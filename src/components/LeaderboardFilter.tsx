import { FC } from "react"
import Props from "@/types/filter"

const LeaderboardFilter: FC<Props> = ({ value, onChange }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border border-gray-300 rounded-md px-2 py-1 text-gray-700 focus:ring focus:ring-indigo-200"
    >
      <option value="all">All Time</option>
      <option value="daily">Today</option>
      <option value="weekly">This Week</option>
      <option value="monthly">This Month</option>
      <option value="last-month">Last Month</option>
      <option value="yearly">This Year</option>
    </select>
  )
}

export default LeaderboardFilter
