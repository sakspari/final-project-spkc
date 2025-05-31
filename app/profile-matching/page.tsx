import { ProfileMatchingApp } from "@/components/profile-matching/profile-matching-app"

export default function Home() {
  return (
    <main className="container mx-auto py-6 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Profile Matching Decision Tool</h1>
      <ProfileMatchingApp />
    </main>
  )
}
