"use client"

import { useAHP } from "@/context/ahp-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { InfoIcon } from "lucide-react"

interface Item {
  id: string
  name: string
}

interface PairwiseComparisonMatrixProps {
  items: Item[]
  matrix: number[][]
  onValueChange: (row: number, col: number, value: number) => void
  type: "criteria" | "alternatives"
  criterionId?: string
}

export default function PairwiseComparisonMatrix({ items, matrix, type, criterionId }: PairwiseComparisonMatrixProps) {
  const { updateCriteriaComparison, updateAlternativesComparison } = useAHP()

  // AHP scale values
  const scaleValues = [
    { value: 9, label: "9 - Extreme importance" },
    { value: 8, label: "8 - Very to extremely strong importance" },
    { value: 7, label: "7 - Very strong importance" },
    { value: 6, label: "6 - Strong to very strong importance" },
    { value: 5, label: "5 - Strong importance" },
    { value: 4, label: "4 - Moderate to strong importance" },
    { value: 3, label: "3 - Moderate importance" },
    { value: 2, label: "2 - Equal to moderate importance" },
    { value: 1, label: "1 - Equal importance" },
    { value: 1 / 2, label: "1/2 - Equal to moderate unimportance" },
    { value: 1 / 3, label: "1/3 - Moderate unimportance" },
    { value: 1 / 4, label: "1/4 - Moderate to strong unimportance" },
    { value: 1 / 5, label: "1/5 - Strong unimportance" },
    { value: 1 / 6, label: "1/6 - Strong to very strong unimportance" },
    { value: 1 / 7, label: "1/7 - Very strong unimportance" },
    { value: 1 / 8, label: "1/8 - Very to extremely strong unimportance" },
    { value: 1 / 9, label: "1/9 - Extreme unimportance" },
  ]

  const handleValueChange = (row: number, col: number, value: number) => {
    if (type === "criteria") {
      updateCriteriaComparison(row, col, value)
    } else if (type === "alternatives" && criterionId) {
      updateAlternativesComparison(criterionId, row, col, value)
    }
  }

  return (
    <div className="overflow-x-auto">
      <TooltipProvider>
        <div className="flex items-center mb-2">
          <h4 className="text-sm font-medium text-gray-500">
            {type === "criteria"
              ? "How important is row compared to column?"
              : "How preferable is row compared to column?"}
          </h4>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="ml-2">
                <InfoIcon className="h-4 w-4 text-gray-400" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>
                Use the AHP scale to compare items:
                <br />1 = Equal importance
                <br />3 = Moderate importance
                <br />5 = Strong importance
                <br />7 = Very strong importance
                <br />9 = Extreme importance
                <br />
                Reciprocals (1/3, 1/5, etc.) indicate the opposite relationship.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>

        <Table className="border">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">{type === "criteria" ? "Criterion" : "Alternative"}</TableHead>
              {items.map((item) => (
                <TableHead key={item.id} className="text-center">
                  {item.name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((rowItem, rowIndex) => (
              <TableRow key={rowItem.id}>
                <TableCell className="font-medium">{rowItem.name}</TableCell>
                {items.map((colItem, colIndex) => {
                  if (rowIndex === colIndex) {
                    return (
                      <TableCell key={colItem.id} className="text-center bg-gray-50">
                        1
                      </TableCell>
                    )
                  }

                  if (rowIndex < colIndex) {
                    return (
                      <TableCell key={colItem.id} className="p-0">
                        <Select
                          value={matrix[rowIndex]?.[colIndex] ? matrix[rowIndex][colIndex].toString() : ""}
                          onValueChange={(value) => handleValueChange(rowIndex, colIndex, Number.parseFloat(value))}
                        >
                          <SelectTrigger className="border-0 h-10 rounded-none focus:ring-0">
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                            {scaleValues.map((scale) => (
                              <SelectItem key={scale.value} value={scale.value.toString()}>
                                {scale.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    )
                  }

                  // For cells below the diagonal, show the reciprocal value
                  return (
                    <TableCell key={colItem.id} className="text-center bg-gray-100">
                      {matrix[colIndex]?.[rowIndex] ? (1 / matrix[colIndex][rowIndex]).toFixed(2) : ""}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TooltipProvider>
    </div>
  )
}
