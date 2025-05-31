"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useProfileMatchingStore } from "@/lib/pm/store"
import { StepDisplay } from "@/components/profile-matching/step-display"
import { ResultsChart } from "@/components/profile-matching/results-chart"

interface ResultsDisplayProps {
  onReset: () => void
}

export function ResultsDisplay({ onReset }: ResultsDisplayProps) {
  const { calculationResults } = useProfileMatchingStore()

  if (!calculationResults) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No calculation results available. Please input data and calculate first.
        </p>
        <Button onClick={onReset} className="mt-4">
          Go to Input
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile Matching Results</CardTitle>
          <CardDescription>The results of the profile matching calculation are displayed below</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <StepDisplay />

            <div className="mt-6 p-4 bg-muted rounded-md">
              <h3 className="text-lg font-medium mb-2">About Gap Calculation</h3>
              <p className="text-sm text-muted-foreground mb-2">
                For range-based criteria, the gap calculation uses linear interpolation:
              </p>
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                <li>If the ideal value is within the range [x1, x2], the gap is 0.</li>
                <li>If the ideal value is outside the range, we use linear interpolation to calculate the gap.</li>
                <li>
                  For values below the range (ideal &lt; x1), the gap is calculated using interpolation with likeness
                  score 1 at x1 and 5 at x2.
                </li>
                <li>
                  For values above the range (ideal &gt; x2), the gap is calculated using interpolation with likeness
                  score 5 at x1 and 1 at x2.
                </li>
                <li>The interpolated value (e.g., 0.33) is used directly as the gap value.</li>
              </ul>
            </div>

            <div className="h-[400px] mt-8">
              <h3 className="text-lg font-medium mb-4">Results Visualization</h3>
              <ResultsChart />
            </div>

            <div className="flex justify-end">
              <Button onClick={onReset} variant="outline">
                Reset & Start Over
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
