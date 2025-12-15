import { Octokit } from "@octokit/rest"

export class GitHubAPI {
  private octokit: Octokit
  private owner: string

  constructor(token: string, owner: string) {
    this.octokit = new Octokit({ auth: token })
    this.owner = owner
  }

  async getUserRepos() {
    const response = await this.octokit.repos.listForUser({
      username: this.owner,
      per_page: 100,
    })
    return response.data.map((repo) => repo.name)
  }

  async getOrgRepos() {
    const response = await this.octokit.repos.listForOrg({
      org: this.owner,
      per_page: 100,
    })
    return response.data.filter((repo) => !repo.fork).map((repo) => repo.name)
  }

  async getCommits(repo: string) {
    const commits = await this.octokit.paginate(this.octokit.repos.listCommits, {
      owner: this.owner,
      repo,
      per_page: 100,
    })

    return Promise.all(commits.map((c) => this.getCommit(c.sha, repo)))
  }

  async getCommit(ref: string, repo: string) {
    const response = await this.octokit.repos.getCommit({
      owner: this.owner,
      ref,
      repo,
    })
    return response.data
  }

  async getRateLimit() {
    const response = await this.octokit.request("GET /rate_limit")
    return response.data.rate
  }
}
