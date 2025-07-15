import type {
  PokeAPIListResponse,
  PokeAPIPokemon,
  PokeAPISpecies,
  Pokemon,
  PokeAPIEvolutionChain,
  EvolutionChainLink,
  EvolutionDetail,
  EvolutionChain,
  EvolutionStage,
} from "@/types/pokemon"
import { pokemonCache, PersistentCache } from "./pokemon-cache"

const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2"
const OFFICIAL_ARTWORK_BASE_URL =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork"

// Optimized fetch with compression and retry logic
async function optimizedFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const cacheKey = `fetch-${url}`

  // Check memory cache first
  const cached = pokemonCache.get<T>(cacheKey)
  if (cached) {
    return cached
  }

  // Check persistent cache
  const persistentCached = PersistentCache.load<T>(cacheKey)
  if (persistentCached) {
    pokemonCache.set(cacheKey, persistentCached)
    return persistentCached
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "Accept-Encoding": "gzip, deflate, br",
        Accept: "application/json",
        ...options.headers,
      },
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()

    // Cache the result
    pokemonCache.set(cacheKey, data)
    PersistentCache.save(cacheKey, data)

    return data
  } catch (error) {
    clearTimeout(timeoutId)

    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timeout")
    }

    throw error
  }
}

// Batch fetching with concurrency control
export async function fetchPokemonBatch(urls: string[], batchSize = 10): Promise<Pokemon[]> {
  const results: Pokemon[] = []
  const errors: string[] = []

  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize)

    const batchPromises = batch.map(async (url, index) => {
      try {
        const pokemon = await optimizedFetch<PokeAPIPokemon>(url)

        // Fetch species data in parallel if needed
        let species: PokeAPISpecies | undefined
        try {
          species = await optimizedFetch<PokeAPISpecies>(pokemon.species.url)
        } catch (speciesError) {
          console.warn(`Failed to fetch species for ${pokemon.name}:`, speciesError)
        }

        return await transformPokemonData(pokemon, species)
      } catch (error) {
        const errorMsg = `Failed to fetch Pokemon from ${url}: ${error}`
        errors.push(errorMsg)
        console.error(errorMsg)
        return null
      }
    })

    const batchResults = await Promise.allSettled(batchPromises)

    batchResults.forEach((result, index) => {
      if (result.status === "fulfilled" && result.value) {
        results.push(result.value)
      }
    })

    // Rate limiting - small delay between batches
    if (i + batchSize < urls.length) {
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
  }

  if (errors.length > 0) {
    console.warn(`Batch fetch completed with ${errors.length} errors out of ${urls.length} requests`)
  }

  return results.sort((a, b) => a.id - b.id)
}

// Paginated Pokemon fetching
export interface PaginatedPokemonResponse {
  pokemon: Pokemon[]
  hasMore: boolean
  nextOffset: number
  total: number
}

export async function fetchPokemonPage(offset = 0, limit = 50): Promise<PaginatedPokemonResponse> {
  const cacheKey = `pokemon-page-${offset}-${limit}`

  // Check cache first
  const cached = pokemonCache.get<PaginatedPokemonResponse>(cacheKey)
  if (cached) {
    return cached
  }

  try {
    // Fetch the list with pagination
    const listResponse = await optimizedFetch<PokeAPIListResponse>(
      `${POKEAPI_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`,
    )

    // Fetch detailed data for this page
    const pokemonUrls = listResponse.results.map((p) => p.url)
    const pokemon = await fetchPokemonBatch(pokemonUrls, 15) // Smaller batch size for pages

    const response: PaginatedPokemonResponse = {
      pokemon,
      hasMore: listResponse.next !== null,
      nextOffset: offset + limit,
      total: listResponse.count,
    }

    // Cache the page result
    pokemonCache.set(cacheKey, response, 10 * 60 * 1000) // 10 minutes

    return response
  } catch (error) {
    console.error("Failed to fetch Pokemon page:", error)
    throw error
  }
}

// Optimized search with indexing
export interface SearchIndex {
  byName: Map<string, number[]>
  byType: Map<string, number[]>
  byGeneration: Map<number, number[]>
  byRegion: Map<string, number[]>
}

let searchIndex: SearchIndex | null = null

export async function buildSearchIndex(pokemon: Pokemon[]): Promise<SearchIndex> {
  if (searchIndex) return searchIndex

  const index: SearchIndex = {
    byName: new Map(),
    byType: new Map(),
    byGeneration: new Map(),
    byRegion: new Map(),
  }

  pokemon.forEach((poke) => {
    // Index by name (including partial matches)
    const name = poke.name.toLowerCase()
    for (let i = 0; i < name.length; i++) {
      for (let j = i + 1; j <= name.length; j++) {
        const substring = name.substring(i, j)
        if (substring.length >= 2) {
          // Only index substrings of 2+ characters
          if (!index.byName.has(substring)) {
            index.byName.set(substring, [])
          }
          index.byName.get(substring)!.push(poke.id)
        }
      }
    }

    // Index by types
    poke.types.forEach((type) => {
      if (!index.byType.has(type)) {
        index.byType.set(type, [])
      }
      index.byType.get(type)!.push(poke.id)
    })

    // Index by generation
    if (!index.byGeneration.has(poke.generation)) {
      index.byGeneration.set(poke.generation, [])
    }
    index.byGeneration.get(poke.generation)!.push(poke.id)

    // Index by region
    if (!index.byRegion.has(poke.region)) {
      index.byRegion.set(poke.region, [])
    }
    index.byRegion.get(poke.region)!.push(poke.id)
  })

  searchIndex = index
  return index
}

