"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Star, TrendingUp, Clock } from "lucide-react"
import { PokemonImage } from "@/components/pokemon-image"
import { TypeBadge } from "@/components/type-badge"
import type { Pokemon } from "@/types/pokemon"

interface PokemonOfTheDayProps {
  pokemon: Pokemon[]
  onPokemonSelect: (pokemon: Pokemon) => void
}

export function PokemonOfTheDay({ pokemon, onPokemonSelect }: PokemonOfTheDayProps) {
  const [dailyPokemon, setDailyPokemon] = useState<Pokemon | null>(null)
  const [timeUntilNext, setTimeUntilNext] = useState("")

  useEffect(() => {
    // Get today's date as seed for consistent daily Pokemon
    const today = new Date()
    const dateString = today.toDateString()

    // Simple hash function to get consistent random number from date
    let hash = 0
    for (let i = 0; i < dateString.length; i++) {
      const char = dateString.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }

    // Use hash to select Pokemon
    const index = Math.abs(hash) % pokemon.length
    setDailyPokemon(pokemon[index])

    // Calculate time until next day
    const updateTimer = () => {
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)

      const diff = tomorrow.getTime() - now.getTime()
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeUntilNext(`${hours}h ${minutes}m ${seconds}s`)
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [pokemon])

  if (!dailyPokemon) return null

  const getStatRank = (stat: number, statName: string) => {
    const allStats = pokemon
      .map((p) => {
        switch (statName) {
          case "hp":
            return p.stats.hp
          case "attack":
            return p.stats.attack
          case "defense":
            return p.stats.defense
          case "speed":
            return p.stats.speed
          default:
            return 0
        }
      })
      .sort((a, b) => b - a)

    const rank = allStats.indexOf(stat) + 1
    const percentile = Math.round((1 - rank / allStats.length) * 100)

    return { rank, percentile }
  }

  const getRandomFact = () => {
    const facts = [
      `${dailyPokemon.name} is from the ${dailyPokemon.region} region.`,
      `This Pokémon belongs to Generation ${dailyPokemon.generation}.`,
      `${dailyPokemon.name} is a ${dailyPokemon.types.join("/")} type Pokémon.`,
      `Its height is ${dailyPokemon.height} and weight is ${dailyPokemon.weight}.`,
      `${dailyPokemon.name} has a base HP of ${dailyPokemon.stats.hp}.`,
    ]

    return facts[Math.floor(Math.random() * facts.length)]
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Pokémon of the Day</h2>
        <p className="text-gray-600 mb-8">Discover a featured Pokémon every day with special insights</p>
      </div>

      <Card className="max-w-4xl mx-auto border-2 border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-yellow-600" />
              Featured Today
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              Next in: {timeUntilNext}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Pokemon Display */}
            <div className="text-center">
              <div className="relative">
                <div className="w-64 h-64 bg-white rounded-lg mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <PokemonImage
                    src={dailyPokemon.image}
                    alt={dailyPokemon.name}
                    width={240}
                    height={240}
                    className="object-contain"
                    pokemonId={dailyPokemon.id}
                  />
                </div>
                <Badge variant="secondary" className="absolute top-2 right-2 bg-yellow-100 text-yellow-800">
                  #{dailyPokemon.id.toString().padStart(3, "0")}
                </Badge>
                <div className="absolute top-2 left-2">
                  <Badge className="bg-yellow-500 text-white">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                </div>
              </div>

              <h3 className="text-4xl font-bold text-gray-900 mb-3">{dailyPokemon.name}</h3>

              <div className="flex gap-2 justify-center mb-4">
                {dailyPokemon.types.map((type) => (
                  <TypeBadge key={type} type={type} size="lg" />
                ))}
              </div>

              <p className="text-gray-700 max-w-md mx-auto mb-6 leading-relaxed">{dailyPokemon.description}</p>

              <Button onClick={() => onPokemonSelect(dailyPokemon)} size="lg" className="gap-2">
                <TrendingUp className="w-5 h-5" />
                Explore {dailyPokemon.name}
              </Button>
            </div>

            {/* Stats and Info */}
            <div className="space-y-6">
              {/* Base Stats */}
              <div>
                <h4 className="font-semibold text-lg mb-4">Base Stats Analysis</h4>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: "HP", value: dailyPokemon.stats.hp, color: "bg-red-500" },
                    { name: "Attack", value: dailyPokemon.stats.attack, color: "bg-orange-500" },
                    { name: "Defense", value: dailyPokemon.stats.defense, color: "bg-blue-500" },
                    { name: "Speed", value: dailyPokemon.stats.speed, color: "bg-green-500" },
                  ].map((stat) => {
                    const { percentile } = getStatRank(stat.value, stat.name.toLowerCase())
                    return (
                      <div key={stat.name} className="bg-white rounded-lg p-4 shadow">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-700">{stat.name}</span>
                          <span className="font-bold text-lg">{stat.value}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                          <div
                            className={`h-2 rounded-full ${stat.color}`}
                            style={{ width: `${(stat.value / 255) * 100}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-600">Top {100 - percentile}% of all Pokémon</div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Quick Facts */}
              <div>
                <h4 className="font-semibold text-lg mb-4">Quick Facts</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow">
                    <span className="text-gray-600">Region</span>
                    <Badge variant="outline">{dailyPokemon.region}</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow">
                    <span className="text-gray-600">Generation</span>
                    <Badge variant="outline">Gen {dailyPokemon.generation}</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow">
                    <span className="text-gray-600">Height</span>
                    <span className="font-medium">{dailyPokemon.height}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow">
                    <span className="text-gray-600">Weight</span>
                    <span className="font-medium">{dailyPokemon.weight}</span>
                  </div>
                </div>
              </div>

              {/* Fun Fact */}
              <div className="bg-white rounded-lg p-4 shadow">
                <h4 className="font-semibold text-lg mb-2">Did You Know?</h4>
                <p className="text-gray-700 italic">"{getRandomFact()}"</p>
              </div>
            </div>
          </div>

          {/* Evolution Chain Preview */}
          {dailyPokemon.evolutionChain && (
            <div className="bg-white rounded-lg p-6 shadow">
              <h4 className="font-semibold text-lg mb-4">Evolution Line</h4>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center mb-2">
                    <PokemonImage
                      src={dailyPokemon.evolutionChain.stage1.image}
                      alt={dailyPokemon.evolutionChain.stage1.name}
                      width={48}
                      height={48}
                      className="object-contain"
                      pokemonId={dailyPokemon.evolutionChain.stage1.id}
                    />
                  </div>
                  <div className="text-xs font-medium">{dailyPokemon.evolutionChain.stage1.name}</div>
                </div>

                {dailyPokemon.evolutionChain.stage2 && (
                  <>
                    <div className="text-gray-400">→</div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center mb-2">
                        <PokemonImage
                          src={dailyPokemon.evolutionChain.stage2.image}
                          alt={dailyPokemon.evolutionChain.stage2.name}
                          width={48}
                          height={48}
                          className="object-contain"
                          pokemonId={dailyPokemon.evolutionChain.stage2.id}
                        />
                      </div>
                      <div className="text-xs font-medium">{dailyPokemon.evolutionChain.stage2.name}</div>
                    </div>
                  </>
                )}

                {dailyPokemon.evolutionChain.stage3 && (
                  <>
                    <div className="text-gray-400">→</div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center mb-2">
                        <PokemonImage
                          src={dailyPokemon.evolutionChain.stage3.image}
                          alt={dailyPokemon.evolutionChain.stage3.name}
                          width={48}
                          height={48}
                          className="object-contain"
                          pokemonId={dailyPokemon.evolutionChain.stage3.id}
                        />
                      </div>
                      <div className="text-xs font-medium">{dailyPokemon.evolutionChain.stage3.name}</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
