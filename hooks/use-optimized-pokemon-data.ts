"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { fetchPokemonPage, searchPokemon, preloadCriticalPokemon } from "@/lib/optimized-pokemon-api"
import type { Pokemon } from "@/types/pokemon"

interface UseOptimizedPokemonDataReturn {
  pokemon: Pokemon[]
  loading: boolean
  error: string | null
  hasMore: boolean
  loadMore: () => Promise<void>
  totalCount: number
  searchResults: Pokemon[]
  search: (
    query: string,
    filters?: {
      types?: string[]
      generation?: number
      region?: string
    },
  ) => Promise<void>
  clearSearch: () => void
  isSearching: boolean
  searchQuery: string
  progress: {
    current: number
    total: number
  }
}

const INITIAL_PAGE_SIZE = 50
const LOAD_MORE_SIZE = 25

export function useOptimizedPokemonData(): UseOptimizedPokemonDataReturn {
  const [pokemon, setPokemon] = useState<Pokemon[]>([])
  const [searchResults, setSearchResults] = useState<Pokemon[]>([])
  const [loading, setLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [nextOffset, setNextOffset] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [allPokemonLoaded, setAllPokemonLoaded] = useState(false)

  // Progress calculation
  const progress = useMemo(
    () => ({
      current: pokemon.length,
      total: totalCount || 1010,
    }),
    [pokemon.length, totalCount],
  )

  // Load initial page with critical Pokemon
  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // First, load critical Pokemon for immediate display
      const criticalPokemon = await preloadCriticalPokemon()
      if (criticalPokemon.length > 0) {
        setPokemon(criticalPokemon)
      }

      // Then load the first page
      const response = await fetchPokemonPage(0, INITIAL_PAGE_SIZE)

      // Merge critical Pokemon with first page, avoiding duplicates
      const criticalIds = new Set(criticalPokemon.map((p) => p.id))
      const newPokemon = response.pokemon.filter((p) => !criticalIds.has(p.id))
      const combinedPokemon = [...criticalPokemon, ...newPokemon].sort((a, b) => a.id - b.id)

      setPokemon(combinedPokemon)
      setHasMore(response.hasMore)
      setNextOffset(response.nextOffset)
      setTotalCount(response.total)
    } catch (err) {
      console.error("Failed to load initial Pokemon data:", err)
      setError(err instanceof Error ? err.message : "Failed to load Pokemon data")
    } finally {
      setLoading(false)
    }
  }, [])

  // Load more Pokemon
  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return

    try {
      setLoading(true)

      const response = await fetchPokemonPage(nextOffset, LOAD_MORE_SIZE)

      setPokemon((prev) => {
        const existingIds = new Set(prev.map((p) => p.id))
        const newPokemon = response.pokemon.filter((p) => !existingIds.has(p.id))
        return [...prev, ...newPokemon].sort((a, b) => a.id - b.id)
      })

      setHasMore(response.hasMore)
      setNextOffset(response.nextOffset)

      if (!response.hasMore) {
        setAllPokemonLoaded(true)
      }
    } catch (err) {
      console.error("Failed to load more Pokemon:", err)
      setError(err instanceof Error ? err.message : "Failed to load more Pokemon")
    } finally {
      setLoading(false)
    }
  }, [hasMore, loading, nextOffset])

  // Optimized search function
  const search = useCallback(
    async (
      query: string,
      filters: {
        types?: string[]
        generation?: number
        region?: string
      } = {},
    ) => {
      if (!query.trim() && !filters.types?.length && !filters.generation && !filters.region) {
        setSearchResults([])
        setSearchQuery("")
        return
      }

      try {
        setIsSearching(true)
        setSearchQuery(query)

        // If we don't have all Pokemon loaded yet, load them for comprehensive search
        let searchablePokemon = pokemon
        if (!allPokemonLoaded && pokemon.length < 500) {
          // Load more data for better search results
          const additionalPages = []
          for (let offset = nextOffset; offset < 500; offset += 50) {
            additionalPages.push(fetchPokemonPage(offset, 50))
          }

          const responses = await Promise.all(additionalPages)
          const additionalPokemon = responses.flatMap((r) => r.pokemon)

          searchablePokemon = [...pokemon, ...additionalPokemon]
            .filter((p, index, arr) => arr.findIndex((other) => other.id === p.id) === index)
            .sort((a, b) => a.id - b.id)
        }

        const results = await searchPokemon(query, searchablePokemon, filters)
        setSearchResults(results)
      } catch (err) {
        console.error("Search failed:", err)
        setError(err instanceof Error ? err.message : "Search failed")
      } finally {
        setIsSearching(false)
      }
    },
    [pokemon, nextOffset, allPokemonLoaded],
  )

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchResults([])
    setSearchQuery("")
  }, [])

  // Auto-load more when scrolling (with throttling)
  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const handleScroll = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        if (
          window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000 &&
          hasMore &&
          !loading &&
          !isSearching &&
          !searchQuery
        ) {
          loadMore()
        }
      }, 100)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearTimeout(timeoutId)
    }
  }, [hasMore, loading, isSearching, searchQuery, loadMore])

  // Initialize data on mount
  useEffect(() => {
    loadInitialData()
  }, [loadInitialData])

  return {
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
  }
}
