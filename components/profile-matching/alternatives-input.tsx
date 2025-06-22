"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2, AlertCircle } from "lucide-react"
import { useProfileMatchingStore } from "@/lib/pm/store"
import type { Alternative } from "@/lib/pm/types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function AlternativesInput() {
  const [newAltName, setNewAltName] = useState("")
  const { alternatives, addAlternative, removeAlternative, updateAlternative } = useProfileMatchingStore()

  const handleAddAlternative = () => {
    if (newAltName.trim()) {
      const newAlt: Alternative = {
        id: `alt-${Date.now()}`,
        name: newAltName.trim(),
        values: {},
      }
      addAlternative(newAlt)
      setNewAltName("")
    }
  }

  const updateAlternativeName = (id: string, name: string) => {
    updateAlternative(id, { name })
  }

  // Validation logic
  const hasEmptyNames = alternatives.some((a) => !a.name.trim())
  const names = alternatives.map((a) => a.name.trim().toLowerCase()).filter((name) => name)
  const hasDuplicateNames = names.length !== new Set(names).size

  return (
    <div className="space-y-4">
      {/* Validation alerts */}
      {hasEmptyNames && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Empty Alternative Names</AlertTitle>
          <AlertDescription>
            All alternatives must have non-empty names. Please fill in all alternative names.
          </AlertDescription>
        </Alert>
      )}

      {hasDuplicateNames && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Duplicate Alternative Names</AlertTitle>
          <AlertDescription>
            All alternative names must be unique. Please ensure no duplicate names exist.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex gap-2">
        <Input
          placeholder="Alternative name (e.g., Apple, Orange)"
          value={newAltName}
          onChange={(e) => setNewAltName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              handleAddAlternative()
            }
          }}
        />
        <Button onClick={handleAddAlternative} className="shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>

      {alternatives.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alternatives.map((alt) => {
              const isEmpty = !alt.name.trim()
              const isDuplicate =
                alternatives.filter((a) => a.name.trim().toLowerCase() === alt.name.trim().toLowerCase()).length > 1 &&
                alt.name.trim()

              return (
                <TableRow key={alt.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <Input
                        value={alt.name}
                        onChange={(e) => updateAlternativeName(alt.id, e.target.value)}
                        placeholder="Enter alternative name"
                        className={`${isEmpty || isDuplicate ? "border-red-500 focus:border-red-500" : ""}`}
                      />
                      {(isEmpty || isDuplicate) && (
                        <div className="text-xs text-red-500">
                          {isEmpty && "Name cannot be empty"}
                          {isDuplicate && "Name must be unique"}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => removeAlternative(alt.id)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      )}

      {alternatives.length === 0 && (
        <div className="text-center py-4 text-muted-foreground">
          No alternatives added yet. Add at least two alternatives to compare.
        </div>
      )}
    </div>
  )
}
