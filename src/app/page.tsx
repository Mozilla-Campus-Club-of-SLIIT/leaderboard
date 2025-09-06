"use client"

import Table from "@/components/Table"
import useFetch from "@/hooks/useFetch"
import RateLimit from "@/types/ratelimit"
import { User } from "@/types/user"
import { relativeTime } from "@/utils/relative-time"
import { CHANGESCORE_MULTIPLIER, COMMIT_MULTIPLIER } from "@/utils/scoring"
import { useEffect, useState } from "react"

export default function Home() {
  const [refreshRatelimit, setRefreshRatelimit] = useState(false)
  const [refreshLastUpdated, setRefreshLastUpdated] = useState(false)

  const [leaderboard, , isLeaderboardLoading] = useFetch<User[]>(
    "/api/leaderboard",
    [] as User[],
    false,
  )
  const [ratelimit] = useFetch<RateLimit>("/api/leaderboard/ratelimit", {}, refreshRatelimit)
  const [lastUpdated, , isLastUpdatedLoading] = useFetch<number>(
    "/api/leaderboard/last-update",
    0,
    refreshLastUpdated,
  )
  const [timeAgo, setTimeAgo] = useState(relativeTime(lastUpdated))

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeAgo(relativeTime(lastUpdated))
    }, 5000)

    return () => clearInterval(interval)
  }, [lastUpdated, setTimeAgo])

  useEffect(() => {
    setRefreshRatelimit((prev) => !prev)
    setRefreshLastUpdated((prev) => !prev)
    setTimeAgo(relativeTime(lastUpdated))
  }, [isLeaderboardLoading, lastUpdated])

  return (
    <main className="bg-gray-50 text-gray-800 min-h-screen font-sans">
      <header className="bg-white sticky top-0 z-50 flex items-center gap-4 px-6 py-4 shadow-sm border-b border-gray-200">
        <img src="/logo.png" alt="SLIIT Mozilla Logo" className="w-16 h-auto" />
        <h1 className="text-xl font-semibold text-gray-900">SLIIT Mozilla GitHub Leaderboard</h1>
      </header>

      <section id="information" className="max-w-5xl m-auto px-6 pt-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Top Contributors</h3>
        <p className="mb-2">
          Here’s a spotlight on the most active contributors to the{" "}
          <strong className="text-indigo-600">Mozilla Campus Club of SLIIT</strong>.
        </p>
        <p className="mb-6">
          Want to be featured? Contribute to our{" "}
          <a
            href="https://github.com/Mozilla-Campus-Club-of-SLIIT/"
            className="text-indigo-600 hover:underline font-medium"
          >
            Github organization
          </a>{" "}
          and climb the leaderboard.
        </p>

        <h4 className="text-lg font-semibold text-gray-800 mb-2">How Points Are Calculated</h4>

        <pre className="bg-white border border-gray-300 rounded p-4 mb-4 text-sm font-mono text-gray-800 overflow-x-auto">
          <code>
            <span className="text-purple-600">score</span> = commitCount *{" "}
            <span className="text-green-600">{COMMIT_MULTIPLIER}</span> +{" "}
            <span className="text-pink-600">log10</span>
            (changeScore + <span className="text-green-600">1</span>) *{" "}
            <span className="text-green-600">{CHANGESCORE_MULTIPLIER}</span>
          </code>
        </pre>

        <div className="text-gray-700 mb-2">
          Where <b>change score</b> is the quality of the changes made.
        </div>

        <p>
          Learn more about how we calculate this{" "}
          <a
            href="https://github.com/Mozilla-Campus-Club-of-SLIIT/leaderboard/blob/main/src/utils/scoring.ts"
            className="text-indigo-600 hover:underline font-medium"
            target="_blank"
            rel="noopener noreferrer"
          >
            on GitHub
          </a>
          .
        </p>
      </section>

      <section id="ratelimit" className="m-auto max-w-5xl text-xs text-gray-400 px-6 pt-4">
        <div>
          API usage:{" "}
          {isLastUpdatedLoading ? (
            "loading..."
          ) : (
            <>
              {ratelimit.used} / {ratelimit.limit}
            </>
          )}
        </div>
        <div>
          Last updated{" "}
          <abbr title={new Date(lastUpdated).toLocaleString()} className="italic">
            {timeAgo}
          </abbr>
        </div>
      </section>

      <section id="leaderboard" className="m-auto max-w-5xl px-6 py-4">
        <Table<User>
          headers={["Rank", "Contributor", "Commits", "Change score", "Overall score"]}
          sortColumns={["Commits", "Change score", "Overall score"]}
          defaultSortingColumn="Overall score"
          defaultSortingMethod="descending"
          isLoading={isLeaderboardLoading}
          renderFunction={(user: User, index: number) => [
            index + 1,
            <a
              key={`link-${index}`}
              href={user.htmlUrl as string}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-4 items-center pointer text-indigo-600 hover:underline font-medium"
            >
              <img
                src={(user.avatarUrl || null) as string}
                className="w-10 h-auto rounded-full"
                alt={user.name}
              />
              <div>{user.name}</div>
            </a>,
            <div className="text-right" key={`commits-${index}`}>
              {user.commits}
            </div>,
            <div className="text-right" key={`change-${index}`}>
              {user.changeScore.toFixed(2)}
            </div>,
            <div className="text-right" key={`overall-${index}`}>
              {user.overallScore.toFixed(2)}
            </div>,
          ]}
          rows={leaderboard}
          columnToKeyMap={{
            ["Commits"]: "commits",
            ["Change score"]: "changeScore",
            ["Overall score"]: "overallScore",
          }}
        />
      </section>
    </main>
  )
}
