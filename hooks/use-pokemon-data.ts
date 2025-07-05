"use client"

import { useState, useEffect, useCallback } from "react"
import { fetchPokemonList, fetchPokemonBatch } from "@/lib/pokemon-api"
import type { Pokemon } from "@/types/pokemon"

interface UsePokemonDataReturn {
  pokemon: Pokemon[]
  loading: boolean
  error: string | null
  hasMore: boolean
  loadMore: () => Promise<void>
  totalCount: number
  progress: {
    current: number
    total: number
    currentRegion?: string
  }
}

export function usePokemonData(): UsePokemonDataReturn {
  const [pokemon, setPokemon] = useState<Pokemon[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [totalCount, setTotalCount] = useState(1000) // Default to 1000
  const [progress, setProgress] = useState({ current: 0, total: 1000 })

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch the first batch to get total count
      const pokemonList = await fetchPokemonList(1000, 0) // Get first 1000 Pokemon
      setTotalCount(pokemonList.results.length)
      setProgress({ current: 0, total: pokemonList.results.length })

      // Load Pokemon in batches
      const batchSize = 50
      const allPokemon: Pokemon[] = []

      for (let i = 0; i < pokemonList.results.length; i += batchSize) {
        const batch = pokemonList.results.slice(i, i + batchSize)
        const batchUrls = batch.map((p) => p.url)

        try {
          const batchPokemon = await fetchPokemonBatch(batchUrls)
          allPokemon.push(...batchPokemon)

          // Update progress and state
          setProgress({ current: allPokemon.length, total: pokemonList.results.length })
          setPokemon([...allPokemon])

          // Small delay to show progress
          await new Promise((resolve) => setTimeout(resolve, 100))
        } catch (batchError) {
          console.warn(`Failed to load batch ${i}-${i + batchSize}:`, batchError)
          // Continue with next batch even if one fails
        }
      }

      setHasMore(false) // All data loaded
    } catch (err) {
      console.error("Failed to load Pokemon data:", err)
      setError(err instanceof Error ? err.message : "Failed to load Pokemon data")
    } finally {
      setLoading(false)
    }
  }, [])

  const loadMore = useCallback(async () => {
    // Since we load all data initially, this is just for compatibility
    return Promise.resolve()
  }, [])

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
    progress,
  }
}
