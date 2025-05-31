"use client"

import { Slider } from "@/components/ui/slider"
import { useProfileMatchingStore } from "@/lib/pm/store"

export function FactorWeights() {
  const { coreFactorWeight, secondaryFactorWeight, setCoreFactorWeight, setSecondaryFactorWeight, criteria } =
    useProfileMatchingStore()

  const hasCoreFactors = criteria.some((c) => c.factorType === "core")
  const hasSecondaryFactors = criteria.some((c) => c.factorType === "secondary")

  // If we don't have both types of factors, we don't need to show the weights
  if (!hasCoreFactors || !hasSecondaryFactors) {
    return (
      <div className="text-muted-foreground">
        Please assign at least one criterion to each factor type (Core and Secondary) to set weights.
      </div>
    )
  }

  const handleCoreWeightChange = (value: number[]) => {
    const newCoreWeight = value[0]
    setCoreFactorWeight(newCoreWeight)
    setSecondaryFactorWeight(100 - newCoreWeight)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Core Factor Weight</span>
          <span className="font-medium">{coreFactorWeight}%</span>
        </div>
        <Slider value={[coreFactorWeight]} onValueChange={handleCoreWeightChange} min={0} max={100} step={5} />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Secondary Factor Weight</span>
          <span className="font-medium">{secondaryFactorWeight}%</span>
        </div>
        <Slider
          value={[secondaryFactorWeight]}
          onValueChange={(value) => {
            const newSecondaryWeight = value[0]
            setSecondaryFactorWeight(newSecondaryWeight)
            setCoreFactorWeight(100 - newSecondaryWeight)
          }}
          min={0}
          max={100}
          step={5}
        />
      </div>

      <div className="text-sm text-muted-foreground">Note: Core and Secondary factor weights must sum to 100%.</div>
    </div>
  )
}
