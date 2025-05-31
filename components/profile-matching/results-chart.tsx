"use client"

import { useProfileMatchingStore } from "@/lib/pm/store"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export function ResultsChart() {
  const { calculationResults, alternatives } = useProfileMatchingStore()

  if (!calculationResults) return null

  // Prepare data for the chart
  const chartData = calculationResults.finalRanking.map((rank) => {
    const alt = alternatives.find((a) => a.id === rank.alternativeId)
    return {
      name: alt?.name,
      score: Number.parseFloat(rank.totalScore.toFixed(2)),
    }
  })

  // Sort by score descending
  chartData.sort((a, b) => b.score - a.score)

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 60,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
        <YAxis domain={["auto", "auto"]} label={{ value: "Score", angle: -90, position: "insideLeft" }} />
        <Tooltip formatter={(value) => [`${value}`, "Score"]} />
        <Legend />
        <Bar
          dataKey="score"
          fill="hsl(var(--primary))"
          name="Total Score"
          isAnimationActive={true}
          // Add custom styling for bars
          shape={(props) => {
            const { x, y, width, height, value } = props
            return (
              <rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill={value < 0 ? "hsl(var(--destructive))" : "hsl(var(--primary))"}
                radius={[4, 4, 0, 0]}
              />
            )
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
