import {NextApiRequest, NextApiResponse} from "next";
import {getValueFromEnv} from "@/utils/env";


export const getSummaryPrompt = ({columns, rows, question}:
                                   { columns?: string[], rows?: string[][], question: string }) => {
  return `
${columns?.join(", ")}
---
${rows?.slice(0, 30).map(row => row.join(", ")).join("\n")}
---
Question: ${question}?
Generate a report based on the questions and data.
---
Report: 
`
}

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
  const [question, columns, rows] = [req.body.question, req.body.columns, req.body.rows]
  //  last 2048 tokens
  const prompt = getSummaryPrompt({columns, rows, question}).slice(-2048)
  const response = await openai.createCompletion({
    model: "text-davinci-002",
    prompt,
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
