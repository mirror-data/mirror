import {atom} from "jotai";
import {fetchData, fetchSummary, fetchVega} from "@/components/v2/apis";

const INITIAL_STATE = {
  initialized: false,
  loading: false,
}

interface State {
  initialized: boolean;
  loading: boolean;
  error?: string;
}

export interface SqlState extends State {
  sql: string;
}

export const setLoading = <T extends State>(state: T): T => {
  return {
    ...state,
    loading: true,
    initialized: true,
  };
}

export const INIT_SQL = {
  ...INITIAL_STATE,
  sql: "",
}
export const sqlStatusAtom = atom<SqlState>(INIT_SQL)


// DATA
export interface DataState extends State {
  columns: string[];
  rows: string[][];
}

export const INITIAL_DATA_STATUS: DataState = {
  initialized: false,
  loading: false,
  columns: [],
  rows: [],
}

export const dataStatusAtom = atom<DataState>(INITIAL_DATA_STATUS)

export const loadData = async (sql: string, set: (update: DataState) => void) => {
  set(setLoading({
    ...INITIAL_DATA_STATUS,
    initialized: true,
    loading: true,
  }))
  const fn = async () => {
    const res = await fetchData(sql)
    set(res)
    return res
  }
  return await fn()
}


// Answer

export interface SummaryState extends State {
  summary: string;
}

export const INITIAL_SUMMARY_STATUS: SummaryState = {
  ...INITIAL_STATE,
  summary: "",
}

export const summaryStatusAtom = atom<SummaryState>(INITIAL_SUMMARY_STATUS)

export const loadSummary = async (question: string,
                                  columns: string[],
                                  rows: string[][],
                                  set: (update: SummaryState) => void) => {
  set(setLoading({
    ...INITIAL_SUMMARY_STATUS,
    initialized: true,
    loading: true,
  }))
  const fn = async () => {
    const res = await fetchSummary(question, {columns, rows})
    set(res)
  }
  fn()
}

// Chart

export interface ChartState extends State {
  config: any;
}

export const INITIAL_CHART_STATUS: ChartState = {
  ...INITIAL_STATE,
  config: {},
}

export const chartStatusAtom = atom<ChartState>(INITIAL_CHART_STATUS)

export const loadChart = async (columns: string[],
                                rows: string[][],
                                set: (update: ChartState) => void) => {
  set(setLoading({
    ...INITIAL_CHART_STATUS,
    initialized: true,
    loading: true,
  }))
  const fn = async () => {
    const res = await fetchVega({columns, rows})
    set({
      config: res.config,
      initialized: true,
      loading: false,
    })
  }
  fn()
}


