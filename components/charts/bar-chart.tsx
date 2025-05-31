"use client"

import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface BarChartProps {
  labels: string[]
  scores: number[]
  bestIndex?: number
}

export function BarChart({ labels, scores, bestIndex }: BarChartProps) {
  // Create background colors array with the best alternative highlighted
  const backgroundColor = scores.map(
    (_, index) =>
      index === bestIndex
        ? "rgba(34, 197, 94, 0.6)" // green for best
        : "rgba(59, 130, 246, 0.6)", // blue for others
  )

  const borderColor = scores.map(
    (_, index) =>
      index === bestIndex
        ? "rgb(22, 163, 74)" // green border for best
        : "rgb(37, 99, 235)", // blue border for others
  )

  const data = {
    labels,
    datasets: [
      {
        label: "Relative Closeness Score",
        data: scores,
        backgroundColor,
        borderColor,
        borderWidth: 1,
      },
    ],
  }

  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => `Score: ${context.formattedValue}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
        title: {
          display: true,
          text: "Relative Closeness (S)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Alternatives",
        },
      },
    },
  }

  return <Bar data={data} options={options} />
}
