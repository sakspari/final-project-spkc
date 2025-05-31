"use client"

import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useProfileMatchingStore } from "@/lib/pm/store"

export function CriteriaValuesInput() {
  const { alternatives, criteria, updateAlternativeValue } = useProfileMatchingStore()

  if (alternatives.length === 0 || criteria.length === 0) {
    return null
  }

  const handleValueChange = (
    altId: string,
    critId: string,
    value: string | number | [number, number],
    index?: number,
  ) => {
    if (index !== undefined) {
      // Handle range value update
      const currentValue = alternatives.find((a) => a.id === altId)?.values[critId] || [0, 0]
      const newValue = [...(currentValue as [number, number])]
      newValue[index] = Number(value)
      updateAlternativeValue(altId, critId, newValue as [number, number])
    } else {
      // Handle single value update
      updateAlternativeValue(altId, critId, value)
    }
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium mb-4">Alternative Values</h3>
      <div className="overflow-x-auto">
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
            {alternatives.map((alternative) => (
              <TableRow key={alternative.id}>
                <TableCell className="font-medium">{alternative.name}</TableCell>
                {criteria.map((criterion) => (
                  <TableCell key={`${alternative.id}-${criterion.id}`}>
                    {criterion.isRange ? (
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          placeholder="Min"
                          className="w-20"
                          value={(alternative.values[criterion.id] as [number, number])?.[0] || ""}
                          onChange={(e) => handleValueChange(alternative.id, criterion.id, e.target.value, 0)}
                        />
                        <span>to</span>
                        <Input
                          type="number"
                          placeholder="Max"
                          className="w-20"
                          value={(alternative.values[criterion.id] as [number, number])?.[1] || ""}
                          onChange={(e) => handleValueChange(alternative.id, criterion.id, e.target.value, 1)}
                        />
                      </div>
                    ) : (
                      <Input
                        type="number"
                        placeholder="Value"
                        className="w-24"
                        value={alternative.values[criterion.id] || ""}
                        onChange={(e) => handleValueChange(alternative.id, criterion.id, e.target.value)}
                      />
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
