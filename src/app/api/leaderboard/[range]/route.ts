import { redis } from "@/lib/upstash"
import { updateLeaderboard } from "../update/route"
import { User } from "@/types/user"
import { filterCommitsByDate } from "@/utils/filterCommitsByDate"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest, ctx: RouteContext<"/api/leaderboard/[range]">) {
  const params = await ctx.params
  const validRanges = ["daily", "weekly", "monthly", "yearly", "all"]
  const range = validRanges.includes(params.range) ? params.range : "all"

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
      changeScore: user.changeScore,
      overallScore: user.overallScore,
    })),
  )
}
