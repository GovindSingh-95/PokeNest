"use client"

import type React from "react"

import { useState, useMemo, useRef, useEffect, useCallback } from "react"
import { Search, X, Filter, ChevronDown, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { PokemonImage } from "@/components/pokemon-image"
import { TypeBadge } from "@/components/type-badge"
import type { Pokemon } from "@/types/pokemon"

interface PokemonSelectorProps {
  pokemon: Pokemon[]
  selectedPokemon?: string
  onSelect: (pokemonId: string) => void
  placeholder?: string
  disabled?: boolean
  excludeIds?: number[]
  showAdvancedFilters?: boolean
}

const generations = [
  { value: "1", label: "Gen 1 (Kanto)", range: [1, 151] },
  { value: "2", label: "Gen 2 (Johto)", range: [152, 251] },
  { value: "3", label: "Gen 3 (Hoenn)", range: [252, 386] },
  { value: "4", label: "Gen 4 (Sinnoh)", range: [387, 493] },
  { value: "5", label: "Gen 5 (Unova)", range: [494, 649] },
  { value: "6", label: "Gen 6 (Kalos)", range: [650, 721] },
  { value: "7", label: "Gen 7 (Alola)", range: [722, 809] },
  { value: "8", label: "Gen 8 (Galar)", range: [810, 905] },
  { value: "9", label: "Gen 9 (Paldea)", range: [906, 1010] },
]

const allTypes = [
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

export function PokemonSelector({
  pokemon,
  selectedPokemon,
  onSelect,
  placeholder = "Search and select a Pokémon...",
  disabled = false,
  excludeIds = [],
  showAdvancedFilters = true,
}: PokemonSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedGeneration, setSelectedGeneration] = useState<string>("all")
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<"id" | "name" | "stats">("id")
  const [recentSelections, setRecentSelections] = useState<string[]>([])
  const [displayLimit, setDisplayLimit] = useState(50)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Load recent selections from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recent-pokemon-selections")
    if (saved) {
      try {
        setRecentSelections(JSON.parse(saved))
      } catch (error) {
        console.error("Error loading recent selections:", error)
      }
    }
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
        setDisplayLimit(50) // Reset display limit when closing
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Filter and sort Pokemon - NO RESULT LIMIT
  const filteredPokemon = useMemo(() => {
    let filtered = pokemon.filter((p) => !excludeIds.includes(p.id))

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.id.toString().includes(term) ||
          p.types.some((type) => type.toLowerCase().includes(term)),
      )
    }

    // Generation filter
    if (selectedGeneration !== "all") {
      const gen = generations.find((g) => g.value === selectedGeneration)
      if (gen) {
        filtered = filtered.filter((p) => p.id >= gen.range[0] && p.id <= gen.range[1])
      }
    }

    // Type filter
    if (selectedTypes.length > 0) {
      filtered = filtered.filter((p) => selectedTypes.some((type) => p.types.includes(type)))
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "stats":
          const aTotal = Object.values(a.stats).reduce((sum, stat) => sum + stat, 0)
          const bTotal = Object.values(b.stats).reduce((sum, stat) => sum + stat, 0)
          return bTotal - aTotal
        default:
          return a.id - b.id
      }
    })

    return filtered // Return ALL filtered results, no limit
  }, [pokemon, searchTerm, selectedGeneration, selectedTypes, sortBy, excludeIds])

  // Get displayed Pokemon based on current display limit
  const displayedPokemon = useMemo(() => {
    return filteredPokemon.slice(0, displayLimit)
  }, [filteredPokemon, displayLimit])

  const selectedPokemonData = pokemon.find((p) => p.id.toString() === selectedPokemon)

  const handleSelect = useCallback(
    (pokemon: Pokemon) => {
      onSelect(pokemon.id.toString())
      setShowDropdown(false)
      setSearchTerm("")
      setDisplayLimit(50) // Reset display limit

      // Add to recent selections
      const newRecent = [pokemon.id.toString(), ...recentSelections.filter((id) => id !== pokemon.id.toString())].slice(
        0,
        5,
      )
      setRecentSelections(newRecent)
      try {
        localStorage.setItem("recent-pokemon-selections", JSON.stringify(newRecent))
      } catch (error) {
        console.error("Error saving recent selections:", error)
      }
    },
    [onSelect, recentSelections],
  )

  const clearSelection = useCallback(() => {
    onSelect("")
    setSearchTerm("")
  }, [onSelect])

  const clearFilters = useCallback(() => {
    setSelectedGeneration("all")
    setSelectedTypes([])
    setSortBy("id")
    setSearchTerm("")
    setDisplayLimit(50)
  }, [])

  const toggleType = useCallback((type: string) => {
    setSelectedTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }, [])

  const loadMore = useCallback(async () => {
    if (isLoadingMore || displayLimit >= filteredPokemon.length) return

    setIsLoadingMore(true)
    // Simulate loading delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 300))
    setDisplayLimit((prev) => Math.min(prev + 50, filteredPokemon.length))
    setIsLoadingMore(false)
  }, [isLoadingMore, displayLimit, filteredPokemon.length])

  // Handle scroll for infinite loading
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
      if (scrollHeight - scrollTop <= clientHeight + 100) {
        // Load when 100px from bottom
        loadMore()
      }
    },
    [loadMore],
  )

  const recentPokemon = recentSelections
    .map((id) => pokemon.find((p) => p.id.toString() === id))
    .filter((p): p is Pokemon => p !== undefined)

  const hasMoreResults = displayLimit < filteredPokemon.length

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Main Input */}
      <div className="relative">
        {selectedPokemonData ? (
          <div className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg bg-white">
            <PokemonImage
              src={selectedPokemonData.image}
              alt={selectedPokemonData.name}
              width={40}
              height={40}
              className="object-contain"
              pokemonId={selectedPokemonData.id}
            />
            <div className="flex-1">
              <div className="font-medium">{selectedPokemonData.name}</div>
              <div className="text-sm text-gray-600">#{selectedPokemonData.id.toString().padStart(3, "0")}</div>
            </div>
            <div className="flex gap-1">
              {selectedPokemonData.types.map((type) => (
                <TypeBadge key={type} type={type} size="sm" />
              ))}
            </div>
            {!disabled && (
              <Button variant="ghost" size="sm" onClick={clearSelection} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        ) : (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              ref={inputRef}
              placeholder={placeholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              disabled={disabled}
              className="pl-10 pr-4"
            />
          </div>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && showDropdown && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 border-b-0 rounded-b-none">
          <CardContent className="p-3 border-b">
            <div className="flex flex-wrap gap-2 items-center">
              <Select value={selectedGeneration} onValueChange={setSelectedGeneration}>
                <SelectTrigger className="w-40 h-8">
                  <SelectValue placeholder="Generation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Generations</SelectItem>
                  {generations.map((gen) => (
                    <SelectItem key={gen.value} value={gen.value}>
                      {gen.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 bg-transparent">
                    <Filter className="w-3 h-3 mr-1" />
                    Types {selectedTypes.length > 0 && `(${selectedTypes.length})`}
                    <ChevronDown className="w-3 h-3 ml-1" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid grid-cols-3 gap-2">
                    {allTypes.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={type}
                          checked={selectedTypes.includes(type)}
                          onCheckedChange={() => toggleType(type)}
                        />
                        <label htmlFor={type} className="text-sm capitalize cursor-pointer">
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              <Select value={sortBy} onValueChange={(value: "id" | "name" | "stats") => setSortBy(value)}>
                <SelectTrigger className="w-32 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="id">By ID</SelectItem>
                  <SelectItem value="name">By Name</SelectItem>
                  <SelectItem value="stats">By Stats</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-xs">
                Clear Filters
              </Button>
            </div>

            {selectedTypes.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {selectedTypes.map((type) => (
                  <Badge
                    key={type}
                    variant="secondary"
                    className="text-xs cursor-pointer"
                    onClick={() => toggleType(type)}
                  >
                    {type}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}

            {/* Results Counter */}
            <div className="mt-2 text-xs text-gray-600">
              Showing {displayedPokemon.length} of {filteredPokemon.length} Pokémon
              {filteredPokemon.length !== pokemon.length && ` (filtered from ${pokemon.length} total)`}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dropdown Results */}
      {showDropdown && (
        <Card
          className={`absolute top-full left-0 right-0 ${showAdvancedFilters ? "mt-0 rounded-t-none" : "mt-1"} z-40 max-h-96 overflow-hidden`}
        >
          <CardContent className="p-0">
            <div ref={scrollRef} className="max-h-96 overflow-y-auto" onScroll={handleScroll}>
              {/* Recent Selections */}
              {searchTerm === "" && recentPokemon.length > 0 && (
                <div className="p-3 border-b bg-gray-50">
                  <div className="text-xs font-medium text-gray-600 mb-2">Recent Selections</div>
                  <div className="space-y-1">
                    {recentPokemon.map((pokemon) => (
                      <button
                        key={pokemon.id}
                        onClick={() => handleSelect(pokemon)}
                        className="w-full flex items-center gap-2 p-2 hover:bg-white rounded text-left"
                      >
                        <PokemonImage
                          src={pokemon.image}
                          alt={pokemon.name}
                          width={24}
                          height={24}
                          className="object-contain"
                          pokemonId={pokemon.id}
                        />
                        <span className="text-sm">{pokemon.name}</span>
                        <span className="text-xs text-gray-500 ml-auto">#{pokemon.id.toString().padStart(3, "0")}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Search Results */}
              {displayedPokemon.length > 0 ? (
                <div className="divide-y">
                  {displayedPokemon.map((pokemon) => (
                    <button
                      key={pokemon.id}
                      onClick={() => handleSelect(pokemon)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
                    >
                      <PokemonImage
                        src={pokemon.image}
                        alt={pokemon.name}
                        width={40}
                        height={40}
                        className="object-contain"
                        pokemonId={pokemon.id}
                      />
                      <div className="flex-1 text-left">
                        <div className="font-medium">{pokemon.name}</div>
                        <div className="text-sm text-gray-600">
                          #{pokemon.id.toString().padStart(3, "0")} • {pokemon.region}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {pokemon.types.map((type) => (
                          <TypeBadge key={type} type={type} size="sm" />
                        ))}
                      </div>
                      <div className="text-xs text-gray-500">
                        {Object.values(pokemon.stats).reduce((sum, stat) => sum + stat, 0)} BST
                      </div>
                    </button>
                  ))}

                  {/* Loading More Indicator */}
                  {isLoadingMore && (
                    <div className="p-4 text-center">
                      <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                      <div className="text-xs text-gray-500 mt-1">Loading more Pokémon...</div>
                    </div>
                  )}

                  {/* Load More Button */}
                  {hasMoreResults && !isLoadingMore && (
                    <div className="p-3 text-center border-t bg-gray-50">
                      <Button variant="ghost" size="sm" onClick={loadMore} className="text-xs">
                        Load More ({filteredPokemon.length - displayLimit} remaining)
                      </Button>
                    </div>
                  )}

                  {/* All Results Loaded */}
                  {!hasMoreResults && displayedPokemon.length > 50 && (
                    <div className="p-3 text-center text-xs text-gray-500 border-t bg-gray-50">
                      All {filteredPokemon.length} Pokémon loaded
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 text-center text-gray-500">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <div className="text-sm">No Pokémon found</div>
                  <div className="text-xs">Try adjusting your search or filters</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
