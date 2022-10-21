import type {NextApiRequest, NextApiResponse} from 'next'
import {CopilotModel, CopilotResponse} from "../../../utils/models/copilot";

const copilot = new CopilotModel()
export default async function handler(
  req: NextApiRequest,
  nextRes: NextApiResponse<CopilotResponse>
) {

  const res = await copilot.exec(req.body.prompt)
  nextRes.status(200).json(res)
}