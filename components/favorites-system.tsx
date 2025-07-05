"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Heart, Search, Filter, Trash2, Star } from "lucide-react"
import { PokemonModal } from "@/components/pokemon-modal"
import type { Pokemon } from "@/types/pokemon"

interface FavoriteSystemProps {
  pokemon: Pokemon[]
}

interface FavoritePokemon {
  pokemon: Pokemon
  addedAt: Date
  notes?: string
  rating?: number
}

export function FavoritesSystem({ pokemon }: FavoriteSystemProps) {
  const [favorites, setFavorites] = useState<FavoritePokemon[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null)
  const [sortBy, setSortBy] = useState<"name" | "date" | "rating">("date")

  useEffect(() => {
    const savedFavorites = localStorage.getItem("pokemon-favorites")
    if (savedFavorites) {
      const parsed = JSON.parse(savedFavorites)
      setFavorites(
        parsed.map((fav: any) => ({
          ...fav,
          addedAt: new Date(fav.addedAt),
        })),
      )
    }
  }, [])

  const saveFavorites = (newFavorites: FavoritePokemon[]) => {
    setFavorites(newFavorites)
    localStorage.setItem("pokemon-favorites", JSON.stringify(newFavorites))
  }

  const addToFavorites = (poke: Pokemon) => {
    if (favorites.some((fav) => fav.pokemon.id === poke.id)) return

    const newFavorite: FavoritePokemon = {
      pokemon: poke,
      addedAt: new Date(),
      rating: 5,
    }

    saveFavorites([...favorites, newFavorite])
  }

  const removeFromFavorites = (pokemonId: number) => {
    saveFavorites(favorites.filter((fav) => fav.pokemon.id !== pokemonId))
  }

  const updateRating = (pokemonId: number, rating: number) => {
    const updated = favorites.map((fav) => (fav.pokemon.id === pokemonId ? { ...fav, rating } : fav))
    saveFavorites(updated)
  }

  const updateNotes = (pokemonId: number, notes: string) => {
    const updated = favorites.map((fav) => (fav.pokemon.id === pokemonId ? { ...fav, notes } : fav))
    saveFavorites(updated)
  }

  const filteredFavorites = favorites
    .filter(
      (fav) =>
        fav.pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fav.pokemon.id.toString().includes(searchTerm),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.pokemon.name.localeCompare(b.pokemon.name)
        case "rating":
          return (b.rating || 0) - (a.rating || 0)
        case "date":
        default:
          return b.addedAt.getTime() - a.addedAt.getTime()
      }
    })

  const isFavorite = (pokemonId: number) => {
    return favorites.some((fav) => fav.pokemon.id === pokemonId)
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Favorite Pokémon</h2>
        <p className="text-gray-600 mb-8">Keep track of your favorite Pokémon with personal notes and ratings</p>
      </div>

      {/* Quick Add Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Quick Add to Favorites
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {pokemon.slice(0, 16).map((poke) => (
              <div key={poke.id} className="text-center">
                <div className="relative group">
                  <img
                    src={poke.image || "/placeholder.svg"}
                    alt={poke.name}
                    className="w-16 h-16 mx-auto mb-2 cursor-pointer hover:scale-110 transition-transform"
                    onClick={() => setSelectedPokemon(poke)}
                  />
                  <Button
                    size="sm"
                    variant={isFavorite(poke.id) ? "default" : "outline"}
                    onClick={() => (isFavorite(poke.id) ? removeFromFavorites(poke.id) : addToFavorites(poke))}
                    className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full"
                  >
                    <Heart className={`w-3 h-3 ${isFavorite(poke.id) ? "fill-current" : ""}`} />
                  </Button>
                </div>
                <div className="text-xs font-medium">{poke.name}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Favorites Management */}
      {favorites.length > 0 && (
        <>
          {/* Search and Filter */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search favorites..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-600" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="border rounded px-3 py-2 text-sm"
                  >
                    <option value="date">Date Added</option>
                    <option value="name">Name</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>
                <Badge variant="secondary">{favorites.length} favorites</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Favorites Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFavorites.map((favorite) => (
              <Card key={favorite.pokemon.id} className="border-pink-200 bg-pink-50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <img
                        src={favorite.pokemon.image || "/placeholder.svg"}
                        alt={favorite.pokemon.name}
                        className="w-20 h-20 cursor-pointer hover:scale-110 transition-transform"
                        onClick={() => setSelectedPokemon(favorite.pokemon)}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">{favorite.pokemon.name}</h3>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFromFavorites(favorite.pokemon.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex gap-1 mb-2">
                        {favorite.pokemon.types.map((type) => (
                          <Badge key={type} variant="secondary" className="text-xs">
                            {type.toUpperCase()}
                          </Badge>
                        ))}
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm text-gray-600">Rating:</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => updateRating(favorite.pokemon.id, star)}
                              className="text-yellow-400 hover:text-yellow-500"
                            >
                              <Star className={`w-4 h-4 ${star <= (favorite.rating || 0) ? "fill-current" : ""}`} />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Notes */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Notes:</label>
                        <textarea
                          value={favorite.notes || ""}
                          onChange={(e) => updateNotes(favorite.pokemon.id, e.target.value)}
                          placeholder="Add your personal notes..."
                          className="w-full text-sm border rounded px-2 py-1 resize-none"
                          rows={2}
                        />
                      </div>

                      <div className="text-xs text-gray-500 mt-2">Added {favorite.addedAt.toLocaleDateString()}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Empty State */}
      {favorites.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-24 h-24 bg-pink-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Heart className="w-12 h-12 text-pink-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Favorites Yet</h3>
            <p className="text-gray-600 mb-6">Start building your collection by adding Pokémon to your favorites</p>
            <Button onClick={() => setSelectedPokemon(pokemon[0])} className="gap-2">
              <Heart className="w-4 h-4" />
              Explore Pokémon
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Pokemon Modal */}
      <PokemonModal pokemon={selectedPokemon} isOpen={!!selectedPokemon} onClose={() => setSelectedPokemon(null)} />
    </div>
  )
}
