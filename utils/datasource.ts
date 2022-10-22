import {AnswerResponse} from "../pages/api/summary";
import {SQLResponse} from "../pages/api/sql";
import {SuggestResponse} from "../pages/api/copilot";
import {IResult, ResultStatus} from "../state/question";
import {format} from "sql-formatter";

export const fetchSuggestion = async (question: string): Promise<Partial<IResult>> => {
    const res = await fetch(`/api/copilot`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            question
        })
    })
    if (!res.ok) {
        return {
            error: await res.text()
        }
    }
    const data = await res.json() as SuggestResponse
    if (!data) {
        // todo: set error
        return {
            error: "empty response"
        }
    }

    console.log("?", data)
    const {text: sql, order} = data.suggestions[0]

    return {
        status: ResultStatus.LOADING_DATA,
        suggestion: {
            order,
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
    const columns = r.data?.columns ?? []
    const rows = r.data?.rows ?? []
    const prompt = `
${columns.join(", ")}
---
${rows.map(row => row.join(", ")).join("\n")}
---
Question: ${question}?
Answer for a CEO: 
`
    const res = await fetch(`/api/summary`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            prompt
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