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
  const [profileDetails, setProfileDetails] = useState<User | null>(null)
  const [resetVisibleArea, setResetVisibleArea] = useState(false)
  const visibleAreaRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    ;(async () => {
      const response = await fetch(`api/profile/${profile}`)
      if (response.status !== 200) return setIsOpen(false)
      const result = await response.json()
      setProfileDetails(result)
      setResetVisibleArea(!resetVisibleArea)
    })()
  }, [profile])

  useEffect(() => {
    if (visibleAreaRef.current) {
      const initialHeight = visibleAreaRef.current.getBoundingClientRect().height + 10
      setHeight(initialHeight)
    }
  }, [visibleAreaRef.current?.getBoundingClientRect().height, resetVisibleArea])

    useEffect(() => {
    if (height < 50) {
      setIsOpen(false)
      setHeight((visibleAreaRef.current?.getBoundingClientRect().height|| 0) + 10)
    }
  }, [height])


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
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        style={{ height }}
        className={`${height >= window.innerHeight ? "" : "touch-none"} max-h-full pointer-events-auto z-100 bg-gray-50 grid justify-center-center fixed p-5 bottom-0 w-full shadow-[0_-4px_6px_rgba(0,0,0,0.1)] border-t-2 border-gray-200 overflow-y-scroll`}
      >
        <div ref={visibleAreaRef}>
          <div className="h-2 rounded-full w-1/3 mx-auto my-3 bg-gray-200" />
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
              <h4 className="font-bold w-11/12 text-2xl text-gray-700 truncate">{profile}</h4>
              <a
                href={profileDetails.htmlUrl as string}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex my-2 items-center pointer text-indigo-600 hover:underline font-medium group"
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
          <h5 className="font-bold text-xl text-gray-700 my-2">Contribution breakdown</h5>
          <div className="grid gap-4 grid-cols-4 [&>div]:p-3 [&>div]:rounded-md [&>div]:opacity-80 [&>div]:shadow-sm [&>div]:aspect-square [&>div]:grid [&>div]:text-center [&>div]:items-center [&>div]:font-bold">
            <div className="bg-purple-600 text-white text-center">
              <Rocket size={40} className="mx-auto" />
              <div className="text-sm font-light my-1">Features</div>
              <div className="text-xl text-center">{featureCount}</div>
            </div>
            <div className="bg-green-500 text-white">
              <Bug size={40} className="mx-auto" />
              <div className="text-sm font-light my-1">Patches</div>
              <div className="text-xl text-center">{bugCount}</div>
            </div>
            <div className="bg-orange-500 text-white">
              <Workflow size={40} className="mx-auto" />
              <div className="text-sm font-light my-1">CI</div>
              <div className="text-xl text-center">{ciCount}</div>
            </div>
            <div className="bg-sky-500 text-white">
              <Book size={40} className="mx-auto" />
              <div className="text-sm font-light my-1">Docs</div>
              <div className="text-xl text-center">{docsCount}</div>
            </div>
            <div className="bg-yellow-500 text-white">
              <TestTube size={40} className="mx-auto" />
              <div className="text-sm font-light my-1">Tests</div>
              <div className="text-xl text-center">{testCount}</div>
            </div>

            <div className="bg-teal-500 text-white">
              <Sliders size={40} className="mx-auto" />
              <div className="text-sm font-light my-1">Perf</div>
              <div className="text-xl text-center">{perfCount}</div>
            </div>

            <div className="bg-gray-500 text-white">
              <Dices size={40} className="mx-auto" />
              <div className="text-sm font-light my-1">Other</div>
              <div className="text-xl text-center">{otherCount}</div>
            </div>
          </div>
        </div>
        <div className="my-2">
          <h5 className="font-bold text-xl text-gray-700 my-2">Recent commits</h5>
          <p className="font-light text-sm">
            <span className="font-normal">{profileDetails.name}</span> has committed{" "}
            <span className="font-normal">{profileDetails.commitCount}</span> times to the
            organization
          </p>
          <div className="bg-white p-1 my-2 rounded-sm">
            <Timeline
              timelineData={profileDetails.commitDetails.slice(0, 5).map((commit) => ({
                date: commit.date,
                icon: GitCommitHorizontal,
                description: commit.message,
                iconBackgroundColor: "#08872B",
              }))}
            />
          </div>
        </div>
      </aside>
    )
  )
}
