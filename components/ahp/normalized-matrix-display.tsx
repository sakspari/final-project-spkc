"use client"

import { formatNumber } from "@/lib/ahp"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Item {
  id: string
  name: string
}

interface NormalizedMatrixDisplayProps {
  items: Item[]
  matrix: number[][]
  priorityVector: number[]
  rawValues?: number[]
  normalizedValues?: number[]
  isQuantitative?: boolean
}

export default function NormalizedMatrixDisplay({
  items,
  matrix,
  priorityVector,
  rawValues,
  normalizedValues,
  isQuantitative = false,
}: NormalizedMatrixDisplayProps) {
  // For quantitative criteria, display raw and normalized values
  if (isQuantitative && rawValues && normalizedValues) {
    return (
      <div className="space-y-6">
        <div className="overflow-x-auto">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Quantitative Values and Priorities</h4>
          <Table className="border">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Alternative</TableHead>
                <TableHead className="text-center">Raw Value</TableHead>
                <TableHead className="text-center">Normalized Value</TableHead>
                <TableHead className="text-center bg-blue-50">Priority</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-center">
                    {rawValues && index < rawValues.length ? rawValues[index] : 0}
                  </TableCell>
                  <TableCell className="text-center">
                    {normalizedValues && index < normalizedValues.length
                      ? formatNumber(normalizedValues[index], 4)
                      : formatNumber(0, 4)}
                  </TableCell>
                  <TableCell className="text-center font-semibold bg-blue-50">
                    {priorityVector && index < priorityVector.length
                      ? formatNumber(priorityVector[index], 4)
                      : formatNumber(0, 4)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-2">Priority Vector (Weights)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item, index) => (
              <div key={item.id} className="bg-white border rounded-md p-4 flex flex-col items-center">
                <div className="text-sm text-gray-500 mb-1">{item.name}</div>
                <div className="text-lg font-semibold">
                  {priorityVector && index < priorityVector.length
                    ? formatNumber(priorityVector[index], 4)
                    : formatNumber(0, 4)}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{
                      width: `${(priorityVector && index < priorityVector.length ? priorityVector[index] : 0) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // For qualitative criteria, calculate and display normalized matrix
  // Calculate column sums for normalization
  const colSums: number[] = Array(items.length).fill(0)
  for (let j = 0; j < items.length; j++) {
    for (let i = 0; i < items.length; i++) {
      colSums[j] += matrix[i][j]
    }
  }

  // Calculate normalized matrix
  const normalizedMatrix: number[][] = []
  for (let i = 0; i < items.length; i++) {
    normalizedMatrix[i] = []
    for (let j = 0; j < items.length; j++) {
      normalizedMatrix[i][j] = matrix[i][j] / colSums[j]
    }
  }

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <h4 className="text-sm font-medium text-gray-500 mb-2">Normalized Matrix</h4>
        <Table className="border">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Item</TableHead>
              {items.map((item) => (
                <TableHead key={item.id} className="text-center">
                  {item.name}
                </TableHead>
              ))}
              <TableHead className="text-center bg-blue-50">Priority</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((rowItem, rowIndex) => (
              <TableRow key={rowItem.id}>
                <TableCell className="font-medium">{rowItem.name}</TableCell>
                {items.map((colItem, colIndex) => (
                  <TableCell key={colItem.id} className="text-center">
                    {normalizedMatrix &&
                    rowIndex < normalizedMatrix.length &&
                    normalizedMatrix[rowIndex] &&
                    colIndex < normalizedMatrix[rowIndex].length
                      ? formatNumber(normalizedMatrix[rowIndex][colIndex], 4)
                      : formatNumber(0, 4)}
                  </TableCell>
                ))}
                <TableCell className="text-center font-semibold bg-blue-50">
                  {formatNumber(priorityVector?.[rowIndex] ?? 0, 4)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-500 mb-2">Priority Vector (Weights)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, index) => (
            <div key={item.id} className="bg-white border rounded-md p-4 flex flex-col items-center">
              <div className="text-sm text-gray-500 mb-1">{item.name}</div>
              <div className="text-lg font-semibold">{formatNumber(priorityVector?.[index] ?? 0, 4)}</div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${(priorityVector?.[index] ?? 0) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
