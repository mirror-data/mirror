import type {NextApiRequest, NextApiResponse} from 'next'
import {getValueFromEnv} from "../../utils/env";

let token = "tid=0;expired=0"

export interface choice {
    order: number
    text: string
}
export interface CopilotResponse {
    choices: choice[]
    time: number
    data: unknown
}
export interface CopilotErrorResponse {
    error: string
}
export default async function handler(
    req: NextApiRequest,
    nextRes: NextApiResponse<CopilotResponse | CopilotErrorResponse>
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
                prompt: req.body.prompt,
                "stream": true,
                "stop": [
                    "#",
                    "---",
                ],
                "temperature": 0.3,
                "max_tokens": req.body.max ?? 400,
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


    const choices = new Map<number, string>();
    results.forEach(data => {
        const c = data.choices[0]
        if (!choices.has(c.index)) {
            choices.set(c.index, "")
        }
        choices.set(c.index, choices.get(c.index) + c.text)
    })

    nextRes.status(200).json({
        time: Date.now() - start,
        choices: Array.from(choices.entries()).map(([order, text]) => ({order, text})),
        data: results})
}
