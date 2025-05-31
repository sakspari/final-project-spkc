"use client"

import { useAHP } from "@/context/ahp-context"
import PairwiseComparisonMatrix from "@/components/ahp/pairwise-comparison-matrix"
import NormalizedMatrixDisplay from "@/components/ahp/normalized-matrix-display"
import ConsistencyCheck from "@/components/ahp/consistency-check"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function CriteriaPairwiseStep() {
  const { criteria, criteriaPairwise, criteriaPairwiseComplete } = useAHP()

  if (!criteriaPairwise) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Criteria Pairwise Comparisons</h2>
        <p className="text-gray-600 mb-6">
          Compare the relative importance of each criterion against every other criterion using the AHP scale. For each
          pair, select how much more important the row criterion is compared to the column criterion.
        </p>

        <PairwiseComparisonMatrix
          items={criteria}
          matrix={criteriaPairwise.matrix}
          onValueChange={() => {}} // This is handled by the context
          type="criteria"
        />
      </div>

      {criteriaPairwiseComplete && (
        <>
          <div>
            <h3 className="text-lg font-semibold mb-3">Criteria Weights</h3>
            <NormalizedMatrixDisplay
              items={criteria}
              matrix={criteriaPairwise.matrix}
              priorityVector={criteriaPairwise.priorityVector}
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Consistency Check</h3>
            <ConsistencyCheck matrix={criteriaPairwise} items={criteria} />

            {!criteriaPairwise.isConsistent && criteriaPairwise.consistencyRatio > 0.1 && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Inconsistent Judgments</AlertTitle>
                <AlertDescription>
                  Your consistency ratio is {criteriaPairwise.consistencyRatio.toFixed(3)}, which is greater than 0.1.
                  Consider revising your pairwise comparisons to improve consistency.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </>
      )}

      {!criteriaPairwiseComplete && (
        <Alert className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Complete All Comparisons</AlertTitle>
          <AlertDescription>
            Please complete all pairwise comparisons to see the criteria weights and consistency check.
          </AlertDescription>
        </Alert>
      )}

      <div className="bg-blue-50 p-4 rounded-md">
        <h3 className="font-medium text-blue-700">Next Steps</h3>
        <p className="text-blue-600 text-sm mt-1">
          After completing the criteria comparisons, proceed to the next step to compare alternatives with respect to
          each criterion.
        </p>
      </div>
    </div>
  )
}
