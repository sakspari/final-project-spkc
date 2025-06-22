"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import type { TopsisInput } from "@/lib/types/topsis"
import { Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface InputFormProps {
  onCalculate: (data: TopsisInput) => void
  loading: boolean
}

export default function InputForm({ onCalculate, loading }: InputFormProps) {
  const [numAlternatives, setNumAlternatives] = useState<number>(3)
  const [numCriteria, setNumCriteria] = useState<number>(3)
  const [alternativeNames, setAlternativeNames] = useState<string[]>([])
  const [criteriaNames, setCriteriaNames] = useState<string[]>([])
  const [values, setValues] = useState<number[][]>([])
  const [weights, setWeights] = useState<number[]>([])
  const [types, setTypes] = useState<string[]>([])

  // Validation states
  const [validation, setValidation] = useState({
    alternativesHasEmpty: false,
    alternativesHasDuplicates: false,
    criteriaHasEmpty: false,
    criteriaHasDuplicates: false,
    canProceed: true,
  })

  // Initialize or update state when dimensions change
  useEffect(() => {
    // Initialize alternative names (A1, A2, ...)
    const newAlternativeNames = Array(numAlternatives)
      .fill(0)
      .map((_, i) => `A${i + 1}`)
    setAlternativeNames(newAlternativeNames)

    // Initialize criteria names (C1, C2, ...)
    const newCriteriaNames = Array(numCriteria)
      .fill(0)
      .map((_, i) => `C${i + 1}`)
    setCriteriaNames(newCriteriaNames)

    // Initialize values matrix with zeros
    const newValues = Array(numAlternatives)
      .fill(0)
      .map(() => Array(numCriteria).fill(0))
    setValues(newValues)

    // Initialize weights with equal distribution (sum to 1)
    const equalWeight = numCriteria > 0 ? 1 / numCriteria : 0
    const newWeights = Array(numCriteria).fill(equalWeight)
    setWeights(newWeights)

    // Initialize types as "benefit" for all criteria
    const newTypes = Array(numCriteria).fill("benefit")
    setTypes(newTypes)
  }, [numAlternatives, numCriteria])

  // Validate names whenever they change
  useEffect(() => {
    // Check alternatives
    const alternativesHasEmpty = alternativeNames.some((name) => !name.trim())
    const altNames = alternativeNames.map((name) => name.trim().toLowerCase()).filter((name) => name)
    const alternativesHasDuplicates = altNames.length !== new Set(altNames).size

    // Check criteria
    const criteriaHasEmpty = criteriaNames.some((name) => !name.trim())
    const critNames = criteriaNames.map((name) => name.trim().toLowerCase()).filter((name) => name)
    const criteriaHasDuplicates = critNames.length !== new Set(critNames).size

    const canProceed =
      !alternativesHasEmpty && !alternativesHasDuplicates && !criteriaHasEmpty && !criteriaHasDuplicates

    setValidation({
      alternativesHasEmpty,
      alternativesHasDuplicates,
      criteriaHasEmpty,
      criteriaHasDuplicates,
      canProceed,
    })
  }, [alternativeNames, criteriaNames])

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedInput = localStorage.getItem("topsisInput")
    if (savedInput) {
      try {
        const parsedInput = JSON.parse(savedInput) as TopsisInput
        setNumAlternatives(parsedInput.alternatives.length)
        setNumCriteria(parsedInput.criteria.length)
        setAlternativeNames(parsedInput.alternatives)
        setCriteriaNames(parsedInput.criteria)
        setValues(parsedInput.values)
        setWeights(parsedInput.weights)
        setTypes(parsedInput.types)
      } catch (error) {
        console.error("Error loading saved data:", error)
      }
    }
  }, [])

  // Handle alternative name change
  const handleAlternativeNameChange = (index: number, value: string) => {
    const newNames = [...alternativeNames]
    newNames[index] = value
    setAlternativeNames(newNames)
  }

  // Handle criteria name change
  const handleCriteriaNameChange = (index: number, value: string) => {
    const newNames = [...criteriaNames]
    newNames[index] = value
    setCriteriaNames(newNames)
  }

  // Handle value change in decision matrix
  const handleValueChange = (altIndex: number, critIndex: number, value: string) => {
    const newValues = [...values]
    newValues[altIndex][critIndex] = Number.parseFloat(value) || 0
    setValues(newValues)
  }

  // Handle weight change
  const handleWeightChange = (index: number, value: string) => {
    const newWeights = [...weights]
    newWeights[index] = Number.parseFloat(value) || 0
    setWeights(newWeights)
  }

  // Handle type change (benefit/cost)
  const handleTypeChange = (index: number, value: string) => {
    const newTypes = [...types]
    newTypes[index] = value
    setTypes(newTypes)
  }

  // Handle form submission
  const handleSubmit = () => {
    if (!validation.canProceed) {
      return
    }

    onCalculate({
      alternatives: alternativeNames,
      criteria: criteriaNames,
      values: values,
      weights: weights,
      types: types,
    })
  }

  // Reset form
  const handleReset = () => {
    localStorage.removeItem("topsisInput")
    setNumAlternatives(3)
    setNumCriteria(3)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="numAlternatives">Number of Alternatives</Label>
          <Input
            id="numAlternatives"
            type="number"
            min="2"
            value={numAlternatives}
            onChange={(e) => setNumAlternatives(Number.parseInt(e.target.value) || 2)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="numCriteria">Number of Criteria</Label>
          <Input
            id="numCriteria"
            type="number"
            min="2"
            value={numCriteria}
            onChange={(e) => setNumCriteria(Number.parseInt(e.target.value) || 2)}
            className="mt-1"
          />
        </div>
      </div>

      {/* Validation Alerts */}
      {validation.alternativesHasEmpty && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Empty Alternative Names</AlertTitle>
          <AlertDescription>
            All alternatives must have non-empty names. Please fill in all alternative names.
          </AlertDescription>
        </Alert>
      )}

      {validation.alternativesHasDuplicates && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Duplicate Alternative Names</AlertTitle>
          <AlertDescription>
            All alternative names must be unique. Please ensure no duplicate names exist.
          </AlertDescription>
        </Alert>
      )}

      {validation.criteriaHasEmpty && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Empty Criteria Names</AlertTitle>
          <AlertDescription>
            All criteria must have non-empty names. Please fill in all criteria names.
          </AlertDescription>
        </Alert>
      )}

      {validation.criteriaHasDuplicates && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Duplicate Criteria Names</AlertTitle>
          <AlertDescription>
            All criteria names must be unique. Please ensure no duplicate names exist.
          </AlertDescription>
        </Alert>
      )}

      <Accordion type="single" collapsible defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger>Alternative & Criteria Names</AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-6 sm:grid-cols-2">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Alternative Names</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {alternativeNames.map((name, index) => {
                      const isEmpty = !name.trim()
                      const isDuplicate =
                        alternativeNames.filter((n) => n.trim().toLowerCase() === name.trim().toLowerCase()).length >
                          1 && name.trim()

                      return (
                        <div key={`alt-${index}`} className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Label htmlFor={`alt-${index}`} className="w-10">
                              A{index + 1}
                            </Label>
                            <Input
                              id={`alt-${index}`}
                              value={name}
                              onChange={(e) => handleAlternativeNameChange(index, e.target.value)}
                              className={isEmpty || isDuplicate ? "border-red-500 focus:border-red-500" : ""}
                            />
                          </div>
                          {(isEmpty || isDuplicate) && (
                            <div className="text-sm text-red-500 pl-12">
                              {isEmpty && "Name cannot be empty"}
                              {isDuplicate && "Name must be unique"}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Criteria Names</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {criteriaNames.map((name, index) => {
                      const isEmpty = !name.trim()
                      const isDuplicate =
                        criteriaNames.filter((n) => n.trim().toLowerCase() === name.trim().toLowerCase()).length > 1 &&
                        name.trim()

                      return (
                        <div key={`crit-${index}`} className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Label htmlFor={`crit-${index}`} className="w-10">
                              C{index + 1}
                            </Label>
                            <Input
                              id={`crit-${index}`}
                              value={name}
                              onChange={(e) => handleCriteriaNameChange(index, e.target.value)}
                              className={isEmpty || isDuplicate ? "border-red-500 focus:border-red-500" : ""}
                            />
                          </div>
                          {(isEmpty || isDuplicate) && (
                            <div className="text-sm text-red-500 pl-12">
                              {isEmpty && "Name cannot be empty"}
                              {isDuplicate && "Name must be unique"}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Card>
        <CardHeader>
          <CardTitle>Decision Matrix</CardTitle>
          <CardDescription>Enter the values for each alternative against each criterion</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Alternative</TableHead>
                  {criteriaNames.map((name, index) => (
                    <TableHead key={`header-${index}`}>{name}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {alternativeNames.map((name, altIndex) => (
                  <TableRow key={`row-${altIndex}`}>
                    <TableCell className="font-medium">{name}</TableCell>
                    {criteriaNames.map((_, critIndex) => (
                      <TableCell key={`cell-${altIndex}-${critIndex}`}>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={values[altIndex]?.[critIndex] || ""}
                          onChange={(e) => handleValueChange(altIndex, critIndex, e.target.value)}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Criteria Weights & Types</CardTitle>
          <CardDescription>Set weights (sum should be 1) and types for each criterion</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Criterion</TableHead>
                  <TableHead>Weight</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {criteriaNames.map((name, index) => (
                  <TableRow key={`weight-${index}`}>
                    <TableCell className="font-medium">{name}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        max="1"
                        step="0.01"
                        value={weights[index] || ""}
                        onChange={(e) => handleWeightChange(index, e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Select value={types[index]} onValueChange={(value) => handleTypeChange(index, value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="benefit">Benefit</SelectItem>
                          <SelectItem value="cost">Cost</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4">
            <p className="text-sm text-muted-foreground">
              Weight Sum: {weights.reduce((sum, w) => sum + w, 0).toFixed(4)}
              {weights.reduce((sum, w) => sum + w, 0) < 0.99 || weights.reduce((sum, w) => sum + w, 0) > 1.01 ? (
                <span className="text-destructive ml-2">(Should be approximately 1)</span>
              ) : (
                <span className="text-green-500 ml-2">✓</span>
              )}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-4">
        <Button onClick={handleSubmit} disabled={loading || !validation.canProceed}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Calculating...
            </>
          ) : (
            "Calculate TOPSIS"
          )}
        </Button>
        <Button variant="outline" onClick={handleReset}>
          Reset Form
        </Button>
      </div>

      {!validation.canProceed && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Cannot Proceed</AlertTitle>
          <AlertDescription>Please fix the validation errors above before calculating TOPSIS results.</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
