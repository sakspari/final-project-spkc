"use client"

import { useAHP } from "@/context/ahp-context"
import { formatNumber } from "@/lib/ahp"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"
// import ExportExcelButton from "@/components/ahp/export-excel-button"
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
    return <div className="text-gray-900 dark:text-gray-100">Loading...</div>
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
  console.log(finalRanking)
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">AHP Results</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Below are the final results of your AHP analysis, showing the ranking of alternatives based on your criteria
          weights and judgments.
          <span className="italic">{` please reload the page if you start a new analysis to make sure the program calculating in fresh condition`}</span>
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
          {/* <ExportExcelButton /> */}
        </div>

        {/* textual result */}
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md flex items-start mb-6 border dark:border-green-800">
          <CheckCircle className="h-12 w-12 text-green-500 -mt-3 mr-2" />
          <div>
            <h3 className="font-medium text-green-700 dark:text-green-300">Textual Result</h3>
            <p className="text-green-600 dark:text-green-400 text-sm mt-1">
              The application of the AHP method resulted in a clear ranking of the alternatives, with{" "}
              <span className="font-bold">{` ${
                alternatives.find((a) => a.id === finalRanking[0].alternativeId)?.name
              } `}</span>{" "}
              securing the highest position. Its cumulative score of{" "}
              <span className="font-bold">{` ${formatNumber(finalRanking[0].score, 3)} `}</span> underscores its
              superiority, making it the most highly recommended solution based on the established criteria. Based on
              the calculation using AHP method, the highest rank is the best alternative
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-gray-100">Final Rankings</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Alternatives ranked by their overall scores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-900 dark:text-gray-100">Rank</TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100">Alternative</TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100">Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {finalRanking.map((item, index) => {
                    const alt = alternatives.find((a) => a.id === item.alternativeId)
                    return (
                      <TableRow key={item.alternativeId}>
                        <TableCell className="font-medium text-gray-900 dark:text-gray-100">{index + 1}</TableCell>
                        <TableCell className="text-gray-900 dark:text-gray-100">
                          {alt ? alt.name : item.alternativeId}
                        </TableCell>
                        <TableCell className="text-gray-900 dark:text-gray-100">
                          {formatNumber(item.score, 4)}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-gray-100">Visualization</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Bar chart showing the relative scores of alternatives
              </CardDescription>
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
        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">Criteria Weights</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-900 dark:text-gray-100">Criterion</TableHead>
              <TableHead className="text-gray-900 dark:text-gray-100">Type</TableHead>
              <TableHead className="text-gray-900 dark:text-gray-100">Weight</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {criteria.map((criterion, index) => (
              <TableRow key={criterion.id}>
                <TableCell className="text-gray-900 dark:text-gray-100">{criterion.name}</TableCell>
                <TableCell>
                  {criterion.isQuantitative ? (
                    <Badge
                      variant="outline"
                      className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300"
                    >
                      Quantitative {criterion.isCost ? "(Cost)" : "(Benefit)"}
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                    >
                      Qualitative
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-gray-900 dark:text-gray-100">
                  {formatNumber(criteriaPairwise?.priorityVector?.[index] ?? 0, 4)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">Alternative Scores by Criterion</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-900 dark:text-gray-100">Alternative</TableHead>
              {criteria.map((criterion) => (
                <TableHead key={criterion.id} className="text-gray-900 dark:text-gray-100">
                  {criterion.name}
                  {criterion.isQuantitative && (
                    <div className="text-xs font-normal mt-1 text-gray-600 dark:text-gray-400">
                      {criterion.isCost ? "Cost" : "Benefit"} ({criterion.normalizationType})
                    </div>
                  )}
                </TableHead>
              ))}
              <TableHead className="text-gray-900 dark:text-gray-100">Overall Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alternatives.map((alternative) => {
              const ranking = finalRanking.find((item) => item.alternativeId === alternative.id)
              return (
                <TableRow key={alternative.id}>
                  <TableCell className="font-medium text-gray-900 dark:text-gray-100">{alternative.name}</TableCell>
                  {criteria.map((criterion, criterionIndex) => {
                    const matrix = alternativesPairwise.find((m) => m.criterionId === criterion.id)
                    const altIndex = alternatives.findIndex((a) => a.id === alternative.id)
                    const score = matrix ? matrix.priorityVector[altIndex] : 0
                    return (
                      <TableCell key={criterion.id} className="text-gray-900 dark:text-gray-100">
                        {formatNumber(score ?? 0, 4)}
                      </TableCell>
                    )
                  })}
                  <TableCell className="font-semibold text-gray-900 dark:text-gray-100">
                    {ranking ? formatNumber(ranking.score ?? 0, 4) : "N/A"}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md flex items-start border dark:border-green-800">
        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
        <div>
          <h3 className="font-medium text-green-700 dark:text-green-300">Analysis Complete</h3>
          <p className="text-green-600 dark:text-green-400 text-sm mt-1">
            Your AHP analysis is complete. You can now use these results to make an informed decision. If you want to
            make changes, you can go back to previous steps and update your inputs.
          </p>
        </div>
      </div>
    </div>
  )
}
