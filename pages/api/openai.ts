import {NextApiRequest, NextApiResponse} from "next";
import {getValueFromEnv} from "../../utils/env";


const completions_pre = "# Table github_events, columns = [id, type, created_at, repo_id, repo_name, actor_id, actor_login, actor_location, language, additions, deletions, action, number, commit_id, comment_id, org_login, org_id, state, closed_at, comments, pr_merged_at, pr_merged, pr_changed_files, pr_review_comments, pr_or_issue_id, event_day, event_month, author_association, event_year, push_size, push_distinct_size]\n" +
    "# Table programming_language_repos, columns = [id, name]\n" +
    "# Table users, columns = [id, login, company, company_name, created_at, type, fake, deleted, long, lat, country_code, state, city, location]\n\n";

const {Configuration, OpenAIApi} = require("openai");

const configuration = new Configuration({
    apiKey: getValueFromEnv('OPENAI_API_KEY'),
});
const openai = new OpenAIApi(configuration);

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const response = await openai.createCompletion({
        model: "text-davinci-002",
        prompt: req.body.prompt,
        temperature: 0.4,
        max_tokens: 500,
        top_p: 1,
        best_of: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        stop: ["#", ";", "--"],
    });

    res.status(200).json({q: req.body.question, data: response.data})
}
