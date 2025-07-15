"use client"

/**
 * Client-side wrapper that lazy-loads the heavy dashboard bundle.
 * Keeping the dynamic import here avoids using `ssr: false` in a
 * Server Component while still preventing the code from being
 * rendered on the server.
 */
import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"

const DashboardClient = dynamic(() => import("@/components/dashboard-client"), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
      <span className="ml-2 text-gray-500">Loading dashboard…</span>
    </div>
  ),
})

export default function DashboardClientWrapper() {
  return <DashboardClient />
}
