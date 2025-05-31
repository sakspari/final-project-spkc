"use client"

import { create } from "zustand"
import type { Alternative, Criterion, CalculationResults } from "./types"

interface ProfileMatchingState {
  alternatives: Alternative[]
  criteria: Criterion[]
  coreFactorWeight: number
  secondaryFactorWeight: number
  calculationResults: CalculationResults | null
  hasCalculatedResults: boolean

  // Actions
  addAlternative: (alternative: Alternative) => void
  removeAlternative: (id: string) => void
  updateAlternativeValue: (altId: string, critId: string, value: string | number | [number, number]) => void

  addCriterion: (criterion: Criterion) => void
  removeCriterion: (id: string) => void
  updateCriterion: (id: string, updates: Partial<Criterion>) => void

  setCoreFactorWeight: (weight: number) => void
  setSecondaryFactorWeight: (weight: number) => void

  setCalculationResults: (results: CalculationResults) => void
  setHasCalculatedResults: (value: boolean) => void

  resetStore: () => void
}

export const useProfileMatchingStore = create<ProfileMatchingState>((set) => ({
  alternatives: [],
  criteria: [],
  coreFactorWeight: 60,
  secondaryFactorWeight: 40,
  calculationResults: null,
  hasCalculatedResults: false,

  addAlternative: (alternative) =>
    set((state) => ({
      alternatives: [...state.alternatives, alternative],
    })),

  removeAlternative: (id) =>
    set((state) => ({
      alternatives: state.alternatives.filter((alt) => alt.id !== id),
    })),

  updateAlternativeValue: (altId, critId, value) =>
    set((state) => ({
      alternatives: state.alternatives.map((alt) =>
        alt.id === altId ? { ...alt, values: { ...alt.values, [critId]: value } } : alt,
      ),
    })),

  addCriterion: (criterion) =>
    set((state) => ({
      criteria: [...state.criteria, criterion],
    })),

  removeCriterion: (id) =>
    set((state) => ({
      criteria: state.criteria.filter((crit) => crit.id !== id),
      // Also remove this criterion from all alternatives' values
      alternatives: state.alternatives.map((alt) => {
        const { [id]: _, ...restValues } = alt.values
        return { ...alt, values: restValues }
      }),
    })),

  updateCriterion: (id, updates) =>
    set((state) => ({
      criteria: state.criteria.map((crit) => (crit.id === id ? { ...crit, ...updates } : crit)),
    })),

  setCoreFactorWeight: (weight) => set({ coreFactorWeight: weight }),

  setSecondaryFactorWeight: (weight) => set({ secondaryFactorWeight: weight }),

  setCalculationResults: (results) => set({ calculationResults: results }),

  setHasCalculatedResults: (value) => set({ hasCalculatedResults: value }),

  resetStore: () =>
    set({
      alternatives: [],
      criteria: [],
      coreFactorWeight: 60,
      secondaryFactorWeight: 40,
      calculationResults: null,
      hasCalculatedResults: false,
    }),
}))
