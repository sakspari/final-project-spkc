"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InputForm } from "@/components/profile-matching/input-form"
import { ResultsDisplay } from "@/components/profile-matching/results-display"
import { useProfileMatchingStore } from "@/lib/pm/store"

export function ProfileMatchingApp() {
  const [activeTab, setActiveTab] = useState("input")
  const { resetStore, hasCalculatedResults } = useProfileMatchingStore()

  const handleCalculate = () => {
    setActiveTab("results")
  }

  const handleReset = () => {
    resetStore()
    setActiveTab("input")
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-8">
        <TabsTrigger value="input">Input Data</TabsTrigger>
        <TabsTrigger value="results" disabled={!hasCalculatedResults}>
          Results
        </TabsTrigger>
      </TabsList>
      <TabsContent value="input">
        <InputForm onCalculate={handleCalculate} />
      </TabsContent>
      <TabsContent value="results">
        <ResultsDisplay onReset={handleReset} />
      </TabsContent>
    </Tabs>
  )
}
