import type {NextApiRequest, NextApiResponse} from 'next'
import {getPrompt} from "../../utils/openai";
import {getValueFromEnv} from "../../utils/env";

let token = "tid=0;expired=0"

export interface suggest {
    order: number
    text: string
}
export interface SuggestResponse {
    suggestions?: suggest[]
    time?: number
    data?: unknown
    error?: string
}
export default async function handler(
    req: NextApiRequest,
    nextRes: NextApiResponse<SuggestResponse>
) {

    const start = Date.now()


    const tokenExpires = parseInt(token.split(";")[1].split("=")[1])
    if (tokenExpires - 10 < (start/1000)) {
        const res = await fetch("https://api.github.com/copilot_internal/v2/token", {
            headers: {
                "Authorization": `Bearer ${getValueFromEnv('COPILOT_TOKEN')}`,
            }

        }).then(res => res.json())
        token = res.token
    }


    const question = req.body.question;
    const SQL_TEMPLATE = getPrompt({question})


    const res = await fetch("https://copilot-proxy.githubusercontent.com/v1/engines/copilot-codex/completions",
        {
            headers: {
                'Content-Type': 'application/json',
                'Openai-Organization': 'copilot-ghost',
                'OpenAI-Intent': 'github-copilot',
                'Authorization': `Bearer ${token}`,
            },
            method: "POST",
            body: JSON.stringify({
                "prompt": SQL_TEMPLATE,
                "stream": true,
                "stop": [
                    "#",
                    "---",
                ],
                "temperature": 0.3,
                "max_tokens": 400,
                "top_p": 1,
                "n": 1,
                "logprobs": 2,
            })
        })
        .then(function (res) {
            return res.text();
        })

    if (!res.startsWith("data: ")) {

        nextRes.status(401).json({error: res})
    }

    const results = res.split("\n")
        .filter(value => value.startsWith("data: "))
        .map(value => value.slice(6).trim())
        .filter(value => value !== "[DONE]")
        .map(value => JSON.parse(value))


    const summary = new Map<number, string>();
    results.forEach(data => {
        const c = data.choices[0]
        if (!summary.has(c.index)) {
            summary.set(c.index, "SELECT")
        }
        summary.set(c.index, summary.get(c.index) + c.text)
    })

    const suggestions = Array.from(summary.entries()).map(([order, text]) => ({order, text}))


    nextRes.status(200).json({time: Date.now() - start, suggestions, data: results})
}
