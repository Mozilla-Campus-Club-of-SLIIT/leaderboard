"use client"

import Table from "@/components/Table"
import Header from "@/components/Header"
import useFetch from "@/hooks/useFetch"
import RateLimit from "@/types/ratelimit"
import { User } from "@/types/user"
import { relativeTime } from "@/utils/relative-time"
import { CHANGESCORE_MULTIPLIER, COMMIT_MULTIPLIER } from "@/utils/scoring"
import { useEffect, useState } from "react"
import moxyLeaderboardImage from "@/assets/images/moxy-leaderboard.png"
import avatarPlaceholder from "@/assets/images/placeholder.png"

import Image from "next/image"

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
      <Header />
      <section id="information" className="max-w-5xl m-auto px-6 pt-8">
        <div className="flex flex-col items-end justify-between md:flex-row gap-6">
          <div className="w-full md:w-1/2">
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
            {/* Desktop/tablet only */}
            <h4 className="text-lg font-semibold text-gray-800 mb-2 md:block hidden">
              How Points Are Calculated
            </h4>
            <pre className="bg-white border border-gray-300 rounded p-4 mb-2 text-sm font-mono text-gray-800 overflow-x-auto md:block hidden">
              <code>
                <span className="text-purple-600">score</span> = commitCount *{" "}
                <span className="text-green-600">{COMMIT_MULTIPLIER}</span> +{" "}
                <span className="text-pink-600">log10</span>
                (changeScore + <span className="text-green-600">1</span>) *{" "}
                <span className="text-green-600">{CHANGESCORE_MULTIPLIER}</span>
              </code>
            </pre>
            <div className="text-gray-700 mb-2 md:block hidden">
              Where <b>change score</b> is the quality of the changes made.
            </div>
            <p className="md:block hidden">
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
          </div>
          {/* Desktop/tablet only */}
          <div className="flex-shrink-0 w-full md:max-w-md md:block hidden">
            <Image
              src={moxyLeaderboardImage}
              alt="Moxy looking at leaderboard"
              className="w-full h-auto max-w-md"
            />
          </div>
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
            user.htmlUrl ? (
              <a
                key={`link-${index}`}
                href={user.htmlUrl as string}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-4 items-center pointer text-indigo-600 hover:underline font-medium group relative"
              >
                <img
                  src={(user.avatarUrl || avatarPlaceholder.src) as string}
                  onError={(e) => {
                    e.currentTarget.src = avatarPlaceholder.src
                  }}
                  className="w-10 h-auto rounded-full"
                  alt={user.name}
                />
                <div>{user.name}</div>
              </a>
            ) : (
              <div key={`link-${index}`} className="flex gap-4 items-center group relative">
                <div className="pointer-events-none absolute duration-200 transition-opacity opacity-0 group-hover:opacity-100 bottom-full -left-10 mb-2 block bg-gray-800 text-white text-sm rounded px-2 py-1">
                  Deactivated Account
                </div>
                <img
                  src={avatarPlaceholder.src}
                  className="w-10 h-auto rounded-full"
                  alt={user.name}
                />
                <div>{user.name}</div>
              </div>
            ),
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
        {/* Mobile only */}
        <div className="block md:hidden mt-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-2">How Points Are Calculated</h4>
          <pre className="bg-white border border-gray-300 rounded p-4 mb-2 text-sm font-mono text-gray-800 overflow-x-auto">
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
          <div className="w-full flex justify-center mt-4">
            <Image
              src={moxyLeaderboardImage}
              alt="Moxy looking at leaderboard"
              className="w-full h-auto max-w-md"
            />
          </div>
        </div>
      </section>
      <section className="w-full text-center py-6 text-sm text-gray-500">
        © {new Date().getFullYear()} Mozilla Campus Club of SLIIT. Made with{" "}
        <span className="text-red-500">❤️</span> by SLIIT Mozillians
      </section>
    </main>
  )
}
