// Random Index values for consistency ratio calculation
export const RANDOM_INDEX: Record<number, number> = {
  1: 0,
  2: 0,
  3: 0.58,
  4: 0.9,
  5: 1.12,
  6: 1.24,
  7: 1.32,
  8: 1.41,
  9: 1.45,
  10: 1.49,
}

// Initialize a matrix with diagonal elements set to 1
export function initializeMatrix(size: number): number[][] {
  const matrix: number[][] = []
  for (let i = 0; i < size; i++) {
    matrix[i] = []
    for (let j = 0; j < size; j++) {
      matrix[i][j] = i === j ? 1 : 0
    }
  }
  return matrix
}

// Calculate the priority vector (weights) from a pairwise comparison matrix
export function calculatePriorityVector(matrix: number[][]): number[] {
  const n = matrix.length
  if (n === 0) return []

  const priorityVector: number[] = []

  // Calculate column sums
  const colSums: number[] = Array(n).fill(0)
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      colSums[j] += matrix[i][j]
    }
  }

  // Normalize the matrix and calculate row averages
  for (let i = 0; i < n; i++) {
    let rowSum = 0
    for (let j = 0; j < n; j++) {
      // Avoid division by zero
      if (colSums[j] === 0) {
        rowSum += 0
      } else {
        rowSum += matrix[i][j] / colSums[j]
      }
    }
    priorityVector[i] = rowSum / n
  }

  return priorityVector
}

// Calculate the consistency ratio to check if pairwise comparisons are consistent
export function calculateConsistencyRatio(matrix: number[][], priorityVector: number[]) {
  const n = matrix.length
  if (n === 0) {
    return {
      consistencyRatio: 0,
      consistencyIndex: 0,
      lambdaMax: 0,
      randomIndex: 0,
      weightedSumVector: [],
      isConsistent: true,
    }
  }

  // If n <= 2, consistency is always perfect
  if (n <= 2) {
    return {
      consistencyRatio: 0,
      consistencyIndex: 0,
      lambdaMax: n,
      randomIndex: 0,
      weightedSumVector: [...priorityVector],
      isConsistent: true,
    }
  }

  // Calculate weighted sum vector
  const weightedSumVector: number[] = Array(n).fill(0)
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      weightedSumVector[i] += matrix[i][j] * priorityVector[j]
    }
  }

  // Calculate lambda max (average of weighted sum vector divided by priority vector)
  const lambdaValues: number[] = []
  for (let i = 0; i < n; i++) {
    // Avoid division by zero
    if (priorityVector[i] === 0) {
      lambdaValues.push(n)
    } else {
      lambdaValues.push(weightedSumVector[i] / priorityVector[i])
    }
  }
  const lambdaMax = lambdaValues.reduce((sum, val) => sum + val, 0) / n

  // Calculate consistency index
  const consistencyIndex = (lambdaMax - n) / (n - 1)

  // Get random index from table
  const randomIndex = RANDOM_INDEX[n] || 1.49 // Default to 1.49 for n > 10

  // Calculate consistency ratio
  const consistencyRatio = randomIndex === 0 ? 0 : consistencyIndex / randomIndex

  // Check if consistency is acceptable (CR <= 0.1)
  const isConsistent = consistencyRatio <= 0.1

  return {
    consistencyRatio,
    consistencyIndex,
    lambdaMax,
    randomIndex,
    weightedSumVector,
    isConsistent,
  }
}

// Calculate the final ranking of alternatives
export function calculateFinalRanking(
  alternatives: { id: string; name: string }[],
  criteriaPriorityVector: number[],
  alternativesPairwise: { criterionId: string; priorityVector: number[] }[],
) {
  const scores: { alternativeId: string; score: number }[] = alternatives.map((alt) => ({
    alternativeId: alt.id,
    score: 0,
  }))

  // For each criterion
  for (let i = 0; i < criteriaPriorityVector.length; i++) {
    const criterionWeight = criteriaPriorityVector[i]

    // For each alternative matrix
    alternativesPairwise.forEach((altMatrix) => {
      // For each alternative
      for (let j = 0; j < alternatives.length; j++) {
        const altScore = altMatrix.priorityVector[j] * criterionWeight
        scores[j].score += altScore
      }
    })
  }

  // Sort by score in descending order
  return scores.sort((a, b) => b.score - a.score)
}

