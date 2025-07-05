"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PokemonCard } from "@/components/pokemon-card"
import type { Pokemon } from "@/types/pokemon"

interface RegionExplorerProps {
  pokemon: Pokemon[]
  onPokemonSelect: (pokemon: Pokemon) => void
}

interface RegionInfo {
  name: string
  generation: number
  description: string
  color: string
  bgColor: string
  textColor: string
}

const REGION_INFO: RegionInfo[] = [
  {
    name: "Kanto",
    generation: 1,
    description: "The original region where the Pokémon journey began",
    color: "bg-red-500",
    bgColor: "bg-red-50",
    textColor: "text-red-600",
  },
  {
    name: "Johto",
    generation: 2,
    description: "A region rich in tradition and legendary Pokémon",
    color: "bg-yellow-500",
    bgColor: "bg-yellow-50",
    textColor: "text-yellow-600",
  },
  {
    name: "Hoenn",
    generation: 3,
    description: "A tropical region with diverse landscapes and weather",
    color: "bg-green-500",
    bgColor: "bg-green-50",
    textColor: "text-green-600",
  },
  {
    name: "Sinnoh",
    generation: 4,
    description: "A mountainous region with ancient mythology",
    color: "bg-blue-500",
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
  },
  {
    name: "Unova",
    generation: 5,
    description: "A modern region inspired by urban landscapes",
    color: "bg-purple-500",
    bgColor: "bg-purple-50",
    textColor: "text-purple-600",
  },
  {
    name: "Kalos",
    generation: 6,
    description: "An elegant region known for beauty and fashion",
    color: "bg-pink-500",
    bgColor: "bg-pink-50",
    textColor: "text-pink-600",
  },
  {
    name: "Alola",
    generation: 7,
    description: "A tropical paradise with unique island culture",
    color: "bg-orange-500",
    bgColor: "bg-orange-50",
    textColor: "text-orange-600",
  },
  {
    name: "Galar",
    generation: 8,
    description: "An industrial region with a rich Pokémon League tradition",
    color: "bg-indigo-500",
    bgColor: "bg-indigo-50",
    textColor: "text-indigo-600",
  },
  {
    name: "Paldea",
    generation: 9,
    description: "The newest region with open-world exploration",
    color: "bg-teal-500",
    bgColor: "bg-teal-50",
    textColor: "text-teal-600",
  },
]

