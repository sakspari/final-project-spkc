import { ProfileMatchingApp } from "@/components/profile-matching/profile-matching-app"

export default function Home() {
  return (
    <main className="container mx-auto py-6 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Profile Matching Decision Tool</h1>
      <p className="text-center mb-4 text-muted-foreground">Profile Matching (Gap Analysis Method) is a decision-making technique used to evaluate how closely candidates (e.g., corn varieties, job applicants, potential investments) align with a predefined ideal profile. This method identifies the "gaps" between each candidate's attributes and the desired attributes, often assigning weights to different criteria to determine the best overall fit. This calculator helps you apply the Profile Matching method to systematically compare options against your ideal requirements.</p>
      <ProfileMatchingApp />
    </main>
  )
}
