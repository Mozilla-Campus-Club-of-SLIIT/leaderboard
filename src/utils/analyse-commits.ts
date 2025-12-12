import { FileData, User } from "@/types/user.js"
import { commitCategories } from "./commit-categories"
import { calculateChangeScore, calculateOverallScore, ignoreFilesPattern } from "./scoring"
import type { Endpoints } from "@octokit/types"

function createUser(author: { name: string; avatar_url: string; html_url: string }): User {
  const user: User = {
    name: author.name,
    avatarUrl: author.avatar_url,
    htmlUrl: author.html_url,
    commits: [],
    commitDetails: [],
    commitCount: 0,
    changeScore: 0,
    overallScore: 0,
  }
  for (const cat of commitCategories) {
    user[cat.countField] = 0
    user[cat.listField] = []
  }
  return user as User
}

export const analyseCommits = (
  commits: Endpoints["GET /repos/{owner}/{repo}/commits"]["response"]["data"],
): User[] => {
  const results: User[] = []

  for (const commit of commits) {
    if (!commit.commit) continue
    const author = commit.author || commit.commit.author || commit.committer
    if (author === null) continue
    const authorName = "login" in author ? author.login : author.name
    if (!authorName) continue

    // Exclude bots/apps by checking against a list of patterns
    const excludePatterns = ["bot", "app"]
    if (excludePatterns.some((pattern) => authorName.toLowerCase().includes(pattern))) continue

    let user = results.find((u) => u.name === authorName)

    if (!user) {
      user = createUser({
        name: authorName,
        avatar_url: "avatar_url" in author ? author.avatar_url : "",
        html_url: "html_url" in author ? author.html_url : "",
      })
      results.push(user)
    }

    const commitMsg = commit.commit.message.split("\n")[0]
    const commitDate = commit.commit.author?.date || commit.commit.committer?.date || ""
    const commitFiles = commit.files as FileData[]

    let changeScore = 0

    for (const file of commitFiles) {
      if (ignoreFilesPattern.test(file.filename)) continue
      changeScore += calculateChangeScore(file.additions, file.deletions)
    }

    user.commits.push(commitMsg)
    user.commitDetails.push({
      message: commitMsg,
      date: commitDate,
      files: commitFiles
        .filter((f) => !ignoreFilesPattern.test(f.filename))
        .map((f) => ({
          filename: f.filename,
          additions: f.additions,
          deletions: f.deletions,
          changes: f.changes,
        })),
    })
    user.commitCount += 1
    user.changeScore += changeScore
    // applying log10 will help the leaderboard to not break when there are 1000+ additions
    // we apply little bit more weight to the change score so people can't get to top with just spam commits
    user.overallScore = calculateOverallScore(user.commitCount, user.changeScore)

    for (const category of commitCategories) {
      if (category.pattern.test(commitMsg)) {
        ;(user[category.countField] as number)++
        ;(user[category.listField] as string[]).push(commitMsg)
        break
      }
    }
  }

  return results
}
