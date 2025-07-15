"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Search, Filter, X, Clock, TrendingUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import type { Pokemon } from "@/types/pokemon"

interface OptimizedSearchProps {
  onSearch: (query: string, filters: SearchFilters) => Promise<void>
  onClear: () => void
  isSearching: boolean
  searchResults: Pokemon[]
  totalPokemon: number
}

interface SearchFilters {
  types?: string[]
  generation?: number
  region?: string
}

interface SearchHistory {
  query: string
  filters: SearchFilters
  timestamp: number
  resultCount: number
}

const pokemonTypes = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
]

const generations = [1, 2, 3, 4, 5, 6, 7, 8, 9]
const regions = ["Kanto", "Johto", "Hoenn", "Sinnoh", "Unova", "Kalos", "Alola", "Galar", "Paldea"]

// Popular searches for suggestions
const popularSearches = [
  "Pikachu",
  "Charizard",
  "Mewtwo",
  "Lucario",
  "Garchomp",
  "Rayquaza",
  "Arceus",
  "Dialga",
  "Palkia",
  "Giratina",
]

export function OptimizedSearch({ onSearch, onClear, isSearching, searchResults, totalPokemon }: OptimizedSearchProps) {
  const [query, setQuery] = useState("")
  const [filters, setFilters] = useState<SearchFilters>({})
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([])
  const [debouncedQuery, setDebouncedQuery] = useState("")

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  // Load search history from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("pokemon-search-history")
        if (saved) {
          const history = JSON.parse(saved)
          setSearchHistory(history.slice(0, 10)) // Keep only last 10 searches
        }
      } catch (error) {
        console.warn("Failed to load search history:", error)
      }
    }
  }, [])

  // Save search to history
  const saveToHistory = useCallback((searchQuery: string, searchFilters: SearchFilters, resultCount: number) => {
    if (!searchQuery.trim()) return

    const newEntry: SearchHistory = {
      query: searchQuery,
      filters: searchFilters,
      timestamp: Date.now(),
      resultCount,
    }

    setSearchHistory((prev) => {
      const filtered = prev.filter(
        (item) => !(item.query === searchQuery && JSON.stringify(item.filters) === JSON.stringify(searchFilters)),
      )
      const updated = [newEntry, ...filtered].slice(0, 10)

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("pokemon-search-history", JSON.stringify(updated))
        } catch (error) {
          console.warn("Failed to save search history:", error)
        }
      }

      return updated
    })
  }, [])

  // Perform search
  const handleSearch = useCallback(async () => {
    if (!debouncedQuery.trim() && Object.keys(filters).length === 0) {
      onClear()
      return
    }

    await onSearch(debouncedQuery, filters)

    if (debouncedQuery.trim()) {
      saveToHistory(debouncedQuery, filters, searchResults.length)
    }
  }, [debouncedQuery, filters, onSearch, onClear, saveToHistory, searchResults.length])

  // Auto-search when query or filters change
  useEffect(() => {
    handleSearch()
  }, [handleSearch])

  // Clear all filters and search
  const handleClearAll = useCallback(() => {
    setQuery("")
    setFilters({})
    onClear()
  }, [onClear])

  // Filter suggestions based on current query
  const suggestions = useMemo(() => {
    if (!query.trim()) return popularSearches.slice(0, 5)

    const queryLower = query.toLowerCase()
    const historySuggestions = searchHistory
      .filter((item) => item.query.toLowerCase().includes(queryLower))
      .map((item) => item.query)
      .slice(0, 3)

    const popularSuggestions = popularSearches.filter((search) => search.toLowerCase().includes(queryLower)).slice(0, 3)

    return [...new Set([...historySuggestions, ...popularSuggestions])].slice(0, 5)
  }, [query, searchHistory])

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (filters.types?.length) count += filters.types.length
    if (filters.generation) count += 1
    if (filters.region) count += 1
    return count
  }, [filters])

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search Pokémon by name or ID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="pl-12 pr-12 h-12 text-base border-2 border-orange-200 focus:border-orange-500 rounded-xl shadow-sm bg-white/70 backdrop-blur-sm"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Search Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-lg">
            <CardContent className="p-2">
              <div className="space-y-1">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setQuery(suggestion)
                      setShowSuggestions(false)
                    }}
                    className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{suggestion}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Filters and Results Summary */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Advanced Filters */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Filter className="w-4 h-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="start">
              <div className="space-y-4">
                <div className="font-semibold">Advanced Filters</div>

                {/* Type Filters */}
                <div className="space-y-2">
                  <div className="text-sm font-medium">Types</div>
                  <div className="grid grid-cols-3 gap-2">
                    {pokemonTypes.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={type}
                          checked={filters.types?.includes(type) || false}
                          onCheckedChange={(checked) => {
                            setFilters((prev) => ({
                              ...prev,
                              types: checked
                                ? [...(prev.types || []), type]
                                : (prev.types || []).filter((t) => t !== type),
                            }))
                          }}
                        />
                        <label htmlFor={type} className="text-sm capitalize">
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Generation Filter */}
                <div className="space-y-2">
                  <div className="text-sm font-medium">Generation</div>
                  <div className="flex flex-wrap gap-2">
                    {generations.map((gen) => (
                      <Button
                        key={gen}
                        variant={filters.generation === gen ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setFilters((prev) => ({
                            ...prev,
                            generation: prev.generation === gen ? undefined : gen,
                          }))
                        }}
                      >
                        Gen {gen}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Region Filter */}
                <div className="space-y-2">
                  <div className="text-sm font-medium">Region</div>
                  <div className="flex flex-wrap gap-2">
                    {regions.map((region) => (
                      <Button
                        key={region}
                        variant={filters.region === region ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setFilters((prev) => ({
                            ...prev,
                            region: prev.region === region ? undefined : region,
                          }))
                        }}
                      >
                        {region}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                {activeFiltersCount > 0 && (
                  <Button variant="outline" size="sm" onClick={() => setFilters({})} className="w-full">
                    Clear All Filters
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* Search Status */}
          {isSearching && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="animate-spin w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full"></div>
              Searching...
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="flex items-center gap-2">
          {(query || activeFiltersCount > 0) && (
            <div className="text-sm text-gray-600">
              {searchResults.length} of {totalPokemon} Pokémon
            </div>
          )}

          {(query || activeFiltersCount > 0) && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              className="gap-2 text-red-600 border-red-300 hover:bg-red-50 bg-transparent"
            >
              <X className="w-4 h-4" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {(query || activeFiltersCount > 0) && (
        <div className="flex flex-wrap items-center gap-2 p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
          <span className="text-sm font-medium text-orange-800">Active:</span>

          {query && (
            <Badge variant="secondary" className="bg-orange-100 text-orange-800 gap-1">
              <Search className="w-3 h-3" />"{query}"
              <button onClick={() => setQuery("")} className="ml-1 hover:text-orange-900">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}

          {filters.types?.map((type) => (
            <Badge key={type} variant="secondary" className="bg-blue-100 text-blue-800 gap-1">
              {type}
              <button
                onClick={() => {
                  setFilters((prev) => ({
                    ...prev,
                    types: prev.types?.filter((t) => t !== type),
                  }))
                }}
                className="ml-1 hover:text-blue-900"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}

          {filters.generation && (
            <Badge variant="secondary" className="bg-purple-100 text-purple-800 gap-1">
              Gen {filters.generation}
              <button
                onClick={() => setFilters((prev) => ({ ...prev, generation: undefined }))}
                className="ml-1 hover:text-purple-900"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}

          {filters.region && (
            <Badge variant="secondary" className="bg-green-100 text-green-800 gap-1">
              {filters.region}
              <button
                onClick={() => setFilters((prev) => ({ ...prev, region: undefined }))}
                className="ml-1 hover:text-green-900"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Popular Searches */}
      {!query && searchHistory.length === 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <TrendingUp className="w-4 h-4" />
            Popular searches
          </div>
          <div className="flex flex-wrap gap-2">
            {popularSearches.slice(0, 8).map((search) => (
              <Button key={search} variant="outline" size="sm" onClick={() => setQuery(search)} className="text-xs">
                {search}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Recent Searches */}
      {!query && searchHistory.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            Recent searches
          </div>
          <div className="flex flex-wrap gap-2">
            {searchHistory.slice(0, 5).map((item, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => {
                  setQuery(item.query)
                  setFilters(item.filters)
                }}
                className="text-xs gap-1"
              >
                {item.query}
                <span className="text-gray-400">({item.resultCount})</span>
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
