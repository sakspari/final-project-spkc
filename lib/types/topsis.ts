/**
 * Input data for TOPSIS calculation
 */
export interface TopsisInput {
  /** Names of alternatives */
  alternatives: string[]

  /** Names of criteria */
  criteria: string[]

  /** Decision matrix (alternatives × criteria) */
  values: number[][]

  /** Weights for each criterion (should sum to 1) */
  weights: number[]

  /** Types of criteria (benefit or cost) */
  types: string[]
}

/**
 * Results of TOPSIS calculation
 */
export interface TopsisResult {
  /** Names of alternatives */
  alternatives: string[]

  /** Names of criteria */
  criteria: string[]

  /** Types of criteria (benefit or cost) */
  types: string[]

  /** Weights for each criterion */
  weights: number[]

  /** Original decision matrix */
  decisionMatrix: number[][]

  /** Normalized decision matrix */
  normalizedMatrix: number[][]

  /** Weighted normalized decision matrix */
  weightedMatrix: number[][]

  /** Positive ideal solution */
  positiveIdeal: number[]

  /** Negative ideal solution */
  negativeIdeal: number[]

  /** Distances to ideal solutions */
  distances: {
    /** Distances to positive ideal solution */
    positive: number[]

    /** Distances to negative ideal solution */
    negative: number[]
  }

  /** Relative closeness scores */
  scores: number[]

  /** Ranking of alternatives (sorted by score in descending order) */
  ranking: { index: number; score: number }[]
}
