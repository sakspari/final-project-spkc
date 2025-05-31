"use client"

import { useAHP } from "@/context/ahp-context"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import type { Criterion, Alternative } from "@/context/ahp-context"
import { normalizeQuantitativeData, convertToPairwiseMatrix, formatNumber } from "@/lib/ahp"

interface QuantitativeDataInputProps {
  criterion: Criterion
  alternatives: Alternative[]
}

export default function QuantitativeDataInput({ criterion, alternatives }: QuantitativeDataInputProps) {
  const { quantitativeData, updateQuantitativeValue } = useAHP()

  // Find data for this criterion
  const criterionData = quantitativeData.find((data) => data.criterionId === criterion.id)

  // Local state for validation
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Preview for normalized values and resulting pairwise matrix
  const [normalizedValues, setNormalizedValues] = useState<number[]>([])
  const [pairwiseMatrix, setPairwiseMatrix] = useState<number[][]>([])

  useEffect(() => {
    if (!criterionData) return

    // Extract values in order of alternatives
    const values = alternatives.map((alt) => criterionData.values[alt.id] || 0)

    // If all values are 0 or there's no data, don't show preview
    if (!values.length || values.every((v) => v === 0)) {
      setNormalizedValues([])
      setPairwiseMatrix([])
      return
    }

    // Calculate normalized values
    const normalized = normalizeQuantitativeData(values, criterion.normalizationType, criterion.isCost)

    setNormalizedValues(normalized)

    // Convert to pairwise matrix
    const matrix = convertToPairwiseMatrix(normalized)
    setPairwiseMatrix(matrix)
  }, [criterionData, alternatives, criterion.normalizationType, criterion.isCost])

  const handleValueChange = (alternativeId: string, value: string) => {
    // Clear previous error for this alternative
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[alternativeId]
      return newErrors
    })

    // Validate input
    const numValue = Number.parseFloat(value)
    if (isNaN(numValue)) {
      setErrors((prev) => ({ ...prev, [alternativeId]: "Must be a number" }))
      return
    }

    if (numValue < 0) {
      setErrors((prev) => ({ ...prev, [alternativeId]: "Must be non-negative" }))
      return
    }

    // Update the value
    updateQuantitativeValue(criterion.id, alternativeId, numValue)
  }

  // Get value for an alternative
  const getValue = (alternativeId: string): number => {
    if (!criterionData) return 0
    return criterionData.values[alternativeId] || 0
  }

  const hasData = normalizedValues.length > 0

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">
          {criterion.name} ({criterion.isCost ? "Cost" : "Benefit"} criterion)
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Enter the numerical values for each alternative. Higher values are
          {criterion.isCost ? " worse " : " better "}
          for this criterion.
        </p>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Alternative</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alternatives.map((alternative) => (
                <TableRow key={alternative.id}>
                  <TableCell>{alternative.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        step="any"
                        value={getValue(alternative.id) || ""}
                        onChange={(e) => handleValueChange(alternative.id, e.target.value)}
                        placeholder="Enter value"
                        className="w-40"
                      />
                      {errors[alternative.id] && <span className="text-xs text-red-500">{errors[alternative.id]}</span>}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {!hasData && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Enter values for the alternatives to see the normalized values and pairwise comparison matrix.
          </AlertDescription>
        </Alert>
      )}

      {hasData && (
        <>
          <div>
            <h4 className="text-md font-medium mb-2">Normalized Values</h4>
            <p className="text-sm text-gray-500 mb-2">
              Using {criterion.normalizationType} normalization for this {criterion.isCost ? "cost" : "benefit"}{" "}
              criterion.
            </p>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Alternative</TableHead>
                    <TableHead>Raw Value</TableHead>
                    <TableHead>Normalized Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alternatives.map((alternative, index) => (
                    <TableRow key={alternative.id}>
                      <TableCell>{alternative.name}</TableCell>
                      <TableCell>{getValue(alternative.id)}</TableCell>
                      <TableCell>
                        {normalizedValues && index < normalizedValues.length
                          ? formatNumber(normalizedValues[index])
                          : formatNumber(0)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div>
            <h4 className="text-md font-medium mb-2">Derived Pairwise Comparison Matrix</h4>
            <p className="text-sm text-gray-500 mb-2">Automatically calculated from normalized values.</p>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead></TableHead>
                    {alternatives.map((alt) => (
                      <TableHead key={alt.id}>{alt.name}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alternatives.map((rowAlt, rowIndex) => (
                    <TableRow key={rowAlt.id}>
                      <TableCell className="font-medium">{rowAlt.name}</TableCell>
                      {alternatives.map((colAlt, colIndex) => (
                        <TableCell key={colAlt.id}>
                          {pairwiseMatrix &&
                          rowIndex < pairwiseMatrix.length &&
                          pairwiseMatrix[rowIndex] &&
                          colIndex < pairwiseMatrix[rowIndex].length
                            ? formatNumber(pairwiseMatrix[rowIndex][colIndex])
                            : formatNumber(0)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
