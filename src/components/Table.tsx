import { ReactNode, useEffect, useState, useMemo } from "react"
import { generatePageNumbers } from "@/utils/pagination"

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
  currentPage?: number
  itemsPerPage?: number
  onPageChange?: (page: number) => void
  siblingCount?: number
  boundaryCount?: number
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
  currentPage = 1,
  itemsPerPage,
  onPageChange,
  siblingCount = 0,
  boundaryCount = 1,
}: TableProps<T>) {
  const [sortingColumn, setSortingColumn] = useState(defaultSortingColumn)
  const [sortingAscending, setSortingAscending] = useState(defaultSortingMethod === "ascending")
  const [mappedRows, setMappedRows] = useState<ReactNode[][]>([])
  const [sortedRows, setSortedRows] = useState<T[]>([])

  const totalPages = itemsPerPage ? Math.ceil(rows.length / itemsPerPage) : 1
  const btnBase = "px-2 sm:px-3 py-1 text-sm rounded border shrink-0"
  const btnNav = `${btnBase} border-[var(--component-border)] bg-[var(--component-bg)] hover:bg-[var(--component-hover)] disabled:opacity-50 disabled:cursor-not-allowed`
  const paginatedRows = useMemo(
    () =>
      itemsPerPage
        ? sortedRows.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
        : sortedRows,
    [sortedRows, currentPage, itemsPerPage],
  )

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
    if (renderFunction) {
      setMappedRows(
        paginatedRows.map((row, idx) =>
          renderFunction(row, (currentPage - 1) * (itemsPerPage || 0) + idx),
        ),
      )
    }
  }, [renderFunction, paginatedRows, currentPage, itemsPerPage])

  useEffect(() => {
    if (!itemsPerPage || !onPageChange) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && currentPage > 1) onPageChange(currentPage - 1)
      if (e.key === "ArrowRight" && currentPage < totalPages) onPageChange(currentPage + 1)
    }
    globalThis.addEventListener("keydown", handleKey)
    return () => globalThis.removeEventListener("keydown", handleKey)
  }, [currentPage, totalPages, itemsPerPage, onPageChange])

  const changeSorting = (column: string) => {
    if (column === sortingColumn) setSortingAscending((prev) => !prev)
    else {
      setSortingColumn(column)
      setSortingAscending(defaultSortingColumn === "ascending")
    }
  }

  return (
    <div className="overflow-x-auto rounded-lg shadow-sm border border-[var(--table-border)] bg-[var(--table-bg)]">
      <table className="min-w-full text-sm text-left text-[var(--table-text)]">
        <thead className="uppercase tracking-wider bg-[var(--table-header-bg)] text-[var(--table-header-text)]">
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="px-4 py-3">
                <div className="flex gap-3 items-center">
                  <div>{header}</div>
                  {sortColumns?.includes(header) && (
                    <div
                      onClick={() => changeSorting(header)}
                      className="text-xs leading-none cursor-pointer"
                    >
                      <div
                        className={`${sortingColumn === header && sortingAscending ? "text-[var(--sort-active)] opacity-100" : "text-[var(--sort-inactive)] opacity-50"}`}
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
                    <div className="h-6 rounded w-full bg-[var(--table-row-even)]"></div>
                  </td>
                ))}
              </tr>
            ))
          ) : rows.length === 0 ? (
            <tr className="bg-[var(--table-hover)]">
              <td key="table-no-data" className="px-4 py-3" colSpan={headers.length}>
                No data
              </td>
            </tr>
          ) : (
            mappedRows.map((row: ReactNode[], rowIndex: number) => (
              <tr
                key={rowIndex}
                className="even:bg-[var(--table-row-even)] bg-[var(--table-bg)] hover:bg-[var(--table-hover)]"
              >
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

      {itemsPerPage && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-gray-200">
          <div className="text-sm text-gray-700 text-center sm:text-left">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, rows.length)} of {rows.length} entries
          </div>

          <div className="flex flex-wrap gap-1 justify-center max-w-full">
            <button
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage === 1}
              className={btnNav}
            >
              Previous
            </button>

            {generatePageNumbers(currentPage, totalPages, siblingCount, boundaryCount, 5).map(
              (item, idx) =>
                item === "ellipsis" ? (
                  <span
                    key={`ellipsis-${idx}`}
                    className="px-1 sm:px-2 py-1 text-sm text-gray-500 shrink-0"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={item}
                    onClick={() => onPageChange?.(item)}
                    className={`${btnBase} ${
                      item === currentPage
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-[var(--component-bg)] border-[var(--component-border)] text-[var(--component-text)]"
                    }`}
                  >
                    {item}
                  </button>
                ),
            )}

            <button
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={btnNav}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
