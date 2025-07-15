"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, TrendingUp, TrendingDown, Minus, Zap } from "lucide-react"
import { PokemonImage } from "@/components/pokemon-image"
import { PokemonSelector } from "@/components/pokemon-selector"
import { TypeBadge } from "@/components/type-badge"
import type { Pokemon } from "@/types/pokemon"

interface PokemonComparisonProps {
  pokemon: Pokemon[]
}

interface StatComparison {
  stat: string
  pokemon1: number
  pokemon2: number
  difference: number
  winner: "pokemon1" | "pokemon2" | "tie"
}

export function PokemonComparison({ pokemon }: PokemonComparisonProps) {
  const [selectedPokemon1, setSelectedPokemon1] = useState<string>("")
  const [selectedPokemon2, setSelectedPokemon2] = useState<string>("")

  const pokemon1 = pokemon.find((p) => p.id.toString() === selectedPokemon1)
  const pokemon2 = pokemon.find((p) => p.id.toString() === selectedPokemon2)

  const statComparisons = useMemo((): StatComparison[] => {
    if (!pokemon1 || !pokemon2) return []

    const statNames = Object.keys(pokemon1.stats) as (keyof typeof pokemon1.stats)[]

    return statNames.map((stat) => {
      const value1 = pokemon1.stats[stat]
      const value2 = pokemon2.stats[stat]
      const difference = value1 - value2

      let winner: "pokemon1" | "pokemon2" | "tie"
      if (difference > 0) winner = "pokemon1"
      else if (difference < 0) winner = "pokemon2"
      else winner = "tie"

      return {
        stat: stat.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()),
        pokemon1: value1,
        pokemon2: value2,
        difference: Math.abs(difference),
        winner,
      }
    })
  }, [pokemon1, pokemon2])

  const totalStats = useMemo(() => {
    if (!pokemon1 || !pokemon2) return null

    const total1 = Object.values(pokemon1.stats).reduce((sum, stat) => sum + stat, 0)
    const total2 = Object.values(pokemon2.stats).reduce((sum, stat) => sum + stat, 0)

    return {
      pokemon1: total1,
      pokemon2: total2,
      difference: Math.abs(total1 - total2),
      winner: total1 > total2 ? "pokemon1" : total1 < total2 ? "pokemon2" : "tie",
    }
  }, [pokemon1, pokemon2])

  const typeAdvantages = useMemo(() => {
    if (!pokemon1 || !pokemon2) return null

    // Simple type effectiveness check (this could be expanded with full type chart)
    const typeChart: Record<string, string[]> = {
      fire: ["grass", "ice", "bug", "steel"],
      water: ["fire", "ground", "rock"],
      grass: ["water", "ground", "rock"],
      electric: ["water", "flying"],
      ice: ["grass", "ground", "flying", "dragon"],
      fighting: ["normal", "ice", "rock", "dark", "steel"],
      poison: ["grass", "fairy"],
      ground: ["fire", "electric", "poison", "rock", "steel"],
      flying: ["grass", "fighting", "bug"],
      psychic: ["fighting", "poison"],
      bug: ["grass", "psychic", "dark"],
      rock: ["fire", "ice", "flying", "bug"],
      ghost: ["psychic", "ghost"],
      dragon: ["dragon"],
      dark: ["psychic", "ghost"],
      steel: ["ice", "rock", "fairy"],
      fairy: ["fighting", "dragon", "dark"],
    }

    const pokemon1Advantages = pokemon1.types.flatMap(
      (type) => typeChart[type]?.filter((weakness) => pokemon2.types.includes(weakness)) || [],
    )

    const pokemon2Advantages = pokemon2.types.flatMap(
      (type) => typeChart[type]?.filter((weakness) => pokemon1.types.includes(weakness)) || [],
    )

    return {
      pokemon1: [...new Set(pokemon1Advantages)],
      pokemon2: [...new Set(pokemon2Advantages)],
    }
  }, [pokemon1, pokemon2])

  const getStatIcon = (winner: "pokemon1" | "pokemon2" | "tie") => {
    switch (winner) {
      case "pokemon1":
        return <TrendingUp className="w-4 h-4 text-green-600" />
      case "pokemon2":
        return <TrendingDown className="w-4 h-4 text-red-600" />
      default:
        return <Minus className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatColor = (winner: "pokemon1" | "pokemon2" | "tie", isPokemon1: boolean) => {
    if (winner === "tie") return "text-gray-600"
    if ((winner === "pokemon1" && isPokemon1) || (winner === "pokemon2" && !isPokemon1)) {
      return "text-green-600 font-bold"
    }
    return "text-red-600"
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">⚖️ Pokémon Comparison</h2>
        <p className="text-gray-600 mb-8">
          Compare two Pokémon side by side to analyze their stats, types, and battle potential!
        </p>
      </div>

      {/* Pokemon Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Pokémon to Compare</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-blue-700">First Pokémon</label>
              <PokemonSelector
                pokemon={pokemon}
                selectedPokemon={selectedPokemon1}
                onSelect={setSelectedPokemon1}
                placeholder="Choose first Pokémon..."
                excludeIds={selectedPokemon2 ? [Number.parseInt(selectedPokemon2)] : []}
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-red-700">Second Pokémon</label>
              <PokemonSelector
                pokemon={pokemon}
                selectedPokemon={selectedPokemon2}
                onSelect={setSelectedPokemon2}
                placeholder="Choose second Pokémon..."
                excludeIds={selectedPokemon1 ? [Number.parseInt(selectedPokemon1)] : []}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comparison Results */}
      {pokemon1 && pokemon2 ? (
        <div className="space-y-6">
          {/* Pokemon Overview */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-blue-200">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <PokemonImage
                    src={pokemon1.image}
                    alt={pokemon1.name}
                    width={120}
                    height={120}
                    className="mx-auto"
                    pokemonId={pokemon1.id}
                  />
                  <div>
                    <h3 className="text-2xl font-bold text-blue-700">{pokemon1.name}</h3>
                    <p className="text-gray-600">
                      #{pokemon1.id.toString().padStart(3, "0")} • {pokemon1.region}
                    </p>
                  </div>
                  <div className="flex gap-2 justify-center">
                    {pokemon1.types.map((type) => (
                      <TypeBadge key={type} type={type} />
                    ))}
                  </div>
                  {totalStats && (
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Base Stat Total</div>
                      <div className={`text-2xl font-bold ${getStatColor(totalStats.winner, true)}`}>
                        {totalStats.pokemon1}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <PokemonImage
                    src={pokemon2.image}
                    alt={pokemon2.name}
                    width={120}
                    height={120}
                    className="mx-auto"
                    pokemonId={pokemon2.id}
                  />
                  <div>
                    <h3 className="text-2xl font-bold text-red-700">{pokemon2.name}</h3>
                    <p className="text-gray-600">
                      #{pokemon2.id.toString().padStart(3, "0")} • {pokemon2.region}
                    </p>
                  </div>
                  <div className="flex gap-2 justify-center">
                    {pokemon2.types.map((type) => (
                      <TypeBadge key={type} type={type} />
                    ))}
                  </div>
                  {totalStats && (
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Base Stat Total</div>
                      <div className={`text-2xl font-bold ${getStatColor(totalStats.winner, false)}`}>
                        {totalStats.pokemon2}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Stats Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Detailed Stats Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {statComparisons.map((comparison) => (
                  <div key={comparison.stat} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{comparison.stat}</span>
                      <div className="flex items-center gap-2">
                        {getStatIcon(comparison.winner)}
                        {comparison.winner !== "tie" && (
                          <span className="text-sm text-gray-600">+{comparison.difference}</span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm text-blue-700">{pokemon1.name}</span>
                          <span className={`text-sm font-medium ${getStatColor(comparison.winner, true)}`}>
                            {comparison.pokemon1}
                          </span>
                        </div>
                        <Progress value={(comparison.pokemon1 / 255) * 100} className="h-2 bg-blue-100" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm text-red-700">{pokemon2.name}</span>
                          <span className={`text-sm font-medium ${getStatColor(comparison.winner, false)}`}>
                            {comparison.pokemon2}
                          </span>
                        </div>
                        <Progress value={(comparison.pokemon2 / 255) * 100} className="h-2 bg-red-100" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Type Advantages */}
          {typeAdvantages && (typeAdvantages.pokemon1.length > 0 || typeAdvantages.pokemon2.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle>Type Advantages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-blue-700 mb-3">{pokemon1.name} has advantage against:</h4>
                    {typeAdvantages.pokemon1.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {typeAdvantages.pokemon1.map((type) => (
                          <Badge key={type} variant="secondary" className="bg-green-100 text-green-800">
                            {type.toUpperCase()}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No type advantages</p>
                    )}
                  </div>

                  <div>
                    <h4 className="font-medium text-red-700 mb-3">{pokemon2.name} has advantage against:</h4>
                    {typeAdvantages.pokemon2.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {typeAdvantages.pokemon2.map((type) => (
                          <Badge key={type} variant="secondary" className="bg-green-100 text-green-800">
                            {type.toUpperCase()}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No type advantages</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Battle Recommendation */}
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-800">Battle Recommendation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {totalStats && totalStats.winner !== "tie" && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-purple-800">
                        {totalStats.winner === "pokemon1" ? pokemon1.name : pokemon2.name} has higher overall stats
                      </p>
                      <p className="text-sm text-purple-600">
                        {totalStats.difference} point advantage in base stat total
                      </p>
                    </div>
                  </div>
                )}

                {typeAdvantages && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-purple-800">Type matchup analysis</p>
                      <p className="text-sm text-purple-600">
                        {typeAdvantages.pokemon1.length > typeAdvantages.pokemon2.length
                          ? `${pokemon1.name} has more type advantages`
                          : typeAdvantages.pokemon2.length > typeAdvantages.pokemon1.length
                            ? `${pokemon2.name} has more type advantages`
                            : "Both Pokémon have equal type advantages"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="space-y-4">
              <div className="flex justify-center items-center gap-4 text-4xl">
                <span>🔍</span>
                <ArrowRight className="w-8 h-8 text-gray-400" />
                <span>⚖️</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Ready to Compare?</h3>
                <p className="text-gray-500">
                  Select two Pokémon above to see a detailed comparison of their stats, types, and battle potential.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
