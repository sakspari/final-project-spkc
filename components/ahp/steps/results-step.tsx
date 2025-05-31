"use client"

import { useAHP } from "@/context/ahp-context"
import { formatNumber } from "@/lib/ahp"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"
import ExportExcelButton from "@/components/ahp/export-excel-button"
import { Badge } from "@/components/ui/badge"

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function ResultsStep() {
  const {
    criteria,
    alternatives,
    criteriaPairwise,
    alternativesPairwise,
    finalRanking,
    criteriaPairwiseComplete,
    alternativesPairwiseComplete,
  } = useAHP()

  if (!criteriaPairwiseComplete || !alternativesPairwiseComplete) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Incomplete Data</AlertTitle>
        <AlertDescription>Please complete all pairwise comparisons before viewing the results.</AlertDescription>
      </Alert>
    )
  }

  if (!criteriaPairwise) {
    return <div>Loading...</div>
  }

  // Check if any matrix has inconsistent judgments
  const hasInconsistentJudgments =
    (criteriaPairwise.consistencyRatio > 0.1 && criteria.length > 2) ||
    alternativesPairwise
      .filter((matrix) => !criteria.find((c) => c.id === matrix.criterionId)?.isQuantitative)
      .some((matrix) => matrix.consistencyRatio > 0.1 && alternatives.length > 2)

  // Prepare data for the chart
  const chartData = {
    labels: finalRanking.map((item) => {
      const alt = alternatives.find((a) => a.id === item.alternativeId)
      return alt ? alt.name : item.alternativeId
    }),
    datasets: [
      {
        label: "Score",
        data: finalRanking.map((item) => item.score),
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        borderColor: "rgba(53, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Alternative Rankings",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Score",
        },
      },
    },
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">AHP Results</h2>
        <p className="text-gray-600 mb-6">
          Below are the final results of your AHP analysis, showing the ranking of alternatives based on your criteria
          weights and judgments.
        </p>

        <div className="flex justify-between items-center mb-6">
          <div>
            {hasInconsistentJudgments && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Warning: Inconsistent Judgments</AlertTitle>
                <AlertDescription>
                  Some of your pairwise comparisons have consistency ratios greater than 0.1, which may affect the
                  reliability of your results. Consider going back to revise your comparisons.
                </AlertDescription>
              </Alert>
            )}
          </div>
          <ExportExcelButton />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Final Rankings</CardTitle>
              <CardDescription>Alternatives ranked by their overall scores</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Alternative</TableHead>
                    <TableHead>Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {finalRanking.map((item, index) => {
                    const alt = alternatives.find((a) => a.id === item.alternativeId)
                    return (
                      <TableRow key={item.alternativeId}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{alt ? alt.name : item.alternativeId}</TableCell>
                        <TableCell>{formatNumber(item.score, 4)}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Visualization</CardTitle>
              <CardDescription>Bar chart showing the relative scores of alternatives</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <Bar data={chartData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Criteria Weights</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Criterion</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Weight</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {criteria.map((criterion, index) => (
              <TableRow key={criterion.id}>
                <TableCell>{criterion.name}</TableCell>
                <TableCell>
                  {criterion.isQuantitative ? (
                    <Badge variant="outline" className="bg-blue-50">
                      Quantitative {criterion.isCost ? "(Cost)" : "(Benefit)"}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-gray-50">
                      Qualitative
                    </Badge>
                  )}
                </TableCell>
                <TableCell>{formatNumber(criteriaPairwise?.priorityVector?.[index] ?? 0, 4)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Alternative Scores by Criterion</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Alternative</TableHead>
              {criteria.map((criterion) => (
                <TableHead key={criterion.id}>
                  {criterion.name}
                  {criterion.isQuantitative && (
                    <div className="text-xs font-normal mt-1">
                      {criterion.isCost ? "Cost" : "Benefit"} ({criterion.normalizationType})
                    </div>
                  )}
                </TableHead>
              ))}
              <TableHead>Overall Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alternatives.map((alternative) => {
              const ranking = finalRanking.find((item) => item.alternativeId === alternative.id)
              return (
                <TableRow key={alternative.id}>
                  <TableCell className="font-medium">{alternative.name}</TableCell>
                  {criteria.map((criterion, criterionIndex) => {
                    const matrix = alternativesPairwise.find((m) => m.criterionId === criterion.id)
                    const altIndex = alternatives.findIndex((a) => a.id === alternative.id)
                    const score = matrix ? matrix.priorityVector[altIndex] : 0
                    return <TableCell key={criterion.id}>{formatNumber(score ?? 0, 4)}</TableCell>
                  })}
                  <TableCell className="font-semibold">
                    {ranking ? formatNumber(ranking.score ?? 0, 4) : "N/A"}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <div className="bg-green-50 p-4 rounded-md flex items-start">
        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
        <div>
          <h3 className="font-medium text-green-700">Analysis Complete</h3>
          <p className="text-green-600 text-sm mt-1">
            Your AHP analysis is complete. You can now use these results to make an informed decision. If you want to
            make changes, you can go back to previous steps and update your inputs.
          </p>
        </div>
      </div>
    </div>
  )
}
