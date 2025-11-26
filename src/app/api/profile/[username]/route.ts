import { redis } from "@/lib/upstash"
import { User } from "@/types/user"
import { updateLeaderboard } from "../../leaderboard/update/route"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest, ctx: RouteContext<"/api/profile/[username]">) {
  const params = await ctx.params
  const username = params.username
  let leaders: User[] = (await redis.get("leaders")) as User[]
  if (!leaders) await updateLeaderboard()
  // fetch again
  leaders = (await redis.get("leaders")) as User[]
  if (!leaders) return Response.json({ body: "Cannot fetch leaderboard now" }, { status: 503 })

  const profile = leaders.find((user) => user.name === username)
  if (!profile) return Response.json({ body: "User not found" }, { status: 404 })
  return Response.json(profile)
}
