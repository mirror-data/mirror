import {CopilotResponse} from "../utils/models/copilot";

export const getPrompt = ({question, describe}: { question: string, describe?: string }) => {
  return `# MySQL SQL 
# Table github_events, columns = [id, type, created_at, repo_id, repo_name, actor_id, actor_login, actor_location, language, additions, deletions, action, number, commit_id, comment_id, org_login, org_id, state, closed_at, comments, pr_merged_at, pr_merged, pr_changed_files, pr_review_comments, pr_or_issue_id, event_day, event_month, author_association, event_year, push_size, push_distinct_size]
# Table programming_language_repos, columns = [id, name]
# Table users, columns = [id, login, company, company_name, created_at, type, fake, deleted, long, lat, country_code, state, city, location]
# Relationship [github_events.actor_login = users.login] 
# Relationship [github_events.repo_id = programming_language_repos.id] 
${describe}
# Question:
# ${question}?
---
SELECT`
}

export const fetchChoices = async (question: string): Promise<CopilotResponse> => {
  const res = await fetch(`/api/models/copilot`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: getPrompt({question})
    })
  })
  if (!res.ok) {
    return {
      error: await res.text()
    }
  }
  return res.json()
}