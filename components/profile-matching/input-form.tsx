"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlternativesInput } from "@/components/profile-matching/alternatives-input"
import { CriteriaInput } from "@/components/profile-matching/criteria-input"
import { FactorWeights } from "@/components/profile-matching/factor-weights"
import { useProfileMatchingStore } from "@/lib/pm/store"
import { calculateProfileMatching } from "@/lib/pm/calculations"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface InputFormProps {
  onCalculate: () => void
}

export function InputForm({ onCalculate }: InputFormProps) {
  const [validationError, setValidationError] = useState<string | null>(null)
  const {
    alternatives,
    criteria,
    coreFactorWeight,
    secondaryFactorWeight,
    setCalculationResults,
    setHasCalculatedResults,
  } = useProfileMatchingStore()

  const validateInputs = () => {
    if (alternatives.length < 2) {
      setValidationError("Please add at least 2 alternatives")
      return false
    }

    if (criteria.length < 1) {
      setValidationError("Please add at least 1 criterion")
      return false
    }

    const hasCoreFactors = criteria.some((c) => c.factorType === "core")
    const hasSecondaryFactors = criteria.some((c) => c.factorType === "secondary")

    if (!hasCoreFactors && !hasSecondaryFactors) {
      setValidationError("Please assign at least one criterion to Core or Secondary factors")
      return false
    }

    if (hasCoreFactors && hasSecondaryFactors && coreFactorWeight + secondaryFactorWeight !== 100) {
      setValidationError("Core and Secondary factor weights must sum to 100%")
      return false
    }

    // Check if all criteria have ideal values
    for (const criterion of criteria) {
      if (criterion.idealValue === undefined || criterion.idealValue === null || criterion.idealValue === "") {
        setValidationError(`Please set an ideal value for criterion: ${criterion.name}`)
        return false
      }

      // For range criteria, validate x1 < x2
      if (criterion.isRange) {
        for (const alt of alternatives) {
          const value = alt.values[criterion.id]
          if (value && Array.isArray(value)) {
            const [x1, x2] = value
            if (x1 >= x2) {
              setValidationError(`Range values for ${alt.name} on ${criterion.name} must have x1 < x2`)
              return false
            }
          }
        }
      }
    }

    // Check if all alternatives have values for all criteria
    for (const alt of alternatives) {
      for (const criterion of criteria) {
        if (
          alt.values[criterion.id] === undefined ||
          alt.values[criterion.id] === null ||
          alt.values[criterion.id] === ""
        ) {
          setValidationError(`Please set a value for ${alt.name} on criterion: ${criterion.name}`)
          return false
        }
      }
    }

    setValidationError(null)
    return true
  }

  const handleCalculate = () => {
    if (validateInputs()) {
      const results = calculateProfileMatching({
        alternatives,
        criteria,
        coreFactorWeight,
        secondaryFactorWeight,
      })

      setCalculationResults(results)
      setHasCalculatedResults(true)
      onCalculate()
    }
  }

  return (
    <div className="space-y-8">
      {validationError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{validationError}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Alternatives</CardTitle>
          <CardDescription>Add the alternatives you want to evaluate</CardDescription>
        </CardHeader>
        <CardContent>
          <AlternativesInput />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Criteria</CardTitle>
          <CardDescription>Define the criteria and ideal values for evaluation</CardDescription>
        </CardHeader>
        <CardContent>
          <CriteriaInput />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Factor Weights</CardTitle>
          <CardDescription>Set weights for Core and Secondary factors</CardDescription>
        </CardHeader>
        <CardContent>
          <FactorWeights />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button size="lg" onClick={handleCalculate}>
          Calculate Results
        </Button>
      </div>
    </div>
  )
}
