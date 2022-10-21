// Search Page
// use NextJS, MUI, Tailwind, React
// grid:
// row1:[Search Input
// row2:[AnswerComponent] [DataTable]
// row3: [SqlSnippet]

// state:
// 1. search input value. default a mock question
// 2. answer result, default a mock answer
// 3. data, default a mock data, with csv format, use \n to split rows, use , to split columns
// 4. sql code, default a mock sql code

// function:
// 1. onSearch: when click search button, create fake answer, fake data and fake sql code
// 2. onSearchInputChange: when search input value change, update state

// components:
// 1. SearchInput : use MUI TextField, label: "🪞mirror, mirror on the wall"
// 2. AnswerComponent: use h2
// 3. DataTable: use MUI Table
// 4. SqlSnippet: use pre, with mono font, with background color #f6f8fa


// Style:
// Global style:
// use tailwindcss, with flex, all full width
// ======================
// Header:
// [SearchInput]
// content:
// row =  [AnswerComponent, DataTable]
// row2= [SqlSnippet]
// ======================
// Content Style: background color grey
// component: AnswerComponent, DataTable, SqlSnippet
// use MUI Card wrapper each component, with padding


import type {NextPage} from 'next'
import Head from 'next/head'
import {Card, Paper, TextField} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import {useState} from "react";
import AnswerComponent from "../components/Answer";
import DataTable from "../components/DataTable";
import SqlSnippet from "../components/SqlSnippet";
import {fetchChoices} from "../components/datasource";

// NextJS
// Mui
// Tailwind
// React

const Home: NextPage = () => {

  const [searchInputValue, setSearchInputValue] = useState("How to get the most popular movie in 2019?")
  const [answer, setAnswer] = useState("")
  const [data, setData] = useState("")
  const [sql, setSql] = useState("")
  const [error, setError] = useState("")

  const onSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInputValue(event.target.value)
  }

  const onSearch = () => {
    // setAnswer("The most popular movie in 2019 is The Avengers.")
    // setData("movie_name,release_year\n" +
    //   "The Avengers,2019\n" +
    //   "The Avengers: Age of Ultron,2015\n" +
    //   "Avengers: Infinity War,2018\n" +
    //   "Avengers: Endgame,2019\n" +
    //   "Captain Marvel,2019\n")
    // setSql("SELECT movie_name, release_year\n" +
    //   "FROM movies\n" +
    //   "WHERE release_year = 2019\n" +
    //   "ORDER BY popularity DESC\n" +
    //   "LIMIT 1")
    const fn = async () => {
      const res = await fetchChoices(searchInputValue)
      if (res.error) {
        setError(res.error)
        return
      }

      setSql(res?.choices?.[0]?.text || "")
    }

    fn()
  }

  return (
    <div className="flex flex-col h-screen">
      <Head>
        <title>Search Page</title>
        <meta name="description" content="Search Page"/>
        <link rel="icon" href="/favicon.svg"/>
      </Head>

      <header className="flex flex-row">
        <Paper
          component="form"
          className="flex flex-row items-center w-full p-2 px-4 m-2 space-x-4 bg-white rounded-full shadow-xl"
        >
          <TextField
            id="searchInput"
            label="🪞mirror, mirror on the wall"
            variant="standard"
            value={searchInputValue}
            onChange={onSearchInputChange}
            className="mx-2"
            fullWidth
          />
          <SearchIcon
            className="cursor-pointer"
            onClick={onSearch}
          />
        </Paper>
      </header>

      <main className="flex flex-col flex-1 p-2 m-2 space-y-2 overflow-auto bg-gray-100">
        {
          sql &&
          <>
            <div className="flex">
              <div className="flex-1"><AnswerComponent answer={answer}/></div>
              <div className="flex-1"><DataTable data={data}/></div>
            </div>

            <Card className="p-2">
              <SqlSnippet sql={sql}/>
            </Card>
          </>

        }
      </main>


    </div>
  )
}
export default Home



