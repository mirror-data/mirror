import {Autocomplete, Text, Button, Modal} from "@mantine/core";
import {useState} from "react";
import SqlEditor from "@/components/SqlEditor";
import * as React from "react";
import DataTable from "@/components/DataTable";
import {Card} from "@/components/v2/Card";
import {useAtom} from "jotai";
import {
  dataStatusAtom, INIT_SQL,
  INITIAL_DATA_STATUS,
  INITIAL_SUMMARY_STATUS,
  loadData,
  loadSummary,
  setLoading,
  sqlStatusAtom,
  summaryStatusAtom
} from "@/components/v2/state";
import {fetchSQL} from "@/components/v2/apis";
import Head from "next/head";
import ChooseRepo from "@/components/v2/ChooseRepo";

interface Repo {
  name: string
  id: string
}

export default () => {
  const [repo, setRepo] = useState<Repo>({
    name: "PingCAP/TiDB",
    id: "41986369"
  })

  const [question, setQuestion] = useState<string>("Who created the first pull request of this repo?")
  const [sqlStatus, setSqlStatus] = useAtom(sqlStatusAtom)
  const [data, setData] = useAtom(dataStatusAtom)
  const [summary, setSummary] = useAtom(summaryStatusAtom)

  const [chooseRepoModal, setChooseRepoModal] = useState<boolean>(false)

  const onSearch = () => {
    setSummary(INITIAL_SUMMARY_STATUS)
    setData(INITIAL_DATA_STATUS)


    setSqlStatus(setLoading(sqlStatus))
    const fn = async () => {
      const res = await fetchSQL(`repo_id equal ${repo.id},${question}`)
      setSqlStatus(res)
      if (!res.error && res.sql) {
        const dataStatus = await loadData(res.sql, setData)
        loadSummary(question, dataStatus.columns, dataStatus.rows, setSummary)
      }
    }
    fn()
  }


  const codeChange = (sql: string) => {
    setSummary(INITIAL_SUMMARY_STATUS)
    setData(INITIAL_DATA_STATUS)

    setSqlStatus({
      ...INIT_SQL,
      initialized: true,
      sql,
    })

    const fn = async () => {
      const dataStatus = await loadData(sql, setData)
      loadSummary(question, dataStatus.columns, dataStatus.rows, setSummary)
    }
    fn()

  }

  return <div style={{
    backgroundColor: "rgb(237 242 255 / 40%)",
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='%23E7F5FF'%3E%3Cpath d='M0 .5H31.5V32'/%3E%3C/svg%3E\")",
  }} className="h-screen w-screen p-4 flex flex-col">
    <Head>
      <title>Mirror for OSSInsight</title>
      <link rel="icon"
            href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🪞</text></svg>"/>
    </Head>
    <div className="flex gap-2 p-4 bg-white pb-6 rounded-lg justify-between items-center">
      <Modal
        opened={chooseRepoModal}
        onClose={() => setChooseRepoModal(false)}
        title="Introduce yourself!"
      >
        <ChooseRepo setRepo={(id, name) => setRepo({id, name})} onClose={() => setChooseRepoModal(false)}/>
      </Modal>
      <div className="flex gap-2 flex-grow ">
        <Button className="mt-[24px]" variant="outline" color="dark" onClick={() => setChooseRepoModal(true)}>
          {repo.name}
        </Button>

        <Autocomplete
          filter={() => true}
          className="flex-grow"
          label="Your Question"
          value={question} onChange={(v) => setQuestion(v)}
          data={[
            "Who created the first pull request of this repo?",
            "Who closed the first issue?",
            "Who is the latest stargazer?",
            "Who reviewed the most of code?",
            "Who contributed the most lines of code?",
            "Who star/unstar this repo again and again...",
          ]}/>
      </div>


      <Button className="mt-[24px] ml-4" variant="outline" onClick={onSearch}>
        Search
      </Button>
    </div>

    <Card error={sqlStatus.error} initialized={sqlStatus.initialized} isLoaded={sqlStatus.loading} className="item-center bg-white p-2 my-4 w-auto">
      <Text  align="center"
            variant="gradient"
            gradient={{ from: 'indigo', to: 'cyan', deg: 45 }}
            size="xl"
            weight={700}>
        The following content was automatically collected and created by AI. No presets.
      </Text>
    </Card>

    <div className="flex flex-col gap-6 grow">


      <div className="grow flex gap-6 ">
        <Card error={sqlStatus.error} initialized={sqlStatus.initialized} isLoaded={sqlStatus.loading}>
          <SqlEditor
            onChange={(v) => codeChange(v)}
            code={sqlStatus.sql ?? ""}
          />
        </Card>
        <div className="flex grow-[1] flex-col gap-6 " style={{width: "calc(100vw - 1030px)"}}>
          <Card error={summary.error} initialized={summary.initialized} isLoaded={summary.loading}>
            {summary.summary}
          </Card>
          <Card error={data.error} initialized={data.initialized} isLoaded={data.loading}>

            <DataTable
              columns={data.columns}
              rows={data.rows}
            />
          </Card>
          {/*<Paper className="grow" shadow="xs" p="md">*/}
          {/*  <Chart config={*/}
          {/*    {*/}
          {/*      "$schema": "https://vega.github.io/schema/vega-lite/v5.json",*/}
          {/*      "description": "A simple bar chart with embedded data.",*/}
          {/*      "data": {*/}
          {/*        "values": [*/}
          {/*          {"name": "A", "country": "USA", "count": 28},*/}
          {/*          {"name": "A", "country": "CN", "count": 55},*/}
          {/*          {"name": "B", "country": "USA", "count": 43},*/}
          {/*          {"name": "C", "country": "USA", "count": 91},*/}
          {/*          {"name": "D", "country": "DE", "count": 81},*/}
          {/*          {"name": "D", "country": "CN", "count": 53}*/}
          {/*        ]*/}
          {/*      },*/}
          {/*      "mark": "bar",*/}
          {/*      "encoding": {*/}
          {/*        "x": {"field": "country", "type": "nominal", "axis": {"labelAngle": 0}},*/}
          {/*        "y": {"field": "count", "type": "quantitative"},*/}
          {/*        "color": {"field": "name", "type": "nominal"}*/}
          {/*      }*/}
          {/*    }*/}

          {/*  }/>*/}

          {/*</Paper>*/}
        </div>


      </div>


    </div>


  </div>
}