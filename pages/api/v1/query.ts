// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import {SQLData} from "@/utils/apis";
import * as pg from 'pg';
import {Sequelize} from "sequelize-cockroachdb";
import {getValueFromEnv} from "@/utils/env";
const sequelize = new Sequelize(getValueFromEnv("PG_URL"), {
  dialectModule: pg
});


export interface SQLResponse extends SQLData {
}

export interface SQLErrResponse {
  error: string
}

export default async function handler(
  req: NextApiRequest,
  // res: NextApiResponse<SQLResponse | SQLErrResponse>
  res: NextApiResponse
) {

  try {
    const [_results, metadata] = await sequelize.query(req.body.sql)
    const results = _results as object[]
    if (!results || results.length === 0) {
      res.status(200).json({error: 'No results'})
    }

    const columns = Object.keys(results[0]) || []
    if (columns.length === 0) {
      return res.status(200).json({error: "No results"})
    }
    const rows = results.map((row: any) => columns.map((column: any) => row[column]))

    res.status(200).json({
      columns: columns,
      rows: rows
    })
  } catch ({message}) {
    res.status(200).json({error: message as string})
  }

}
