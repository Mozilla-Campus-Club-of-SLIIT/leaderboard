import { FC } from "react"
import Props from "@/types/filter"

const LeaderboardFilter: FC<Props> = ({ value, onChange }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
      style={{
        backgroundColor: "var(--select-bg)",
        border: "1px solid var(--select-border)",
        color: "var(--select-text)",
      }}
    >
      <option value="all">All Time</option>
      <option value="daily">Today</option>
      <option value="weekly">This Week</option>
      <option value="monthly">This Month</option>
      <option value="yearly">This Year</option>
    </select>
  )
}

export default LeaderboardFilter
