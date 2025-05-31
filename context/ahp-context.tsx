"use client"

import { createContext, useContext, useState, type ReactNode, useEffect, useCallback, useMemo, useRef } from "react"
import {
  calculatePriorityVector,
  calculateConsistencyRatio,
  initializeMatrix,
  normalizeQuantitativeData,
  convertToPairwiseMatrix,
} from "@/lib/ahp"

export interface Criterion {
  id: string
  name: string
  isQuantitative: boolean
  isCost: boolean
  normalizationType: "sum" | "max" | "min"
}

export interface Alternative {
  id: string
  name: string
}

export interface QuantitativeData {
  criterionId: string
  values: Record<string, number>
}

export interface PairwiseMatrix {
  matrix: number[][]
  priorityVector: number[]
  consistencyRatio: number
  consistencyIndex: number
  lambdaMax: number
  randomIndex: number
  weightedSumVector: number[]
  isConsistent: boolean
}

export interface AlternativeMatrix extends PairwiseMatrix {
  criterionId: string
  rawValues?: number[]
  normalizedValues?: number[]
}

interface AHPContextType {
  criteria: Criterion[]
  alternatives: Alternative[]
  criteriaComparisonMatrix: number[][]
  alternativesComparisonMatrices: Record<string, number[][]>
  criteriaPriorityVector: number[]
  alternativesPriorityVectors: Record<string, number[]>
  overallRanking: { id: string; name: string; score: number }[]
  quantitativeData: QuantitativeData[]

  addCriterion: () => void
  removeCriterion: (id: string) => void
  updateCriterionName: (id: string, name: string) => void
  toggleCriterionType: (id: string, isQuantitative: boolean) => void
  updateCriterionCostBenefit: (id: string, isCost: boolean) => void
  updateCriterionNormalization: (id: string, normType: "sum" | "max" | "min") => void

  addAlternative: () => void
  removeAlternative: (id: string) => void
  updateAlternativeName: (id: string, name: string) => void

  updateCriteriaComparison: (row: number, col: number, value: number) => void
  updateAlternativesComparison: (criterionId: string, row: number, col: number, value: number) => void
  updateQuantitativeValue: (criterionId: string, alternativeId: string, value: number) => void

  criteriaPairwiseComplete: boolean
  alternativesPairwiseComplete: boolean

  criteriaPairwise: PairwiseMatrix | null
  alternativesPairwise: AlternativeMatrix[]
  finalRanking: { alternativeId: string; score: number }[]
}

const AHPContext = createContext<AHPContextType | undefined>(undefined)

