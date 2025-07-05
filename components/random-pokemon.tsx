"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shuffle, RefreshCw, Heart, ExternalLink } from "lucide-react"
import { PokemonImage } from "@/components/pokemon-image"
import { TypeBadge } from "@/components/type-badge"
import type { Pokemon } from "@/types/pokemon"

interface RandomPokemonProps {
  pokemon: Pokemon[]
  onPokemonSelect: (pokemon: Pokemon) => void
}

export function RandomPokemon({ pokemon, onPokemonSelect }: RandomPokemonProps) {
  const [currentPokemon, setCurrentPokemon] = useState<Pokemon | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const getRandomPokemon = () => {
    if (pokemon.length === 0) return

    setIsAnimating(true)

    // Add a small delay for animation effect
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * pokemon.length)
      setCurrentPokemon(pokemon[randomIndex])
      setIsAnimating(false)
    }, 500)
  }

  const addToFavorites = () => {
    if (!currentPokemon) return

    const favorites = JSON.parse(localStorage.getItem("pokemon-favorites") || "[]")
    const newFavorite = {
      pokemon: currentPokemon,
      addedAt: new Date(),
      rating: 5,
    }

    if (!favorites.some((fav: any) => fav.pokemon.id === currentPokemon.id)) {
      favorites.push(newFavorite)
      localStorage.setItem("pokemon-favorites", JSON.stringify(favorites))
      alert(`${currentPokemon.name} added to favorites!`)
    } else {
      alert(`${currentPokemon.name} is already in your favorites!`)
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Random Pokémon Discovery</h2>
        <p className="text-gray-600 mb-8">Discover new Pokémon with our random generator</p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2">
            <Shuffle className="w-5 h-5" />
            Random Pokémon Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!currentPokemon ? (
            <div className="text-center py-12">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Shuffle className="w-16 h-16 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Discover?</h3>
              <p className="text-gray-600 mb-6">
                Click the button below to discover a random Pokémon from our database!
              </p>
              <Button onClick={getRandomPokemon} size="lg" className="gap-2">
                <Shuffle className="w-5 h-5" />
                Discover Random Pokémon
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Pokemon Display */}
              <div
                className={`text-center transition-all duration-500 ${isAnimating ? "opacity-50 scale-95" : "opacity-100 scale-100"}`}
              >
                <div className="relative">
                  <div className="w-48 h-48 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    {isAnimating ? (
                      <RefreshCw className="w-16 h-16 text-orange-400 animate-spin" />
                    ) : (
                      <PokemonImage
                        src={currentPokemon.image}
                        alt={currentPokemon.name}
                        width={180}
                        height={180}
                        className="object-contain"
                        pokemonId={currentPokemon.id}
                      />
                    )}
                  </div>
                  <Badge variant="secondary" className="absolute top-2 right-2 bg-orange-100 text-orange-800">
                    #{currentPokemon.id.toString().padStart(3, "0")}
                  </Badge>
                </div>

                <h3 className="text-3xl font-bold text-gray-900 mb-3">{currentPokemon.name}</h3>

                <div className="flex gap-2 justify-center mb-4">
                  {currentPokemon.types.map((type) => (
                    <TypeBadge key={type} type={type} size="md" />
                  ))}
                </div>

                <p className="text-gray-600 max-w-md mx-auto mb-6">{currentPokemon.description}</p>

                {/* Stats Preview */}
                <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-6">
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{currentPokemon.stats.hp}</div>
                    <div className="text-sm text-gray-600">HP</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{currentPokemon.stats.attack}</div>
                    <div className="text-sm text-gray-600">Attack</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{currentPokemon.stats.defense}</div>
                    <div className="text-sm text-gray-600">Defense</div>
                  </div>
                </div>

                {/* Region and Generation */}
                <div className="flex justify-center gap-4 mb-6">
                  <Badge variant="outline" className="gap-1">
                    📍 {currentPokemon.region}
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    🎮 Generation {currentPokemon.generation}
                  </Badge>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-center">
                <Button onClick={getRandomPokemon} variant="outline" className="gap-2">
                  <Shuffle className="w-4 h-4" />
                  Another Random
                </Button>
                <Button onClick={addToFavorites} variant="outline" className="gap-2">
                  <Heart className="w-4 h-4" />
                  Add to Favorites
                </Button>
                <Button onClick={() => onPokemonSelect(currentPokemon)} className="gap-2">
                  <ExternalLink className="w-4 h-4" />
                  View Details
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Fun Facts */}
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Did You Know?</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>There are over 1,000 different Pokémon species across all generations</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500">•</span>
              <span>Each Pokémon has unique stats, types, and abilities that make them special</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-purple-500">•</span>
              <span>Some Pokémon can evolve into different forms with various methods</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-orange-500">•</span>
              <span>Type matchups play a crucial role in Pokémon battles and strategy</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
