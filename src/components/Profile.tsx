"use client"

import { User } from "@/types/user"
import { useEffect, useRef, useState } from "react"
import {
  Book,
  Bug,
  Dices,
  GitCommitHorizontal,
  GitCompare,
  Github,
  Rocket,
  Sigma,
  Sliders,
  TestTube,
  Workflow,
} from "lucide-react"
import avatarPlaceholder from "@/assets/images/placeholder.png"
import Timeline from "./Timeline"

export interface ProfileProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  profile: string | null
}

export default function Profile({ isOpen, setIsOpen, profile }: ProfileProps) {
  const isMobileDevice =
    typeof globalThis.window !== "undefined" &&
    (/Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent) ||
      globalThis.window.innerWidth < 768)

  const [profileDetails, setProfileDetails] = useState<User | null>(null)
  const [resetVisibleArea, setResetVisibleArea] = useState(false)
  const visibleAreaRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (!profile) return
    ;(async () => {
      const response = await fetch(`api/profile/${profile}`)
      if (response.status !== 200) return setIsOpen(false)
      const result = await response.json()
      setProfileDetails(result)
      setResetVisibleArea((prev) => !prev)
    })()
  }, [profile, setIsOpen])

  const visibleAreaHeight = visibleAreaRef.current?.getBoundingClientRect().height || 0
  useEffect(() => {
    if (!isMobileDevice) return
    if (visibleAreaRef.current) {
      const initialHeight = visibleAreaRef.current.getBoundingClientRect().height + 10
      setHeight(initialHeight)
    }
  }, [isMobileDevice, visibleAreaHeight, resetVisibleArea])

  useEffect(() => {
    if (!isMobileDevice) return
    if (height < 50) {
      setIsOpen(false)
      setHeight((visibleAreaRef.current?.getBoundingClientRect().height || 0) + 10)
    }
  }, [height, setIsOpen, isMobileDevice])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef?.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [setIsOpen])

  const featureCount: number = (profileDetails?.featureCount || 0) as number
  const bugCount: number = (profileDetails?.bugCount || 0) as number
  const ciCount: number = (profileDetails?.ciCount || 0) as number
  const docsCount: number = (profileDetails?.docsCount || 0) as number
  const testCount: number = (profileDetails?.testCount || 0) as number
  const perfCount: number = (profileDetails?.perfCount || 0) as number
  const otherCount =
    (profileDetails?.commitCount || 0) -
    (featureCount + bugCount + ciCount + docsCount + testCount + perfCount)

  const [touchStartY, setTouchStartY] = useState(0)

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStartY(e.touches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.currentTarget.scrollTop !== 0) return

    const currentY = e.touches[0].clientY
    const deltaY = touchStartY - currentY
    setHeight((h) => {
      const newHeight = Math.max(h + deltaY, 0)
      if (newHeight < 50) {
        return 0
      }
      if (newHeight >= window.innerHeight) {
        return window.innerHeight
      }
      return newHeight
    })
    setTouchStartY(currentY)
  }

  return (
    isOpen &&
    profileDetails && (
      <aside
        ref={panelRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        style={{ height: isMobileDevice ? height : undefined }}
        className={`${height >= window.innerHeight ? "" : "touch-none"} max-h-full z-100 bg-[var(--component-bg)] grid fixed p-5 sm:p-8 bottom-0 sm:top-0 sm:right-0 w-full sm:w-1/4 sm:min-w-100 sm:h-full shadow-[0_-4px_6px_rgba(0,0,0,0.1)] border-t-2 sm:border-l-2 border-[var(--component-border)] overflow-y-scroll`}
      >
        <div ref={visibleAreaRef}>
          <div className="h-2 rounded-full w-1/3 mx-auto my-3 bg-gray-200 sm:hidden" />
          <div className="flex items-center gap-5 w-full">
            <img
              src={(profileDetails.avatarUrl || avatarPlaceholder.src) as string}
              onError={(e) => {
                e.currentTarget.src = avatarPlaceholder.src
              }}
              className="w-26 h-auto rounded-full"
              alt={profileDetails.name}
            />
            <div className="relative w-full">
              <h4 className="font-bold w-11/12 text-2xl text-(var(--header-text)) truncate">
                {profile}
              </h4>
              <a
                href={profileDetails.htmlUrl as string}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex my-2 items-center cursor-pointer text-[var(--link-color)] hover:underline font-medium group"
              >
                <Github color="black" size={20} />
                <span className="truncate absolute left-[25px] w-9/10">
                  {profileDetails.htmlUrl}
                </span>
              </a>
            </div>
          </div>
          <div className="flex gap-2 my-4">
            <div className="flex items-center gap-2 rounded-md px-2 py-1 bg-[#08872B]">
              <GitCommitHorizontal color="white" size={24} />
              <span className="text-white font-bold">{profileDetails.commitCount}</span>
            </div>
            <div className="flex items-center gap-2 rounded-md px-2 py-1 bg-[#501DAF]">
              <GitCompare color="white" size={24} />
              <span className="text-white font-bold">{profileDetails.changeScore.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2 rounded-md px-2 py-1 bg-[#0527FC]">
              <Sigma color="white" size={24} />
              <span className="text-white font-bold">{profileDetails.overallScore.toFixed(2)}</span>
            </div>
          </div>
          <hr />
        </div>
        <div className="my-2">
          <h5 className="font-bold text-xl text-(var(--header-text)) my-2">
            Contribution breakdown
          </h5>
          <div className="grid gap-2 grid-cols-4 [&>div]:py-3 [&>div]:rounded-md [&>div]:opacity-80 [&>div]:shadow-sm [&>div]:aspect-square [&>div]:grid [&>div]:text-center [&>div]:items-center [&>div]:font-bold [&>div]:border [&>div]:border-violet-700">
            <div>
              <Rocket size={28} className="mx-auto" color="#f54900" />
              <div className="text-sm font-light">Features</div>
              <div className="text-2xl text-center text-violet-700">{featureCount}</div>
            </div>
            <div>
              <Bug size={28} className="mx-auto" color="#f54900" />
              <div className="text-sm font-light">Patches</div>
              <div className="text-2xl text-center text-violet-700">{bugCount}</div>
            </div>
            <div>
              <Workflow size={28} className="mx-auto" color="#f54900" />
              <div className="text-sm font-light">CI</div>
              <div className="text-2xl text-center text-violet-700">{ciCount}</div>
            </div>
            <div>
              <Book size={28} className="mx-auto" color="#f54900" />
              <div className="text-sm font-light">Docs</div>
              <div className="text-2xl text-center text-violet-700">{docsCount}</div>
            </div>
            <div>
              <TestTube size={28} className="mx-auto" color="#f54900" />
              <div className="text-sm font-light">Tests</div>
              <div className="text-2xl text-center text-violet-700">{testCount}</div>
            </div>
            <div>
              <Sliders size={28} className="mx-auto" color="#f54900" />
              <div className="text-sm font-light">Perf</div>
              <div className="text-2xl text-center text-violet-700">{perfCount}</div>
            </div>
            <div>
              <Dices size={28} className="mx-auto" color="#f54900" />
              <div className="text-sm font-light">Other</div>
              <div className="text-2xl text-center text-violet-700">{otherCount}</div>
            </div>
          </div>
        </div>
        <div className="my-2">
          <h5 className="font-bold text-xl text-(var(--header-text)) my-2">Recent commits</h5>
          <p className="font-light text-sm">
            <span className="font-normal">{profileDetails.name}</span> has committed{" "}
            <span className="font-normal">{profileDetails.commitCount}</span> times to the
            organization
          </p>
          <div className="bg-[var(--background)] p-1 my-2 rounded-sm">
            <Timeline
              timelineData={
                profileDetails.commitDetails?.slice(0, 5).map((commit) => ({
                  date: commit.date,
                  icon: GitCommitHorizontal,
                  description: commit.message,
                  iconBackgroundColor: "#08872B",
                })) || []
              }
            />
          </div>
        </div>
      </aside>
    )
  )
}
