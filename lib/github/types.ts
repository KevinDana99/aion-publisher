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
  watchers_count: number
  pushed_at: string
  created_at: string
  updated_at: string
  topics: string[]
  permissions: {
    admin: boolean
    push: boolean
    pull: boolean
  }
}

export interface GithubBranch {
  name: string
  commit: {
    sha: string
    url: string
  }
  protected: boolean
}

export interface GithubDeployment {
  id: number
  sha: string
  ref: string
  environment: string
  description: string | null
  creator: {
    login: string
    avatar_url: string
  }
  created_at: string
  updated_at: string
  statuses_url: string
}

export interface GithubDeploymentStatus {
  id: number
  state: 'error' | 'failure' | 'inactive' | 'in_progress' | 'queued' | 'pending' | 'success'
  description: string | null
  environment: string
  created_at: string
}
