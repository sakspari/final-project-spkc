export interface Alternative {
  id: string
  name: string
  values: Record<string, string | number | [number, number]>
}

export interface Criterion {
  id: string
  name: string
  isRange: boolean
  idealValue: string | number
  factorType: "none" | "core" | "secondary"
}

export interface GapValue {
  gap: number
  interpolation?: number
  isNegative?: boolean
}

export interface FactorAverage {
  coreFactorAvg: number
  secondaryFactorAvg: number
}

export interface Ranking {
  alternativeId: string
  totalScore: number
  rank: number
}

export interface CalculationResults {
  weights: {
    coreFactorWeight: number
    secondaryFactorWeight: number
  }
  gapValues: Record<string, number | GapValue>[]
  weightedGaps: Record<string, number>[]
  factorAverages: FactorAverage[]
  finalRanking: Ranking[]
}

export interface ProfileMatchingInput {
  alternatives: Alternative[]
  criteria: Criterion[]
  coreFactorWeight: number
  secondaryFactorWeight: number
}
