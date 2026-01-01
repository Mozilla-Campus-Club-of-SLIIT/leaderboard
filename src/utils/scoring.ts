// separate file to have a better transparency with viewers

export const ADDITION_MULTIPLIER = 1
export const DELETION_MULTIPLIER = 0.25
export const COMMIT_MULTIPLIER = 1.8
export const CHANGESCORE_MULTIPLIER = 0.125
export const LOW_EFFORT_CHANGE_THRESHOLD = 5
export const LOW_EFFORT_CHANGE_PENALTY = 0.1

// logistic function constants
// curve maximum value
export const LOGISTIC_L = 20
// growth rate or steepness
export const LOGISTIC_K = 0.01
export const SIGMOID_MIDPOINT = 160

export const ignoreFiles = [
  // Dependency locks
  /package-lock\.json$/i,
  /yarn\.lock$/i,
  /pnpm-lock\.yaml$/i,
  /bun\.lockb$/i,

  // Dependency directories
  /\bnode_modules[\/\\]/i,
  /\bvendor[\/\\]/i,

  // Build outputs
  /\bdist[\/\\]/i,
  /\bbuild[\/\\]/i,
  /\bout[\/\\]/i,
  /\.next[\/\\]/i,
  /\.nuxt[\/\\]/i,
  /\bcoverage[\/\\]/i,

  // Environment / configs
  /\.env(\..*)?$/i,
  /\.DS_Store$/i,
  /\bThumbs\.db$/i,

  // Logs / debug
  /\.log$/i,
  /\bnpm-debug\.log$/i,
  /\byarn-error\.log$/i,

  // Compiled/binary
  /\.pyc$/i,
  /\.pyo$/i,
  /\.class$/i,
  /\.o$/i,
  /\.obj$/i,
  /\.so$/i,
  /\.dll$/i,
  /\.exe$/i,
  /\.out$/i,

  // License
  /LICENSE$/i,
]

export const ignoreFilesPattern = new RegExp(
  "(" + ignoreFiles.map((r) => r.source).join("|") + ")",
  "i",
)

const logistic = (L: number, k: number, x0: number, x: number) => L / (1 + Math.exp(-k * (x - x0)))

export const calculateChangeScore = (additions: number, deletions: number) => {
  const effectiveAdditions =
    additions < LOW_EFFORT_CHANGE_THRESHOLD ? LOW_EFFORT_CHANGE_PENALTY : additions
  // logistic function for linear gain upto a certain point, then saturate
  return logistic(
    LOGISTIC_L,
    LOGISTIC_K,
    SIGMOID_MIDPOINT,
    effectiveAdditions * ADDITION_MULTIPLIER + deletions * DELETION_MULTIPLIER,
  )
}

export const calculateOverallScore = (commits: number, changeScore: number) =>
  commits * COMMIT_MULTIPLIER + changeScore * CHANGESCORE_MULTIPLIER
