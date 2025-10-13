export type PageItem = number | 'ellipsis'

/**
 * Generates page numbers for pagination with ellipsis for gaps.
 * Uses O(1) calculation - only computes needed pages, no iteration over all pages.
 * 
 * @param current - Current active page (1-indexed)
 * @param total - Total number of pages
 * @param siblingCount - Pages to show on each side of current page
 * @param boundaryCount - Pages to show at start and end
 * @param truncationThreshold - Minimum pages before showing ellipsis (default: 5)
 * @returns Array of page numbers and 'ellipsis' strings for gaps
 */
export function generatePageNumbers(
  current: number,
  total: number,
  siblingCount: number,
  boundaryCount: number,
  truncationThreshold: number = 5
): PageItem[] {
  const totalNumbers = boundaryCount * 2 + siblingCount * 2 + 3
  
  if (total < truncationThreshold) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const leftBoundary = boundaryCount
  const rightBoundary = total - boundaryCount + 1
  let leftSibling = Math.max(current - siblingCount, 1)
  let rightSibling = Math.min(current + siblingCount, total)

  // Add extra sibling if on first or last page
  if (current === 1) rightSibling = Math.min(rightSibling + 1, total)
  if (current === total) leftSibling = Math.max(leftSibling - 1, 1)


  const showLeftEllipsis = leftSibling > leftBoundary + 1
  const showRightEllipsis = rightSibling < rightBoundary - 1

  const pages: PageItem[] = []

  for (let i = 1; i <= leftBoundary; i++) pages.push(i)
  
  if (showLeftEllipsis) pages.push('ellipsis')
  
  const start = showLeftEllipsis ? leftSibling : leftBoundary + 1
  const end = showRightEllipsis ? rightSibling : rightBoundary - 1
  
  for (let i = start; i <= end; i++) {
    if (i > leftBoundary && i < rightBoundary) pages.push(i)
  }
  
  if (showRightEllipsis) pages.push('ellipsis')
  
  for (let i = rightBoundary; i <= total; i++) pages.push(i)

  return pages
}

