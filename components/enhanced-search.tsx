"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Clock, Zap } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Pokemon } from "@/types/pokemon"

interface EnhancedSearchProps {
  pokemon: Pokemon[]
  onSelect: (pokemon: Pokemon) => void
  onSearchChange: (term: string) => void
}

export function EnhancedSearch({ pokemon, onSelect, onSearchChange }: EnhancedSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [suggestions, setSuggestions] = useState<Pokemon[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [popularSearches] = useState(["Pikachu", "Charizard", "Mewtwo", "Lucario", "Garchomp"])
  const inputRef = useRef<HTMLInputElement>(null)

  // Smart search with fuzzy matching
  const fuzzySearch = (term: string, pokemon: Pokemon[]) => {
    const searchLower = term.toLowerCase()

    return pokemon
      .map((p) => ({
        pokemon: p,
        score: calculateRelevanceScore(p, searchLower),
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((item) => item.pokemon)
  }

  const calculateRelevanceScore = (pokemon: Pokemon, searchTerm: string): number => {
    let score = 0
    const name = pokemon.name.toLowerCase()

    // Exact match gets highest score
    if (name === searchTerm) score += 100

    // Name starts with search term
    if (name.startsWith(searchTerm)) score += 50

    // Name contains search term
    if (name.includes(searchTerm)) score += 25

    // ID match
    if (pokemon.id.toString().includes(searchTerm)) score += 30

    // Type match
    if (pokemon.types.some((type) => type.toLowerCase().includes(searchTerm))) score += 20

    // Region match
    if (pokemon.region.toLowerCase().includes(searchTerm)) score += 15

    return score
  }

  useEffect(() => {
    const saved = localStorage.getItem("pokemon-search-history")
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = fuzzySearch(searchTerm, pokemon)
      setSuggestions(filtered)
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [searchTerm, pokemon])

  const handleSelect = (pokemon: Pokemon) => {
    setSearchTerm(pokemon.name)
    setShowSuggestions(false)
    onSelect(pokemon)

    // Update search history
    const newRecent = [pokemon.name, ...recentSearches.filter((s) => s !== pokemon.name)].slice(0, 5)
    setRecentSearches(newRecent)
    localStorage.setItem("pokemon-search-history", JSON.stringify(newRecent))
  }

  const handleQuickSearch = (term: string) => {
    setSearchTerm(term)
    onSearchChange(term)
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          ref={inputRef}
          placeholder="Search Pokémon by name, ID, type, or region..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            onSearchChange(e.target.value)
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="pl-12 pr-4 h-14 text-lg border-2 border-orange-200 focus:border-orange-500 rounded-xl shadow-sm"
        />

        {/* Search shortcuts */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-1">
          <kbd className="px-2 py-1 text-xs bg-gray-100 rounded border">Ctrl+K</kbd>
        </div>
      </div>

      {/* Enhanced suggestions dropdown */}
      {showSuggestions && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-96 overflow-hidden shadow-lg">
          <CardContent className="p-0">
            {/* Quick filters */}
            {searchTerm.length === 0 && (
              <div className="p-4 border-b bg-gray-50">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <Zap className="w-4 h-4" />
                  Quick Search
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => handleQuickSearch(term)}
                      className="px-3 py-1 bg-white border rounded-full text-sm hover:bg-orange-50 hover:border-orange-300 transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Recent searches */}
            {searchTerm.length === 0 && recentSearches.length > 0 && (
              <div className="p-4 border-b">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <Clock className="w-4 h-4" />
                  Recent Searches
                </div>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickSearch(search)}
                      className="block w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search results */}
            {suggestions.length > 0 && (
              <div className="max-h-64 overflow-y-auto">
                {suggestions.map((pokemon) => (
                  <button
                    key={pokemon.id}
                    onClick={() => handleSelect(pokemon)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 border-b last:border-b-0 transition-colors"
                  >
                    <img
                      src={pokemon.image || "/placeholder.svg"}
                      alt={pokemon.name}
                      className="w-12 h-12 object-contain rounded-lg bg-gray-100"
                    />
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-900">{pokemon.name}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-500">#{pokemon.id.toString().padStart(3, "0")}</span>
                        <div className="flex gap-1">
                          {pokemon.types.slice(0, 2).map((type) => (
                            <Badge key={type} variant="secondary" className="text-xs">
                              {type}
                            </Badge>
                          ))}
                        </div>
                        <span className="text-xs text-gray-400">{pokemon.region}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* No results */}
            {searchTerm.length > 0 && suggestions.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No Pokémon found for "{searchTerm}"</p>
                <p className="text-sm mt-1">Try searching by name, type, or region</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