export function AHPProvider({ children }: { children: ReactNode }) {
  // Use refs to track initialization and prevent infinite loops
  const isInitialRender = useRef(true)
  const prevCriteriaLength = useRef(0)
  const prevAlternativesLength = useRef(0)

  // Initial state with 3 criteria and 3 alternatives
  const [criteria, setCriteria] = useState<Criterion[]>([
    { id: "c1", name: "Criteria 1", isQuantitative: false, isCost: false, normalizationType: "sum" },
    { id: "c2", name: "Criteria 2", isQuantitative: false, isCost: false, normalizationType: "sum" },
    { id: "c3", name: "Criteria 3", isQuantitative: false, isCost: false, normalizationType: "sum" },
  ])

  const [alternatives, setAlternatives] = useState<Alternative[]>([
    { id: "a1", name: "Alternative 1" },
    { id: "a2", name: "Alternative 2" },
    { id: "a3", name: "Alternative 3" },
  ])

  // Quantitative data state
  const [quantitativeData, setQuantitativeData] = useState<QuantitativeData[]>([])

  // Raw comparison matrices (user input)
  const [criteriaComparisonMatrix, setCriteriaComparisonMatrix] = useState<number[][]>([])
  const [alternativesComparisonMatrices, setAlternativesComparisonMatrices] = useState<Record<string, number[][]>>({})

  // Calculated matrices and vectors
  const [criteriaPairwise, setCriteriaPairwise] = useState<PairwiseMatrix | null>(null)
  const [alternativesPairwise, setAlternativesPairwise] = useState<AlternativeMatrix[]>([])
  const [finalRanking, setFinalRanking] = useState<{ alternativeId: string; score: number }[]>([])

  // Completion flags
  const [criteriaPairwiseComplete, setCriteriaPairwiseComplete] = useState(false)
  const [alternativesPairwiseComplete, setAlternativesPairwiseComplete] = useState(false)

  // Initialize matrices when criteria or alternatives change
  useEffect(() => {
    // Skip if this is not the initial render and the lengths haven't changed
    if (
      !isInitialRender.current &&
      prevCriteriaLength.current === criteria.length &&
      prevAlternativesLength.current === alternatives.length
    ) {
      return
    }

    // Update refs
    isInitialRender.current = false
    prevCriteriaLength.current = criteria.length
    prevAlternativesLength.current = alternatives.length

    // Initialize criteria comparison matrix
    const n = criteria.length
    const newCriteriaMatrix = Array(n)
      .fill(0)
      .map((_, i) =>
        Array(n)
          .fill(0)
          .map((_, j) => (i === j ? 1 : 0)),
      )
    setCriteriaComparisonMatrix(newCriteriaMatrix)

    // Initialize alternative comparison matrices for each criterion
    const newAltMatrices: Record<string, number[][]> = {}
    criteria.forEach((criterion) => {
      const m = alternatives.length
      newAltMatrices[criterion.id] = Array(m)
        .fill(0)
        .map((_, i) =>
          Array(m)
            .fill(0)
            .map((_, j) => (i === j ? 1 : 0)),
        )
    })
    setAlternativesComparisonMatrices(newAltMatrices)

    // Initialize criteriaPairwise with default values
    const defaultPriorityVector = Array(n).fill(1 / n)
    setCriteriaPairwise({
      matrix: newCriteriaMatrix,
      priorityVector: defaultPriorityVector,
      consistencyRatio: 0,
      consistencyIndex: 0,
      lambdaMax: 0,
      randomIndex: 0,
      weightedSumVector: Array(n).fill(0),
      isConsistent: true,
    })

    // Initialize alternativesPairwise with default values
    const newAlternativesPairwise: AlternativeMatrix[] = criteria.map((criterion) => ({
      criterionId: criterion.id,
      matrix: newAltMatrices[criterion.id],
      priorityVector: Array(alternatives.length).fill(1 / alternatives.length),
      consistencyRatio: 0,
      consistencyIndex: 0,
      lambdaMax: 0,
      randomIndex: 0,
      weightedSumVector: Array(alternatives.length).fill(0),
      isConsistent: true,
    }))
    setAlternativesPairwise(newAlternativesPairwise)

    // Reset completion flags
    setCriteriaPairwiseComplete(false)
    setAlternativesPairwiseComplete(false)
  }, [criteria.length, alternatives.length])

  // Initialize or update quantitative data when alternatives or criteria change
  useEffect(() => {
    // Get all quantitative criteria
    const quantitativeCriteria = criteria.filter((criterion) => criterion.isQuantitative)

    // Create or update quantitative data for each quantitative criterion
    const updatedData = quantitativeCriteria.map((criterion) => {
      // Check if data already exists for this criterion
      const existingData = quantitativeData.find((data) => data.criterionId === criterion.id)

      // If exists, keep existing values for alternatives that still exist
      if (existingData) {
        const filteredValues: Record<string, number> = {}
        alternatives.forEach((alt) => {
          // Keep existing value or set to 0 if it's a new alternative
          filteredValues[alt.id] = existingData.values[alt.id] !== undefined ? existingData.values[alt.id] : 0
        })

        return {
          criterionId: criterion.id,
          values: filteredValues,
        }
      }

      // If no existing data, create new entries with 0 values
      const newValues: Record<string, number> = {}
      alternatives.forEach((alt) => {
        newValues[alt.id] = 0
      })

      return {
        criterionId: criterion.id,
        values: newValues,
      }
    })

    setQuantitativeData(updatedData)
  }, [criteria, alternatives])

  // Process criteria comparisons - use a separate ref to track matrix changes
  const criteriaMatrixRef = useRef(criteriaComparisonMatrix)
  useEffect(() => {
    // Skip if matrix is empty or hasn't changed
    if (
      criteriaComparisonMatrix.length === 0 ||
      JSON.stringify(criteriaMatrixRef.current) === JSON.stringify(criteriaComparisonMatrix)
    ) {
      return
    }

    // Update ref
    criteriaMatrixRef.current = criteriaComparisonMatrix

    const n = criteria.length
    let isComplete = true

    // Check if all values are filled
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        if (criteriaComparisonMatrix[i][j] === 0) {
          isComplete = false
          break
        }
      }
      if (!isComplete) break
    }

    // Always update the matrix in criteriaPairwise
    if (criteriaPairwise) {
      setCriteriaPairwise((prev) => ({
        ...prev!,
        matrix: criteriaComparisonMatrix,
      }))
    }

    // Calculate priority vector and consistency only if complete
    if (isComplete && n > 1) {
      const priorityVector = calculatePriorityVector(criteriaComparisonMatrix)
      const { consistencyRatio, consistencyIndex, lambdaMax, randomIndex, weightedSumVector, isConsistent } =
        calculateConsistencyRatio(criteriaComparisonMatrix, priorityVector)

      setCriteriaPairwise((prev) => ({
        ...prev!,
        priorityVector,
        consistencyRatio,
        consistencyIndex,
        lambdaMax,
        randomIndex,
        weightedSumVector,
        isConsistent,
      }))

      setCriteriaPairwiseComplete(true)
    } else if (criteriaPairwiseComplete) {
      setCriteriaPairwiseComplete(false)
    }
  }, [criteriaComparisonMatrix, criteria.length])

  // Process alternatives comparisons - use a separate ref to track matrix changes
  const alternativesMatricesRef = useRef(alternativesComparisonMatrices)
  const quantitativeDataRef = useRef(quantitativeData)

  useEffect(() => {
    // Skip if matrices are empty or nothing has changed
    if (
      Object.keys(alternativesComparisonMatrices).length === 0 &&
      JSON.stringify(alternativesMatricesRef.current) === JSON.stringify(alternativesComparisonMatrices) &&
      JSON.stringify(quantitativeDataRef.current) === JSON.stringify(quantitativeData)
    ) {
      return
    }

    // Update refs
    alternativesMatricesRef.current = alternativesComparisonMatrices
    quantitativeDataRef.current = quantitativeData

    const m = alternatives.length
    let allComplete = true
    const newAlternativesPairwise: AlternativeMatrix[] = []

    criteria.forEach((criterion) => {
      // For quantitative criteria, generate pairwise comparison matrix from quantitative data
      if (criterion.isQuantitative) {
        const quantData = quantitativeData.find((data) => data.criterionId === criterion.id)

        if (quantData) {
          // Extract values in the same order as alternatives array
          const rawValues = alternatives.map((alt) => quantData.values[alt.id] || 0)

          // Skip if all values are 0
          if (rawValues.every((val) => val === 0)) {
            allComplete = false

            // Find existing matrix to preserve any calculated values
            const existingMatrix = alternativesPairwise.find((m) => m.criterionId === criterion.id)

            newAlternativesPairwise.push({
              criterionId: criterion.id,
              matrix: initializeMatrix(m),
              priorityVector: existingMatrix?.priorityVector || Array(m).fill(1 / m),
              consistencyRatio: 0,
              consistencyIndex: 0,
              lambdaMax: 0,
              randomIndex: 0,
              weightedSumVector: Array(m).fill(0),
              isConsistent: true,
              rawValues,
              normalizedValues: Array(m).fill(0),
            })

            return
          }

          // Normalize values
          const normalizedValues = normalizeQuantitativeData(rawValues, criterion.normalizationType, criterion.isCost)

          // Convert to pairwise comparison matrix
          const matrix = convertToPairwiseMatrix(normalizedValues)

          // Calculate priority vector and consistency
          const priorityVector = [...normalizedValues] // For quantitative data, normalized values = priority vector
          const { consistencyRatio, consistencyIndex, lambdaMax, randomIndex, weightedSumVector, isConsistent } =
            calculateConsistencyRatio(matrix, priorityVector)

          newAlternativesPairwise.push({
            criterionId: criterion.id,
            matrix,
            priorityVector,
            consistencyRatio,
            consistencyIndex,
            lambdaMax,
            randomIndex,
            weightedSumVector,
            isConsistent,
            rawValues,
            normalizedValues,
          })
        } else {
          allComplete = false
        }
      } else {
        // For qualitative criteria, process as before
        const matrix = alternativesComparisonMatrices[criterion.id]
        if (!matrix) {
          allComplete = false
          return
        }

        let isComplete = true
        // Check if all values are filled
        for (let i = 0; i < m; i++) {
          for (let j = i + 1; j < m; j++) {
            if (matrix[i][j] === 0) {
              isComplete = false
              allComplete = false
              break
            }
          }
          if (!isComplete) break
        }

        // Find existing matrix to preserve any calculated values
        const existingMatrix = alternativesPairwise.find((m) => m.criterionId === criterion.id)

        if (isComplete && m > 1) {
          // Calculate priority vector and consistency only if complete
          const priorityVector = calculatePriorityVector(matrix)
          const { consistencyRatio, consistencyIndex, lambdaMax, randomIndex, weightedSumVector, isConsistent } =
            calculateConsistencyRatio(matrix, priorityVector)

          newAlternativesPairwise.push({
            criterionId: criterion.id,
            matrix,
            priorityVector,
            consistencyRatio,
            consistencyIndex,
            lambdaMax,
            randomIndex,
            weightedSumVector,
            isConsistent,
          })
        } else {
          // Add matrix with default or existing values
          newAlternativesPairwise.push({
            criterionId: criterion.id,
            matrix,
            priorityVector: existingMatrix?.priorityVector || Array(m).fill(1 / m),
            consistencyRatio: existingMatrix?.consistencyRatio || 0,
            consistencyIndex: existingMatrix?.consistencyIndex || 0,
            lambdaMax: existingMatrix?.lambdaMax || 0,
            randomIndex: existingMatrix?.randomIndex || 0,
            weightedSumVector: existingMatrix?.weightedSumVector || Array(m).fill(0),
            isConsistent: existingMatrix?.isConsistent || false,
          })
        }
      }
    })

    setAlternativesPairwise(newAlternativesPairwise)
    setAlternativesPairwiseComplete(allComplete && newAlternativesPairwise.length === criteria.length)
  }, [alternativesComparisonMatrices, alternatives.length, criteria, quantitativeData])

  // Calculate final ranking - use refs to track completion status changes
  const criteriaPairwiseCompleteRef = useRef(criteriaPairwiseComplete)
  const alternativesPairwiseCompleteRef = useRef(alternativesPairwiseComplete)
  useEffect(() => {
    // Skip if completion status hasn't changed or not all complete
    if (
      !criteriaPairwiseComplete ||
      !alternativesPairwiseComplete ||
      (criteriaPairwiseCompleteRef.current === criteriaPairwiseComplete &&
        alternativesPairwiseCompleteRef.current === alternativesPairwiseComplete)
    ) {
      return
    }

    // Update refs
    criteriaPairwiseCompleteRef.current = criteriaPairwiseComplete
    alternativesPairwiseCompleteRef.current = alternativesPairwiseComplete

    if (!criteriaPairwise) return

    const scores: { alternativeId: string; score: number }[] = alternatives.map((alt) => ({
      alternativeId: alt.id,
      score: 0,
    }))

    // For each criterion
    criteria.forEach((criterion, criterionIndex) => {
      const criterionWeight = criteriaPairwise.priorityVector[criterionIndex]
      const altMatrix = alternativesPairwise.find((m) => m.criterionId === criterion.id)

      if (!altMatrix) return

      // For each alternative
      alternatives.forEach((alt, altIndex) => {
        const altScore = altMatrix.priorityVector[altIndex] * criterionWeight
        const scoreIndex = scores.findIndex((s) => s.alternativeId === alt.id)
        if (scoreIndex >= 0) {
          scores[scoreIndex].score += altScore
        }
      })
    })

    // Sort by score in descending order
    setFinalRanking(scores.sort((a, b) => b.score - a.score))
  }, [
    criteriaPairwiseComplete,
    alternativesPairwiseComplete,
    criteriaPairwise,
    alternativesPairwise,
    criteria,
    alternatives,
  ])

  // Derived state for priority vectors
  const criteriaPriorityVector = useMemo(() => {
    return criteriaPairwise?.priorityVector || Array(criteria.length).fill(0)
  }, [criteriaPairwise, criteria.length])

  const alternativesPriorityVectors = useMemo(() => {
    const vectors: Record<string, number[]> = {}
    alternativesPairwise.forEach((matrix) => {
      vectors[matrix.criterionId] = matrix.priorityVector
    })
    return vectors
  }, [alternativesPairwise])

  // CRUD operations for criteria
  const addCriterion = useCallback(() => {
    const newId = `c${criteria.length + 1}`
    setCriteria((prev) => [
      ...prev,
      {
        id: newId,
        name: `Criteria ${prev.length + 1}`,
        isQuantitative: false,
        isCost: false,
        normalizationType: "sum",
      },
    ])
  }, [criteria.length])

  const removeCriterion = useCallback((id: string) => {
    setCriteria((prev) => {
      if (prev.length <= 2) return prev
      return prev.filter((c) => c.id !== id)
    })

    // Also remove quantitative data for this criterion if exists
    setQuantitativeData((prev) => prev.filter((data) => data.criterionId !== id))
  }, [])

  const updateCriterionName = useCallback((id: string, name: string) => {
    setCriteria((prev) => prev.map((c) => (c.id === id ? { ...c, name } : c)))
  }, [])

  const toggleCriterionType = useCallback(
    (id: string, isQuantitative: boolean) => {
      setCriteria((prev) => prev.map((c) => (c.id === id ? { ...c, isQuantitative } : c)))

      // If switching to quantitative, ensure quantitative data exists
      if (isQuantitative) {
        setQuantitativeData((prev) => {
          // Check if data already exists for this criterion
          if (prev.some((data) => data.criterionId === id)) {
            return prev
          }

          // Create new entry with 0 values
          const newValues: Record<string, number> = {}
          alternatives.forEach((alt) => {
            newValues[alt.id] = 0
          })

          return [
            ...prev,
            {
              criterionId: id,
              values: newValues,
            },
          ]
        })
      }

      // Reset the comparison matrix for this criterion
      setAlternativesComparisonMatrices((prev) => {
        const newMatrices = { ...prev }
        const m = alternatives.length
        newMatrices[id] = initializeMatrix(m)
        return newMatrices
      })
    },
    [alternatives],
  )

  const updateCriterionCostBenefit = useCallback((id: string, isCost: boolean) => {
    setCriteria((prev) => prev.map((c) => (c.id === id ? { ...c, isCost } : c)))
  }, [])

  const updateCriterionNormalization = useCallback((id: string, normalizationType: "sum" | "max" | "min") => {
    setCriteria((prev) => prev.map((c) => (c.id === id ? { ...c, normalizationType } : c)))
  }, [])

  // CRUD operations for alternatives
  const addAlternative = useCallback(() => {
    const newId = `a${alternatives.length + 1}`
    setAlternatives((prev) => [...prev, { id: newId, name: `Alternative ${prev.length + 1}` }])

    // Also add this alternative with 0 value to all quantitative data
    setQuantitativeData((prev) =>
      prev.map((data) => ({
        ...data,
        values: {
          ...data.values,
          [newId]: 0,
        },
      })),
    )
  }, [alternatives.length])

  const removeAlternative = useCallback((id: string) => {
    setAlternatives((prev) => {
      if (prev.length <= 2) return prev
      return prev.filter((a) => a.id !== id)
    })

    // Also remove this alternative from all quantitative data
    setQuantitativeData((prev) =>
      prev.map((data) => {
        const newValues = { ...data.values }
        delete newValues[id]
        return {
          ...data,
          values: newValues,
        }
      }),
    )
  }, [])

  const updateAlternativeName = useCallback((id: string, name: string) => {
    setAlternatives((prev) => prev.map((a) => (a.id === id ? { ...a, name } : a)))
  }, [])

  // Update pairwise comparison matrices
  const updateCriteriaComparison = useCallback((row: number, col: number, value: number) => {
    setCriteriaComparisonMatrix((prev) => {
      const newMatrix = prev.map((r) => [...r])
      newMatrix[row][col] = value
      newMatrix[col][row] = 1 / value
      return newMatrix
    })
  }, [])

  const updateAlternativesComparison = useCallback(
    (criterionId: string, row: number, col: number, value: number) => {
      setAlternativesComparisonMatrices((prev) => {
        const newMatrices = { ...prev }
        if (!newMatrices[criterionId]) {
          const m = alternatives.length
          newMatrices[criterionId] = initializeMatrix(m)
        }

        const newMatrix = newMatrices[criterionId].map((r) => [...r])
        newMatrix[row][col] = value
        newMatrix[col][row] = 1 / value
        newMatrices[criterionId] = newMatrix

        return newMatrices
      })
    },
    [alternatives.length],
  )

  const updateQuantitativeValue = useCallback(
    (criterionId: string, alternativeId: string, value: number) => {
      setQuantitativeData((prev) => {
        const newData = [...prev]
        const dataIndex = newData.findIndex((d) => d.criterionId === criterionId)

        if (dataIndex >= 0) {
          newData[dataIndex] = {
            ...newData[dataIndex],
            values: {
              ...newData[dataIndex].values,
              [alternativeId]: value,
            },
          }
        } else {
          // Should not normally happen if we initialize properly
          const newValues: Record<string, number> = {}
          alternatives.forEach((alt) => {
            newValues[alt.id] = alt.id === alternativeId ? value : 0
          })

          newData.push({
            criterionId,
            values: newValues,
          })
        }

        return newData
      })
    },
    [alternatives],
  )

  // Calculate overall ranking
  const overallRanking = useMemo(() => {
    if (!criteriaPairwiseComplete || !alternativesPairwiseComplete || !criteriaPairwise) {
      return alternatives.map((alt) => ({ id: alt.id, name: alt.name, score: 0 }))
    }

    const scores = alternatives.map((alt) => ({ id: alt.id, name: alt.name, score: 0 }))

    // For each criterion
    criteria.forEach((criterion, criterionIndex) => {
      const criterionWeight = criteriaPairwise.priorityVector[criterionIndex]
      const altMatrix = alternativesPairwise.find((m) => m.criterionId === criterion.id)

      if (!altMatrix) return

      // For each alternative
      alternatives.forEach((alt, altIndex) => {
        const altScore = altMatrix.priorityVector[altIndex] * criterionWeight
        const scoreIndex = scores.findIndex((s) => s.id === alt.id)
        if (scoreIndex >= 0) {
          scores[scoreIndex].score += altScore
        }
      })
    })

    // Sort by score in descending order
    return scores.sort((a, b) => b.score - a.score)
  }, [
    criteria,
    alternatives,
    criteriaPairwise,
    alternativesPairwise,
    criteriaPairwiseComplete,
    alternativesPairwiseComplete,
  ])

  const value = {
    criteria,
    alternatives,
    criteriaComparisonMatrix,
    alternativesComparisonMatrices,
    criteriaPriorityVector,
    alternativesPriorityVectors,
    overallRanking,
    quantitativeData,

    addCriterion,
    removeCriterion,
    updateCriterionName,
    toggleCriterionType,
    updateCriterionCostBenefit,
    updateCriterionNormalization,

    addAlternative,
    removeAlternative,
    updateAlternativeName,

    updateCriteriaComparison,
    updateAlternativesComparison,
    updateQuantitativeValue,

    criteriaPairwiseComplete,
    alternativesPairwiseComplete,

    criteriaPairwise,
    alternativesPairwise,
    finalRanking,
  }

  return <AHPContext.Provider value={value}>{children}</AHPContext.Provider>
}

export function useAHP() {
  const context = useContext(AHPContext)
  if (context === undefined) {
    throw new Error("useAHP must be used within an AHPProvider")
  }
  return context
}
