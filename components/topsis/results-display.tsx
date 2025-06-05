"use client";

import { useState } from "react";
import type { TopsisResult } from "@/lib/types/topsis";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { BarChart } from "@/components/charts/bar-chart";
import { RadarChart } from "@/components/charts/radar-chart";
import { Download } from "lucide-react";
import { exportToPDF } from "@/lib/topsis/export-utils";

interface ResultsDisplayProps {
  results: TopsisResult;
}

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
  const [exportLoading, setExportLoading] = useState(false);

  const handleExport = async () => {
    setExportLoading(true);
    try {
      await exportToPDF("topsis-results", "TOPSIS_Results");
    } catch (error) {
      console.error("Error exporting to PDF:", error);
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div id="topsis-results" className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">TOPSIS Results</h2>
        {/* <Button onClick={handleExport} disabled={exportLoading}>
          <Download className="mr-2 h-4 w-4" />
          {exportLoading ? "Exporting..." : "Export to PDF"}
        </Button> */}
      </div>

      <Tabs defaultValue="matrices" className="w-full">
        <TabsList className="grid w-full md:w-[600px] grid-cols-4">
          <TabsTrigger value="matrices">Matrices</TabsTrigger>
          <TabsTrigger value="ideals">Ideal Solutions</TabsTrigger>
          <TabsTrigger value="distances">Distances</TabsTrigger>
          <TabsTrigger value="ranking">Ranking</TabsTrigger>
        </TabsList>

        <TabsContent value="matrices" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Decision Matrix</CardTitle>
              <CardDescription>
                The original input values for each alternative and criterion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MatrixTable
                matrix={results.decisionMatrix}
                rowLabels={results.alternatives}
                colLabels={results.criteria}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Normalized Matrix</CardTitle>
              <CardDescription>
                Values normalized using vector normalization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MatrixTable
                matrix={results.normalizedMatrix}
                rowLabels={results.alternatives}
                colLabels={results.criteria}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weighted Normalized Matrix</CardTitle>
              <CardDescription>
                Normalized values multiplied by their respective weights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MatrixTable
                matrix={results.weightedMatrix}
                rowLabels={results.alternatives}
                colLabels={results.criteria}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ideals" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Ideal Solutions</CardTitle>
              <CardDescription>
                Positive ideal (best) and negative ideal (worst) solutions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Solution Type</TableHead>
                    {results.criteria.map((criterion, index) => (
                      <TableHead key={`ideal-header-${index}`}>
                        {criterion}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Positive Ideal (A+)
                    </TableCell>
                    {results.positiveIdeal.map((value, index) => (
                      <TableCell key={`positive-${index}`}>
                        {value.toFixed(4)}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Negative Ideal (A-)
                    </TableCell>
                    {results.negativeIdeal.map((value, index) => (
                      <TableCell key={`negative-${index}`}>
                        {value.toFixed(4)}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Criteria Types</CardTitle>
              <CardDescription>
                Type of each criterion (benefit or cost)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    {results.criteria.map((criterion, index) => (
                      <TableHead key={`type-header-${index}`}>
                        {criterion}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    {results.types.map((type, index) => (
                      <TableCell key={`type-${index}`} className="capitalize">
                        {type}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distances" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Separation Measures</CardTitle>
              <CardDescription>
                Distances from each alternative to the ideal solutions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Alternative</TableHead>
                    <TableHead>Distance to Positive Ideal (D+)</TableHead>
                    <TableHead>Distance to Negative Ideal (D-)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.alternatives.map((alt, index) => (
                    <TableRow key={`distance-${index}`}>
                      <TableCell className="font-medium">{alt}</TableCell>
                      <TableCell>
                        {results.distances.positive[index].toFixed(4)}
                      </TableCell>
                      <TableCell>
                        {results.distances.negative[index].toFixed(4)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ranking" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Relative Closeness and Ranking</CardTitle>
              <CardDescription>
                Final scores and ranking of alternatives
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Alternative</TableHead>
                    <TableHead>Relative Closeness (S)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.ranking.map((rank, index) => (
                    <TableRow
                      key={`rank-${index}`}
                      className={index === 0 ? "bg-primary/10" : ""}
                    >
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{results.alternatives[rank.index]}</TableCell>
                      <TableCell>{rank.score.toFixed(4)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
{/* textual result */}
              <div className="mt-6 p-4 bg-green-300/10 rounded-lg">
              <h3 className="font-bold">Conclusion</h3>
                <p className="text-md">
                  The calculation using TOPSIS shows that Alternative <span className="font-bold"> {` ${results.alternatives[results.ranking[0].index]} `} </span> is the
                  best choice. It achieved score of <span>{ ` ${results.ranking[0].score.toFixed(4)}, ` }</span> the highest relative closeness score,
                  indicating it is the closest to the ideal solution and
                  farthest from the worst solution based on the given criteria,
                  their weights, and the performance data. In this specific
                  setup, <span className="font-bold"> {` ${results.alternatives[results.ranking[0].index]} `} </span> is the Best solution.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Relative Closeness Scores</CardTitle>
                <CardDescription>
                  Visual comparison of alternatives by their scores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart
                  labels={results.alternatives}
                  scores={results.scores}
                  bestIndex={results.ranking[0].index}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Criteria Comparison</CardTitle>
                <CardDescription>
                  Radar chart comparing alternatives across criteria
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadarChart
                  labels={results.criteria}
                  datasets={results.alternatives.map((alt, i) => ({
                    label: alt,
                    data: results.weightedMatrix[i],
                    isBest: i === results.ranking[0].index,
                  }))}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface MatrixTableProps {
  matrix: number[][];
  rowLabels: string[];
  colLabels: string[];
}

function MatrixTable({ matrix, rowLabels, colLabels }: MatrixTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]"></TableHead>
            {colLabels.map((label, index) => (
              <TableHead key={`col-${index}`}>{label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {matrix.map((row, rowIndex) => (
            <TableRow key={`row-${rowIndex}`}>
              <TableCell className="font-medium">
                {rowLabels[rowIndex]}
              </TableCell>
              {row.map((value, colIndex) => (
                <TableCell key={`cell-${rowIndex}-${colIndex}`}>
                  {value.toFixed(4)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
