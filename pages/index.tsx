import {Autocomplete, Text, Button, Modal, Paper, Input} from "@mantine/core";
import {useState} from "react";
import SqlEditor from "@/components/v2/SqlEditor";
import * as React from "react";
import DataTable from "@/components/v2/DataTable";
import {Card} from "@/components/v2/Card";
import {useAtom} from "jotai";
import {
  chartStatusAtom,
  dataStatusAtom, INIT_SQL,
  INITIAL_DATA_STATUS,
  INITIAL_SUMMARY_STATUS, loadChart,
  loadData,
  loadSummary,
  setLoading,
  sqlStatusAtom,
  summaryStatusAtom
} from "@/components/v2/state";
import {fetchSQL} from "@/components/v2/apis";
import Head from "next/head";
import ChooseRepo from "@/components/v2/ChooseRepo";
import {IconBrandGithub, IconUser} from "@tabler/icons";
import Chart from "@/components/v2/Chart";

interface Repo {
  name: string
  id: string
}


const RepoQuestions = [
  {value: "Who created the first pull request of this repo?", group: 'Created by OSSInsight'},
  {value: "Who closed the first issue?", group: 'Created by OSSInsight'},
  {value: "Who is the latest stargazer?", group: 'Created by OSSInsight'},
  {value: "Who reviewed the most of code?", group: 'Created by OSSInsight'},
  {value: "Who contributed the most lines of code?", group: 'Created by OSSInsight'},
  {value: "Who star/unstar this repo again and again...", group: 'Created by OSSInsight'},
  {value: "Who is the most active contributor?", group: 'Created by AI'},
  {value: "Who is the most active reviewer?", group: 'Created by AI'},

]

const UserQuestions = [
  {value: "What is the latest repo I created?", group: 'Created by AI'},
  {value: "What is the latest repo I starred?", group: 'Created by AI'},
  {value: "What is the latest repo I forked?", group: 'Created by AI'},
  {value: "What is the latest repo I contributed?", group: 'Created by AI'},
  {value: "What is the latest repo I reviewed?", group: 'Created by AI'},
  {value: "What is the latest repo I closed an issue?", group: 'Created by AI'},
  {value: "What is the latest repo I created an issue?", group: 'Created by AI'},
  {value: "What is the latest repo I created a pull request?", group: 'Created by AI'},
  {value: "What is the latest repo I merged a pull request?", group: 'Created by AI'},
]

export default () => {
  const [repo, setRepo] = useState<Repo>({
    name: "PingCAP/TiDB",
    id: "41986369"
  })
  const [userOrRepo, setUserOrRepo] = useState<string>("repo")

  const [user, setUser] = useState<Repo>({
    name: "c4pt0r",
    id: "773853"
  })

  const [question, setQuestion] = useState<string>("Who created the first pull request of this repo?")
  const [sqlStatus, setSqlStatus] = useAtom(sqlStatusAtom)
  const [data, setData] = useAtom(dataStatusAtom)
  const [summary, setSummary] = useAtom(summaryStatusAtom)
  const [vega, setVega] = useAtom(chartStatusAtom)

  const [chooseRepoModal, setChooseRepoModal] = useState<boolean>(false)

  const help = userOrRepo === "hacker" ? ` my name is ${user.name}, github_events.actor_id equal ${user.id}` : `repo_id equal ${repo.id}`
  const fullQuestion = `${help}, ${question}`

  const onSearch = () => {
    setSummary(INITIAL_SUMMARY_STATUS)
    setData(INITIAL_DATA_STATUS)


    setSqlStatus(setLoading(sqlStatus))
    const fn = async () => {

      const res = await fetchSQL(fullQuestion)
      setSqlStatus(res)
      if (!res.error && res.sql) {
        const dataStatus = await loadData(res.sql, setData)
        loadSummary(fullQuestion, dataStatus.columns, dataStatus.rows, setSummary)
        loadChart(dataStatus.columns, dataStatus.rows, setVega)
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
      loadSummary(fullQuestion, dataStatus.columns, dataStatus.rows, setSummary)
      loadChart(dataStatus.columns, dataStatus.rows, setVega)
    }
    fn()

  }


  return <div style={{
    backgroundColor: "rgb(237 242 255 / 60%)",
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='%23e0eefb'%3E%3Cpath d='M0 .5H31.5V32'/%3E%3C/svg%3E\")",
  }} className="h-screen w-screen p-4 flex flex-col">
    <Head>
      <title>Mirror for OSSInsight</title>
      <link rel="icon"
            href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🪞</text></svg>"/>
    </Head>
    {/*top 0, left 0 absoution */}
    <div className="h-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500  left-0 right-0 top-0 absolute">
      <Text align="center" color="white" weight={700}>
        Mirror for OSSInsight. Powered by Mirror. <Text className="ml-4" component="span" underline size="xs" italic>
        mirror-data.github.io
      </Text>
      </Text>


    </div>

    <Paper shadow="xl" className="flex gap-2 mt-4 p-4 bg-white pb-6 rounded-lg justify-between items-center">
      <Modal
        opened={chooseRepoModal}
        onClose={() => setChooseRepoModal(false)}
        title="Repo or Hacker?"
      >
        <ChooseRepo setRepo={(type, id, name) => {
          if (type === "hacker") {
            setUserOrRepo("hacker")
            setUser({id, name})
            setQuestion(UserQuestions[0].value)
          } else {
            setUserOrRepo("repo")
            setRepo({id, name})
            setQuestion(RepoQuestions[0].value)
          }

        }} onClose={() => setChooseRepoModal(false)}/>
      </Modal>
      <div className="flex gap-2 flex-grow ">
        <Input.Wrapper label="Hacker or Repo">
          <Input
            component="button"
            icon={userOrRepo === "repo" ? <IconBrandGithub/> : <IconUser/>}
            wrapperProps={{
              leftIcon: userOrRepo === "repo" ? <IconBrandGithub/> : <IconUser/>,
              variant: "outline",
              color: "dark",
              onClick: () => setChooseRepoModal(true)
            }}>{userOrRepo === "repo" ? repo.name : user.name}</Input>

        </Input.Wrapper>


        <Autocomplete
          filter={() => true}
          className="flex-grow"
          label="Your Question"
          limit={10}
          value={question} onChange={(v) => setQuestion(v)}
          data={userOrRepo === "repo" ? RepoQuestions : UserQuestions}/>
      </div>


      <Button className="mt-[24px] ml-4" variant="outline" onClick={onSearch}>
        Search
      </Button>
    </Paper>

    <Card error={sqlStatus.error} initialized={sqlStatus.initialized} isLoaded={sqlStatus.loading}
          className="item-center bg-white p-2 my-4 w-auto">
      <Text align="center"
            variant="gradient"
            gradient={{from: 'violet', to: 'green', deg: 45}}
            size="xl"
            weight={700}>
        The following content was automatically collected and created by Mirror-AI. No presets.
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
          <Card error={vega.error} initialized={vega.initialized} isLoaded={vega.loading}>
            <Chart config={vega.config}/>

          </Card>
        </div>


      </div>


    </div>


  </div>
}