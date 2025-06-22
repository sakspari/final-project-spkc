"use client"

import { useAHP } from "@/context/ahp-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusCircle, Trash2, Info } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import QuantitativeDataInput from "@/components/ahp/quantitative-data-input"

export default function CriteriaAlternativesStep() {
  const {
    criteria,
    alternatives,
    addCriterion,
    removeCriterion,
    updateCriterionName,
    toggleCriterionType,
    updateCriterionCostBenefit,
    updateCriterionNormalization,
    addAlternative,
    removeAlternative,
    updateAlternativeName,
    criteriaValidation,
    alternativesValidation,
  } = useAHP()

  const hasQuantitativeCriteria = criteria.some((c) => c.isQuantitative)

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Define Your Criteria</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Criteria are the factors you will use to evaluate your alternatives. Add at least 2 criteria.
        </p>

        {/* Criteria validation alerts */}
        {criteriaValidation.hasEmptyNames && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Empty Criteria Names</AlertTitle>
            <AlertDescription>
              All criteria must have non-empty names. Please fill in all criteria names.
            </AlertDescription>
          </Alert>
        )}

        {criteriaValidation.hasDuplicateNames && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Duplicate Criteria Names</AlertTitle>
            <AlertDescription>
              All criteria names must be unique. Please ensure no duplicate names exist.
            </AlertDescription>
          </Alert>
        )}

        {criteria.length < 2 && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Insufficient Criteria</AlertTitle>
            <AlertDescription>At least 2 criteria are required for AHP analysis.</AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          {criteria.map((criterion) => {
            const isEmpty = !criterion.name.trim()
            const isDuplicate =
              criteria.filter((c) => c.name.trim().toLowerCase() === criterion.name.trim().toLowerCase()).length > 1 &&
              criterion.name.trim()

            return (
              <div key={criterion.id} className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Input
                    value={criterion.name}
                    onChange={(e) => updateCriterionName(criterion.id, e.target.value)}
                    placeholder="Enter criterion name"
                    className={`flex-1 ${isEmpty || isDuplicate ? "border-red-500 focus:border-red-500" : ""}`}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeCriterion(criterion.id)}
                    title="Remove criterion"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {(isEmpty || isDuplicate) && (
                  <div className="text-sm text-red-500 pl-2">
                    {isEmpty && "Criterion name cannot be empty"}
                    {isDuplicate && "Criterion name must be unique"}
                  </div>
                )}

                <div className="flex items-center gap-4 pl-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={criterion.isQuantitative}
                      onCheckedChange={(checked) => toggleCriterionType(criterion.id, checked)}
                      id={`quant-toggle-${criterion.id}`}
                    />
                    <Label htmlFor={`quant-toggle-${criterion.id}`} className="text-gray-700 dark:text-gray-300">
                      Quantitative
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-gray-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>
                            Qualitative: Subjective judgments using pairwise comparisons (e.g., design preference).
                            <br />
                            Quantitative: Objective numerical values (e.g., cost in dollars).
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  {criterion.isQuantitative && (
                    <>
                      <div className="flex items-center space-x-2">
                        <Select
                          value={criterion.isCost ? "cost" : "benefit"}
                          onValueChange={(value) => updateCriterionCostBenefit(criterion.id, value === "cost")}
                        >
                          <SelectTrigger className="w-[120px] h-8 text-xs">
                            <SelectValue placeholder="Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="benefit">Benefit (↑)</SelectItem>
                            <SelectItem value="cost">Cost (↓)</SelectItem>
                          </SelectContent>
                        </Select>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-gray-400 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p>
                                Benefit: Higher values are better (e.g., performance).
                                <br />
                                Cost: Lower values are better (e.g., price).
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Select
                          value={criterion.normalizationType}
                          onValueChange={(value) =>
                            updateCriterionNormalization(criterion.id, value as "sum" | "max" | "min")
                          }
                        >
                          <SelectTrigger className="w-[140px] h-8 text-xs">
                            <SelectValue placeholder="Normalization" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sum">Sum Normalization</SelectItem>
                            <SelectItem value="max">Max Normalization</SelectItem>
                            <SelectItem value="min">Min Normalization</SelectItem>
                          </SelectContent>
                        </Select>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-gray-400 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p>
                                Sum: Divide by sum of all values (value / sum).
                                <br />
                                Max: Divide by maximum value (value / max).
                                <br />
                                Min: For costs, divide min by value (min / value).
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )
          })}

          <Button variant="outline" onClick={addCriterion} className="mt-2 w-full">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Criterion
          </Button>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Define Your Alternatives</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Alternatives are the options you are comparing. Add at least 2 alternatives.
        </p>

        {/* Alternatives validation alerts */}
        {alternativesValidation.hasEmptyNames && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Empty Alternative Names</AlertTitle>
            <AlertDescription>
              All alternatives must have non-empty names. Please fill in all alternative names.
            </AlertDescription>
          </Alert>
        )}

        {alternativesValidation.hasDuplicateNames && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Duplicate Alternative Names</AlertTitle>
            <AlertDescription>
              All alternative names must be unique. Please ensure no duplicate names exist.
            </AlertDescription>
          </Alert>
        )}

        {alternatives.length < 2 && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Insufficient Alternatives</AlertTitle>
            <AlertDescription>At least 2 alternatives are required for AHP analysis.</AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          {alternatives.map((alternative) => {
            const isEmpty = !alternative.name.trim()
            const isDuplicate =
              alternatives.filter((a) => a.name.trim().toLowerCase() === alternative.name.trim().toLowerCase()).length >
                1 && alternative.name.trim()

            return (
              <div key={alternative.id} className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Input
                    value={alternative.name}
                    onChange={(e) => updateAlternativeName(alternative.id, e.target.value)}
                    placeholder="Enter alternative name"
                    className={`flex-1 ${isEmpty || isDuplicate ? "border-red-500 focus:border-red-500" : ""}`}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeAlternative(alternative.id)}
                    title="Remove alternative"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {(isEmpty || isDuplicate) && (
                  <div className="text-sm text-red-500 pl-2">
                    {isEmpty && "Alternative name cannot be empty"}
                    {isDuplicate && "Alternative name must be unique"}
                  </div>
                )}
              </div>
            )
          })}

          <Button variant="outline" onClick={addAlternative} className="mt-2 w-full">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Alternative
          </Button>
        </div>
      </div>

      {hasQuantitativeCriteria && (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Quantitative Data Input</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Enter numerical values for each alternative under quantitative criteria.
          </p>

          <Tabs defaultValue={criteria.find((c) => c.isQuantitative)?.id} className="w-full">
            <TabsList className="w-full overflow-x-auto flex-wrap">
              {criteria
                .filter((c) => c.isQuantitative)
                .map((criterion) => (
                  <TabsTrigger key={criterion.id} value={criterion.id} className="flex-1">
                    {criterion.name}
                  </TabsTrigger>
                ))}
            </TabsList>

            {criteria
              .filter((c) => c.isQuantitative)
              .map((criterion) => (
                <TabsContent key={criterion.id} value={criterion.id} className="pt-4">
                  <QuantitativeDataInput criterion={criterion} alternatives={alternatives} />
                </TabsContent>
              ))}
          </Tabs>
        </div>
      )}

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md border dark:border-blue-800">
        <h3 className="font-medium text-blue-700 dark:text-blue-300">Next Steps</h3>
        <p className="text-blue-600 dark:text-blue-400 text-sm mt-1">
          {!criteriaValidation.canProceed || !alternativesValidation.canProceed
            ? "Please fix the validation errors above before proceeding to the next step."
            : "Once you've defined your criteria and alternatives, proceed to the next step to compare the relative importance of your criteria."}
        </p>
      </div>
    </div>
  )
}