export function RegionExplorer({ pokemon, onPokemonSelect }: RegionExplorerProps) {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)

  // Ensure pokemon is always an array
  const safePokemon = Array.isArray(pokemon) ? pokemon : []

  const regionsWithData = useMemo(() => {
    return REGION_INFO.map((regionInfo) => {
      const regionPokemon = safePokemon.filter((poke) => poke.region === regionInfo.name)
      return {
        ...regionInfo,
        pokemon: regionPokemon,
        count: regionPokemon.length,
        hasData: regionPokemon.length > 0,
      }
    })
  }, [safePokemon])

  const getRegionPokemon = (regionName: string) => {
    return safePokemon.filter((poke) => poke.region === regionName)
  }

  const selectedRegionData = selectedRegion ? regionsWithData.find((r) => r.name === selectedRegion) : null
  const regionPokemon = selectedRegionData ? getRegionPokemon(selectedRegionData.name) : []

  // Calculate stats
  const totalRegions = regionsWithData.length
  const regionsWithPokemon = regionsWithData.filter((r) => r.hasData).length
  const totalPokemon = safePokemon.length
  const latestGeneration = Math.max(...regionsWithData.map((r) => r.generation))

  const handleRegionSelect = (regionName: string) => {
    setSelectedRegion(selectedRegion === regionName ? null : regionName)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Region Explorer</h2>
        <p className="text-gray-600 mb-2">Explore Pokémon from all nine regions and generations</p>
        <div className="flex justify-center gap-4 text-sm text-gray-500">
          <span>
            {regionsWithPokemon} of {totalRegions} regions have Pokémon data
          </span>
          <span>•</span>
          <span>{totalPokemon} total Pokémon available</span>
        </div>
      </div>

      {/* All Regions Grid - Always show all 9 regions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {regionsWithData.map((region) => (
          <Card
            key={region.name}
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
              selectedRegion === region.name
                ? `ring-2 ring-offset-2 ${region.color.replace("bg-", "ring-")} ${region.bgColor}`
                : region.hasData
                  ? "hover:shadow-md"
                  : "opacity-60"
            }`}
            onClick={() => handleRegionSelect(region.name)}
          >
            <CardHeader className="text-center pb-3">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className={`w-4 h-4 rounded-full ${region.color}`}></div>
                <CardTitle className="text-xl">{region.name}</CardTitle>
              </div>
              <Badge variant={region.hasData ? "default" : "secondary"} className="mx-auto">
                Generation {region.generation}
              </Badge>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <div className={`text-3xl font-bold mb-2 ${region.hasData ? region.textColor : "text-gray-400"}`}>
                {region.count}
              </div>
              <div className="text-gray-600 text-sm mb-3">{region.count === 1 ? "Pokémon" : "Pokémon"} Available</div>
              <p className="text-xs text-gray-500 leading-relaxed">{region.description}</p>

              {selectedRegion === region.name && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedRegion(null)
                  }}
                >
                  Clear Selection
                </Button>
              )}

              {!region.hasData && (
                <div className="mt-3">
                  <Badge variant="outline" className="text-xs">
                    Coming Soon
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Region Details */}
      {selectedRegionData && selectedRegionData.hasData && (
        <Card
          className={`${selectedRegionData.bgColor} border-2 ${selectedRegionData.color.replace("bg-", "border-")}`}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-6 h-6 rounded-full ${selectedRegionData.color}`}></div>
                  <CardTitle className="text-2xl">{selectedRegionData.name} Region</CardTitle>
                </div>
                <p className="text-gray-600">
                  Generation {selectedRegionData.generation} • {regionPokemon.length} Pokémon •{" "}
                  {selectedRegionData.description}
                </p>
              </div>
              <Badge variant="outline" className="text-lg px-4 py-2">
                Gen {selectedRegionData.generation}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {regionPokemon.map((pokemon) => (
                <PokemonCard key={pokemon.id} pokemon={pokemon} onClick={() => onPokemonSelect(pokemon)} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected Region - No Data State */}
      {selectedRegionData && !selectedRegionData.hasData && (
        <Card
          className={`${selectedRegionData.bgColor} border-2 ${selectedRegionData.color.replace("bg-", "border-")}`}
        >
          <CardContent className="p-12 text-center">
            <div
              className={`w-24 h-24 ${selectedRegionData.bgColor} rounded-full mx-auto mb-4 flex items-center justify-center border-4 ${selectedRegionData.color.replace("bg-", "border-")}`}
            >
              <div className={`w-12 h-12 ${selectedRegionData.color} rounded-full opacity-50`}></div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{selectedRegionData.name} Region</h3>
            <p className="text-gray-600 mb-4">{selectedRegionData.description}</p>
            <Badge variant="outline" className="mb-4">
              Generation {selectedRegionData.generation}
            </Badge>
            <p className="text-gray-500">Pokémon data for this region is coming soon! Check back later for updates.</p>
          </CardContent>
        </Card>
      )}

      {/* Empty State - No Region Selected */}
      {!selectedRegion && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full"></div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Choose a Region to Explore</h3>
            <p className="text-gray-600 mb-4">
              Select any region above to explore its Pokémon and learn about different generations
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {regionsWithData
                .filter((r) => r.hasData)
                .map((region) => (
                  <Button
                    key={region.name}
                    variant="outline"
                    size="sm"
                    onClick={() => handleRegionSelect(region.name)}
                    className="text-xs"
                  >
                    {region.name}
                  </Button>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Region Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">{totalRegions}</div>
            <div className="text-sm text-gray-600">Total Regions</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">{regionsWithPokemon}</div>
            <div className="text-sm text-gray-600">With Pokémon</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">{totalPokemon}</div>
            <div className="text-sm text-gray-600">Total Pokémon</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">{latestGeneration}</div>
            <div className="text-sm text-gray-600">Latest Gen</div>
          </CardContent>
        </Card>
      </div>

      {/* Generation Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Generation Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {regionsWithData.map((region) => (
              <div
                key={region.name}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                  selectedRegion === region.name
                    ? `${region.bgColor} ${region.color.replace("bg-", "border-")} border-2`
                    : region.hasData
                      ? "bg-gray-100 hover:bg-gray-200"
                      : "bg-gray-50 opacity-60"
                }`}
                onClick={() => handleRegionSelect(region.name)}
              >
                <div className={`w-3 h-3 rounded-full ${region.color}`}></div>
                <span className="text-sm font-medium">{region.name}</span>
                <Badge variant="outline" className="text-xs">
                  Gen {region.generation}
                </Badge>
                {region.hasData && <span className="text-xs text-gray-500">({region.count})</span>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
