import { create } from "zustand"
import { persist } from "zustand/middleware"

interface Criterion {
  id: string
  name: string
  weight: number
  type: "benefit" | "cost" // Higher is better for benefit, lower is better for cost
}

interface Alternative {
  id: string
  name: string
  scores: Record<string, number>
}

interface TOPSISResult {
  alternativeId: string
  score: number
  rank: number
}

interface TOPSISStore {
  criteria: Criterion[]
  alternatives: Alternative[]
  results: TOPSISResult[]

  // Actions
  addCriterion: (criterion: Criterion) => void
  updateCriterion: (id: string, criterion: Partial<Criterion>) => void
  removeCriterion: (id: string) => void

  addAlternative: (alternative: Alternative) => void
  updateAlternative: (id: string, alternative: Partial<Alternative>) => void
  removeAlternative: (id: string) => void
  updateScore: (alternativeId: string, criterionId: string, score: number) => void

  calculateResults: () => void
  resetStore: () => void
}

const initialState = {
  criteria: [],
  alternatives: [],
  results: [],
}

export const useTOPSISStore = create<TOPSISStore>()(
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

      updateScore: (alternativeId, criterionId, score) =>
        set((state) => ({
          alternatives: state.alternatives.map((a) =>
            a.id === alternativeId ? { ...a, scores: { ...a.scores, [criterionId]: score } } : a,
          ),
        })),

      calculateResults: () => {
        // This would implement the TOPSIS algorithm
        // Simplified placeholder implementation
        const { alternatives } = get()

        const results = alternatives.map((alt, index) => ({
          alternativeId: alt.id,
          score: Math.random(), // Placeholder for actual TOPSIS calculation
          rank: index + 1,
        }))

        // Sort by score descending
        results.sort((a, b) => b.score - a.score)

        // Update ranks
        results.forEach((result, index) => {
          result.rank = index + 1
        })

        set({ results })
      },

      resetStore: () => set(initialState),
    }),
    {
      name: "dss-topsis-store",
    },
  ),
)