// Update the formatNumber function to be even more robust
export function formatNumber(num: number | undefined | null, decimals = 3): string {
  // Check if num is undefined, null, or NaN
  if (num === undefined || num === null || isNaN(num)) {
    return "0".padEnd(decimals + 2, "0") // Returns "0.000" for decimals=3
  }
  try {
    return num.toFixed(decimals)
  } catch (error) {
    console.error("Error formatting number:", num, error)
    return "0".padEnd(decimals + 2, "0")
  }
}

/**
 * Normalizes quantitative data based on the specified normalization type and cost/benefit classification
 *
 * @param values The raw numerical values to normalize
 * @param normalizationType The normalization method: 'sum', 'max', or 'min'
 * @param isCost Whether the criterion is a cost criterion (lower is better)
 * @returns Array of normalized values
 */
export function normalizeQuantitativeData(
  values: number[],
  normalizationType: "sum" | "max" | "min",
  isCost: boolean,
): number[] {
  // Handle empty array or all zeros
  if (!values.length || values.every((v) => v === 0)) {
    return Array(values.length).fill(1 / values.length)
  }

  // For cost criteria, transform values (invert them)
  let transformedValues = [...values]
  if (isCost) {
    // Find minimum non-zero value to handle potential zeros
    const minValue = Math.min(...values.filter((v) => v > 0))
    transformedValues = values.map((v) => (v === 0 ? 0 : minValue / v))
  }

  // Apply normalization
  switch (normalizationType) {
    case "sum":
      // Sum normalization: divide each value by the sum of all values
      const sum = transformedValues.reduce((acc, val) => acc + val, 0)
      if (sum === 0) return Array(values.length).fill(1 / values.length)
      return transformedValues.map((v) => v / sum)

    case "max":
      // Max normalization: divide each value by the maximum value
      const max = Math.max(...transformedValues)
      if (max === 0) return Array(values.length).fill(1 / values.length)
      return transformedValues.map((v) => v / max)

    case "min":
      // Min normalization: divide minimum value by each value (for cost criteria)
      // or divide each value by max value (for benefit criteria)
      if (isCost) {
        // Already transformed for cost criteria
        const maxTransformed = Math.max(...transformedValues)
        if (maxTransformed === 0) return Array(values.length).fill(1 / values.length)
        return transformedValues.map((v) => v / maxTransformed)
      } else {
        // For benefit criteria using min normalization
        const min = Math.min(...transformedValues.filter((v) => v > 0)) || 1
        return transformedValues.map((v) => (v === 0 ? 0 : v / min))
      }

    default:
      return Array(values.length).fill(1 / values.length)
  }
}

/**
 * Converts normalized values into a pairwise comparison matrix
 *
 * @param normalizedValues Array of normalized values
 * @returns Pairwise comparison matrix
 */
export function convertToPairwiseMatrix(normalizedValues: number[]): number[][] {
  const n = normalizedValues.length
  const matrix = initializeMatrix(n)

  // Calculate pairwise ratios
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i !== j) {
        // Avoid division by zero
        if (normalizedValues[j] === 0) {
          matrix[i][j] = normalizedValues[i] === 0 ? 1 : 9 // Max value if denominator is zero
        } else {
          // Use ratio of normalized values with a cap at 9 (AHP scale max)
          const ratio = normalizedValues[i] / normalizedValues[j]
          matrix[i][j] = Math.min(Math.max(ratio, 1 / 9), 9) // Constrain between 1/9 and 9
        }
      }
    }
  }

  return matrix
}
