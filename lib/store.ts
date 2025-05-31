import { create } from "zustand"
import { persist } from "zustand/middleware"

type ThemeType = "light" | "dark" | "system"

interface UserPreferences {
  defaultMethod: string
  recentMethods: string[]
}

interface GlobalStore {
  theme: ThemeType
  userPreferences: UserPreferences
  setTheme: (theme: ThemeType) => void
  setDefaultMethod: (method: string) => void
  addRecentMethod: (method: string) => void
}

export const useGlobalStore = create<GlobalStore>()(
  persist(
    (set) => ({
      theme: "system",
      userPreferences: {
        defaultMethod: "ahp",
        recentMethods: [],
      },
      setTheme: (theme) => set({ theme }),
      setDefaultMethod: (method) =>
        set((state) => ({
          userPreferences: {
            ...state.userPreferences,
            defaultMethod: method,
          },
        })),
      addRecentMethod: (method) =>
        set((state) => {
          const filteredMethods = state.userPreferences.recentMethods.filter((m) => m !== method)
          return {
            userPreferences: {
              ...state.userPreferences,
              recentMethods: [method, ...filteredMethods].slice(0, 5),
            },
          }
        }),
    }),
    {
      name: "dss-global-store",
    },
  ),
)
