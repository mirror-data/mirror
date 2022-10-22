// **** BEGIN original prompt to generate UI skeleton ****

// use NextJS, MUI, Tailwind, React

// AnswerComponent
// input: answer
// output: answer result with h2
// use MUI Card wrapper each component, with padding, with right margin

// **** END original prompt to generate UI skeleton ****


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
import {resultAtom, ResultStatus} from "../state/question";
import {useAtom} from 'jotai'
import SqlEditor from "./SqlEditor";
import {DiffModal} from "./DiffModal";
import Instruction from "./Instruction";
import Chart from "./Chart";

interface Props {
    editLoading: boolean
    onEdit: (edit: string) => void
}

export default ({onEdit, editLoading}: Props) => {
    const [question, setQuestion] = useAtom(resultAtom)



    if (question.status == ResultStatus.INITIAL) {
        return <></>
    }

    return <>
        <Grid container spacing={2} className={"pt-8"}>
            <Grid item xs={8}>
                <Paper className="p-4">
                    <h1 className={`text-l flex ${question.status <= ResultStatus.LOADING_ANSWER && "justify-center"}`}>
                        {question.status <= ResultStatus.LOADING_ANSWER
                            ? <CircularProgress/>
                            : <>{question.answer?.text}</>}
                    </h1>
                </Paper>
                <Paper className="mt-4">
                    <div className={`${question.status <= ResultStatus.LOADING_SUGGESTIONS && "flex justify-center p-4"}`}>
                    {
                        question.status <= ResultStatus.LOADING_SUGGESTIONS
                            ? <CircularProgress/>
                            : <SqlEditor
                                code={question.suggestion?.sql ?? ""}
                            />
                    }
                    </div>


                </Paper>
                {
                    question.history.map((h, i) => <DiffModal
                        index={i}
                        instruction={h.instruction}
                        modified={h.modified}
                        original={h.original}
                    />)
                }
                {
                    question.status > ResultStatus.LOADING_SUGGESTIONS && <Instruction
                        editLoading={editLoading}
                        onEdit={onEdit}
                    />
                }

            </Grid>
            <Grid item xs={4}>
                <Paper className={`${question.status <= ResultStatus.LOADING_DATA && "flex justify-center p-4"}`}>
                    {question.status <= ResultStatus.LOADING_DATA
                        ? <CircularProgress/>
                        : <TableContainer component={Paper} sx={{maxHeight: 400}}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        {question.data?.columns?.map((v, i) => <TableCell key={i}>{v}</TableCell>)}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {question.data?.rows?.map((row, index) => (
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

                <Paper className={`${question.status <= ResultStatus.LOADING_DATA && "flex justify-center p-4"} mt-4`}>
                    {question.status <= ResultStatus.LOADING_DATA
                      ? <CircularProgress/>
                      : <Chart data={{
                          columns: question.data?.columns ?? [],
                          rows: question.data?.rows || []
                      }}/>
                    }

                </Paper>

            </Grid>


        </Grid>


    </>
}
