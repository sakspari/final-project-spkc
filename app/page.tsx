// src/app/page.tsx (or your home page file)
import Link from "next/link";
import { BarChart3, Brain, GitCompare, Leaf, CheckCircle } from "lucide-react"; // Added Leaf and CheckCircle

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { SiteLayout } from "@/components/SiteLayout"; // Import SiteLayout

export default function HomePage() {
  return (
    <>
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-40 flex items-center justify-center"> {/* Centering content */}
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-6 text-center">
            <div className="space-y-3">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Find Your Ideal Corn Variety, Faster.
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                CornSelect Pro helps you choose the best corn varieties for your specific needs using proven analytical methods. Maximize yield and resilience with data-driven decisions.
              </p>
            </div>
            <div className="space-x-4">
              <Button asChild size="lg">
                <Link href="#methods">Explore Selection Methods</Link>
              </Button>
              
            </div>
          </div>
        </div>
      </section>

      <section id="methods" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40 flex items-center justify-center"> {/* Centering content */}
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
              Decision Tools
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Advanced Corn Variety Selection Tools
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Utilize our suite of decision-making methodologies to pinpoint the optimal corn varieties based on your criteria.
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
            <Card className="flex flex-col h-full"> {/* Ensure cards have equal height if desired */}
              <CardHeader>
                <div className="flex items-center gap-3">
                  <GitCompare className="h-8 w-8 text-primary" />
                  <div>
                    <CardTitle>AHP Analysis</CardTitle>
                    <CardDescription>Analytic Hierarchy Process</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow"> {/* Allow content to grow */}
                <p>
                  Prioritize selection criteria and compare corn varieties systematically to find the best fit for complex scenarios.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/ahp">Use AHP</Link>
                </Button>
              </CardFooter>
            </Card>
            <Card className="flex flex-col h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-8 w-8 text-primary" />
                  <div>
                    <CardTitle>TOPSIS Analysis</CardTitle>
                    <CardDescription>Order Preference by Similarity</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p>
                  Identify varieties closest to your ideal performance benchmarks and furthest from undesirable traits.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/topsis">Use TOPSIS</Link>
                </Button>
              </CardFooter>
            </Card>
            <Card className="flex flex-col h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Brain className="h-8 w-8 text-primary" />
                  <div>
                    <CardTitle>Profile Matching</CardTitle>
                    <CardDescription>Ideal Variety Gap Analysis</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p>
                  Match corn varieties against predefined ideal profiles based on critical agronomic traits and resistance.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/profile-matching">Use Profile Matching</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 flex items-center justify-center"> {/* Centering content */}
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                Key Benefits
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Make Smarter Corn Variety Choices with CornSelect Pro
              </h2>
              <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our platform empowers agronomists, farmers, and researchers to select the best corn varieties by simplifying complex data into actionable insights.
              </p>
              <ul className="grid gap-3 py-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>Tailored recommendations for your specific farm conditions.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>Compare multiple varieties using robust analytical frameworks.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>Save time and reduce risk in your seed selection process.</span>
                </li>
               
              </ul>
            </div>
            <div className="flex flex-col justify-center space-y-4 items-center">
              {/* You can add an image or illustration here */}
              <Leaf className="h-48 w-48 text-green-500 opacity-80" />
              <div className="rounded-lg border bg-card p-6 shadow-sm w-full max-w-md text-center">
                <h3 className="text-xl font-bold">Ready to Optimize Your Harvest?</h3>
                <p className="text-muted-foreground mt-2 mb-4">
                  Start making decisions for your cornfields today.
                </p>
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href="#methods">Begin Your Analysis</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
<section id="team" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40"> {/* Or use bg-background */}
  <div className="container mx-auto px-4 md:px-6">
    <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10 md:mb-12">
      <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm dark:bg-primary/10 dark:text-primary">
        Our Team
      </div>
      <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
        Meet the Developers
      </h2>
      <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg/relaxed">
        Passionate about creating effective tools to support your agricultural decisions.
      </p>
    </div>
    <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-3 md:gap-10 lg:gap-12">
      {/* Developer 1 */}
      <div className="flex flex-col items-center space-y-3 text-center">
        {/* Optional: Avatar Placeholder */}
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20">
          {/* Replace with actual image or keep as an icon placeholder */}
          {/* <User className="h-12 w-12 text-primary" /> */}
          <span className="text-3xl font-semibold text-primary">RK</span> {/* Initials as placeholder */}
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold">Rafli Kusumawardhana</h3>
          {/* <p className="text-sm text-muted-foreground">Developer</p> -- You can add a generic title if desired */}
        </div>
      </div>

      {/* Developer 2 */}
      <div className="flex flex-col items-center space-y-3 text-center">
        {/* Optional: Avatar Placeholder */}
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20">
          {/* <User className="h-12 w-12 text-primary" /> */}
          <span className="text-3xl font-semibold text-primary">FS</span> {/* Initials as placeholder */}
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold">Frederik Sakspari</h3>
          {/* <p className="text-sm text-muted-foreground">Developer</p> */}
        </div>
      </div>

      {/* Developer 3 */}
      <div className="flex flex-col items-center space-y-3 text-center">
        {/* Optional: Avatar Placeholder */}
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20">
          {/* <User className="h-12 w-12 text-primary" /> */}
          <span className="text-3xl font-semibold text-primary">BM</span> {/* Initials as placeholder */}
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold">Bintang Madani</h3>
          {/* <p className="text-sm text-muted-foreground">Developer</p> */}
        </div>
      </div>
    </div>
  </div>
</section>
      </>
  );
}