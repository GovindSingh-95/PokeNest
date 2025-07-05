"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Accessibility, Eye, Volume2, Keyboard } from "lucide-react"

export function AccessibilityPanel() {
  const [highContrast, setHighContrast] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [largeText, setLargeText] = useState(false)
  const [screenReader, setScreenReader] = useState(false)

  useEffect(() => {
    // Apply accessibility settings
    document.documentElement.classList.toggle("high-contrast", highContrast)
    document.documentElement.classList.toggle("reduced-motion", reducedMotion)
    document.documentElement.classList.toggle("large-text", largeText)
  }, [highContrast, reducedMotion, largeText])

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Accessibility className="w-4 h-4" />
          Accessibility Options
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span className="text-sm">High Contrast</span>
          </div>
          <Switch checked={highContrast} onCheckedChange={setHighContrast} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4" />
            <span className="text-sm">Reduced Motion</span>
          </div>
          <Switch checked={reducedMotion} onCheckedChange={setReducedMotion} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Keyboard className="w-4 h-4" />
            <span className="text-sm">Large Text</span>
          </div>
          <Switch checked={largeText} onCheckedChange={setLargeText} />
        </div>

        <div className="pt-2 border-t">
          <p className="text-xs text-gray-600">
            Press <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Alt + A</kbd> to toggle this panel
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
