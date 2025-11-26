import { redis } from "@/lib/upstash"
import { updateLeaderboard } from "./update/route"
import { User } from "@/types/user"

export async function GET() {
  let leaders = await redis.get("leaders")
  if (!leaders) await updateLeaderboard()
  // fetch again
  leaders = await redis.get("leaders")
  if (!leaders) return Response.json({ body: "Cannot fetch leaderboard now" }, { status: 503 })

  leaders = (leaders as User[]).map((user) => ({
    name: user.name,
    avatarUrl: user.avatarUrl,
    htmlUrl: user.htmlUrl,
    commits: user.commitCount,
    changeScore: user.changeScore,
    overallScore: user.overallScore,
  }))
  return Response.json(leaders)
}
