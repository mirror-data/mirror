import {AnswerResponse} from "../pages/api/summary";
import {SQLResponse} from "../pages/api/sql";
import {CopilotErrorResponse, CopilotResponse} from "../pages/api/copilot";
import {IResult, ResultStatus} from "../state/question";
import {format} from "sql-formatter";
import {getAnswerPrompt, getSQLPrompt, getVegaPrompt} from "./prompt";

export const fetchSuggestion = async (question: string): Promise<Partial<IResult>> => {
  const res = await fetch(`/api/copilot`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: getSQLPrompt({question})
    })
  })
  if (!res.ok) {
    return {
      error: await res.text()
    }
  }
  const raw = await res.json() as CopilotResponse | CopilotErrorResponse
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
  const data = raw as CopilotResponse


  const choice = data.choices[0]
  // Fix choice lose SELECT
  let sql = choice.text.trim()
  if (!sql.startsWith('SELECT')) {
    sql = 'SELECT ' + sql
  }

  return {
    status: ResultStatus.LOADING_DATA,
    suggestion: {
      order: choice.order,
      sql: format(sql),
    }
  }
}

export const fetchData = async (sql: string) => {
  const res = await fetch(`/api/sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      sql
    })
  })
  if (!res.ok) {
    return {
      error: await res.text()
    }
  }
  const data = await res.json() as SQLResponse

  if (!data) {
    return {
      error: "empty response"
    }
  }

  const {columns, rows} = data
  return {
    status: ResultStatus.LOADING_ANSWER,
    data: {
      columns,
      rows

    }
  }
}
export const fetchAnswer = async (r: Partial<IResult>, question: string) => {
  const res = await fetch(`/api/summary`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: getAnswerPrompt({
        question,
        columns: r.data?.columns ?? [],
        rows: r.data?.rows ?? []
      })
    })
  })
  if (!res.ok) {
    return {
      error: await res.text()
    }
  }

  const data = await res.json() as AnswerResponse
  if (!data) {
    return {
      error: "empty response"
    }
  }

  return {
    status: ResultStatus.DONE,
    answer: {
      text: data.text
    }
  }

}

export interface MirrorData {
  columns: string[]
  rows: string[][]
}

export const fetchVega = async (d: MirrorData) => {
  const fn = async () => {
    const res = await fetch(`/api/copilot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: getVegaPrompt({columns: d.columns, rows: d.rows}),
        max: 2000
      })
    })
    if (!res.ok) {
      return {
        error: await res.text()
      }
    }
    const raw = await res.json() as CopilotResponse | CopilotErrorResponse
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
    const data = raw as CopilotResponse


    return data.choices[0].text.trim().split("==")[0]
  }
  let retry = 0
  while (retry < 10) {
    try {
      const v = await fn()
      if (typeof v === 'string') {
        return JSON.parse(v)
      }
    } catch (e) {
    }
    retry++
  }
  return {}
}