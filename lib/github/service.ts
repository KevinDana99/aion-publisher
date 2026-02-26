export interface GithubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  private: boolean
  default_branch: string
  language: string | null
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  pushed_at: string
  created_at: string
  updated_at: string
}

export async function fetchGithubRepos(token: string): Promise<GithubRepo[]> {
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28'
  }

  const url = 'https://api.github.com/user/repos?per_page=100&sort=updated'
  const response = await fetch(url, { headers })
  
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} - ${response.statusText}`)
  }

  return response.json()
}

export async function fetchGithubRepo(token: string, owner: string, repo: string): Promise<GithubRepo> {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`)
  }

  return response.json()
}
