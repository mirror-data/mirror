import {NextApiRequest, NextApiResponse} from "next";
import {getValueFromEnv} from "../../utils/env";

const {Configuration, OpenAIApi} = require("openai");

const configuration = new Configuration({
    apiKey: getValueFromEnv('OPENAI_API_KEY'),
});
const openai = new OpenAIApi(configuration);


export interface AnswerResponse {
    text: string
    data: unknown
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<AnswerResponse>
) {

    const response = await openai.createCompletion({
        model: "text-davinci-002",
        prompt: req.body.prompt,
        temperature: 0.6,
        max_tokens: 256,
        top_p: 1,
        best_of: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        stop: ["#", ";", "--"],
    });

    res.status(200).json({text: response.data?.choices?.[0]?.text, data: response.data})
}
