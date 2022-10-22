// **** BEGIN original prompt to generate UI skeleton ****

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

// **** END original prompt to generate UI skeleton ****

import type {NextPage} from 'next'
import Head from 'next/head'
import Result from "../components/Result";
import {useState} from "react";
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import {CircularProgress, TextField, Autocomplete} from "@mui/material";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import Paper from "@mui/material/Paper";
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import {useAtom} from "jotai";
import {resultAtom, ResultStatus} from "../state/question";
import {fetchAnswer, fetchData, fetchSuggestion} from "../utils/datasource";
import {format} from 'sql-formatter';
import {EditResponse} from "./api/edit";

const Home: NextPage = () => {
    const [input, setInput] = useState("")
    const [searchSuggestions, setSearchSuggestions] = useState<string[]>([
        "Which country or region contributes the most to programming languages?",
        "How many tables are in the dataset?",
        "How many events are in the dataset?",
        "How many repositories are in the dataset?",
        "How many event types are in the dataset?",
        "What is the range of time for the data in the dataset?",
    ])
    const handleInputChange = (event: any, newValue: string) => {
        setInput(newValue);
    };

    const [isLoading, setIsLoading] = useState(false)

    const [showImproveBar, setShowImproveBar] = useState(false)

    const [result, setResult] = useAtom(resultAtom)

    // todo, use ResultStatus.LOADING_EDIT instead of editLoading
    const [editLoading, setEditLoading] = useState(false)

    const onSearch = () => {
        setIsLoading(true)

        const fn = async () => {
            setIsLoading(false)
            setResult(q => ({
                ...q,
                question: input,
                status: ResultStatus.LOADING_SUGGESTIONS,
                history: []
            }))

            const fetchResult = await fetchSuggestion(input)
            setResult(old => ({
                ...old,
                ...fetchResult
            }))
            if (result.error){
                return
            }




            const dataResult = await fetchData(fetchResult?.suggestion?.sql ?? "")
            setResult(old => ({
                ...old,
                ...dataResult
            }))


            const answerResult = await fetchAnswer(dataResult, input)
            setResult(old => ({
                ...old,
                ...answerResult
            }))




        }
        fn()
    }


    const onEdit = (instruction: string) => {
        setEditLoading(true)
        const fn = async () => {
            setResult(q => ({
                ...q,
                status: ResultStatus.LOADING_EDIT
            }))

            const res = await fetch(`/api/edit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    question: result.question,
                    sql: result.suggestion?.sql,
                    instruction: instruction
                })
            })
            const d = await res.json() as EditResponse
            const modified = format(d.sql.startsWith("SELECT") ? d.sql : "SELECT\n" + d.sql)

            setResult(q => {
                const history = q.history ?? []
                history.push({
                    original: q.suggestion?.sql ?? "",
                    modified: modified,
                    instruction: instruction
                })

                const suggestion = q.suggestion ?? {sql: "", order: 0}
                suggestion.sql = modified

                return {
                    ...q,
                    suggestion,
                    history
                }
            })
            setEditLoading(false)


            const dataResult = await fetchData(modified)
            setResult(old => ({
                ...old,
                ...dataResult
            }))


            const answerResult = await fetchAnswer(dataResult, input)
            setResult(old => ({
                ...old,
                ...answerResult
            }))
        }
        fn()
    }


    return (
        <div className="flex min-h-screen flex-col items-center justify-center"
             style={{backgroundColor: "#f5f5f5"}}>
            <Head>
                <title>Mirror</title>
                <link rel="icon"
                      href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🪞</text></svg>"/>
            </Head>


            <Paper className={"w-full p-4"}>

                <div className="pt-2 relative mx-auto text-gray-600 w-full flex items-end	">
                    <Autocomplete
                        freeSolo
                        fullWidth
                        value={input}
                        onInputChange={handleInputChange}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="standard"
                                className="flex flex-grow"
                                label={"🪞Mirror, Mirror on the Wall"}
                                InputProps={{
                                    ...params.InputProps,
                                    type: 'search',
                                    endAdornment: <IconButton type="button" sx={{p: '10px'}} aria-label="search"
                                                            onClick={onSearch}>
                                        <SearchIcon/>
                                    </IconButton>
                                }}
                            />
                        )}
                        options={searchSuggestions}
                    />
                </div>

            </Paper>
            <div className="mt-3"/>
            <main className="flex w-full flex-1 flex-col  px-20">


                {isLoading && <div className="flex justify-center"><CircularProgress/></div>}


                <Result onEdit={onEdit} editLoading={editLoading}/>


            </main>


        </div>
    )
}


export default Home



