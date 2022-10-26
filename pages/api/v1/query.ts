// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import {SQLData} from "@/state/question";
import {connection} from "@/utils/db";

export interface SQLResponse extends SQLData {
}

export interface SQLErrResponse {
  error: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<SQLResponse | SQLErrResponse>
) {

  connection.query(
    req.body.sql,
    (err, results) => {
      if (err) {
        res.status(200).json({error: `${err}`})
        return
      }
      results = results as any[]
      if (results.length > 0) {
        const columns = Object.keys(results[0])
        const rows = results.map((row) => Object.values(row))
        res.status(200).json({columns, rows})
      }
      res.status(200).json({columns: [], rows: []})
    }
  );
}
