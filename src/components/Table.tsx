import { ReactNode, useEffect, useState } from "react"

type SortingMethod = "ascending" | "descending"

type TableProps<T> = {
  headers: string[]
  rows: T[]
  isLoading?: boolean
  sortColumns?: string[]
  defaultSortingColumn?: string
  defaultSortingMethod?: SortingMethod
  columnToKeyMap?: Record<string, string>
  renderFunction?: (row: T, rowIndex: number) => (string | number | ReactNode)[]
}

export default function Table<T>({
  headers,
  rows,
  isLoading,
  sortColumns,
  defaultSortingColumn,
  defaultSortingMethod,
  columnToKeyMap,
  renderFunction,
}: TableProps<T>) {
  const [sortingColumn, setSortingColumn] = useState(defaultSortingColumn)
  const [sortingAscending, setSortingAscending] = useState(defaultSortingMethod === "ascending")
  const [mappedRows, setMappedRows] = useState<ReactNode[][]>([])
  const [sortedRows, setSortedRows] = useState<T[]>([])

  useEffect(() => {
    if (!sortColumns || sortColumns.length === 0 || !sortingColumn) return setSortedRows(rows)

    let aValue: string | number | object
    let bValue: string | number | object
    let sortedResult = [] as T[]

    if (Array.isArray(rows[0])) {
      //const sortingColumnIndex = headers.indexOf(sortingColumn)
      // no need to really handle this because we know for this project it is going to be an object
      // just making a note here if any dev turns it into an array, just implement this branch
      // you probably have to do something like
      /**
       * aValue = a[sortingColumnIndex]
       * bValue = b[sortingColumnIndex]
       */
      // and then rest is going to look just like what we have below
      setSortedRows(rows)
    } else if (typeof rows[0] === "object") {
      sortedResult = rows.sort((a: T, b: T) => {
        const key = columnToKeyMap?.[sortingColumn] ?? null
        if (!key) return 0

        aValue = a[key as keyof T]?.valueOf() ?? 0
        bValue = b[key as keyof T]?.valueOf() ?? 0

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortingAscending ? aValue - bValue : bValue - aValue
        }

        // if it's not a number let's just turn it into a string and compare
        return sortingAscending
          ? String(aValue).localeCompare(String(bValue), undefined, { numeric: true })
          : String(bValue).localeCompare(String(aValue), undefined, { numeric: true })
      })
      setSortedRows([...sortedResult])
    } else {
      setSortedRows(rows)
    }
  }, [columnToKeyMap, headers, sortingAscending, sortColumns, sortingColumn, rows])

  useEffect(() => {
    if (renderFunction) setMappedRows(sortedRows.map(renderFunction))
  }, [renderFunction, sortedRows])

  const changeSorting = (column: string) => {
    if (column === sortingColumn) setSortingAscending((prev) => !prev)
    else {
      setSortingColumn(column)
      setSortingAscending(defaultSortingColumn === "ascending")
    }
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full text-sm text-left text-gray-700">
        <thead className="bg-gray-100 text-gray-600 uppercase tracking-wider">
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="px-4 py-3">
                <div className="flex gap-3 items-center">
                  <div>{header}</div>
                  {sortColumns?.includes(header) && (
                    <div
                      onClick={() => changeSorting(header)}
                      className="text-xs leading-none text-gray-300 cursor-pointer"
                    >
                      <div
                        className={
                          sortingColumn === header && sortingAscending ? "text-gray-500" : ""
                        }
                      >
                        ▲
                      </div>
                      <div
                        className={
                          sortingColumn === header && !sortingAscending ? "text-gray-500" : ""
                        }
                      >
                        ▼
                      </div>
                    </div>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, rowIndex) => (
              <tr key={rowIndex} className="animate-pulse">
                {Array.from({ length: headers.length }).map((_, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-3">
                    <div className="h-6 bg-gray-300 rounded w-full"></div>
                  </td>
                ))}
              </tr>
            ))
          ) : rows.length === 0 ? (
            <tr className="hover:bg-gray-200">
              <td key="table-no-data" className="px-4 py-3" colSpan={headers.length}>
                No data
              </td>
            </tr>
          ) : (
            mappedRows.map((row: ReactNode[], rowIndex: number) => (
              <tr key={rowIndex} className="nth-[even]:bg-gray-100 hover:bg-gray-200">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-3">
                    {cell as ReactNode}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
