import {NextApiRequest, NextApiResponse} from "next";
import {copilotModel, CopilotResponse} from "@/utils/models/copilot";
import {ErrorResponse} from "@/utils/response";

const getPrompt = ({input}:{input: string}) => {
  return `// We have a NBA dataset, include teams, players, and games.
//  I will give you a user input, you will autocomplete the input, give me 5 suggestions with json array.
// === EXAMPLE START ===
// INPUT: "Who are the top"
// SUGGESTIONS: ["Who are the top scorers?", "Who are the top 3 scorers of Warriors?", "Who are the top scorers in 2021?", " Who are the best 3 scorers in 2019", "Who are the top 3 scorers in 2021?"]
// === EXAMPLE END ===

INPUT: "${input}"
`
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CopilotResponse | ErrorResponse>
) {

  const prompt = getPrompt({input: req.body.input})
  const results = await copilotModel.getCompletion(prompt, req.body.max, 0.8)
  res.status(200).json(results)
}