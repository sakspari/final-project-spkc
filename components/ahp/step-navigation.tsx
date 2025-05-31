"use client"

import type { Step } from "@/components/ahp/ahp-calculator"
import { useAHP } from "@/context/ahp-context"
import { CheckCircle, Circle } from "lucide-react"

interface StepNavigationProps {
  currentStep: Step
  setCurrentStep: (step: Step) => void
}

export default function StepNavigation({ currentStep, setCurrentStep }: StepNavigationProps) {
  const { criteria, alternatives, criteriaPairwiseComplete, alternativesPairwiseComplete } = useAHP()

  const steps = [
    {
      id: "setup" as Step,
      name: "Define Criteria & Alternatives",
      description: "Set up your decision problem",
      isComplete: criteria.length >= 2 && alternatives.length >= 2,
      isDisabled: false,
    },
    {
      id: "criteria-pairwise" as Step,
      name: "Criteria Comparisons",
      description: "Compare criteria importance",
      isComplete: criteriaPairwiseComplete,
      isDisabled: criteria.length < 2 || alternatives.length < 2,
    },
    {
      id: "alternatives-pairwise" as Step,
      name: "Alternative Comparisons",
      description: "Compare alternatives for each criterion",
      isComplete: alternativesPairwiseComplete,
      isDisabled: !criteriaPairwiseComplete,
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
    <nav className="bg-white rounded-lg shadow-md p-4">
      <h2 className="font-semibold text-lg mb-4 text-gray-700">AHP Steps</h2>
      <ol className="space-y-4">
        {steps.map((step) => (
          <li key={step.id}>
            <button
              onClick={() => !step.isDisabled && setCurrentStep(step.id)}
              disabled={step.isDisabled}
              className={`w-full text-left flex items-start p-3 rounded-md transition-colors ${
                currentStep === step.id
                  ? "bg-blue-50 text-blue-700"
                  : step.isDisabled
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="mr-3 mt-0.5">
                {step.isComplete ? <CheckCircle className="h-5 w-5 text-green-500" /> : <Circle className="h-5 w-5" />}
              </span>
              <div>
                <p className="font-medium">{step.name}</p>
                <p className="text-sm text-gray-500">{step.description}</p>
              </div>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  )
}
