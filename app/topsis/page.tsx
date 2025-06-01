import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import TopsisCalculator from "@/components/topsis/topsis-calculator"
// import { ModeToggle } from "@/components/topsis/theme-toggle"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-center">TOPSIS Calculator</h1>
          <p className="text-muted-foreground text-center">TOPSIS (Technique for Order Preference by Similarity to Ideal Solution) is a multi-criteria decision analysis method. It identifies the best alternative by measuring its shortest geometric distance from an "ideal" solution and the longest geometric distance from a "negative-ideal" (or anti-ideal) solution. This calculator helps you use TOPSIS to rank your options based on how closely they resemble the best possible outcome while being farthest from the worst.</p>
        </div>
        {/* <ModeToggle /> */}
      </header>

      <main>
        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="about">About TOPSIS</TabsTrigger>
          </TabsList>
          <TabsContent value="calculator" className="mt-6">
            <TopsisCalculator />
          </TabsContent>
          <TabsContent value="about" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>About TOPSIS</CardTitle>
                <CardDescription>
                  Understanding the Technique for Order Preference by Similarity to Ideal Solution
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  TOPSIS (Technique for Order Preference by Similarity to Ideal Solution) is a multi-criteria decision
                  analysis method. It is based on the concept that the chosen alternative should have the shortest
                  geometric distance from the positive ideal solution (PIS) and the longest geometric distance from the
                  negative ideal solution (NIS).
                </p>
                <h3 className="text-lg font-semibold mt-4">The TOPSIS Process:</h3>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Create a decision matrix with alternatives and criteria</li>
                  <li>Normalize the decision matrix</li>
                  <li>Calculate the weighted normalized decision matrix</li>
                  <li>Determine the ideal and negative-ideal solutions</li>
                  <li>Calculate the separation measures from ideal solutions</li>
                  <li>Calculate the relative closeness to the ideal solution</li>
                  <li>Rank the alternatives based on relative closeness</li>
                </ol>
                <p className="mt-4">
                  TOPSIS is widely used in engineering, management, and other fields where multiple criteria need to be
                  evaluated to make optimal decisions.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} TOPSIS Calculator. All rights reserved.</p>
      </footer>
    </div>
  )
}