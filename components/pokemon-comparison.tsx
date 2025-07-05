"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUp, ArrowDown, Minus, RotateCcw } from "lucide-react"
import type { Pokemon } from "@/types/pokemon"
import { PokemonImage } from "@/components/pokemon-image"

const typeColors: Record<string, string> = {
  normal: "bg-gray-400",
  fire: "bg-red-500",
  water: "bg-blue-500",
  electric: "bg-yellow-400 text-gray-900",
  grass: "bg-green-500",
  ice: "bg-cyan-300 text-gray-900",
  fighting: "bg-red-700",
  poison: "bg-purple-500",
  ground: "bg-yellow-600",
  flying: "bg-indigo-400",
  psychic: "bg-pink-500",
  bug: "bg-green-400 text-gray-900",
  rock: "bg-yellow-800",
  ghost: "bg-purple-700",
  dragon: "bg-indigo-700",
  dark: "bg-gray-800",
  steel: "bg-gray-500",
  fairy: "bg-pink-300 text-gray-900",
}

interface PokemonComparisonProps {
  pokemon: Pokemon[]
}

export function PokemonComparison({ pokemon }: PokemonComparisonProps) {
  const [pokemon1, setPokemon1] = useState<Pokemon | null>(null)
  const [pokemon2, setPokemon2] = useState<Pokemon | null>(null)

  const handleReset = () => {
    setPokemon1(null)
    setPokemon2(null)
  }

  const getStatComparison = (stat1: number, stat2: number) => {
    if (stat1 > stat2) return "higher"
    if (stat1 < stat2) return "lower"
    return "equal"
  }

  const StatComparison = ({ label, stat1, stat2 }: { label: string; stat1: number; stat2: number }) => {
    const comparison1 = getStatComparison(stat1, stat2)
    const comparison2 = getStatComparison(stat2, stat1)

    return (
      <div className="grid grid-cols-3 gap-4 items-center py-3 border-b border-gray-100 last:border-b-0">
        <div
          className={`text-center p-2 rounded ${
            comparison1 === "higher"
              ? "bg-green-100 text-green-800"
              : comparison1 === "lower"
                ? "bg-red-100 text-red-800"
                : "bg-gray-100 text-gray-800"
          }`}
        >
          <div className="flex items-center justify-center gap-1">
            <span className="font-semibold">{stat1}</span>
            {comparison1 === "higher" && <ArrowUp className="w-4 h-4" />}
            {comparison1 === "lower" && <ArrowDown className="w-4 h-4" />}
            {comparison1 === "equal" && <Minus className="w-4 h-4" />}
          </div>
        </div>

        <div className="text-center font-medium text-gray-700">{label}</div>

        <div
          className={`text-center p-2 rounded ${
            comparison2 === "higher"
              ? "bg-green-100 text-green-800"
              : comparison2 === "lower"
                ? "bg-red-100 text-red-800"
                : "bg-gray-100 text-gray-800"
          }`}
        >
          <div className="flex items-center justify-center gap-1">
            <span className="font-semibold">{stat2}</span>
            {comparison2 === "higher" && <ArrowUp className="w-4 h-4" />}
            {comparison2 === "lower" && <ArrowDown className="w-4 h-4" />}
            {comparison2 === "equal" && <Minus className="w-4 h-4" />}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Pokémon Comparison</h2>
        <p className="text-gray-600 mb-8">Select two Pokémon to compare their stats and abilities side by side</p>
      </div>

      {/* Pokemon Selectors */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Select First Pokémon</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={pokemon1?.id.toString() || ""}
              onValueChange={(value) => {
                const selected = pokemon.find((p) => p.id.toString() === value)
                setPokemon1(selected || null)
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a Pokémon..." />
              </SelectTrigger>
              <SelectContent>
                {pokemon.map((pokemon) => (
                  <SelectItem key={pokemon.id} value={pokemon.id.toString()}>
                    #{pokemon.id.toString().padStart(3, "0")} {pokemon.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Select Second Pokémon</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={pokemon2?.id.toString() || ""}
              onValueChange={(value) => {
                const selected = pokemon.find((p) => p.id.toString() === value)
                setPokemon2(selected || null)
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a Pokémon..." />
              </SelectTrigger>
              <SelectContent>
                {pokemon.map((pokemon) => (
                  <SelectItem key={pokemon.id} value={pokemon.id.toString()}>
                    #{pokemon.id.toString().padStart(3, "0")} {pokemon.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* Reset Button */}
      {(pokemon1 || pokemon2) && (
        <div className="text-center">
          <Button onClick={handleReset} variant="outline" className="gap-2">
            <RotateCcw className="w-4 h-4" />
            Reset Comparison
          </Button>
        </div>
      )}

      {/* Comparison Display */}
      {pokemon1 && pokemon2 && (
        <div className="space-y-8">
          {/* Pokemon Info Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {[pokemon1, pokemon2].map((pokemon, index) => (
              <Card key={pokemon.id}>
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="relative">
                      <div className="w-full h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                        <PokemonImage
                          src={pokemon.image || "/placeholder.svg"}
                          alt={pokemon.name}
                          width={150}
                          height={150}
                          className="object-contain"
                          pokemonId={pokemon.id}
                        />
                      </div>
                      <Badge variant="secondary" className="absolute top-2 right-2">
                        #{pokemon.id.toString().padStart(3, "0")}
                      </Badge>
                    </div>

                    <h3 className="text-2xl font-bold">{pokemon.name}</h3>

                    <div className="flex flex-wrap gap-2 justify-center">
                      {pokemon.types.map((type) => (
                        <Badge key={type} className={`font-medium ${typeColors[type] || "bg-gray-400 text-white"}`}>
                          {type.toUpperCase()}
                        </Badge>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-gray-50 rounded p-2">
                        <div className="text-gray-600">Height</div>
                        <div className="font-semibold">{pokemon.height}</div>
                      </div>
                      <div className="bg-gray-50 rounded p-2">
                        <div className="text-gray-600">Weight</div>
                        <div className="font-semibold">{pokemon.weight}</div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded p-2 text-sm">
                      <div className="text-gray-600">Region</div>
                      <div className="font-semibold">
                        {pokemon.region} (Gen {pokemon.generation})
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Stats Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-xl">Base Stats Comparison</CardTitle>
              <p className="text-center text-gray-600">Green indicates higher stat, red indicates lower stat</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <StatComparison label="HP" stat1={pokemon1.stats.hp} stat2={pokemon2.stats.hp} />
                <StatComparison label="Attack" stat1={pokemon1.stats.attack} stat2={pokemon2.stats.attack} />
                <StatComparison label="Defense" stat1={pokemon1.stats.defense} stat2={pokemon2.stats.defense} />
                <StatComparison
                  label="Sp. Attack"
                  stat1={pokemon1.stats.specialAttack}
                  stat2={pokemon2.stats.specialAttack}
                />
                <StatComparison
                  label="Sp. Defense"
                  stat1={pokemon1.stats.specialDefense}
                  stat2={pokemon2.stats.specialDefense}
                />
                <StatComparison label="Speed" stat1={pokemon1.stats.speed} stat2={pokemon2.stats.speed} />
              </div>

              {/* Total Stats */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4 items-center">
                  <div className="text-center p-3 bg-blue-50 rounded">
                    <div className="text-lg font-bold text-blue-800">
                      {Object.values(pokemon1.stats).reduce((a, b) => a + b, 0)}
                    </div>
                    <div className="text-sm text-blue-600">Total</div>
                  </div>

                  <div className="text-center font-bold text-gray-700">Base Stat Total</div>

                  <div className="text-center p-3 bg-blue-50 rounded">
                    <div className="text-lg font-bold text-blue-800">
                      {Object.values(pokemon2.stats).reduce((a, b) => a + b, 0)}
                    </div>
                    <div className="text-sm text-blue-600">Total</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {!pokemon1 && !pokemon2 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <div className="w-12 h-12 bg-gray-400 rounded-full"></div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Compare</h3>
            <p className="text-gray-600">
              Select two Pokémon above to see a detailed comparison of their stats and abilities
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
