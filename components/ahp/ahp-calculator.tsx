"use client"

import { useState } from "react"
import { AHPProvider } from "@/context/ahp-context"
import Header from "@/components/ahp/header"
import StepNavigation from "@/components/ahp/step-navigation"
import CriteriaAlternativesStep from "@/components/ahp/steps/criteria-alternatives-step"
import CriteriaPairwiseStep from "@/components/ahp/steps/criteria-pairwise-step"
import AlternativesPairwiseStep from "@/components/ahp/steps/alternatives-pairwise-step"
import ResultsStep from "@/components/ahp/steps/results-step"

export type Step = "setup" | "criteria-pairwise" | "alternatives-pairwise" | "results"

export default function AHPCalculator() {
  const [currentStep, setCurrentStep] = useState<Step>("setup")

  const renderStep = () => {
    switch (currentStep) {
      case "setup":
        return <CriteriaAlternativesStep />
      case "criteria-pairwise":
        return <CriteriaPairwiseStep />
      case "alternatives-pairwise":
        return <AlternativesPairwiseStep />
      case "results":
        return <ResultsStep />
      default:
        return <CriteriaAlternativesStep />
    }
  }

  return (
    <AHPProvider>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Header />
        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6 mt-8">
          <StepNavigation currentStep={currentStep} setCurrentStep={setCurrentStep} />
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border dark:border-gray-700">
            {renderStep()}
          </div>
        </div>
      </div>
    </AHPProvider>
  )
}
