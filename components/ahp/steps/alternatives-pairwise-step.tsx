"use client"

import { useState } from "react"
import { useAHP } from "@/context/ahp-context"
import PairwiseComparisonMatrix from "@/components/ahp/pairwise-comparison-matrix"
import NormalizedMatrixDisplay from "@/components/ahp/normalized-matrix-display"
import ConsistencyCheck from "@/components/ahp/consistency-check"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import QuantitativeDataInput from "@/components/ahp/quantitative-data-input"

export default function AlternativesPairwiseStep() {
  const { criteria, alternatives, alternativesPairwise, alternativesPairwiseComplete } = useAHP()
  const [currentCriterionId, setCurrentCriterionId] = useState<string>(criteria[0]?.id || "")

  const currentMatrix = alternativesPairwise.find((matrix) => matrix.criterionId === currentCriterionId)
  const currentCriterion = criteria.find((c) => c.id === currentCriterionId)

  if (!currentMatrix || !currentCriterion) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Alternative Comparisons</h2>
        <p className="text-gray-600 mb-6">
          {currentCriterion.isQuantitative
            ? "For each quantitative criterion, numerical values are automatically normalized to calculate priorities."
            : "For each criterion, compare the relative performance of each alternative against every other alternative."}
          Select a criterion tab below to make comparisons for that criterion.
        </p>

        <Tabs
          defaultValue={criteria[0]?.id}
          value={currentCriterionId}
          onValueChange={setCurrentCriterionId}
          className="w-full"
        >
          <TabsList className="w-full overflow-x-auto flex-wrap">
            {criteria.map((criterion) => (
              <TabsTrigger key={criterion.id} value={criterion.id} className="flex-1">
                {criterion.name}
                {criterion.isQuantitative ? " (Quant)" : ""}
              </TabsTrigger>
            ))}
          </TabsList>

          {criteria.map((criterion) => {
            const matrix = alternativesPairwise.find((matrix) => matrix.criterionId === criterion.id)

            if (!matrix) return null

            return (
              <TabsContent key={criterion.id} value={criterion.id} className="pt-4">
                <h3 className="text-lg font-semibold mb-3">
                  Comparing Alternatives for: {criterion.name}
                  {criterion.isQuantitative &&
                    ` (${criterion.isCost ? "Cost" : "Benefit"}, ${criterion.normalizationType} normalization)`}
                </h3>

                {criterion.isQuantitative ? (
                  <QuantitativeDataInput criterion={criterion} alternatives={alternatives} />
                ) : (
                  <PairwiseComparisonMatrix
                    items={alternatives}
                    matrix={matrix.matrix}
                    onValueChange={() => {}} // This is handled by the context
                    type="alternatives"
                    criterionId={criterion.id}
                  />
                )}

                {matrix.priorityVector.some((v) => v > 0) && (
                  <>
                    <div className="mt-8">
                      <h4 className="text-md font-semibold mb-3">Alternative Weights for {criterion.name}</h4>
                      <NormalizedMatrixDisplay
                        items={alternatives}
                        matrix={matrix.matrix}
                        priorityVector={matrix.priorityVector}
                        rawValues={matrix.rawValues}
                        normalizedValues={matrix.normalizedValues}
                        isQuantitative={criterion.isQuantitative}
                      />
                    </div>

                    {!criterion.isQuantitative && (
                      <div className="mt-8">
                        <h4 className="text-md font-semibold mb-3">Consistency Check for {criterion.name}</h4>
                        <ConsistencyCheck matrix={matrix} items={alternatives} />

                        {!matrix.isConsistent && matrix.consistencyRatio > 0.1 && (
                          <Alert variant="destructive" className="mt-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Inconsistent Judgments</AlertTitle>
                            <AlertDescription>
                              Your consistency ratio for {criterion.name} is {matrix.consistencyRatio.toFixed(3)}, which
                              is greater than 0.1. Consider revising your pairwise comparisons to improve consistency.
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    )}
                  </>
                )}
              </TabsContent>
            )
          })}
        </Tabs>
      </div>

      {!alternativesPairwiseComplete && (
        <Alert className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Complete All Comparisons</AlertTitle>
          <AlertDescription>
            Please complete all pairwise comparisons for each criterion to proceed to the results.
          </AlertDescription>
        </Alert>
      )}

      <div className="bg-blue-50 p-4 rounded-md">
        <h3 className="font-medium text-blue-700">Next Steps</h3>
        <p className="text-blue-600 text-sm mt-1">
          After completing all alternative comparisons, proceed to the results step to see the final rankings.
        </p>
      </div>
    </div>
  )
}
