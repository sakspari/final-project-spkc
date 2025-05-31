"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2 } from "lucide-react"
import { useProfileMatchingStore } from "@/lib/pm/store"
import type { Criterion } from "@/lib/pm/types"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CriteriaValuesInput } from "@/components/profile-matching/criteria-values-input"

export function CriteriaInput() {
  const [newCriterionName, setNewCriterionName] = useState("")
  const { criteria, addCriterion, removeCriterion, updateCriterion } = useProfileMatchingStore()

  const handleAddCriterion = () => {
    if (newCriterionName.trim()) {
      const newCriterion: Criterion = {
        id: `crit-${Date.now()}`,
        name: newCriterionName.trim(),
        isRange: false,
        idealValue: "",
        factorType: "none",
      }
      addCriterion(newCriterion)
      setNewCriterionName("")
    }
  }

  const toggleRangeType = (id: string, isRange: boolean) => {
    updateCriterion(id, { isRange })
  }

  const setFactorType = (id: string, factorType: "none" | "core" | "secondary") => {
    updateCriterion(id, { factorType })
  }

  const setIdealValue = (id: string, idealValue: string | number) => {
    updateCriterion(id, { idealValue })
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Criterion name (e.g., Price, Quality)"
          value={newCriterionName}
          onChange={(e) => setNewCriterionName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              handleAddCriterion()
            }
          }}
        />
        <Button onClick={handleAddCriterion} className="shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>

      {criteria.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Range/Single</TableHead>
              <TableHead>Ideal Value</TableHead>
              <TableHead>Factor Type</TableHead>
              <TableHead className="w-[80px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {criteria.map((criterion) => (
              <TableRow key={criterion.id}>
                <TableCell>{criterion.name}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`range-${criterion.id}`}
                      checked={criterion.isRange}
                      onCheckedChange={(checked) => toggleRangeType(criterion.id, checked)}
                    />
                    <Label htmlFor={`range-${criterion.id}`}>{criterion.isRange ? "Range" : "Single Value"}</Label>
                  </div>
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    placeholder="Ideal value"
                    value={criterion.idealValue}
                    onChange={(e) => setIdealValue(criterion.id, e.target.value)}
                    className="w-24"
                  />
                </TableCell>
                <TableCell>
                  <Select
                    value={criterion.factorType}
                    onValueChange={(value) => setFactorType(criterion.id, value as "none" | "core" | "secondary")}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="core">Core Factor</SelectItem>
                      <SelectItem value="secondary">Secondary Factor</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => removeCriterion(criterion.id)}>
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {criteria.length === 0 && (
        <div className="text-center py-4 text-muted-foreground">
          No criteria added yet. Add at least one criterion for evaluation.
        </div>
      )}

      {criteria.length > 0 && <CriteriaValuesInput />}
    </div>
  )
}
