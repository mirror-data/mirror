import {NextApiRequest, NextApiResponse} from "next";
import { getValueFromEnv } from "@/utils/env";
import {getSQLEditorPrompt} from "@/utils/prompt";

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
        input: getSQLEditorPrompt({
            question: req.body.question,
            sql: req.body.sql,
            histories: req.body.histories,
        }),
        instruction: req.body.instruction,
    });


    const sql = response.data?.choices?.[0]?.text.split("---SQL---")[1];

    res.status(200).json({sql, data: response.data})
}
