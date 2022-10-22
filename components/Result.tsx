// **** BEGIN original prompt to generate UI skeleton ****

// use NextJS, MUI, Tailwind, React

// AnswerComponent
// input: answer
// output: answer result with h2
// use MUI Card wrapper each component, with padding, with right margin

// **** END original prompt to generate UI skeleton ****


import * as React from 'react';
import {useEffect} from 'react';
import Paper from '@mui/material/Paper';
import {
    Button,
    CircularProgress,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from "@mui/material";
import {resultAtom, ResultStatus} from "../state/question";
import {useAtom} from 'jotai'
import SqlEditor from "./SqlEditor";
import {LoadingButton} from "@mui/lab";
import {DiffModal} from "./DiffModal";

interface Props {
    editLoading: boolean
    onEdit: (edit: string) => void
}

export default ({onEdit, editLoading}: Props) => {
    const [question, setQuestion] = useAtom(resultAtom)
    const [instruction, setInstruction] = React.useState<string>("")


    useEffect(() => {
        if (!editLoading) {
            setInstruction("")
        }

    }, [editLoading])
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
                    question.status > ResultStatus.LOADING_SUGGESTIONS && <div className={"flex"}>
                        <TextField
                            className={"flex-grow"}
                            label="Add more instructions"
                            variant="standard"
                            value={instruction}
                            disabled={editLoading}
                            onChange={e => setInstruction(e.target.value)}
                            fullWidth
                        />
                        {
                            editLoading
                                ? <LoadingButton size="small" variant="outlined" loading/>
                                :
                                <Button className="submit-instruction-button" size="small" variant="contained" onClick={e => onEdit(instruction)}>Submit</Button>

                        }
                    </div>
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

            </Grid>


        </Grid>


    </>
}
