export const BASE_TEMPLATE = `# MySQL SQL
Only two tables, ["github_events", "github_users"]
Table github_events, columns = [id, type, created_at, repo_name, repo_id, actor_id, actor_login, language, additions, deletions,  number, commit_id, comment_id, org_login, org_id, state, closed_at, comments, pr_merged_at, pr_changed_files, pr_review_comments, event_day, event_month, event_year, push_size, push_distinct_size, creator_user_login, creator_user_id]
Table github_users, columns = [id, login, type, is_bot, name, email, organization, organization_formatted, address, country_code, region_code, state, city, longitude, latitude, public_repos, followers, followings, created_at, updated_at, is_deleted, refreshed_at]

github_events.type in ["CreateEvent", "ReleaseEvent", "IssuesEvent", "PullRequestEvent", "PullRequestReviewCommentEvent", "CommitCommentEvent", "PullRequestReviewEvent", "WatchEvent"] 

Define stargazer, github_events.type = "WatchEvent"
Define star, github_events.type = "WatchEvent"
Define user name = github_events.actor_login
Define user_id = github_events.actor_id
Relation github_events.actor_id = github_users.id

`


export const getSQLEditorPrompt = ({question, sql}: { question: string, sql: string, histories?: [] }) => {
  return `${BASE_TEMPLATE}
# Question:
# ${question}?
# Limit not more than 100 rows
---SQL---
${sql}`
}


