import { throttling } from "@octokit/plugin-throttling"
import { Octokit } from "@octokit/rest"

export class GitHubAPI {
  private octokit: Octokit
  private owner: string

  constructor(token: string, owner: string) {
    const ThrottlingOctokit = Octokit.plugin(throttling)
    this.octokit = new ThrottlingOctokit({
      auth: token,
      throttle: {
        onRateLimit(retryAfter, options, octokit, retryCount) {
          octokit.log.warn(`Request quota exhausted for request ${options.method} ${options.url}`)
          if (retryCount < 3) {
            octokit.log.info(`Retrying after ${retryAfter} seconds!`)
            return true
          }
        },
        onSecondaryRateLimit(retryAfter, options, octokit, retryCount) {
          octokit.log.warn(
            `SecondaryRateLimit detected for request ${options.method} ${options.url}`,
          )
          if (retryCount < 3) {
            octokit.log.info(`Retrying after ${retryAfter} seconds!`)
            return true
          }
        },
      },
    })
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
