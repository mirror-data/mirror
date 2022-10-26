// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import {SQLData} from "@/state/question";
const mysql = require('serverless-mysql')({
  backoff: 'decorrelated',
  base: 5,
  cap: 200
})
mysql.config({
  host     : process.env.DB_HOST,
  database : process.env.DB_NAME,
  user     : process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  port     : process.env.DB_PORT
})

export interface SQLResponse extends SQLData {
}

export interface SQLErrResponse {
  error: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SQLResponse | SQLErrResponse>
) {

  let results = await mysql.query(req.body.sql)
  const columns = Object.keys(results[0]) || []
  const rows = results.map((row: any) => columns.map((column: any) => row[column]))

  res.status(200).json({
    columns: columns,
    rows: rows
  })
}
