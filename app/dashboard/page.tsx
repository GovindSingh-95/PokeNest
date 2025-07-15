"use client"

import dynamic from "next/dynamic"

// Lazy-load the client bundle to keep the server footprint minimal
const DashboardClient = dynamic(() => import("@/components/dashboard-client"), {
  ssr: false,
})

export default function DashboardPage() {
  return <DashboardClient />
}
