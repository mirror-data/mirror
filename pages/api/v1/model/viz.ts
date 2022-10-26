import {NextApiRequest, NextApiResponse} from "next";
import {copilotModel, CopilotResponse} from "@/utils/models/copilot";
import {ErrorResponse} from "@/utils/response";

const getVegaPrompt = ({columns, rows}:
                         { columns?: string[], rows?: string[][] }) => {
  return `// You are given a json, is vega schema defined, and a vega spec.
// EXAMPLE:
// ==================
// DATA csv format
// --------------------
// name, country, count
// A, USA, 28
// A, CN, 55
// B, USA, 43
// C, USA, 91
// D, DE, 81
// D, CN, 53
// =====================
// your vega spec:
// {
//   "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
//   "description": "A simple bar chart with embedded data.",
//   "data": {
//     "values": [
//       {"name": "A", "country": "USA", "count": 28},
//       {"name": "A", "country": "CN", "count": 55},
//       {"name": "B", "country": "USA", "count": 43},
//       {"name": "C", "country": "USA", "count": 91},
//       {"name": "D", "country": "DE", "count": 81},
//       {"name": "D", "country": "CN", "count": 53}
//     ]
//   },
//   "mark": "bar",
//   "encoding": {
//     "x": {"field": "country", "type": "nominal", "axis": {"labelAngle": 0}},
//     "y": {"field": "count", "type": "quantitative"},
//     "color": {"field": "name", "type": "nominal"}
//   }
// }



==================
DATA csv format
--------------------
${columns?.join(", ")}
${rows?.slice(0, 30).map(row => row.join(", ")).join("\n")}
=====================
your vega spec:
`
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CopilotResponse | ErrorResponse>
) {

  const {columns, rows}= req.body.sqlData
  const prompt = getVegaPrompt({columns, rows})
  const results = await copilotModel.getCompletion(prompt, req.body.max)
  res.status(200).json(results)
}