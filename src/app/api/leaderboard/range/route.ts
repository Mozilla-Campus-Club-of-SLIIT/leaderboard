import { redis } from "@/lib/upstash" 
import { updateLeaderboard } from "../update/route"
import { User } from "@/types/user"
import { filterCommitsByDate } from "@/utils/filterCommitsByDate"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const range = searchParams.get("range") || "all"

  let leaders = (await redis.get("leaders")) as User[] | null
  if (!leaders) await updateLeaderboard()
  leaders = await redis.get("leaders")
  if (!leaders) return Response.json({ body: "Cannot fetch leaderboard now" }, { status: 503 })

  if (range !== "all") {
    leaders = filterCommitsByDate(leaders, range as "daily" | "weekly" | "monthly" | "yearly")
  }

  return Response.json(
    leaders.map((user) => ({
      name: user.name,
      avatarUrl: user.avatarUrl,
      htmlUrl: user.htmlUrl,
      commits: user.commitCount,
      commitDetails: user.commitDetails,
      changeScore: user.changeScore,
      overallScore: user.overallScore,
    }))
  )
}
