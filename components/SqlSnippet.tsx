// use NextJS, MUI, Tailwind, React

// SqlSnippet
// input: text with sql code
// show sql code with pre, with mono font, with background color #f6f8fa

export default function SqlSnippet({sql}: { sql: string }) {
  return (
    <div>
      <pre className="bg-gray-100 p-2 rounded-md font-mono">{sql}</pre>
    </div>
  )
}


