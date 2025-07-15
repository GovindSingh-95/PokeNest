"use client"
import { useState, useMemo } from "react"
import { GitCompare, Map, Home, AlertCircle, ArrowLeft, Trophy } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PokemonModal } from "@/components/pokemon-modal"
import { PokemonComparison } from "@/components/pokemon-comparison"
import { RegionExplorer } from "@/components/region-explorer"
import { MobileNavigation } from "@/components/mobile-navigation"
import { useOptimizedPokemonData } from "@/hooks/use-optimized-pokemon-data"
import { OptimizedSearch } from "@/components/optimized-search"
import { LazyPokemonGrid } from "@/components/lazy-pokemon-grid"
import type { Pokemon } from "@/types/pokemon"
import { TypeMatchupCalculator } from "@/components/type-matchup-calculator"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { BattleSimulator } from "@/components/battle-simulator"
import { TeamBuilder } from "@/components/team-builder"
import { QuizSystem } from "@/components/quiz-system"

export default function ExplorePage() {
  const searchParams = useSearchParams()
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null)
  const [activeTab, setActiveTab] = useState(searchParams?.get("tab") || "pokedex")

  const {
    pokemon,
    loading,
    error,
    hasMore,
    loadMore,
    totalCount,
    searchResults,
    search,
    clearSearch,
    isSearching,
    searchQuery,
    progress,
  } = useOptimizedPokemonData()

  // Determine which Pokemon to display
  const displayPokemon = useMemo(() => {
    return searchQuery ? searchResults : pokemon
  }, [searchQuery, searchResults, pokemon])

  // Show error state
  if (error && pokemon.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Failed to Load Pokémon Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
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
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-orange-200 hover:bg-orange-50 bg-transparent"
                >
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
                {pokemon.length} / {totalCount} Pokémon
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
            {/* Optimized Search Component */}
            <OptimizedSearch
              onSearch={search}
              onClear={clearSearch}
              isSearching={isSearching}
              searchResults={searchResults}
              totalPokemon={totalCount}
            />

            {/* Results Display */}
            {displayPokemon.length === 0 && !loading && !isSearching ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <AlertCircle className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Pokémon found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <>
                {/* Loading Progress for Initial Load */}
                {loading && pokemon.length === 0 && (
                  <div className="mb-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-700">
                          Loading Pokémon... ({progress.current}/{progress.total})
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

                {/* Lazy Pokemon Grid */}
                <LazyPokemonGrid pokemon={displayPokemon} onPokemonSelect={setSelectedPokemon} loading={loading} />

                {/* Load More Button for non-search results */}
                {!searchQuery && hasMore && !loading && pokemon.length > 0 && (
                  <div className="text-center py-8">
                    <Button
                      onClick={loadMore}
                      className="gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                    >
                      Load more Pokémon ({pokemon.length}/{totalCount})
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="comparison">
            <PokemonComparison pokemon={pokemon} />
          </TabsContent>

          <TabsContent value="regions">
            <RegionExplorer pokemon={pokemon} onPokemonSelect={setSelectedPokemon} />
          </TabsContent>

          <TabsContent value="matchups">
            <TypeMatchupCalculator />
          </TabsContent>

          <TabsContent value="battle">
            <BattleSimulator pokemon={pokemon} />
          </TabsContent>

          <TabsContent value="teams">
            <TeamBuilder pokemon={pokemon} />
          </TabsContent>

          <TabsContent value="quiz">
            <QuizSystem pokemon={pokemon} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Pokemon Modal */}
      <PokemonModal pokemon={selectedPokemon} isOpen={!!selectedPokemon} onClose={() => setSelectedPokemon(null)} />
    </div>
  )
}
