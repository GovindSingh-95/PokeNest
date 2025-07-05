"use client"

import type React from "react"

import { useState, useMemo, useEffect } from "react"
import {
  Search,
  Filter,
  GitCompare,
  Map,
  Home,
  AlertCircle,
  Loader2,
  X,
  ArrowLeft,
  Trophy,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PokemonCard } from "@/components/pokemon-card"
import { PokemonModal } from "@/components/pokemon-modal"
import { PokemonComparison } from "@/components/pokemon-comparison"
import { RegionExplorer } from "@/components/region-explorer"
import { PokemonGridSkeleton, LoadingSpinner, PokemonLoadingProgress } from "@/components/pokemon-loading"
import { MobileNavigation } from "@/components/mobile-navigation"
import { usePokemonData } from "@/hooks/use-pokemon-data"
import type { Pokemon } from "@/types/pokemon"
import { SearchResultsSummary } from "@/components/search-results-summary"
import { TypeMatchupCalculator } from "@/components/type-matchup-calculator"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

import { BattleSimulator } from "@/components/battle-simulator"
import { TeamBuilder } from "@/components/team-builder"
import { QuizSystem } from "@/components/quiz-system"

const pokemonTypes = [
  "all",
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

interface TypeFilterButtonProps {
  type: string
  isSelected: boolean
  onClick: () => void
}

const TypeFilterButton: React.FC<TypeFilterButtonProps> = ({ type, isSelected, onClick }) => {
  const typeColors: Record<string, string> = {
    normal: "bg-gray-400 hover:bg-gray-500",
    fire: "bg-red-500 hover:bg-red-600",
    water: "bg-blue-500 hover:bg-blue-600",
    electric: "bg-yellow-400 hover:bg-yellow-500",
    grass: "bg-green-500 hover:bg-green-600",
    ice: "bg-cyan-300 hover:bg-cyan-400",
    fighting: "bg-red-700 hover:bg-red-800",
    poison: "bg-purple-500 hover:bg-purple-600",
    ground: "bg-yellow-600 hover:bg-yellow-700",
    flying: "bg-indigo-400 hover:bg-indigo-500",
    psychic: "bg-pink-500 hover:bg-pink-600",
    bug: "bg-green-400 hover:bg-green-500",
    rock: "bg-yellow-800 hover:bg-yellow-900",
    ghost: "bg-purple-700 hover:bg-purple-800",
    dragon: "bg-indigo-700 hover:bg-indigo-800",
    dark: "bg-gray-800 hover:bg-gray-900",
    steel: "bg-gray-500 hover:bg-gray-600",
    fairy: "bg-pink-300 hover:bg-pink-400",
  }

  const colorClass = typeColors[type] || typeColors.normal

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border-2 ${
        isSelected
          ? `${colorClass} text-white border-white ring-2 ring-offset-2 ring-blue-500 scale-105 shadow-lg`
          : `${colorClass} text-white opacity-70 hover:opacity-100 border-transparent hover:scale-105 hover:shadow-md`
      }`}
    >
      {type.charAt(0).toUpperCase() + type.slice(1)}
      {isSelected && <span className="ml-1">✓</span>}
    </button>
  )
}

export default function ExplorePage() {
  const searchParams = useSearchParams()

  // Initialize all state with proper default values
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null)
  const [activeTab, setActiveTab] = useState(searchParams?.get("tab") || "pokedex")
  const [loadingMore, setLoadingMore] = useState(false)
  const [filterHistory, setFilterHistory] = useState<
    Array<{ searchTerm: string; selectedTypes: string[]; timestamp: number }>
  >([])
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [selectedGeneration, setSelectedGeneration] = useState<number | null>(null)
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)

  const { pokemon, loading, error, hasMore, loadMore, totalCount, progress } = usePokemonData()

  // Sort Pokemon by ID to ensure they appear in order - with proper safety checks
  const sortedPokemon = useMemo(() => {
    if (!Array.isArray(pokemon) || pokemon.length === 0) {
      return []
    }
    return [...pokemon].sort((a, b) => a.id - b.id)
  }, [pokemon])

  // Filter Pokemon with proper safety checks
  const filteredPokemon = useMemo(() => {
    if (!Array.isArray(sortedPokemon) || sortedPokemon.length === 0) {
      return []
    }

    return sortedPokemon.filter((poke) => {
      if (!poke || typeof poke !== "object") {
        return false
      }

      const matchesSearch =
        (poke.name && poke.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (poke.id && poke.id.toString().includes(searchTerm))

      // Multi-type filtering - Pokemon must have at least one of the selected types
      const matchesType =
        !Array.isArray(selectedTypes) ||
        selectedTypes.length === 0 ||
        (Array.isArray(poke.types) && selectedTypes.some((type) => poke.types.includes(type)))

      const matchesGeneration = selectedGeneration === null || poke.generation === selectedGeneration
      const matchesRegion = selectedRegion === null || poke.region === selectedRegion

      return matchesSearch && matchesType && matchesGeneration && matchesRegion
    })
  }, [sortedPokemon, searchTerm, selectedTypes, selectedGeneration, selectedRegion])

  const handleLoadMore = async () => {
    setLoadingMore(true)
    try {
      await loadMore()
    } finally {
      setLoadingMore(false)
    }
  }

  // Auto-load more when scrolling near bottom
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000 &&
        hasMore &&
        !loading &&
        !loadingMore &&
        activeTab === "pokedex"
      ) {
        handleLoadMore()
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [hasMore, loading, loadingMore, activeTab])

  const toggleTypeFilter = (type: string) => {
    setSelectedTypes((prev) => {
      const currentTypes = Array.isArray(prev) ? prev : []
      const newTypes = currentTypes.includes(type) ? currentTypes.filter((t) => t !== type) : [...currentTypes, type]

      // Save current state to history before changing
      if (currentTypes.length > 0 || searchTerm) {
        setFilterHistory((current) => {
          const currentHistory = Array.isArray(current) ? current : []
          return [
            ...currentHistory,
            {
              searchTerm,
              selectedTypes: currentTypes,
              timestamp: Date.now(),
            },
          ]
        })
      }

      return newTypes
    })
  }

  const clearAllFilters = () => {
    const currentTypes = Array.isArray(selectedTypes) ? selectedTypes : []

    // Save current state to history
    if (currentTypes.length > 0 || searchTerm || selectedGeneration || selectedRegion) {
      setFilterHistory((current) => {
        const currentHistory = Array.isArray(current) ? current : []
        return [
          ...currentHistory,
          {
            searchTerm,
            selectedTypes: currentTypes,
            timestamp: Date.now(),
          },
        ]
      })
    }

    setSearchTerm("")
    setSelectedTypes([])
    setSelectedGeneration(null)
    setSelectedRegion(null)
  }

  const goBackToPreviousFilter = () => {
    const currentHistory = Array.isArray(filterHistory) ? filterHistory : []
    if (currentHistory.length > 0) {
      const previousState = currentHistory[currentHistory.length - 1]
      setSearchTerm(previousState.searchTerm || "")
      setSelectedTypes(Array.isArray(previousState.selectedTypes) ? previousState.selectedTypes : [])
      setFilterHistory((current) => {
        const currentArray = Array.isArray(current) ? current : []
        return currentArray.slice(0, -1)
      })
    }
  }

  // Safety check for arrays before rendering
  const safeSelectedTypes = Array.isArray(selectedTypes) ? selectedTypes : []
  const safeFilterHistory = Array.isArray(filterHistory) ? filterHistory : []
  const safePokemon = Array.isArray(pokemon) ? pokemon : []
  const safeFilteredPokemon = Array.isArray(filteredPokemon) ? filteredPokemon : []

  // Show loading screen with progress
  if (loading && safePokemon.length === 0) {
    return <PokemonLoadingProgress progress={progress} />
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Failed to Load Pokémon Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-orange-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                  <div className="w-5 h-5 bg-white rounded-full"></div>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">PokéNest</h1>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors">
                <Home className="w-4 h-4" />
                Home
              </Link>
              <Link
                href="/explore"
                className="flex items-center gap-2 text-orange-600 font-medium hover:text-orange-700 transition-colors"
              >
                <Search className="w-4 h-4" />
                Pokédex
              </Link>
              <button
                onClick={() => setActiveTab("comparison")}
                className={`flex items-center gap-2 transition-colors ${
                  activeTab === "comparison" ? "text-orange-600 font-medium" : "text-gray-600 hover:text-orange-600"
                }`}
              >
                <GitCompare className="w-4 h-4" />
                Compare
              </button>
              <button
                onClick={() => setActiveTab("regions")}
                className={`flex items-center gap-2 transition-colors ${
                  activeTab === "regions" ? "text-orange-600 font-medium" : "text-gray-600 hover:text-orange-600"
                }`}
              >
                <Map className="w-4 h-4" />
                Regions
              </button>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors"
              >
                <Trophy className="w-4 h-4" />
                Dashboard
              </Link>
            </div>

            {/* Mobile Navigation & Back Button */}
            <div className="flex items-center gap-2">
              <MobileNavigation activeTab={activeTab} onTabChange={setActiveTab} />
              <Link href="/">
                <Button variant="outline" size="sm" className="gap-2 border-orange-200 hover:bg-orange-50">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Back to Home</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="bg-white/50 backdrop-blur-sm border-b border-orange-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                <div className="w-6 h-6 bg-white rounded-full"></div>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Explore Pokémon</h1>
                <p className="text-gray-600 text-sm sm:text-base">Discover and learn about every Pokémon</p>
              </div>
            </div>
            <div className="text-right">
              <Badge variant="secondary" className="text-xs sm:text-sm mb-1 bg-orange-100 text-orange-800">
                {safePokemon.length} / {totalCount} Pokémon
              </Badge>
              {loading && <div className="text-xs text-gray-500">Loading...</div>}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 sm:grid-cols-7 bg-white/70 backdrop-blur-sm">
            <TabsTrigger value="pokedex" className="text-xs sm:text-sm">
              Pokédex
            </TabsTrigger>
            <TabsTrigger value="comparison" className="text-xs sm:text-sm">
              Compare
            </TabsTrigger>
            <TabsTrigger value="regions" className="text-xs sm:text-sm">
              Regions
            </TabsTrigger>
            <TabsTrigger value="matchups" className="text-xs sm:text-sm hidden sm:block">
              Type Matchups
            </TabsTrigger>
            <TabsTrigger value="battle" className="text-xs sm:text-sm hidden sm:block">
              Battle
            </TabsTrigger>
            <TabsTrigger value="teams" className="text-xs sm:text-sm hidden sm:block">
              Teams
            </TabsTrigger>
            <TabsTrigger value="quiz" className="text-xs sm:text-sm hidden sm:block">
              Quiz
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pokedex" className="space-y-8">
            {error ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <AlertCircle className="w-12 h-12 text-red-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>Reload Page</Button>
              </div>
            ) : (
              <>
                {/* Enhanced Search and Filter */}
                <div className="space-y-6">
                  {/* Navigation and Back Button */}
                  {(safeSelectedTypes.length > 0 ||
                    searchTerm ||
                    selectedGeneration ||
                    selectedRegion ||
                    safeFilterHistory.length > 0) && (
                    <div className="flex items-center justify-between p-4 bg-white/70 backdrop-blur-sm rounded-lg border border-orange-200">
                      <div className="flex items-center gap-3">
                        {safeFilterHistory.length > 0 && (
                          <Button
                            onClick={goBackToPreviousFilter}
                            variant="outline"
                            size="sm"
                            className="gap-2 border-orange-300 hover:bg-orange-50"
                          >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="hidden sm:inline">Previous Filter</span>
                          </Button>
                        )}
                        <span className="text-sm text-gray-600">{safeFilteredPokemon.length} Pokémon found</span>
                      </div>
                      <Button
                        onClick={clearAllFilters}
                        variant="outline"
                        size="sm"
                        className="gap-2 text-red-600 border-red-300 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                        <span className="hidden sm:inline">Clear All</span>
                      </Button>
                    </div>
                  )}

                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      placeholder="Search Pokémon by name or ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 h-12 sm:h-14 text-base sm:text-lg border-2 border-orange-200 focus:border-orange-500 rounded-xl shadow-sm bg-white/70 backdrop-blur-sm"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  {/* Advanced Filters Toggle */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Filter className="w-5 h-5 text-gray-600" />
                      <h3 className="font-semibold text-gray-700">Filters</h3>
                    </div>
                    <Button
                      onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <span className="hidden sm:inline">{showAdvancedFilters ? "Hide" : "Show"} Advanced</span>
                      <span className="sm:hidden">{showAdvancedFilters ? "Hide" : "Show"}</span>
                      {showAdvancedFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                  </div>

                  {/* Type Filter Buttons - Multi-select */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-700">
                        Types {safeSelectedTypes.length > 0 && `(${safeSelectedTypes.length} selected)`}
                      </h4>
                      {safeSelectedTypes.length > 0 && (
                        <button
                          onClick={() => setSelectedTypes([])}
                          className="text-sm text-orange-600 hover:text-orange-800 underline"
                        >
                          Clear types
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {pokemonTypes.slice(1).map((type) => (
                        <TypeFilterButton
                          key={type}
                          type={type}
                          isSelected={safeSelectedTypes.includes(type)}
                          onClick={() => toggleTypeFilter(type)}
                        />
                      ))}
                    </div>
                    {safeSelectedTypes.length > 0 && (
                      <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <strong>Multi-type filtering:</strong> Showing Pokémon that have at least one of the selected
                        types: {safeSelectedTypes.join(", ")}
                      </div>
                    )}
                  </div>

                  {/* Advanced Filters */}
                  {showAdvancedFilters && (
                    <div className="grid md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      {/* Generation Filter */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-700">Generation</h4>
                          {selectedGeneration && (
                            <button
                              onClick={() => setSelectedGeneration(null)}
                              className="text-sm text-orange-600 hover:text-orange-800 underline"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {generations.map((gen) => (
                            <button
                              key={gen}
                              onClick={() => setSelectedGeneration(selectedGeneration === gen ? null : gen)}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                selectedGeneration === gen
                                  ? "bg-blue-500 text-white"
                                  : "bg-white text-gray-700 hover:bg-blue-50 border border-gray-300"
                              }`}
                            >
                              Gen {gen}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Region Filter */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-700">Region</h4>
                          {selectedRegion && (
                            <button
                              onClick={() => setSelectedRegion(null)}
                              className="text-sm text-orange-600 hover:text-orange-800 underline"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {regions.map((region) => (
                            <button
                              key={region}
                              onClick={() => setSelectedRegion(selectedRegion === region ? null : region)}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                selectedRegion === region
                                  ? "bg-green-500 text-white"
                                  : "bg-white text-gray-700 hover:bg-green-50 border border-gray-300"
                              }`}
                            >
                              {region}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Active Filters Display */}
                  {(searchTerm || safeSelectedTypes.length > 0 || selectedGeneration || selectedRegion) && (
                    <div className="flex flex-wrap items-center gap-2 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
                      <span className="text-sm font-medium text-orange-800">Active filters:</span>

                      {searchTerm && (
                        <Badge variant="secondary" className="bg-orange-100 text-orange-800 gap-1">
                          <Search className="w-3 h-3" />"{searchTerm}"
                          <button onClick={() => setSearchTerm("")} className="ml-1 hover:text-orange-900">
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      )}

                      {safeSelectedTypes.map((type) => (
                        <Badge key={type} variant="secondary" className="bg-blue-100 text-blue-800 gap-1">
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                          <button onClick={() => toggleTypeFilter(type)} className="ml-1 hover:text-blue-900">
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}

                      {selectedGeneration && (
                        <Badge variant="secondary" className="bg-purple-100 text-purple-800 gap-1">
                          Generation {selectedGeneration}
                          <button onClick={() => setSelectedGeneration(null)} className="ml-1 hover:text-purple-900">
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      )}

                      {selectedRegion && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 gap-1">
                          {selectedRegion}
                          <button onClick={() => setSelectedRegion(null)} className="ml-1 hover:text-green-900">
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                {/* Search Results Summary */}
                <SearchResultsSummary
                  totalResults={safeFilteredPokemon.length}
                  searchTerm={searchTerm}
                  selectedType={
                    safeSelectedTypes.length === 1
                      ? safeSelectedTypes[0]
                      : safeSelectedTypes.length > 1
                        ? "multiple"
                        : "all"
                  }
                  totalPokemon={safePokemon.length}
                />

                {loading && safePokemon.length === 0 ? (
                  <PokemonGridSkeleton count={20} />
                ) : safeFilteredPokemon.length === 0 && !loading ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Search className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Pokémon found</h3>
                    <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                  </div>
                ) : (
                  <>
                    {loading && safePokemon.length > 0 && (
                      <div className="mb-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-blue-700">
                              Loading more Pokémon... ({progress.current}/{progress.total})
                            </span>
                            <span className="text-sm text-blue-600">
                              {Math.round((progress.current / progress.total) * 100)}%
                            </span>
                          </div>
                          <div className="w-full bg-blue-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(progress.current / progress.total) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                      {safeFilteredPokemon.map((poke) => (
                        <PokemonCard key={poke.id} pokemon={poke} onClick={() => setSelectedPokemon(poke)} />
                      ))}
                    </div>

                    {/* Load More / Loading Indicator */}
                    {hasMore && !loading && (
                      <div className="text-center py-8">
                        <Button
                          onClick={handleLoadMore}
                          disabled={loadingMore}
                          className="gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                        >
                          {loadingMore ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Loading more...
                            </>
                          ) : (
                            `Load more Pokémon (${safePokemon.length}/${totalCount})`
                          )}
                        </Button>
                      </div>
                    )}

                    {loadingMore && <LoadingSpinner />}

                    {!hasMore && safePokemon.length > 0 && (
                      <div className="text-center py-8 text-gray-600">
                        <p>You've seen all {safePokemon.length} Pokémon! 🎉</p>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="comparison">
            <PokemonComparison pokemon={sortedPokemon} />
          </TabsContent>

          <TabsContent value="regions">
            <RegionExplorer pokemon={sortedPokemon} onPokemonSelect={setSelectedPokemon} />
          </TabsContent>

          <TabsContent value="matchups">
            <TypeMatchupCalculator />
          </TabsContent>

          <TabsContent value="battle">
            <BattleSimulator pokemon={sortedPokemon} />
          </TabsContent>

          <TabsContent value="teams">
            <TeamBuilder pokemon={sortedPokemon} />
          </TabsContent>

          <TabsContent value="quiz">
            <QuizSystem pokemon={sortedPokemon} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Pokemon Modal */}
      <PokemonModal pokemon={selectedPokemon} isOpen={!!selectedPokemon} onClose={() => setSelectedPokemon(null)} />
    </div>
  )
}
