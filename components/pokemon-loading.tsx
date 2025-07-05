"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Loader2 } from "lucide-react"

// Grid skeleton for Pokemon cards
export function PokemonGridSkeleton({ count = 20 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="bg-white/80 backdrop-blur-sm border-orange-200">
          <CardContent className="p-4">
            <div className="text-center space-y-3">
              <div className="relative">
                <Skeleton className="w-full h-32 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg mb-2" />
                <Skeleton className="absolute top-2 right-2 w-12 h-5 bg-orange-100" />
              </div>
              <Skeleton className="h-6 w-24 mx-auto bg-gray-200" />
              <div className="flex gap-1 justify-center">
                <Skeleton className="h-5 w-12 bg-red-100" />
                <Skeleton className="h-5 w-12 bg-blue-100" />
              </div>
              <Skeleton className="h-4 w-16 mx-auto bg-gray-100" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Loading spinner component
export function LoadingSpinner() {
  return (
    <div className="flex justify-center py-8">
      <div className="flex items-center gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
        <span className="text-gray-600">Loading more Pokémon...</span>
      </div>
    </div>
  )
}

// Full-screen loading progress component
interface PokemonLoadingProgressProps {
  progress: {
    current: number
    total: number
    currentRegion?: string
  }
}

export function PokemonLoadingProgress({ progress }: PokemonLoadingProgressProps) {
  const percentage = Math.round((progress.current / progress.total) * 100)

  const regions = [
    { name: "Kanto", range: "1-151", color: "bg-red-500" },
    { name: "Johto", range: "152-251", color: "bg-yellow-500" },
    { name: "Hoenn", range: "252-386", color: "bg-green-500" },
    { name: "Sinnoh", range: "387-493", color: "bg-blue-500" },
    { name: "Unova", range: "494-649", color: "bg-purple-500" },
    { name: "Kalos", range: "650-721", color: "bg-pink-500" },
    { name: "Alola", range: "722-809", color: "bg-orange-500" },
    { name: "Galar", range: "810-905", color: "bg-indigo-500" },
    { name: "Paldea", range: "906-1010", color: "bg-teal-500" },
  ]

  const getCurrentRegion = (current: number) => {
    if (current <= 151) return "Kanto"
    if (current <= 251) return "Johto"
    if (current <= 386) return "Hoenn"
    if (current <= 493) return "Sinnoh"
    if (current <= 649) return "Unova"
    if (current <= 721) return "Kalos"
    if (current <= 809) return "Alola"
    if (current <= 905) return "Galar"
    return "Paldea"
  }

  const currentRegion = getCurrentRegion(progress.current)

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
      <div className="max-w-2xl w-full mx-auto px-4">
        <div className="text-center space-y-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-2xl">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                </div>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-pink-400 rounded-full animate-bounce"></div>
            </div>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                PokéNest
              </span>
            </h1>
            <p className="text-xl text-gray-600">Loading your Pokémon adventure...</p>
          </div>

          {/* Progress Info */}
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">{percentage}%</div>
              <div className="text-gray-600">
                Loading Pokémon {progress.current} of {progress.total}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Currently exploring: <span className="font-medium text-orange-600">{currentRegion}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full">
              <Progress value={percentage} className="h-3 bg-orange-100" />
            </div>
          </div>

          {/* Region Grid */}
          <div className="grid grid-cols-3 gap-3">
            {regions.map((region) => {
              const [start, end] = region.range.split("-").map(Number)
              const isActive = progress.current >= start && progress.current <= end
              const isComplete = progress.current > end

              return (
                <div
                  key={region.name}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    isActive
                      ? `${region.color.replace("bg-", "border-")} bg-white shadow-lg scale-105`
                      : isComplete
                        ? `${region.color} text-white`
                        : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="text-sm font-medium">{region.name}</div>
                  <div className="text-xs opacity-75">{region.range}</div>
                  {isActive && <div className="text-xs mt-1 text-orange-600">Loading...</div>}
                  {isComplete && <div className="text-xs mt-1">✓ Complete</div>}
                </div>
              )
            })}
          </div>

          {/* Loading Tips */}
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-orange-200">
            <h3 className="font-semibold text-gray-900 mb-2">Did you know?</h3>
            <p className="text-sm text-gray-600">
              We're fetching authentic Pokémon data from the official PokéAPI, including real stats, evolution chains,
              and descriptions for the most accurate Pokédex experience!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