// Fast search using index
export async function searchPokemon(
  query: string,
  pokemon: Pokemon[],
  filters: {
    types?: string[]
    generation?: number
    region?: string
  } = {},
): Promise<Pokemon[]> {
  const index = await buildSearchIndex(pokemon)
  const pokemonMap = new Map(pokemon.map((p) => [p.id, p]))

  let candidateIds: Set<number> = new Set()

  // Search by name if query provided
  if (query.trim()) {
    const searchTerm = query.toLowerCase().trim()
    const nameMatches = index.byName.get(searchTerm) || []

    // Also check for exact ID matches
    const idMatch = Number.parseInt(searchTerm)
    if (!isNaN(idMatch)) {
      nameMatches.push(idMatch)
    }

    candidateIds = new Set(nameMatches)
  } else {
    // No query, start with all Pokemon
    candidateIds = new Set(pokemon.map((p) => p.id))
  }

  // Apply type filters
  if (filters.types && filters.types.length > 0) {
    const typeMatches = new Set<number>()
    filters.types.forEach((type) => {
      const matches = index.byType.get(type) || []
      matches.forEach((id) => typeMatches.add(id))
    })
    candidateIds = new Set([...candidateIds].filter((id) => typeMatches.has(id)))
  }

  // Apply generation filter
  if (filters.generation) {
    const genMatches = new Set(index.byGeneration.get(filters.generation) || [])
    candidateIds = new Set([...candidateIds].filter((id) => genMatches.has(id)))
  }

  // Apply region filter
  if (filters.region) {
    const regionMatches = new Set(index.byRegion.get(filters.region) || [])
    candidateIds = new Set([...candidateIds].filter((id) => regionMatches.has(id)))
  }

  // Convert back to Pokemon objects and sort
  const results = [...candidateIds]
    .map((id) => pokemonMap.get(id))
    .filter((p): p is Pokemon => p !== undefined)
    .sort((a, b) => {
      // Prioritize exact name matches
      if (query.trim()) {
        const queryLower = query.toLowerCase()
        const aExact = a.name.toLowerCase() === queryLower
        const bExact = b.name.toLowerCase() === queryLower
        if (aExact && !bExact) return -1
        if (!aExact && bExact) return 1

        // Then prioritize name starts with query
        const aStarts = a.name.toLowerCase().startsWith(queryLower)
        const bStarts = b.name.toLowerCase().startsWith(queryLower)
        if (aStarts && !bStarts) return -1
        if (!aStarts && bStarts) return 1
      }

      // Finally sort by ID
      return a.id - b.id
    })

  return results
}

