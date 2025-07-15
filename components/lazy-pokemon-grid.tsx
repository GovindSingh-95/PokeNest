"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { PokemonCard } from "@/components/pokemon-card"
import { PokemonGridSkeleton } from "@/components/pokemon-loading"
import type { Pokemon } from "@/types/pokemon"

interface LazyPokemonGridProps {
  pokemon: Pokemon[]
  onPokemonSelect: (pokemon: Pokemon) => void
  loading?: boolean
  className?: string
}

const ITEMS_PER_PAGE = 20
const INTERSECTION_THRESHOLD = 0.1

export function LazyPokemonGrid({ pokemon, onPokemonSelect, loading = false, className = "" }: LazyPokemonGridProps) {
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Intersection Observer for infinite scroll
  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries

      if (entry.isIntersecting && visibleCount < pokemon.length && !isLoadingMore) {
        setIsLoadingMore(true)

        // Simulate loading delay for smooth UX
        setTimeout(() => {
          setVisibleCount((prev) => Math.min(prev + ITEMS_PER_PAGE, pokemon.length))
          setIsLoadingMore(false)
        }, 300)
      }
    },
    [visibleCount, pokemon.length, isLoadingMore],
  )

  // Set up intersection observer
  useEffect(() => {
    if (!sentinelRef.current) return

    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold: INTERSECTION_THRESHOLD,
      rootMargin: "100px",
    })

    observerRef.current.observe(sentinelRef.current)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [handleIntersection])

  // Reset visible count when pokemon array changes
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE)
  }, [pokemon])

  const visiblePokemon = pokemon.slice(0, visibleCount)
  const hasMore = visibleCount < pokemon.length

  if (loading && pokemon.length === 0) {
    return <PokemonGridSkeleton count={20} />
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {visiblePokemon.map((poke) => (
          <PokemonCard key={poke.id} pokemon={poke} onClick={() => onPokemonSelect(poke)} />
        ))}
      </div>

      {/* Loading more indicator */}
      {(isLoadingMore || loading) && (
        <div className="mt-8">
          <PokemonGridSkeleton count={ITEMS_PER_PAGE} />
        </div>
      )}

      {/* Intersection sentinel */}
      {hasMore && !loading && (
        <div ref={sentinelRef} className="h-10 flex items-center justify-center mt-8">
          <div className="text-sm text-gray-500">Loading more Pokémon...</div>
        </div>
      )}

      {/* End of results */}
      {!hasMore && pokemon.length > 0 && (
        <div className="text-center py-8 text-gray-600">
          <p>You've seen all {pokemon.length} Pokémon! 🎉</p>
        </div>
      )}
    </div>
  )
}
