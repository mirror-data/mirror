import {NextApiRequest, NextApiResponse} from "next";
import {SQLErrResponse, SQLResponse} from "@/pages/api/v1/query";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SQLResponse | SQLErrResponse>
) {

  fetch(`https://api.ossinsight.io/gh/repos/search?keyword=${req.query.keyword || 'recommend-repo-list-1-keyword'}`)
    .then(res => res.json())
    .then(data => {
      res.status(200).json(data)
    })

}