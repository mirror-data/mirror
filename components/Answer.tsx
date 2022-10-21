// use NextJS, MUI, Tailwind, React

// AnswerComponent
// input: text
// output: answer result with h2


export default function AnswerComponent({text}: { text: string }) {
  return (
    <div>
      <h2>{text}</h2>
    </div>
  )
}

