import {NextApiRequest, NextApiResponse} from "next";
import {copilotModel, CopilotResponse} from "@/utils/models/copilot";
import {BASE_TEMPLATE} from "@/utils/prompt";
import {ErrorResponse} from "@/utils/response";

const getSQLPrompt = ({question}: { question: string }) => {
  return `${BASE_TEMPLATE}
---
# Question:
# ${question}?
---
SELECT`
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CopilotResponse | ErrorResponse>
) {


  const prompt = getSQLPrompt({question: req.body.question})

  const results = await copilotModel.getCompletion(prompt, req.body.max)

  res.status(200).json(results)
}