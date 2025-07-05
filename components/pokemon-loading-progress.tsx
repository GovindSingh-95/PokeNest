"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface PokemonLoadingProgressProps {
  progress: { current: number; total: number }
  currentRegion?: string
}

export function PokemonLoadingProgress({ progress, currentRegion }: PokemonLoadingProgressProps) {
  const percentage = progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0

  const getRegionFromCount = (count: number) => {
    if (count <= 151) return "Kanto"
    if (count <= 251) return "Johto"
    if (count <= 386) return "Hoenn"
    if (count <= 493) return "Sinnoh"
    if (count <= 649) return "Unova"
    if (count <= 721) return "Kalos"
    if (count <= 809) return "Alola"
    if (count <= 905) return "Galar"
    return "Paldea"
  }

  const currentLoadingRegion = getRegionFromCount(progress.current)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
            <div className="w-8 h-8 bg-white rounded-full"></div>
          </div>
          <CardTitle className="text-2xl">Loading Pokédex</CardTitle>
          <p className="text-gray-600">Fetching Pokémon data from PokéAPI...</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>
                {progress.current} / {progress.total}
              </span>
            </div>
            <Progress value={percentage} className="h-3" />
            <div className="text-center">
              <Badge variant="outline" className="text-sm">
                {percentage}% Complete
              </Badge>
            </div>
          </div>

          <div className="text-center space-y-2">
            <div className="text-sm text-gray-600">Currently Loading</div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {currentLoadingRegion} Region
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            {[
              { name: "Kanto", max: 151 },
              { name: "Johto", max: 251 },
              { name: "Hoenn", max: 386 },
              { name: "Sinnoh", max: 493 },
              { name: "Unova", max: 649 },
              { name: "Kalos", max: 721 },
              { name: "Alola", max: 809 },
              { name: "Galar", max: 905 },
              { name: "Paldea", max: 1010 },
            ].map((region) => (
              <div
                key={region.name}
                className={`p-2 rounded text-center ${
                  progress.current >= region.max
                    ? "bg-green-100 text-green-700"
                    : currentLoadingRegion === region.name
                      ? "bg-blue-100 text-blue-700 animate-pulse"
                      : "bg-gray-100 text-gray-500"
                }`}
              >
                {region.name}
              </div>
            ))}
          </div>

          <div className="text-center text-xs text-gray-500">
            This may take a few moments as we fetch data from the official Pokémon API
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
