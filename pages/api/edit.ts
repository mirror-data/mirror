import {NextApiRequest, NextApiResponse} from "next";
import {getPrompt} from "../../utils/openai";
import {getValueFromEnv} from "../../utils/env";

const {Configuration, OpenAIApi} = require("openai");

const configuration = new Configuration({
    apiKey: getValueFromEnv('OPENAI_API_KEY'),
});
const openai = new OpenAIApi(configuration);

export interface EditResponse {
    sql: string
    data: unknown

}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<EditResponse>
) {

    const response = await openai.createEdit({
        model: "code-davinci-edit-001",
        input: getPrompt({question: req.body.question}) + req.body.sql,
        instruction: req.body.instruction,
    });


    const sql = response.data?.choices?.[0]?.text.split("---\nSELECT")[1];

    res.status(200).json({sql, data: response.data})
}