// Enhanced evolution chain parsing with caching
function parseEvolutionChain(chain: EvolutionChainLink): EvolutionChain | undefined {
  const stages: EvolutionStage[] = []

  const getPokemonIdFromUrl = (url: string): number => {
    const matches = url.match(/\/(\d+)\/$/)
    return matches ? Number.parseInt(matches[1]) : 0
  }

  const getEvolutionMethod = (details: EvolutionDetail[]): string => {
    if (!details || details.length === 0) return "Unknown"

    const detail = details[0]

    if (detail.min_level) return `Level ${detail.min_level}`
    if (detail.item) {
      const itemName = detail.item.name
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
      return itemName
    }
    if (detail.trigger.name === "trade") {
      if (detail.held_item) {
        const itemName = detail.held_item.name
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
        return `Trade holding ${itemName}`
      }
      return "Trade"
    }
    if (detail.min_happiness) {
      return detail.time_of_day ? `Friendship (${detail.time_of_day})` : "Friendship"
    }

    return detail.trigger.name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Stage 1 (base form)
  const stage1Id = getPokemonIdFromUrl(chain.species.url)
  const stage1Name = chain.species.name.charAt(0).toUpperCase() + chain.species.name.slice(1)

  stages.push({
    id: stage1Id,
    name: stage1Name,
    image: `${OFFICIAL_ARTWORK_BASE_URL}/${stage1Id}.png`,
  })

  // Stage 2 (first evolution)
  if (chain.evolves_to && chain.evolves_to.length > 0) {
    const evolution2 = chain.evolves_to[0]
    const stage2Id = getPokemonIdFromUrl(evolution2.species.url)
    const stage2Name = evolution2.species.name.charAt(0).toUpperCase() + evolution2.species.name.slice(1)
    const stage2Method = getEvolutionMethod(evolution2.evolution_details)

    stages.push({
      id: stage2Id,
      name: stage2Name,
      image: `${OFFICIAL_ARTWORK_BASE_URL}/${stage2Id}.png`,
      method: stage2Method,
      level: evolution2.evolution_details[0]?.min_level || undefined,
    })

    // Stage 3 (second evolution)
    if (evolution2.evolves_to && evolution2.evolves_to.length > 0) {
      const evolution3 = evolution2.evolves_to[0]
      const stage3Id = getPokemonIdFromUrl(evolution3.species.url)
      const stage3Name = evolution3.species.name.charAt(0).toUpperCase() + evolution3.species.name.slice(1)
      const stage3Method = getEvolutionMethod(evolution3.evolution_details)

      stages.push({
        id: stage3Id,
        name: stage3Name,
        image: `${OFFICIAL_ARTWORK_BASE_URL}/${stage3Id}.png`,
        method: stage3Method,
        level: evolution3.evolution_details[0]?.min_level || undefined,
      })
    }
  }

  if (stages.length < 2) return undefined

  const evolutionChain: EvolutionChain = { stage1: stages[0] }
  if (stages[1]) evolutionChain.stage2 = stages[1]
  if (stages[2]) evolutionChain.stage3 = stages[2]

  return evolutionChain
}

function getGenerationFromId(id: number): { region: string; generation: number } {
  if (id >= 1 && id <= 151) return { region: "Kanto", generation: 1 }
  if (id >= 152 && id <= 251) return { region: "Johto", generation: 2 }
  if (id >= 252 && id <= 386) return { region: "Hoenn", generation: 3 }
  if (id >= 387 && id <= 493) return { region: "Sinnoh", generation: 4 }
  if (id >= 494 && id <= 649) return { region: "Unova", generation: 5 }
  if (id >= 650 && id <= 721) return { region: "Kalos", generation: 6 }
  if (id >= 722 && id <= 809) return { region: "Alola", generation: 7 }
  if (id >= 810 && id <= 905) return { region: "Galar", generation: 8 }
  if (id >= 906 && id <= 1010) return { region: "Paldea", generation: 9 }
  return { region: "Unknown", generation: 1 }
}

export async function transformPokemonData(apiPokemon: PokeAPIPokemon, species?: PokeAPISpecies): Promise<Pokemon> {
  const { region, generation } = getGenerationFromId(apiPokemon.id)

  let description = "No description available."
  if (species) {
    const englishEntry = species.flavor_text_entries.find((entry) => entry.language.name === "en")
    if (englishEntry) {
      description = englishEntry.flavor_text.replace(/\f/g, " ").replace(/\n/g, " ")
    }
  }

  let evolutionChain: EvolutionChain | undefined
  if (species?.evolution_chain?.url) {
    try {
      const evolutionData = await optimizedFetch<PokeAPIEvolutionChain>(species.evolution_chain.url)
      evolutionChain = parseEvolutionChain(evolutionData.chain)
    } catch (error) {
      console.warn(`Failed to fetch evolution chain for ${apiPokemon.name}:`, error)
    }
  }

  const statsMap: Record<string, keyof Pokemon["stats"]> = {
    hp: "hp",
    attack: "attack",
    defense: "defense",
    "special-attack": "specialAttack",
    "special-defense": "specialDefense",
    speed: "speed",
  }

  const stats = {
    hp: 0,
    attack: 0,
    defense: 0,
    specialAttack: 0,
    specialDefense: 0,
    speed: 0,
  }

  apiPokemon.stats.forEach((stat) => {
    const statName = statsMap[stat.stat.name]
    if (statName) {
      stats[statName] = stat.base_stat
    }
  })

  const officialArtwork = apiPokemon.sprites.other["official-artwork"].front_default
  const image = officialArtwork || `${OFFICIAL_ARTWORK_BASE_URL}/${apiPokemon.id}.png`

  return {
    id: apiPokemon.id,
    name: apiPokemon.name.charAt(0).toUpperCase() + apiPokemon.name.slice(1),
    types: apiPokemon.types.map((type) => type.type.name),
    image,
    stats,
    height: `${(apiPokemon.height / 10).toFixed(1)} m`,
    weight: `${(apiPokemon.weight / 10).toFixed(1)} kg`,
    description,
    region,
    generation,
    evolutionChain,
  }
}

// Preload critical Pokemon data
export async function preloadCriticalPokemon(): Promise<Pokemon[]> {
  const criticalIds = [1, 4, 7, 25, 150, 151, 249, 250, 384, 385, 483, 484, 644, 645, 716, 717, 800, 898, 899]

  try {
    const urls = criticalIds.map((id) => `${POKEAPI_BASE_URL}/pokemon/${id}`)
    return await fetchPokemonBatch(urls, 5)
  } catch (error) {
    console.warn("Failed to preload critical Pokemon:", error)
    return []
  }
}

// Initialize cache and preload data
if (typeof window !== "undefined") {
  // Preload critical data on client side
  pokemonCache.preloadCriticalData()
}
