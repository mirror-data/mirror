import type {NextApiRequest, NextApiResponse} from 'next'
import {SQLData} from "@/utils/apis";
import {Sequelize} from "sequelize-cockroachdb";
import {getValueFromEnv} from "@/utils/env";

const sequelize = new Sequelize(getValueFromEnv("PG_URL"));

export interface SQLResponse extends SQLData {
}

export interface SQLErrResponse {
  error: string
}

interface Schema {
  table_name: string
  column_name: string
  column_comment: string
}

const TEMPLE = `
SELECT 
   table_name, 
   column_name,
   column_comment
FROM 
   information_schema.columns
WHERE
    table_schema = 'public'`
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  try {
    const [results, metadata] = await sequelize.query(TEMPLE)
    const schemas = results as Schema[]
    const tables = new Map<string, { name: string, comment: string }[]>()
    schemas.forEach((s: Schema) => {
      const {table_name, column_name: name, column_comment: comment} = s
      if (tables.has(table_name)) {
        tables.get(table_name)?.push({name, comment: comment ? comment.slice(1, -1) : ''})
      } else {
        tables.set(table_name, [{name, comment}])
      }
    })
    res.status(200).json(Array.from(tables.entries()).map(([k, v]) => ({table: k, columns: v})))
  } catch ({message}) {
    res.status(400).json({
      err: message
    })
  }

}
