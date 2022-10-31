import {SQLData} from "@/state/question";
import Paper from "@mui/material/Paper";
import {CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import * as React from "react";

interface Props {
  data?: SQLData
  error?: string
  isLoading: boolean
}

export const SqlData: React.FC<Props> = ({data, error, isLoading}) => {


  if (error) {
    return <div>{error}</div>
  }
  if (isLoading) {
    return <CircularProgress/>
  }

  return <TableContainer component={Paper} sx={{maxHeight: 400}}>
    <Table stickyHeader>
      <TableHead>
        <TableRow>
          {data?.columns?.map((v, i) => <TableCell key={i}>{v}</TableCell>)}
        </TableRow>
      </TableHead>
      <TableBody>
        {data?.rows?.map((row, index) => (
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