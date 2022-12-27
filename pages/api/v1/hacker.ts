import {NextApiRequest, NextApiResponse} from "next";
import {SQLErrResponse, SQLResponse} from "@/pages/api/v1/query";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SQLResponse | SQLErrResponse>
) {

  fetch(`https://api.ossinsight.io/gh/users/search?keyword=${req.query.keyword || 'recommend-user-list-keyword'}`)
    .then(res => res.json())
    .then(data => {
      res.status(200).json(data)
    })

}