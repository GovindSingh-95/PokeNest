"use client"

import { Suspense } from "react"
import { BattleSimulator } from "@/components/battle-simulator"
import { usePokemonData } from "@/hooks/use-pokemon-data"
import { PokemonLoadingProgress } from "@/components/pokemon-loading-progress"

export default function BattlePage() {
  const { pokemon, loading, error, progress } = usePokemonData()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <PokemonLoadingProgress progress={progress} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Pokemon Data</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<PokemonLoadingProgress progress={100} />}>
          <BattleSimulator pokemon={pokemon} />
        </Suspense>
      </div>
    </div>
  )
}
