import * as React from 'react';
import Paper from '@mui/material/Paper';
import {
  CircularProgress,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { SQLData} from "@/state/question";
import SqlEditor from "./SqlEditor";
import {DiffModal} from "./DiffModal";
import Instruction from "./Instruction";
import Chart from "./Chart";
import {useCallback, useEffect} from "react";
import {fetchData, fetchEdit, fetchSQL, fetchSummary, fetchVega} from "@/utils/apis";

interface Props {
  question: string
}

interface editHistory {
  instruction: string
  original: string
  modified: string
}

export default ({question}: Props) => {

  const [sql, setSql] = React.useState<string>("")
  const [sqlLoading, setSqlLoading] = React.useState(false)

  const [sqlData, setSqlData] = React.useState<SQLData>()
  const [sqlDataLoading, setSqlDataLoading] = React.useState(false)

  const [chartConfig, setChartConfig] = React.useState<any>()
  const [chartConfigLoading, setChartConfigLoading] = React.useState(false)

  const [editLoading, setEditLoading] = React.useState(false)
  const [history, setHistory] = React.useState<editHistory[]>([])

  const [summaryLoading, setSummaryLoading] = React.useState(false)
  const [summary, setSummary] = React.useState<string>("")

  useEffect(() => {
    if (question) {
      setSqlLoading(true)
      fetchSQL(question).then(({sql}) => {
        setSql(sql)
        setSqlLoading(false)
      })
    }

  }, [question])

  useEffect(() => {
    if (sql) {
      setSqlDataLoading(true)
      fetchData(sql).then((res) => {
        if ("error" in res) {
          console.error(res.error)
          return
        }
        setSqlData(res.data)
        setSqlDataLoading(false)
      })
    }

  }, [sql])


  useEffect(() => {
    if (sqlData && sqlData.rows && sqlData.rows.length > 0) {
      setChartConfigLoading(true)
      setSummaryLoading(true)

      fetchVega(sqlData).then((res) => {
        if ("error" in res) {
          console.error(res.error)
          return
        }
        setChartConfig(res)
        setChartConfigLoading(false)
      })

      fetchSummary(question, sqlData).then((res) => {
        if ("error" in res) {
          console.error(res.error)
          return
        }
        setSummary(res.text)
        setSummaryLoading(false)
      })
    }
  }, [sqlData])


  const onEdit = useCallback((instruction: string) => {

    setEditLoading(true)
    fetchEdit(sql, question, instruction).then((res) => {
      if ("error" in res) {
        console.error(res.error)
        return
      }
      setHistory([...history, {instruction, original: sql, modified: res.sql}])
      setSql(res.sql)
      setEditLoading(false)
    })
  }, [sql, question])

  if (!question) {
    return null
  }
  return <Grid container spacing={2} className={"pt-8"}>
    <Grid item xs={8}>
      <Paper className="p-4">
          <h1 className={`text-l flex ${summaryLoading && "justify-center"}`}>
              {summaryLoading
                  ? <CircularProgress/>
                  : <>{summary}</>}
          </h1>
      </Paper>
      <Paper className="mt-4">
        <div className={`${sqlLoading && "flex justify-center p-4"}`}>
          {
            sqlLoading
              ? <CircularProgress/>
              : <SqlEditor
                code={sql}
              />
          }
        </div>


      </Paper>
      {
        !sqlLoading && history.map((h, i) => <DiffModal
          index={i}
          instruction={h.instruction}
          modified={h.modified}
          original={h.original}
        />)
      }
      {
        !sqlLoading && <Instruction
          editLoading={editLoading}
          onEdit={onEdit}
        />
      }

    </Grid>
    <Grid item xs={4}>
      <Paper className={`${sqlDataLoading && "flex justify-center p-4"}`}>
        {sqlDataLoading
          ? <CircularProgress/>
          : <TableContainer component={Paper} sx={{maxHeight: 400}}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {sqlData?.columns?.map((v, i) => <TableCell key={i}>{v}</TableCell>)}
                </TableRow>
              </TableHead>
              <TableBody>
                {sqlData?.rows?.map((row, index) => (
                  <TableRow
                    key={`row-${index}`}
                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                  >
                    {row.map((v, index) => <TableCell component="th" scope="row" key={`cell-${index}`}>
                      {v || "NULL"}
                    </TableCell>)}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        }


      </Paper>

      <Paper className={"flex justify-center p-4 mt-4"}>
        {chartConfigLoading
          ? <CircularProgress/>
          : <Chart config={chartConfig}/>
        }

      </Paper>

    </Grid>


  </Grid>
}
