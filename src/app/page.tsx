"use client"

import Table from "@/components/Table"
import useFetch from "@/hooks/useFetch"
import RateLimit from "@/types/ratelimit"
import { User } from "@/types/user"
import { relativeTime } from "@/utils/relative-time"
import { CHANGESCORE_MULTIPLIER, COMMIT_MULTIPLIER } from "@/utils/scoring"
import { useEffect, useState } from "react"
import moxyLeaderboardImage from "@/assets/images/moxy-leaderboard.png"
import Image from "next/image"
import ThemeToggle from "@/components/ThemeToggle"
import Logo from "@/components/Logo"

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
    <main className="min-h-screen font-sans" style={{ background: "var(--bg)", color: "var(--fg)" }}>
      <header className="sticky top-0 z-50 flex items-center gap-4 px-6 py-4 shadow-sm border-b" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <div className="flex items-center gap-4">
          {/* Logo switches automatically between light and dark variants */}
          <Logo className="w-16 h-auto" />
          <h1 className="text-xl font-semibold" style={{ color: "var(--fg)" }}>SLIIT Mozilla GitHub Leaderboard</h1>
        </div>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </header>

      <section id="information" className="max-w-5xl m-auto px-6 pt-8">
        <div className="flex flex-col items-end justify-between md:flex-row gap-6">
          <div className="w-full md:w-1/2">
            {" "}
            <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--fg)' }}>Top Contributors</h3>
            <p className="mb-2">
              Here’s a spotlight on the most active contributors to the{" "}
              <a href="https://www.sliitmozilla.org/" className="org-link">Mozilla Campus Club of SLIIT</a>.
            </p>
            <p className="mb-6">
              Want to be featured? Contribute to our{" "}
              <a
                href="https://github.com/Mozilla-Campus-Club-of-SLIIT/"
                className="accent-link font-medium"
              >
                Github organization
              </a>{" "}
              and climb the leaderboard.
            </p>
            <h4 className="text-lg font-semibold mb-2" style={{ color: 'var(--fg)' }}>How Points Are Calculated</h4>
            <pre className="rounded p-4 mb-4 text-sm font-mono overflow-x-auto" style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--fg)' }}>
              <code>
                <span style={{ color: 'var(--purple)' }} className="">score</span> = commitCount *{" "}
                <span style={{ color: 'var(--green)' }}>{COMMIT_MULTIPLIER}</span> +{" "}
                <span style={{ color: 'var(--pink)' }}>log10</span>
                (changeScore + <span style={{ color: 'var(--green)' }}>1</span>) *{" "}
                <span style={{ color: 'var(--green)' }}>{CHANGESCORE_MULTIPLIER}</span>
              </code>
            </pre>
            <div className="mb-2 text-muted">
              Where <b className="font-semibold">change score</b> is the quality of the changes made.
            </div>
            <p>
              Learn more about how we calculate this{" "}
              <a
                href="https://github.com/Mozilla-Campus-Club-of-SLIIT/leaderboard/blob/main/src/utils/scoring.ts"
                className="accent-link font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                on GitHub
              </a>
              .
            </p>
          </div>
          <div className="flex-shrink-0 w-full md:w-sm">
            <Image
              src={moxyLeaderboardImage}
              alt="Moxy looking at leaderboard"
              className="w-xs h-auto"
            />
          </div>
        </div>
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
