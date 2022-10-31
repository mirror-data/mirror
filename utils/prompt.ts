import {getValueFromEnv} from "./env";

export const BASE_TEMPLATE = `# MySQL SQL
Table github_events, columns = [id, type, created_at, repo_id, actor_id, actor_login, language, additions, deletions,  number, commit_id, comment_id, org_login, org_id, state, closed_at, comments, pr_merged_at, pr_changed_files, pr_review_comments, event_day, event_month, event_year, push_size, push_distinct_size, creator_user_login, creator_user_id]
all type = [IssuesEvent, PullRequestEvent, PullRequestReviewCommentEvent, CommitCommentEvent, PullRequestReviewEvent, WatchEvent] 
github_events.type = [IssuesEvent, PullRequestEvent, PullRequestReviewCommentEvent, CommitCommentEvent, PullRequestReviewEvent]

stargazer = github_events.type = WatchEvent
`


export const getSQLEditorPrompt = ({question, sql}: { question: string, sql: string, histories?: [] }) => {
  return `${BASE_TEMPLATE}
# Question:
# ${question}?
---SQL---
${sql}`
}


