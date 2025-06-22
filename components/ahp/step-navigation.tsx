"use client"

import type { Step } from "@/components/ahp/ahp-calculator"
import { useAHP } from "@/context/ahp-context"
import { CheckCircle, Circle } from "lucide-react"

interface StepNavigationProps {
  currentStep: Step
  setCurrentStep: (step: Step) => void
}

export default function StepNavigation({ currentStep, setCurrentStep }: StepNavigationProps) {
  const {
    criteria,
    alternatives,
    criteriaPairwiseComplete,
    alternativesPairwiseComplete,
    criteriaValidation,
    alternativesValidation,
    criteriaPairwise,
  } = useAHP()

  // Check if setup step is valid (no validation errors)
  const setupValid = criteriaValidation.canProceed && alternativesValidation.canProceed

  // Check if criteria pairwise step is valid (complete and consistent)
  const criteriaPairwiseValid =
    criteriaPairwiseComplete && criteriaPairwise && (criteriaPairwise.consistencyRatio <= 0.1 || criteria.length <= 2)

  const steps = [
    {
      id: "setup" as Step,
      name: "Define Criteria & Alternatives",
      description: "Set up your decision problem",
      isComplete: setupValid,
      isDisabled: false,
    },
    {
      id: "criteria-pairwise" as Step,
      name: "Criteria Comparisons",
      description: "Compare criteria importance",
      isComplete: criteriaPairwiseValid,
      isDisabled: !setupValid,
    },
    {
      id: "alternatives-pairwise" as Step,
      name: "Alternative Comparisons",
      description: "Compare alternatives for each criterion",
      isComplete: alternativesPairwiseComplete,
      isDisabled: !criteriaPairwiseValid,
    },
    {
      id: "results" as Step,
      name: "Results",
      description: "View final rankings and analysis",
      isComplete: false,
      isDisabled: !alternativesPairwiseComplete,
    },
  ]

  return (
    <nav className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border dark:border-gray-700">
      <h2 className="font-semibold text-lg mb-4 text-gray-700 dark:text-gray-200">AHP Steps</h2>
      <ol className="space-y-4">
        {steps.map((step) => (
          <li key={step.id}>
            <button
              onClick={() => !step.isDisabled && setCurrentStep(step.id)}
              disabled={step.isDisabled}
              className={`w-full text-left flex items-start p-3 rounded-md transition-colors ${
                currentStep === step.id
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border dark:border-blue-800"
                  : step.isDisabled
                    ? "text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <span className="mr-3 mt-0.5">
                {step.isComplete ? <CheckCircle className="h-5 w-5 text-green-500" /> : <Circle className="h-5 w-5" />}
              </span>
              <div>
                <p className="font-medium">{step.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{step.description}</p>
                {step.isDisabled && (
                  <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                    {step.id === "criteria-pairwise" && !setupValid && "Fix validation errors in setup first"}
                    {step.id === "alternatives-pairwise" &&
                      !criteriaPairwiseValid &&
                      "Complete criteria comparisons with acceptable consistency first"}
                    {step.id === "results" &&
                      !alternativesPairwiseComplete &&
                      "Complete all alternative comparisons first"}
                  </p>
                )}
              </div>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  )
}
