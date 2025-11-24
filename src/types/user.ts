export interface FileData {
  filename: string
  additions: number
  changes: number
  deletions: number
}

export type CommitDetail = {
  message: string
  date: string // ISO string from GitHub commit
  files?: FileData[]
}

export interface User {
  name: string
  commits: string[]
  commitCount: number
  commitDetails: CommitDetail[]
  changeScore: number
  overallScore: number
  [key: string]: string | number | string[] | CommitDetail[]
}

