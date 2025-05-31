import type { TopsisInput, TopsisResult } from "@/lib/types/topsis";

/**
 * Calculate TOPSIS (Technique for Order Preference by Similarity to Ideal Solution)
 * @param input The input data containing alternatives, criteria, values, weights, and types
 * @returns The TOPSIS calculation results
 */
export function calculateTopsis(input: TopsisInput): TopsisResult {
  const { alternatives, criteria, values, weights, types } = input;

  // Step 1: Create decision matrix (already done in input)
  const decisionMatrix = values;

  // Step 2: Normalize the decision matrix
  const normalizedMatrix = normalizeMatrix(decisionMatrix);

  // Step 3: Calculate the weighted normalized decision matrix
  const weightedMatrix = weightMatrix(normalizedMatrix, weights);

  // Step 4: Determine the ideal and negative-ideal solutions
  const { positiveIdeal, negativeIdeal } = getIdealSolutions(
    weightedMatrix,
    types
  );

  // Step 5: Calculate the separation measures
  const distances = calculateDistances(
    weightedMatrix,
    positiveIdeal,
    negativeIdeal
  );

  // Step 6: Calculate the relative closeness to the ideal solution
  const scores = calculateScores(distances.positive, distances.negative);

  // Step 7: Rank the alternatives
  const ranking = rankAlternatives(scores);

  return {
    alternatives,
    criteria,
    types,
    weights,
    decisionMatrix,
    normalizedMatrix,
    weightedMatrix,
    positiveIdeal,
    negativeIdeal,
    distances,
    scores,
    ranking,
  };
}

/**
 * Normalize a decision matrix using vector normalization
 * @param matrix The decision matrix to normalize
 * @returns The normalized matrix
 */
function normalizeMatrix(matrix: number[][]): number[][] {
  const numRows = matrix.length;
  const numCols = matrix[0].length;
  const normalizedMatrix: number[][] = Array(numRows)
    .fill(0)
    .map(() => Array(numCols).fill(0));

  // Calculate the square root of the sum of squares for each column
  const columnNorms: number[] = Array(numCols).fill(0);

  for (let j = 0; j < numCols; j++) {
    let sumOfSquares = 0;
    for (let i = 0; i < numRows; i++) {
      sumOfSquares += Math.pow(matrix[i][j], 2);
    }
    columnNorms[j] = Math.sqrt(sumOfSquares);
  }

  // Normalize each element
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      // Avoid division by zero
      normalizedMatrix[i][j] =
        columnNorms[j] === 0 ? 0 : matrix[i][j] / columnNorms[j];
    }
  }

  return normalizedMatrix;
}

/**
 * Weight a normalized matrix by multiplying each element by its corresponding weight
 * @param matrix The normalized matrix
 * @param weights The weights for each criterion
 * @returns The weighted normalized matrix
 */
function weightMatrix(matrix: number[][], weights: number[]): number[][] {
  const numRows = matrix.length;
  const numCols = matrix[0].length;
  const weightedMatrix: number[][] = Array(numRows)
    .fill(0)
    .map(() => Array(numCols).fill(0));

  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      weightedMatrix[i][j] = matrix[i][j] * weights[j];
    }
  }

  return weightedMatrix;
}

/**
 * Determine the positive and negative ideal solutions
 * @param matrix The weighted normalized matrix
 * @param types The types of criteria (benefit or cost)
 * @returns The positive and negative ideal solutions
 */
function getIdealSolutions(
  matrix: number[][],
  types: string[]
): {
  positiveIdeal: number[];
  negativeIdeal: number[];
} {
  const numRows = matrix.length;
  const numCols = matrix[0].length;
  const positiveIdeal: number[] = Array(numCols).fill(0);
  const negativeIdeal: number[] = Array(numCols).fill(0);

  for (let j = 0; j < numCols; j++) {
    let max = Number.NEGATIVE_INFINITY;
    let min = Number.POSITIVE_INFINITY;

    for (let i = 0; i < numRows; i++) {
      if (matrix[i][j] > max) max = matrix[i][j];
      if (matrix[i][j] < min) min = matrix[i][j];
    }

    // For benefit criteria, the positive ideal is the maximum value
    // For cost criteria, the positive ideal is the minimum value
    if (types[j] === "benefit") {
      positiveIdeal[j] = max;
      negativeIdeal[j] = min;
    } else {
      // cost
      positiveIdeal[j] = min;
      negativeIdeal[j] = max;
    }
  }

  return { positiveIdeal, negativeIdeal };
}

/**
 * Calculate the distances from each alternative to the ideal solutions
 * @param matrix The weighted normalized matrix
 * @param positiveIdeal The positive ideal solution
 * @param negativeIdeal The negative ideal solution
 * @returns The distances to the positive and negative ideal solutions
 */
function calculateDistances(
  matrix: number[][],
  positiveIdeal: number[],
  negativeIdeal: number[]
): {
  positive: number[];
  negative: number[];
} {
  const numRows = matrix.length;
  const numCols = matrix[0].length;
  const positiveDistances: number[] = Array(numRows).fill(0);
  const negativeDistances: number[] = Array(numRows).fill(0);

  for (let i = 0; i < numRows; i++) {
    let positiveSum = 0;
    let negativeSum = 0;

    for (let j = 0; j < numCols; j++) {
      // Distance to positive ideal
      positiveSum += Math.pow(matrix[i][j] - positiveIdeal[j], 2);

      // Distance to negative ideal
      negativeSum += Math.pow(matrix[i][j] - negativeIdeal[j], 2);
    }

    positiveDistances[i] = Math.sqrt(positiveSum);
    negativeDistances[i] = Math.sqrt(negativeSum);
  }

  return { positive: positiveDistances, negative: negativeDistances };
}

/**
 * Calculate the relative closeness to the ideal solution
 * @param positiveDistances The distances to the positive ideal solution
 * @param negativeDistances The distances to the negative ideal solution
 * @returns The relative closeness scores
 */
function calculateScores(
  positiveDistances: number[],
  negativeDistances: number[]
): number[] {
  const numAlternatives = positiveDistances.length;
  const scores: number[] = Array(numAlternatives).fill(0);

  for (let i = 0; i < numAlternatives; i++) {
    const denominator = positiveDistances[i] + negativeDistances[i];
    // Avoid division by zero
    scores[i] = denominator === 0 ? 0 : negativeDistances[i] / denominator;
  }

  return scores;
}

/**
 * Rank the alternatives based on their relative closeness scores
 * @param scores The relative closeness scores
 * @returns The ranking of alternatives (sorted by score in descending order)
 */
function rankAlternatives(
  scores: number[]
): { index: number; score: number }[] {
  return scores
    .map((score, index) => ({ index, score }))
    .sort((a, b) => b.score - a.score);
}
