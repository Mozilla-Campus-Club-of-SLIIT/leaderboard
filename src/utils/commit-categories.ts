export interface CommitCategory {
  name: string
  pattern: RegExp
  countField: string
  listField: string
}

export const commitCategories: CommitCategory[] = [
  { name: "bug", pattern: /^(fix|bug)(\(.*\))?:/i, countField: "bugCount", listField: "bugs" },
  {
    name: "feature",
    pattern: /^(feat|feature)(\(.*\))?:/i,
    countField: "featureCount",
    listField: "features",
  },
  { name: "ci", pattern: /^ci(\(.*\))?:/i, countField: "ciCount", listField: "cis" },
  { name: "docs", pattern: /^docs(\(.*\))?:/i, countField: "docsCount", listField: "docs" },
  { name: "test", pattern: /^test(\(.*\))?:/i, countField: "testCount", listField: "test" },
  { name: "perf", pattern: /^perf(\(.*\))?:/i, countField: "perfCount", listField: "perf" },
]
