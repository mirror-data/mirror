import {format} from "sql-formatter";
import {CopilotResponse} from "@/utils/models/copilot";
import {ErrorResponse} from "./response";
import {SQLResponse} from "@/pages/api/v1/query";
import {AnswerResponse} from "@/pages/api/v1/model/summary";
import {EditResponse} from "@/pages/api/v1/model/edit";

export interface SQLData {
  columns: string[]
  rows: string[][]
}
async function verify<T>(res: Response) {
  if (!res.ok) {
    return {
      error: await res.text()
    }
  }
  const raw = await res.json() as T | ErrorResponse
  return checkResponse<T>(raw)
}

function checkResponse<T>(raw: ErrorResponse | T) {
  if (!raw) {
    return {
      error: 'No response'
    }
  }
  if ('error' in raw) {
    return {
      error: raw.error
    }
  }

  return {
    data: raw as T
  }
}

interface fetchSQLResponse {
  sql: string
  error?: string
}
export const fetchSQL = async (question: string): Promise<fetchSQLResponse> => {
  const res = await fetch(`/api/v1/model/sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      question
    })
  })
  let {error, data} = await verify<CopilotResponse>(res)
  if (error || !data) {
    return {
      error,
      sql: "",
    }
  }
  const choice = data.choices[0]
  // Fix choice lose SELECT
  let sql = choice.text.trim()
  if (!sql.startsWith('SELECT')) {
    sql = 'SELECT ' + sql
  }
  return {
    sql: format(sql),
  }
}

export const fetchData = async (sql: string) => {
  const res = await fetch(`/api/v1/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      sql
    })
  })

  let {error, data} = await verify<SQLResponse>(res)
  if (error || !data) {
    return {
      error,
    }
  }

  const {columns, rows} = data
  return {
    data: {
      columns,
      rows
    }
  }
}
export const fetchSummary= async (question: string, sqlData: SQLData) => {
  const res = await fetch(`/api/v1/model/summary`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      question,
      columns: sqlData.columns,
      rows: sqlData.rows,
    })
  })

  let {error, data} = await verify<AnswerResponse>(res)
  if (error || !data) {
    return {
      error,
    }
  }

  return {
    text: data.text
  }

}


export const fetchVega = async (sqlData: SQLData) => {
  const fn = async () => {
    const res = await fetch(`/api/v1/model/viz`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sqlData,
        max: 2000
      })
    })
    const {error, data} = await verify<CopilotResponse>(res)
    if (error || !data) {
      return {
        error,
      }
    }
    return data.choices[0].text.trim().split("==")[0]
  }
  let retry = 0
  while (retry < 10) {
    try {
      const v = await fn()
      console.log(v)
      if (typeof v === 'string') {
        return JSON.parse(v)
      }
    } catch (e) {
      console.log(`vega retry ${retry}`, e)
    }
    retry++
  }
  return {
    error: 'Failed to fetch vega'
  }

}

export const fetchEdit = async (sql: string, question: string, instruction: string) => {
  const res = await fetch(`/api/v1/model/edit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      sql,
      instruction,
      question
    })
  })
  const {error, data} = await verify<EditResponse>(res)
  if (error || !data) {
    return {
      error,
    }
  }
  return {
    sql: format(data.sql),
  }
}