import { User } from "@/types/user"
import { calculateChangeScore, calculateOverallScore } from "@/utils/scoring"

export const filterCommitsByDate = (
  users: User[],
  type: "daily" | "weekly" | "monthly" | "yearly",
) => {
  const now = new Date()
  let from: Date

  switch (type) {
    case "daily":
      from = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      break
    case "weekly":
      from = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
      break
    case "monthly":
      from = new Date(now.getFullYear(), now.getMonth(), 1)
      break
    case "yearly":
      from = new Date(now.getFullYear(), 0, 1)
      break
    default:
      return users
  }

  return users
    .map((user) => {
      // Filter commitDetails by date
      const filteredCommitDetails = user.commitDetails.filter((c) => new Date(c.date) >= from)

      // Recalculate commitCount
      const commitCount = filteredCommitDetails.length

      // Recalculate changeScore from filtered commits
      let changeScore = 0

      for (const commit of filteredCommitDetails) {
        // Each commit now has files with additions/deletions
        if (commit.files) {
          for (const file of commit.files) {
            changeScore += calculateChangeScore(file.additions, file.deletions)
          }
        }
      }

      // Recalculate overallScore
      const overallScore = calculateOverallScore(commitCount, changeScore)

      return {
        ...user,
        commitDetails: filteredCommitDetails,
        commitCount,
        changeScore,
        overallScore,
      }
    })
    .filter((user) => user.commitCount > 0)
}
