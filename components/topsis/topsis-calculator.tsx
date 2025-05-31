"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import InputForm from "@/components/topsis/input-form"
import ResultsDisplay from "@/components/topsis/results-display"
import { calculateTopsis } from "@/lib/topsis/topsis"
import type { TopsisInput, TopsisResult } from "@/lib/types/topsis"
import { useToast } from "@/hooks/use-toast"

export default function TopsisCalculator() {
  const [results, setResults] = useState<TopsisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleCalculate = (input: TopsisInput) => {
    try {
      setLoading(true)

      // Validate weights sum to approximately 1
      const weightSum = input.weights.reduce((sum, weight) => sum + weight, 0)
      if (weightSum < 0.99 || weightSum > 1.01) {
        toast({
          title: "Invalid weights",
          description: "Weights must sum to approximately 1",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      // Calculate TOPSIS
      const result = calculateTopsis(input)
      setResults(result)

      // Save to localStorage
      localStorage.setItem("topsisInput", JSON.stringify(input))

      toast({
        title: "Calculation complete",
        description: "TOPSIS calculation has been performed successfully",
      })
    } catch (error) {
      toast({
        title: "Calculation error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-1">
      <Card>
        <CardContent className="pt-6">
          <InputForm onCalculate={handleCalculate} loading={loading} />
        </CardContent>
      </Card>

      {results && <ResultsDisplay results={results} />}
    </div>
  )
}
