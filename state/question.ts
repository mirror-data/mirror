import { atom } from 'jotai'
export enum ResultStatus {
    INITIAL,
    LOADING_SUGGESTIONS,
    LOADING_EDIT,
    LOADING_DATA,
    LOADING_ANSWER,
    DONE,
}

export type IEdit = {
    instruction: string
    original: string
    modified: string
}

export interface IResult {
    error?: string,
    status: ResultStatus,
    question?: string,
    suggestion?: {
        order: number
        sql: string
    }

    data?: {
        columns: string[]
        rows: string[][]
    }
    answer?: {
        text: string
    }

    history: IEdit[]
}

export const resultAtom = atom<IResult>({
    status: ResultStatus.INITIAL,
    history: []
})