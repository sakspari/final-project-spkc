import type { CalculationResults, GapValue, ProfileMatchingInput } from "./types"

// Gap weight mapping
const GAP_WEIGHTS: Record<number, number> = {
  0: 5.0, // No gap
  1: 4.5, // Gap of 1
  2: 4.0, // Gap of 2
  3: 3.5, // Gap of 3
  4: 3.0, // Gap of 4
  5: 2.5, // Gap of 5
  6: 2.0, // Gap of 6
  7: 1.5, // Gap of 7
  8: 1.0, // Gap of 8
  9: 0.5, // Gap of 9
  10: 0.0, // Gap of 10 or more
}

export function calculateProfileMatching(input: ProfileMatchingInput): CalculationResults {
  const { alternatives, criteria, coreFactorWeight, secondaryFactorWeight } = input

  // Step 6: Calculate gap values
  const gapValues = alternatives.map((alternative) => {
    const gapRow: Record<string, number | GapValue> = {}

    criteria.forEach((criterion) => {
      const idealValue = Number(criterion.idealValue)

      if (criterion.isRange) {
        // Handle range-based criteria
        const [x1, x2] = alternative.values[criterion.id] as [number, number]

        // If ideal value is within the range, gap is 0
        if (idealValue >= x1 && idealValue <= x2) {
          gapRow[criterion.id] = 0
        } else {
          // Apply linear interpolation with parameters y1=1 and y2=5
          let interpolation: number

          if (idealValue < x1) {
            // Ideal is below range
            // Calculate likeness score using interpolation
            interpolation = calculateInterpolation(idealValue, x1, x1, x2, 1, 5)
          } else {
            // Ideal is above range
            interpolation = calculateInterpolation(idealValue, x2, x1, x2, 5, 1)
          }

          // Use the interpolated value directly as the gap
          const gap = interpolation

          gapRow[criterion.id] = {
            gap,
            interpolation,
          }
        }
      } else {
        // Handle single value criteria
        const actualValue = Number(alternative.values[criterion.id])
        gapRow[criterion.id] = actualValue - idealValue // This can be negative
      }
    })

    return gapRow
  })

  // Step 7: Assign gap weights
  const weightedGaps = gapValues.map((gapRow) => {
    const weightedRow: Record<string, number> = {}

    Object.entries(gapRow).forEach(([critId, gap]) => {
      let gapValue: number

      if (typeof gap === "object") {
        // For range-based criteria with interpolation
        gapValue = gap.gap
      } else {
        // For single value criteria
        gapValue = gap
      }

      // Map gap to weight
      const absGap = Math.abs(gapValue)
      const gapWeight = absGap <= 10 ? GAP_WEIGHTS[Math.floor(absGap)] : 0

      weightedRow[critId] = gapWeight
    })

    return weightedRow
  })

  // Step 8: Calculate Core Factor and Secondary Factor averages
  const factorAverages = weightedGaps.map((weightedRow) => {
    let coreTotalWeight = 0
    let coreCount = 0
    let secondaryTotalWeight = 0
    let secondaryCount = 0

    criteria.forEach((criterion) => {
      const weight = weightedRow[criterion.id]

      if (criterion.factorType === "core") {
        coreTotalWeight += weight
        coreCount++
      } else if (criterion.factorType === "secondary") {
        secondaryTotalWeight += weight
        secondaryCount++
      }
    })

    const coreFactorAvg = coreCount > 0 ? coreTotalWeight / coreCount : 0
    const secondaryFactorAvg = secondaryCount > 0 ? secondaryTotalWeight / secondaryCount : 0

    return {
      coreFactorAvg,
      secondaryFactorAvg,
    }
  })

  // Step 9: Calculate total scores
  const totalScores = factorAverages.map((avg, index) => {
    const coreWeight = coreFactorWeight / 100
    const secondaryWeight = secondaryFactorWeight / 100

    const totalScore = coreWeight * avg.coreFactorAvg + secondaryWeight * avg.secondaryFactorAvg

    return {
      alternativeId: alternatives[index].id,
      totalScore,
    }
  })

  // Step 10: Rank alternatives
  const sortedScores = [...totalScores].sort((a, b) => b.totalScore - a.totalScore)

  const finalRanking = sortedScores.map((score, index) => ({
    ...score,
    rank: index + 1,
  }))

  return {
    weights: {
      coreFactorWeight,
      secondaryFactorWeight,
    },
    gapValues,
    weightedGaps,
    factorAverages,
    finalRanking,
  }
}

// Linear interpolation function
function calculateInterpolation(
  x: number,
  x1: number,
  rangeX1: number,
  rangeX2: number,
  y1: number,
  y2: number,
): number {
  // Formula: (x - x1) / (x2 - x1) = (y - y1) / (y2 - y1)
  // Solving for y: y = y1 + ((x - x1) * (y2 - y1)) / (x2 - x1)

  // If range is zero, avoid division by zero
  if (rangeX2 === rangeX1) {
    return y1
  }

  const interpolatedValue = y1 + ((x - x1) * (y2 - y1)) / (rangeX2 - rangeX1)

  // Ensure the value is within the range [0, 5]
  return Math.max(0, Math.min(5, interpolatedValue))
}
