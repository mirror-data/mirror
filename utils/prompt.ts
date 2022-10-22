const BASE_TEMPLATE = `# MySQL SQL 
# Table github_events, columns = [id, type, created_at, repo_id, repo_name, actor_id, actor_login, actor_location, language, additions, deletions, action, number, commit_id, comment_id, org_login, org_id, state, closed_at, comments, pr_merged_at, pr_merged, pr_changed_files, pr_review_comments, pr_or_issue_id, event_day, event_month, author_association, event_year, push_size, push_distinct_size]
# Table programming_language_repos, columns = [id, name]
# Table users, columns = [id, login, company, company_name, created_at, type, fake, deleted, long, lat, country_code, state, city, location]
# Relationship [github_events.actor_login = users.login] 
# Relationship [github_events.repo_id = programming_language_repos.id] 
# Describe [contribute] distinct users
# Describe [contribute] github_events.type = [IssuesEvent, PullRequestEvent, PullRequestReviewCommentEvent, CommitCommentEvent, PullRequestReviewEvent]
# Describe [country or region] users.country_code
# Describe [programming languages] table programming_language_repos
`


export const getSQLPrompt = ({question}: { question: string }) => {
  return `${BASE_TEMPLATE}
---
# Question:
# ${question}?
---
SELECT`
}

export const getSQLEditorPrompt = ({question, sql, histories}: { question: string, sql: string, histories?: [] }) => {
  return `${BASE_TEMPLATE}
---
# Question:
# ${question}?
---
# Edit history:
# ${histories ? histories.join("\n#") : ""}
---SQL---
${sql}`
}

export const getVegaPrompt = ({columns, rows}:
                                { columns?: string[], rows?: string[][] }) => {
  return `// You are given a json, is vega schema defined, and a vega spec.
//
// EXAMPLE 1:
// ==================
// DATA csv format
// --------------------
// column1, column2
// A, 28
// B, 55
// C, 43
// D, 91
// E, 81
// F, 53
// G, 19
// H, 87
// I, 52
// =====================
// your vega spec:
// {
//   "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
//   "description": "A simple bar chart with embedded data.",
//   "data": {
//     "values": [
//       {"column1": "A", "column2": 28}, {"column1": "B", "column2": 55}, {"column1": "C", "column2": 43},
//       {"column1": "D", "column2": 91}, {"column1": "E", "column2": 81}, {"column1": "F", "column2": 53},
//       {"column1": "G", "column2": 19}, {"column1": "H", "column2": 87}, {"column1": "I", "column2": 52}
//     ]
//   },
//   "mark": "bar",
//   "encoding": {
//     "x": {"field": "column1", "type": "nominal", "axis": {"labelAngle": 0}},
//     "y": {"field": "column2", "type": "quantitative"}
//   }
// }
//
// EXAMPLE 2:
// ==================
// DATA csv format
// --------------------
// name, country, count
// A, USA, 28
// A, CN, 55
// B, USA, 43
// C, USA, 91
// D, DE, 81
// D, CN, 53
// =====================
// your vega spec:
// {
//   "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
//   "description": "A simple bar chart with embedded data.",
//   "data": {
//     "values": [
//       {"name": "A", "country": "USA", "count": 28},
//       {"name": "A", "country": "CN", "count": 55},
//       {"name": "B", "country": "USA", "count": 43},
//       {"name": "C", "country": "USA", "count": 91},
//       {"name": "D", "country": "DE", "count": 81},
//       {"name": "D", "country": "CN", "count": 53}
//     ]
//   },
//   "mark": "bar",
//   "encoding": {
//     "x": {"field": "country", "type": "nominal", "axis": {"labelAngle": 0}},
//     "y": {"field": "count", "type": "quantitative"},
//     "color": {"field": "name", "type": "nominal"}
//   }
// }



==================
DATA csv format
--------------------
${columns?.join(", ")}
${rows?.slice(0, 30).map(row => row.join(", ")).join("\n")}
=====================
your vega spec:
`

}

export const getAnswerPrompt = ({columns, rows, question}:
                                  { columns?: string[], rows?: string[][], question: string }) => {
  return `
${columns?.join(", ")}
---
${rows?.slice(0, 30).map(row => row.join(", ")).join("\n")}
---
Question: ${question}?
Answer for a CEO: 
`


}