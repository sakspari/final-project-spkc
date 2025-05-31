import Link from "next/link"
import { BarChart3, Brain, GitCompare } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            DSS App
          </Link>
          <nav className="hidden md:flex gap-6 items-center">
            <Link href="/ahp" className="text-sm font-medium transition-colors hover:text-primary">
              AHP
            </Link>
            <Link href="/topsis" className="text-sm font-medium transition-colors hover:text-primary">
              TOPSIS
            </Link>
            <Link href="/profile-matching" className="text-sm font-medium transition-colors hover:text-primary">
              Profile Matching
            </Link>
            <ThemeToggle />
          </nav>
          <div className="flex md:hidden items-center gap-4">
            <ThemeToggle />
            <Button variant="outline" size="icon" className="md:hidden">
              <span className="sr-only">Toggle menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Empower Your Decisions with Precision
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  A comprehensive decision support system that helps you make complex decisions with confidence using
                  advanced analytical methods.
                </p>
              </div>
              <div className="space-x-4">
                <Button asChild>
                  <Link href="#methods">Explore Methods</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/docs">Documentation</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section id="methods" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Decision Support Methods
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Choose from our suite of powerful decision-making methodologies to solve your complex problems.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <GitCompare className="h-6 w-6 text-primary" />
                    <CardTitle>AHP</CardTitle>
                  </div>
                  <CardDescription>Analytic Hierarchy Process</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Break down complex decisions into hierarchical structures and make pairwise comparisons to determine
                    the best option.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href="/ahp">Learn More</Link>
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-6 w-6 text-primary" />
                    <CardTitle>TOPSIS</CardTitle>
                  </div>
                  <CardDescription>Technique for Order Preference by Similarity to Ideal Solution</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Find the best alternative by measuring its distance from the ideal solution and the negative-ideal
                    solution.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href="/topsis">Learn More</Link>
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Brain className="h-6 w-6 text-primary" />
                    <CardTitle>Profile Matching</CardTitle>
                  </div>
                  <CardDescription>Gap Analysis Method</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Compare profiles against ideal requirements to find the best match based on weighted criteria and
                    gap analysis.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href="/profile-matching">Learn More</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Why Choose Our DSS App?</h2>
                <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our Decision Support System provides a comprehensive suite of tools to help you make informed
                  decisions based on data and proven methodologies.
                </p>
                <ul className="grid gap-2">
                  <li className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-primary"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Multiple decision-making methodologies in one platform</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-primary"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Intuitive interface for complex decision processes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-primary"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Data-driven insights for better decision-making</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-primary"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Customizable criteria and weighting systems</span>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="rounded-lg border bg-background p-6 shadow-sm">
                  <h3 className="text-xl font-bold">Get Started Today</h3>
                  <p className="text-muted-foreground">
                    Start making better decisions with our comprehensive decision support system.
                  </p>
                  <div className="mt-4">
                    <Button asChild>
                      <Link href="/signup">Create Free Account</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} DSS App. All rights reserved.</p>
          <nav className="flex gap-4 sm:gap-6">
            <Link href="/terms" className="text-sm font-medium hover:underline">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-sm font-medium hover:underline">
              Privacy Policy
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:underline">
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
