import { redirect } from "next/navigation"

export default function HomePage() {
  // Redirect to the onboarding page
  redirect("/onboarding")

  // This won't be rendered due to the redirect, but is needed for TypeScript
  return null
}
