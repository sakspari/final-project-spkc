"use client"

import { Radar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js"

// Register ChartJS components
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

interface RadarChartProps {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    isBest?: boolean
  }[]
}

export function RadarChart({ labels, datasets }: RadarChartProps) {
  // Generate colors for each dataset
  const colors = [
    { bg: "rgba(59, 130, 246, 0.2)", border: "rgb(59, 130, 246)" }, // blue
    { bg: "rgba(249, 115, 22, 0.2)", border: "rgb(249, 115, 22)" }, // orange
    { bg: "rgba(16, 185, 129, 0.2)", border: "rgb(16, 185, 129)" }, // green
    { bg: "rgba(236, 72, 153, 0.2)", border: "rgb(236, 72, 153)" }, // pink
    { bg: "rgba(139, 92, 246, 0.2)", border: "rgb(139, 92, 246)" }, // purple
    { bg: "rgba(239, 68, 68, 0.2)", border: "rgb(239, 68, 68)" }, // red
    { bg: "rgba(234, 179, 8, 0.2)", border: "rgb(234, 179, 8)" }, // yellow
  ]

  // Format the datasets with colors
  const formattedDatasets = datasets.map((dataset, index) => {
    // Use a special color for the best alternative
    const colorIndex = dataset.isBest ? 2 : index % colors.length

    return {
      label: dataset.label,
      data: dataset.data,
      backgroundColor: dataset.isBest
        ? "rgba(34, 197, 94, 0.2)" // green background for best
        : colors[colorIndex].bg,
      borderColor: dataset.isBest
        ? "rgb(22, 163, 74)" // green border for best
        : colors[colorIndex].border,
      borderWidth: dataset.isBest ? 2 : 1,
      pointBackgroundColor: dataset.isBest ? "rgb(22, 163, 74)" : colors[colorIndex].border,
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: dataset.isBest ? "rgb(22, 163, 74)" : colors[colorIndex].border,
    }
  })

  const data = {
    labels,
    datasets: formattedDatasets,
  }

  const options: ChartOptions<"radar"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${Number.parseFloat(context.formattedValue).toFixed(4)}`,
        },
      },
    },
    scales: {
      r: {
        angleLines: {
          display: true,
        },
        suggestedMin: 0,
      },
    },
  }

  return <Radar data={data} options={options} />
}
