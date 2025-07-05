"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity } from "lucide-react"

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    apiCalls: 0,
    cacheHits: 0,
    memoryUsage: 0,
  })

  useEffect(() => {
    // Monitor performance metrics
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry) => {
        if (entry.entryType === "navigation") {
          setMetrics((prev) => ({
            ...prev,
            loadTime: entry.loadEventEnd - entry.loadEventStart,
          }))
        }
      })
    })

    observer.observe({ entryTypes: ["navigation", "resource"] })

    return () => observer.disconnect()
  }, [])

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Performance Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{metrics.loadTime.toFixed(0)}ms</div>
            <div className="text-sm text-gray-600">Load Time</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{metrics.apiCalls}</div>
            <div className="text-sm text-gray-600">API Calls</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{metrics.cacheHits}%</div>
            <div className="text-sm text-gray-600">Cache Hit Rate</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
