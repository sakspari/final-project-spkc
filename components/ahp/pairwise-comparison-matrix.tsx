"use client"

import { useAHP } from "@/context/ahp-context"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { InfoIcon } from "lucide-react"
import { useState } from "react"

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
  const [inputValues, setInputValues] = useState<Record<string, string>>({})

  const handleValueChange = (row: number, col: number, value: number) => {
    if (type === "criteria") {
      updateCriteriaComparison(row, col, value)
    } else if (type === "alternatives" && criterionId) {
      updateAlternativesComparison(criterionId, row, col, value)
    }
  }

  const parseValue = (input: string): number | null => {
    if (!input.trim()) return null

    // Handle fractions like 1/2, 5/6, etc.
    if (input.includes("/")) {
      const parts = input.split("/")
      if (parts.length === 2) {
        const numerator = Number.parseFloat(parts[0].trim())
        const denominator = Number.parseFloat(parts[1].trim())
        if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) {
          return numerator / denominator
        }
      }
      return null
    }

    // Handle decimal or whole numbers
    const num = Number.parseFloat(input)
    return isNaN(num) ? null : num
  }

  const isValidValue = (value: number): boolean => {
    return value >= 1 / 9 && value <= 9 && value > 0
  }

  const formatDisplayValue = (value: number): string => {
    if (value === 0) return ""

    // Check for common fractions
    const commonFractions = [
      { decimal: 1 / 9, fraction: "1/9" },
      { decimal: 1 / 8, fraction: "1/8" },
      { decimal: 1 / 7, fraction: "1/7" },
      { decimal: 1 / 6, fraction: "1/6" },
      { decimal: 1 / 5, fraction: "1/5" },
      { decimal: 1 / 4, fraction: "1/4" },
      { decimal: 1 / 3, fraction: "1/3" },
      { decimal: 1 / 2, fraction: "1/2" },
      { decimal: 2 / 3, fraction: "2/3" },
      { decimal: 3 / 4, fraction: "3/4" },
      { decimal: 4 / 5, fraction: "4/5" },
      { decimal: 5 / 6, fraction: "5/6" },
      { decimal: 6 / 7, fraction: "6/7" },
      { decimal: 7 / 8, fraction: "7/8" },
      { decimal: 8 / 9, fraction: "8/9" },
    ]

    // Check if it matches a common fraction (with small tolerance)
    for (const frac of commonFractions) {
      if (Math.abs(value - frac.decimal) < 0.001) {
        return frac.fraction
      }
    }

    // Check if it's a whole number
    if (Number.isInteger(value)) {
      return value.toString()
    }

    // Return as decimal with appropriate precision
    return value.toFixed(3).replace(/\.?0+$/, "")
  }

  const handleInputChange = (row: number, col: number, input: string) => {
    const key = `${row}-${col}`
    setInputValues((prev) => ({ ...prev, [key]: input }))

    const parsedValue = parseValue(input)
    if (parsedValue !== null && isValidValue(parsedValue)) {
      handleValueChange(row, col, parsedValue)
    }
  }

  const getInputValue = (row: number, col: number): string => {
    const key = `${row}-${col}`
    if (inputValues[key] !== undefined) {
      return inputValues[key]
    }

    const matrixValue = matrix[row]?.[col]
    if (matrixValue && matrixValue !== 0) {
      return formatDisplayValue(matrixValue)
    }

    return ""
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
                Enter comparison values between 1/9 and 9:
                <br />• Whole numbers: 1, 2, 3, 4, 5, 6, 7, 8, 9
                <br />• Fractions: 1/2, 1/3, 2/3, 5/6, 7/8, etc.
                <br />• Decimals: 1.5, 2.33, 0.67, etc.
                <br />
                Values less than 1 indicate the column item is more important.
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
                    const inputValue = getInputValue(rowIndex, colIndex)
                    const parsedValue = parseValue(inputValue)
                    const isValid = parsedValue === null || isValidValue(parsedValue)

                    return (
                      <TableCell key={colItem.id} className="p-1">
                        <Input
                          value={inputValue}
                          onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                          placeholder="Enter value"
                          className={`h-8 text-center border-0 focus:ring-1 ${
                            !isValid ? "ring-red-500 bg-red-50" : "focus:ring-blue-500"
                          }`}
                        />
                        {!isValid && inputValue && (
                          <div className="text-xs text-red-500 mt-1">Value must be between 1/9 and 9</div>
                        )}
                      </TableCell>
                    )
                  }

                  // For cells below the diagonal, show the reciprocal value
                  const upperValue = matrix[colIndex]?.[rowIndex]
                  return (
                    <TableCell key={colItem.id} className="text-center bg-gray-100">
                      {upperValue && upperValue !== 0 ? formatDisplayValue(1 / upperValue) : ""}
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
