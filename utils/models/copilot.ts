export const get_copilot_token_from_env = (): string => {
  return process.env.COPILOT_TOKEN || '';
}
export interface Choice {
  order: number;
  text: string;
}

export interface CopilotResponse {
  error?: string
  choices?: Choice[]
}


export class CopilotModel {
  token: string = "";

  constructor() {
  }

  update_token = async () => {
    const res = await fetch("https://api.github.com/copilot_internal/v2/token", {
      headers: {
        "Authorization": `Bearer ${get_copilot_token_from_env()}`,
      }

    }).then(res => res.json())
    this.token = res.token
  }

  get_or_update_token = async () => {
    if (!this.token) {
      await this.update_token()
      return
    }
    const now = Date.now()
    const token_expires = parseInt(this.token.split(";")[1].split("=")[1])
    if (token_expires - 10 < (now / 1000)) {
      await this.update_token()
    }
  }

  exec: (prompt: string) => Promise<CopilotResponse> = async (prompt) => {
    await this.get_or_update_token()
    const res = await fetch("https://copilot-proxy.githubusercontent.com/v1/engines/copilot-codex/completions",
      {
        headers: {
          'Content-Type': 'application/json',
          'Openai-Organization': 'copilot-ghost',
          'OpenAI-Intent': 'github-copilot',
          'Authorization': `Bearer ${this.token}`,
        },
        method: "POST",
        body: JSON.stringify({
          prompt,
          stream: true,
          "stop": [
            "#",
            "---",
          ],
          "temperature": 0.3,
          "max_tokens": 400,
          "top_p": 1,
          "n": 1,
          "logprobs": 2,
        })
      })
      .then(function (res) {
        return res.text();
      })


    if (!res.startsWith("data: ")) {
      return {error: res}
    }

    const results = res.split("\n")
      .filter(value => value.startsWith("data: "))
      .map(value => value.slice(6).trim())
      .filter(value => value !== "[DONE]")
      .map(value => JSON.parse(value))


    const summary = new Map<number, string>();
    results.forEach(data => {
      const c = data.choices[0]
      if (!summary.has(c.index)) {
        summary.set(c.index, "SELECT")
      }
      summary.set(c.index, summary.get(c.index) + c.text)
    })

    const choices = Array.from(summary.entries()).map(([order, text]) => ({order, text}))

    return {
      choices,
    }
  }
}