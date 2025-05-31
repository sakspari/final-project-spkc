"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useProfileMatchingStore } from "@/lib/pm/store"
import { Badge } from "@/components/ui/badge"

export function StepDisplay() {
  const { calculationResults, alternatives, criteria } = useProfileMatchingStore()

  if (!calculationResults) return null

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="step1">
        <AccordionTrigger>Step 1-2: Criteria and Factor Grouping</AccordionTrigger>
        <AccordionContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Criterion</TableHead>
                <TableHead>Factor Type</TableHead>
                <TableHead>Ideal Value</TableHead>
                <TableHead>Value Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {criteria.map((criterion) => (
                <TableRow key={criterion.id}>
                  <TableCell>{criterion.name}</TableCell>
                  <TableCell>
                    {criterion.factorType === "core" && <Badge>Core Factor</Badge>}
                    {criterion.factorType === "secondary" && <Badge variant="outline">Secondary Factor</Badge>}
                    {criterion.factorType === "none" && <span className="text-muted-foreground">Not assigned</span>}
                  </TableCell>
                  <TableCell>{criterion.idealValue}</TableCell>
                  <TableCell>{criterion.isRange ? "Range" : "Single Value"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="step3">
        <AccordionTrigger>Step 3: Factor Weights</AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border rounded-md">
              <div className="text-lg font-medium">Core Factor Weight</div>
              <div className="text-3xl font-bold">{calculationResults.weights.coreFactorWeight}%</div>
            </div>
            <div className="p-4 border rounded-md">
              <div className="text-lg font-medium">Secondary Factor Weight</div>
              <div className="text-3xl font-bold">{calculationResults.weights.secondaryFactorWeight}%</div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="step4-5">
        <AccordionTrigger>Step 4-5: Ideal Profile and Candidate Data</AccordionTrigger>
        <AccordionContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Criterion</TableHead>
                <TableHead>Ideal Value</TableHead>
                {alternatives.map((alt) => (
                  <TableHead key={alt.id}>{alt.name}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {criteria.map((criterion) => (
                <TableRow key={criterion.id}>
                  <TableCell>{criterion.name}</TableCell>
                  <TableCell>{criterion.idealValue}</TableCell>
                  {alternatives.map((alt) => (
                    <TableCell key={`${alt.id}-${criterion.id}`}>
                      {criterion.isRange
                        ? `[${(alt.values[criterion.id] as [number, number])?.[0] || 0}, ${(alt.values[criterion.id] as [number, number])?.[1] || 0}]`
                        : alt.values[criterion.id]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="step6">
        <AccordionTrigger>Step 6: Gap Calculation</AccordionTrigger>
        <AccordionContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Alternative</TableHead>
                {criteria.map((criterion) => (
                  <TableHead key={criterion.id}>{criterion.name}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {calculationResults.gapValues.map((gapRow, index) => (
                <TableRow key={index}>
                  <TableCell>{alternatives[index].name}</TableCell>
                  {Object.entries(gapRow).map(([critId, gap]) => (
                    <TableCell key={critId}>
                      {typeof gap === "object" && gap.interpolation !== undefined ? (
                        <div>
                          <div>{gap.gap.toFixed(2)}</div>
                          <div className="text-xs text-muted-foreground">
                            (Interpolation: {gap.interpolation.toFixed(2)})
                          </div>
                        </div>
                      ) : (
                        <span className={Number(gap) < 0 ? "text-red-500 font-medium" : ""}>
                          {typeof gap === "number" ? gap.toFixed(2) : gap}
                        </span>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="step7">
        <AccordionTrigger>Step 7: Gap Weights</AccordionTrigger>
        <AccordionContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Alternative</TableHead>
                {criteria.map((criterion) => (
                  <TableHead key={criterion.id}>{criterion.name}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {calculationResults.weightedGaps.map((weightedRow, index) => (
                <TableRow key={index}>
                  <TableCell>{alternatives[index].name}</TableCell>
                  {Object.entries(weightedRow).map(([critId, weight]) => (
                    <TableCell key={critId}>
                      <span className={Number(weight) < 0 ? "text-red-500 font-medium" : ""}>
                        {typeof weight === "number" ? weight.toFixed(2) : weight}
                      </span>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="step8">
        <AccordionTrigger>Step 8: Core and Secondary Factor Averages</AccordionTrigger>
        <AccordionContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Alternative</TableHead>
                <TableHead>Core Factor Average (ACF)</TableHead>
                <TableHead>Secondary Factor Average (ASF)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {calculationResults.factorAverages.map((avg, index) => (
                <TableRow key={index}>
                  <TableCell>{alternatives[index].name}</TableCell>
                  <TableCell>{avg.coreFactorAvg.toFixed(2)}</TableCell>
                  <TableCell>{avg.secondaryFactorAvg.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="step9-10">
        <AccordionTrigger>Step 9-10: Total Scores and Ranking</AccordionTrigger>
        <AccordionContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Alternative</TableHead>
                <TableHead>Total Score</TableHead>
                <TableHead>Calculation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {calculationResults.finalRanking.map((rank) => {
                const alt = alternatives.find((a) => a.id === rank.alternativeId)
                const factorAvg = calculationResults.factorAverages.find(
                  (avg, idx) => alternatives[idx].id === rank.alternativeId,
                )

                return (
                  <TableRow key={rank.alternativeId}>
                    <TableCell>{rank.rank}</TableCell>
                    <TableCell>{alt?.name}</TableCell>
                    <TableCell className="font-bold">{rank.totalScore.toFixed(2)}</TableCell>
                    <TableCell className="text-sm">
                      {factorAvg ? (
                        <>
                          ({calculationResults.weights.coreFactorWeight}% × {factorAvg.coreFactorAvg.toFixed(2)}) + (
                          {calculationResults.weights.secondaryFactorWeight}% ×{" "}
                          {factorAvg.secondaryFactorAvg.toFixed(2)})
                        </>
                      ) : null}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
