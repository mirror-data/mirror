import { Table } from '@mantine/core';

export default function DataTable({columns, rows}: { columns: string[], rows: string[][] }) {
  return (
    <div className="overflow-auto max-h-[500px] font-mono">
      <Table striped highlightOnHover>
        <thead>
        <tr>
          {columns.map((column, index) => <th key={index}>{column}</th>)}
        </tr>
        </thead>
        <tbody>
        {rows.map((row, index) => <tr key={index}>
          {row.map((cell, index) => <td key={index}>{cell}</td>)}
        </tr>)}

        </tbody>
      </Table>
    </div>
  )
}

