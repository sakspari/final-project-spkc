import { create } from "zustand"
import { persist } from "zustand/middleware"

interface Criterion {
  id: string
  name: string
  weight: number
  targetValue: number
  type: "core" | "secondary"
}

interface Profile {
  id: string
  name: string
  values: Record<string, number>
}

interface GapAnalysisResult {
  profileId: string
  coreFactorScore: number
  secondaryFactorScore: number
  totalScore: number
  rank: number
}

interface ProfileMatchingStore {
  criteria: Criterion[]
  profiles: Profile[]
  idealProfile: Record<string, number>
  coreFactorPercentage: number
  secondaryFactorPercentage: number
  results: GapAnalysisResult[]

  // Actions
  addCriterion: (criterion: Criterion) => void
  updateCriterion: (id: string, criterion: Partial<Criterion>) => void
  removeCriterion: (id: string) => void

  addProfile: (profile: Profile) => void
  updateProfile: (id: string, profile: Partial<Profile>) => void
  removeProfile: (id: string) => void
  updateProfileValue: (profileId: string, criterionId: string, value: number) => void

  setIdealProfileValue: (criterionId: string, value: number) => void
  setCoreFactorPercentage: (percentage: number) => void

  calculateResults: () => void
  resetStore: () => void
}

const initialState = {
  criteria: [],
  profiles: [],
  idealProfile: {},
  coreFactorPercentage: 60,
  secondaryFactorPercentage: 40,
  results: [],
}

export const useProfileMatchingStore = create<ProfileMatchingStore>()(
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

      addProfile: (profile) =>
        set((state) => ({
          profiles: [...state.profiles, profile],
        })),

      updateProfile: (id, profile) =>
        set((state) => ({
          profiles: state.profiles.map((p) => (p.id === id ? { ...p, ...profile } : p)),
        })),

      removeProfile: (id) =>
        set((state) => ({
          profiles: state.profiles.filter((p) => p.id !== id),
        })),

      updateProfileValue: (profileId, criterionId, value) =>
        set((state) => ({
          profiles: state.profiles.map((p) =>
            p.id === profileId ? { ...p, values: { ...p.values, [criterionId]: value } } : p,
          ),
        })),

      setIdealProfileValue: (criterionId, value) =>
        set((state) => ({
          idealProfile: { ...state.idealProfile, [criterionId]: value },
        })),

      setCoreFactorPercentage: (percentage) =>
        set((state) => ({
          coreFactorPercentage: percentage,
          secondaryFactorPercentage: 100 - percentage,
        })),

      calculateResults: () => {
        // This would implement the Profile Matching algorithm
        // Simplified placeholder implementation
        const { profiles } = get()

        const results = profiles.map((profile, index) => ({
          profileId: profile.id,
          coreFactorScore: Math.random() * 5, // Placeholder
          secondaryFactorScore: Math.random() * 5, // Placeholder
          totalScore: Math.random() * 5, // Placeholder
          rank: index + 1,
        }))

        // Sort by total score descending
        results.sort((a, b) => b.totalScore - a.totalScore)

        // Update ranks
        results.forEach((result, index) => {
          result.rank = index + 1
        })

        set({ results })
      },

      resetStore: () => set(initialState),
    }),
    {
      name: "dss-profile-matching-store",
    },
  ),
)
