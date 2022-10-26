import {getValueFromEnv} from "./env";

export const BASE_TEMPLATE = `# MySQL SQL
${getValueFromEnv("SQL_PROMPT", true)}
`


export const getSQLEditorPrompt = ({question, sql}: { question: string, sql: string, histories?: [] }) => {
  return `${BASE_TEMPLATE}
# Question:
# ${question}?
---SQL---
${sql}`
}


