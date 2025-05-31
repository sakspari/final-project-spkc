import { create } from "zustand"
import { persist } from "zustand/middleware"

interface Criterion {
  id: string
  name: string
  weight: number
}

interface Alternative {
  id: string
  name: string
  scores: Record<string, number>
}

interface AHPStore {
  criteria: Criterion[]
  alternatives: Alternative[]
  comparisonMatrix: Record<string, Record<string, number>>
  consistencyRatio: number | null

  // Actions
  addCriterion: (criterion: Criterion) => void
  updateCriterion: (id: string, criterion: Partial<Criterion>) => void
  removeCriterion: (id: string) => void

  addAlternative: (alternative: Alternative) => void
  updateAlternative: (id: string, alternative: Partial<Alternative>) => void
  removeAlternative: (id: string) => void

  updateComparisonValue: (criterion1: string, criterion2: string, value: number) => void
  calculateWeights: () => void
  calculateConsistencyRatio: () => void
  resetStore: () => void
}

const initialState = {
  criteria: [],
  alternatives: [],
  comparisonMatrix: {},
  consistencyRatio: null,
}

export const useAHPStore = create<AHPStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      addCriterion: (criterion) =>
        set((state) => ({
          criteria: [...state.criteria, criterion],
        })),

      updateCriterion: (id, criterion) =>
        set((state) => ({
          criteria: state.criteria.map((c) => (c.id === id ? { ...c, ...criterion } : c)),
        })),

      removeCriterion: (id) =>
        set((state) => ({
          criteria: state.criteria.filter((c) => c.id !== id),
        })),

      addAlternative: (alternative) =>
        set((state) => ({
          alternatives: [...state.alternatives, alternative],
        })),

      updateAlternative: (id, alternative) =>
        set((state) => ({
          alternatives: state.alternatives.map((a) => (a.id === id ? { ...a, ...alternative } : a)),
        })),

      removeAlternative: (id) =>
        set((state) => ({
          alternatives: state.alternatives.filter((a) => a.id !== id),
        })),

      updateComparisonValue: (criterion1, criterion2, value) =>
        set((state) => {
          const matrix = { ...state.comparisonMatrix }

          if (!matrix[criterion1]) {
            matrix[criterion1] = {}
          }

          matrix[criterion1][criterion2] = value

          // Reciprocal value
          if (!matrix[criterion2]) {
            matrix[criterion2] = {}
          }

          matrix[criterion2][criterion1] = 1 / value

          return { comparisonMatrix: matrix }
        }),

      calculateWeights: () => {
        // This would implement the AHP weight calculation algorithm
        // Simplified placeholder implementation
        set((state) => {
          const weights = state.criteria.map((c) => ({
            ...c,
            weight: 1 / state.criteria.length, // Equal weights as placeholder
          }))

          return {
            criteria: weights,
          }
        })
      },

      calculateConsistencyRatio: () => {
        // This would implement the consistency ratio calculation
        // Simplified placeholder implementation
        set({ consistencyRatio: 0.05 })
      },

      resetStore: () => set(initialState),
    }),
    {
      name: "dss-ahp-store",
    },
  ),
)
