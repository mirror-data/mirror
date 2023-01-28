import {ActionIcon, Button, Code, Modal, Paper, Space, Textarea} from "@mantine/core";
import {IconAdjustments} from "@tabler/icons";
import {Card} from "@/components/v2/Card";
import SqlEditor from "@/components/v2/SqlEditor";
import DataTable from "@/components/v2/DataTable";
import Chart from "@/components/v2/Chart";
import * as React from "react";
import {useState} from "react";
import {useAtom} from "jotai";
import {
  chartStatusAtom,
  dataStatusAtom, INIT_SQL, INITIAL_DATA_STATUS,
  INITIAL_SUMMARY_STATUS, loadChart, loadData, loadSummary, setLoading,
  sqlStatusAtom,
  summaryStatusAtom
} from "@/components/v2/state";
import {fetchSQL} from "@/components/v2/apis";
import {QuestionInput} from "@/components/QuestionInput";


export const Question: React.FC = () => {

  const [question, setQuestion] = useState<string>("Who are the top 3 scorers of Warriors?")
  const [sqlStatus, setSqlStatus] = useAtom(sqlStatusAtom)
  const [data, setData] = useAtom(dataStatusAtom)
  const [summary, setSummary] = useAtom(summaryStatusAtom)
  const [vega, setVega] = useAtom(chartStatusAtom)


  const [configModal, setConfigModal] = useState(false)

  const onSearch = () => {
    setSummary(INITIAL_SUMMARY_STATUS)
    setData(INITIAL_DATA_STATUS)


    setSqlStatus(setLoading(sqlStatus))
    const fn = async () => {

      const res = await fetchSQL(question)
      setSqlStatus(res)
      if (!res.error && res.sql) {
        const dataStatus = await loadData(res.sql, setData)
        loadSummary(question, dataStatus.columns, dataStatus.rows, setSummary)
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
      loadSummary(question, dataStatus.columns, dataStatus.rows, setSummary)
      loadChart(dataStatus.columns, dataStatus.rows, setVega)
    }
    fn()

  }

  return <>
    <Paper shadow="xl" className="relative flex gap-2 mt-4 p-4 bg-white pb-6 rounded-lg justify-between items-center">
      <Modal
        opened={configModal}
        size={800}
        onClose={() => setConfigModal(false)}
        title="Config"
      >
        <div>
          <Textarea
            label="Prompt"
            autosize
            minRows={5}
            description="builtin variables: {METADATA} AND {QUESTION}"
            defaultValue={`# Postgres SQL 
{METADATA}
define team_id = home_team_id or visitor_team_id. 
tips: if question use team nickname, use table Teams to find the team_id.
---------
# Question:
# {Question}?
# Limit not more than 100 rows
---SQL---
            `}
          />
          Rendered:
          <Code block>{`# Postgres SQL 
Table 'Games'
  #columne_name: description
  game_date_est: 'Game date'
  game_id: ID of the game
  game_status_text: Status : Final means that the is completed
  home_team_id: ID of the home team
  visitor_team_id: ID of the visitor team
  season: year when the game occurred
  team_id_home: ID of the home team (duplicate of HOME_TEAM_ID)
  pts_home: Number of points scored by home team
  fg_pct_home: Field Goal Percentage home team
  ft_pct_home: Free Throw Percentage of the home team
  fg3_pct_home: Three Point Percentage of the home team
  ast_home: Assists of the home team
  reb_home: Rebounds of the home team
  team_id_away: ID of the away team (duplicate of VISITOR_TEAM_ID)
  pts_away: Number of points scored by away team
  fg_pct_away: Field Goal Percentage away team
  ft_pct_away: Free Throw Percentage of the away team
  fg3_pct_away: Three Point Percentage of the away team
  ast_away: Assists of the away team
  reb_away: Rebounds of the away team
  home_team_wins: If home team won the game
  
Table 'Teams'
  #columne_name: description
  league_id:
  team_id:
  min_year:
  max_year:
  abbreviation:
  nickname:
  yearfounded:
  city:
  arena:
  arenacapacity:
  owner:
  generalmanager:
  headcoach:
  dleagueaffiliation:
 
  
define team_id = home_team_id or visitor_team_id. 

tips: if question use team nickname, use table Teams to find the team_id.
---------
# Question:
# {Question}?
# Limit not more than 100 rows          
          `}</Code>
        </div>
      </Modal>

      <div className="flex gap-2 flex-grow ">
        <QuestionInput value={question} setValue={setQuestion} autocomplete={true}/>


      </div>


      <Button className="mt-[24px] ml-4" variant="outline" onClick={onSearch}>
        Search
      </Button>

      <ActionIcon className="absolute bottom-0 right-0"
                  onClick={() => setConfigModal(true)}
                  variant="transparent">
        <IconAdjustments size={18}/>
      </ActionIcon>
    </Paper>

    {/*<Card error={sqlStatus.error} initialized={sqlStatus.initialized} isLoaded={sqlStatus.loading}*/}
    {/*      className="item-center bg-white p-2 my-4 w-auto">*/}
    {/*  <Text align="center"*/}
    {/*        variant="gradient"*/}
    {/*        gradient={{from: 'violet', to: 'green', deg: 45}}*/}
    {/*        size="xl"*/}
    {/*        weight={700}>*/}
    {/*    The following content was automatically collected and created by MirrorData. No presets.*/}
    {/*  </Text>*/}
    {/*</Card>*/}
    <Space h="lg"/>

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
  </>
}