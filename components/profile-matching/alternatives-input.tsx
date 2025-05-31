"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2 } from "lucide-react"
import { useProfileMatchingStore } from "@/lib/pm/store"
import type { Alternative } from "@/lib/pm/types"

export function AlternativesInput() {
  const [newAltName, setNewAltName] = useState("")
  const { alternatives, addAlternative, removeAlternative } = useProfileMatchingStore()

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

  return (
    <div className="space-y-4">
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
            {alternatives.map((alt) => (
              <TableRow key={alt.id}>
                <TableCell>{alt.name}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => removeAlternative(alt.id)}>
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
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
