// use NextJS, MUI, Tailwind, React

// DataTable
// input: csv format data
// output: show data with MUI Table

import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {Paper} from "@mui/material";

export default function DataTable({data}: { data: string }) {
  // parse csv data
  const rows = data.split("\n")
  const columns = rows[0].split(',')
  const tableRows = rows.slice(1)

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell>{column}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableRows.map((row) => (
              <TableRow>
                {row.split(',').map((cell) => (
                  <TableCell>{cell}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

