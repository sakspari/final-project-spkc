"use client"

import { formatNumber } from "@/lib/ahp"
import { CheckCircle, XCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Item {
  id: string
  name: string
}

interface Matrix {
  matrix: number[][]
  priorityVector: number[]
  consistencyRatio: number
  consistencyIndex: number
  lambdaMax: number
  randomIndex: number
  weightedSumVector: number[]
  isConsistent: boolean
}

interface ConsistencyCheckProps {
  matrix: Matrix
  items: Item[]
}

export default function ConsistencyCheck({ matrix, items }: ConsistencyCheckProps) {
  const n = items.length

  // If n <= 2, consistency is always perfect
  if (n <= 2) {
    return (
      <div className="bg-green-50 p-4 rounded-md flex items-center">
        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
        <div>
          <p className="text-green-700 font-medium">Consistency is perfect for {n} items.</p>
          <p className="text-green-600 text-sm">With only {n} items, the consistency ratio is always 0.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <h4 className="text-sm font-medium text-gray-500 mb-2">Weighted Sum Vector</h4>
        <Table className="border">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Item</TableHead>
              <TableHead>Priority (w)</TableHead>
              <TableHead>Weighted Sum (Aw)</TableHead>
              <TableHead>Ratio (Aw/w)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>
                  {formatNumber(
                    matrix.priorityVector && index < matrix.priorityVector.length ? matrix.priorityVector[index] : 0,
                    4,
                  )}
                </TableCell>
                <TableCell>
                  {formatNumber(
                    matrix.weightedSumVector && index < matrix.weightedSumVector.length
                      ? matrix.weightedSumVector[index]
                      : 0,
                    4,
                  )}
                </TableCell>
                <TableCell>
                  {formatNumber(
                    matrix.weightedSumVector &&
                      index < matrix.weightedSumVector.length &&
                      matrix.priorityVector &&
                      index < matrix.priorityVector.length &&
                      matrix.priorityVector[index] !== 0
                      ? matrix.weightedSumVector[index] / matrix.priorityVector[index]
                      : 0,
                    4,
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border rounded-md p-4">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Consistency Calculations</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">λ max:</span>
              <span className="font-medium">{formatNumber(matrix.lambdaMax, 4)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Consistency Index (CI):</span>
              <span className="font-medium">{formatNumber(matrix.consistencyIndex, 4)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Random Index (RI):</span>
              <span className="font-medium">{formatNumber(matrix.randomIndex, 4)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Consistency Ratio (CR):</span>
              <span className="font-medium">{formatNumber(matrix.consistencyRatio, 4)}</span>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-md flex items-center ${matrix.isConsistent ? "bg-green-50" : "bg-red-50"}`}>
          {matrix.isConsistent ? (
            <>
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <div>
                <p className="text-green-700 font-medium">Consistency Acceptable (CR ≤ 0.1)</p>
                <p className="text-green-600 text-sm">
                  Your judgments are consistent. The consistency ratio is {formatNumber(matrix.consistencyRatio, 3)}.
                </p>
              </div>
            </>
          ) : (
            <>
              <XCircle className="h-5 w-5 text-red-500 mr-2" />
              <div>
                <p className="text-red-700 font-medium">Consistency Unacceptable (CR &gt; 0.1)</p>
                <p className="text-red-600 text-sm">
                  Your judgments are inconsistent. The consistency ratio is {formatNumber(matrix.consistencyRatio, 3)}.
                  Consider revising your pairwise comparisons to improve consistency.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
