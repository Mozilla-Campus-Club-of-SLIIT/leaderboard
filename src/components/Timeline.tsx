"use client"

import { LucideIcon } from "lucide-react"

interface TimelineItem {
  date: string
  title?: string
  description: string
  icon: LucideIcon
  iconBackgroundColor?: string
}

export interface TimelineProps {
  timelineData: TimelineItem[]
}

const Timeline = ({ timelineData }: TimelineProps) => {
  return (
    <div className="relative my-4">
      {/* vertical line */}
      <div className="absolute top-0 left-4 w-[1px] h-full bg-gray-400" />
      {timelineData.map((item, index) => {
        const Icon = item.icon
        return (
          <div key={item.date + index} className="flex items-start mb-3 relative">
            <div
              className={`absolute left-1 mt-1 p-1 rounded-full ${item.iconBackgroundColor ? `bg-[${item.iconBackgroundColor}]` : "bg-gray-600"}`}
            >
              <Icon color="white" size={16} />
            </div>
            <div className="ml-10">
              <p className="font-bold text-gray-800">{item.title}</p>
              <p className="text-gray-800">{item.description}</p>
              <p className="text-gray-400 text-sm">{item.date}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Timeline
