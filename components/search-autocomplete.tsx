"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import type { Pokemon } from "@/types/pokemon"

interface SearchAutocompleteProps {
  pokemon: Pokemon[]
  onSelect: (pokemon: Pokemon) => void
  onSearchChange: (term: string) => void
}

export function SearchAutocomplete({ pokemon, onSelect, onSearchChange }: SearchAutocompleteProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [suggestions, setSuggestions] = useState<Pokemon[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem("recent-pokemon-searches")
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = pokemon
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.id.toString().includes(searchTerm) ||
            p.types.some((type) => type.toLowerCase().includes(searchTerm.toLowerCase())),
        )
        .slice(0, 8)
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

    // Add to recent searches
    const newRecent = [pokemon.name, ...recentSearches.filter((s) => s !== pokemon.name)].slice(0, 5)
    setRecentSearches(newRecent)
    localStorage.setItem("recent-pokemon-searches", JSON.stringify(newRecent))
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          ref={inputRef}
          placeholder="Search Pokémon by name, ID, or type..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            onSearchChange(e.target.value)
          }}
          onFocus={() => setShowSuggestions(searchTerm.length > 0 || recentSearches.length > 0)}
          className="pl-12 h-14 text-lg border-2 border-orange-200 focus:border-orange-500 rounded-xl"
        />
      </div>

      {showSuggestions && (suggestions.length > 0 || recentSearches.length > 0) && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            {searchTerm.length === 0 && recentSearches.length > 0 && (
              <div className="p-3 border-b">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Clock className="w-4 h-4" />
                  Recent Searches
                </div>
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchTerm(search)}
                    className="block w-full text-left px-2 py-1 hover:bg-gray-50 rounded text-sm"
                  >
                    {search}
                  </button>
                ))}
              </div>
            )}

            {suggestions.map((pokemon) => (
              <button
                key={pokemon.id}
                onClick={() => handleSelect(pokemon)}
                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 border-b last:border-b-0"
              >
                <img
                  src={pokemon.image || "/placeholder.svg"}
                  alt={pokemon.name}
                  className="w-10 h-10 object-contain"
                />
                <div className="flex-1 text-left">
                  <div className="font-medium">{pokemon.name}</div>
                  <div className="text-sm text-gray-600">
                    #{pokemon.id.toString().padStart(3, "0")} • {pokemon.types.join(", ")}
                  </div>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
