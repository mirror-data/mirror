// use NextJS, MUI, Tailwind, React

// AnswerComponent
// input: answer
// output: answer result with h2
// use MUI Card wrapper each component, with padding, with right margin


import {Card} from "@mui/material";

export default function AnswerComponent({answer}: { answer: string }) {
  return (
    <Card className="p-4 mr-4">
      <h2>{answer}</h2>
    </Card>
  )
}

