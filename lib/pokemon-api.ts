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

const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2"
const OFFICIAL_ARTWORK_BASE_URL =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork"

// Enhanced cache with expiration
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

async function fetchWithCache<T>(url: string): Promise<T> {
  const cached = cache.get(url)
  const now = Date.now()

  if (cached && now - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    cache.set(url, { data, timestamp: now })
    return data
  } catch (error) {
    console.error(`Failed to fetch ${url}:`, error)
    throw error
  }
}

export async function fetchPokemonList(limit = 1000, offset = 0): Promise<PokeAPIListResponse> {
  const url = `${POKEAPI_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`
  return fetchWithCache<PokeAPIListResponse>(url)
}

export async function fetchPokemonDetails(pokemonUrl: string): Promise<PokeAPIPokemon> {
  return fetchWithCache<PokeAPIPokemon>(pokemonUrl)
}

export async function fetchPokemonSpecies(speciesUrl: string): Promise<PokeAPISpecies> {
  return fetchWithCache<PokeAPISpecies>(speciesUrl)
}

export async function fetchEvolutionChain(evolutionChainUrl: string): Promise<PokeAPIEvolutionChain> {
  return fetchWithCache<PokeAPIEvolutionChain>(evolutionChainUrl)
}

function getEvolutionMethod(details: EvolutionDetail[]): string {
  if (!details || details.length === 0) return "Unknown"

  const detail = details[0] // Use first evolution detail

  if (detail.min_level) {
    return `Level ${detail.min_level}`
  }

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
    if (detail.trade_species) {
      const speciesName = detail.trade_species.name
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
      return `Trade for ${speciesName}`
    }
    return "Trade"
  }

  if (detail.min_happiness) {
    if (detail.time_of_day) {
      return `Friendship (${detail.time_of_day})`
    }
    return "Friendship"
  }

  if (detail.min_affection) {
    return "Affection"
  }

  if (detail.known_move) {
    const moveName = detail.known_move.name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
    return `Learn ${moveName}`
  }

  if (detail.location) {
    const locationName = detail.location.name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
    return `At ${locationName}`
  }

  if (detail.time_of_day) {
    return `Level up (${detail.time_of_day})`
  }

  if (detail.relative_physical_stats === 1) {
    return "Level up (Attack > Defense)"
  }

  if (detail.relative_physical_stats === -1) {
    return "Level up (Defense > Attack)"
  }

  if (detail.relative_physical_stats === 0) {
    return "Level up (Attack = Defense)"
  }

  if (detail.gender === 1) {
    return "Level up (Female)"
  }

  if (detail.gender === 2) {
    return "Level up (Male)"
  }

  if (detail.needs_overworld_rain) {
    return "Level up (Rain)"
  }

  if (detail.turn_upside_down) {
    return "Turn console upside down"
  }

  // Fallback to trigger name
  const triggerName = detail.trigger.name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  return triggerName
}

function parseEvolutionChain(chain: EvolutionChainLink): EvolutionChain | undefined {
  const stages: EvolutionStage[] = []

  // Helper function to extract Pokemon ID from species URL
  const getPokemonIdFromUrl = (url: string): number => {
    const matches = url.match(/\/(\d+)\/$/)
    return matches ? Number.parseInt(matches[1]) : 0
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

  // Only return evolution chain if there are multiple stages
  if (stages.length < 2) {
    return undefined
  }

  const evolutionChain: EvolutionChain = {
    stage1: stages[0],
  }

  if (stages[1]) {
    evolutionChain.stage2 = stages[1]
  }

  if (stages[2]) {
    evolutionChain.stage3 = stages[2]
  }

  return evolutionChain
}

// Enhanced generation detection with more accurate ranges
function getGenerationFromId(id: number): { region: string; generation: number } {
  if (id >= 1 && id <= 151) {
    return { region: "Kanto", generation: 1 }
  } else if (id >= 152 && id <= 251) {
    return { region: "Johto", generation: 2 }
  } else if (id >= 252 && id <= 386) {
    return { region: "Hoenn", generation: 3 }
  } else if (id >= 387 && id <= 493) {
    return { region: "Sinnoh", generation: 4 }
  } else if (id >= 494 && id <= 649) {
    return { region: "Unova", generation: 5 }
  } else if (id >= 650 && id <= 721) {
    return { region: "Kalos", generation: 6 }
  } else if (id >= 722 && id <= 809) {
    return { region: "Alola", generation: 7 }
  } else if (id >= 810 && id <= 905) {
    return { region: "Galar", generation: 8 }
  } else if (id >= 906 && id <= 1010) {
    return { region: "Paldea", generation: 9 }
  } else {
    return { region: "Unknown", generation: 1 }
  }
}

// Update the transformPokemonData function to include real evolution data
export async function transformPokemonData(apiPokemon: PokeAPIPokemon, species?: PokeAPISpecies): Promise<Pokemon> {
  const { region, generation } = getGenerationFromId(apiPokemon.id)

  // Get English description
  let description = "No description available."
  if (species) {
    const englishEntry = species.flavor_text_entries.find((entry) => entry.language.name === "en")
    if (englishEntry) {
      description = englishEntry.flavor_text.replace(/\f/g, " ").replace(/\n/g, " ")
    }
  }

  // Fetch evolution chain data
  let evolutionChain: EvolutionChain | undefined
  if (species?.evolution_chain?.url) {
    try {
      const evolutionData = await fetchEvolutionChain(species.evolution_chain.url)
      evolutionChain = parseEvolutionChain(evolutionData.chain)
    } catch (error) {
      console.warn(`Failed to fetch evolution chain for ${apiPokemon.name}:`, error)
    }
  }

  // Transform stats
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

  // Get official artwork or fallback
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

export async function fetchPokemonBatch(urls: string[]): Promise<Pokemon[]> {
  const batchSize = 20 // Smaller batches for better reliability
  const results: Pokemon[] = []

  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize)
    const batchPromises = batch.map(async (url) => {
      try {
        const pokemon = await fetchPokemonDetails(url)
        // Always fetch species data for evolution chains and descriptions
        let species: PokeAPISpecies | undefined
        try {
          species = await fetchPokemonSpecies(pokemon.species.url)
        } catch (error) {
          console.warn(`Failed to fetch species for ${pokemon.name}:`, error)
        }
        return transformPokemonData(pokemon, species)
      } catch (error) {
        console.error(`Failed to fetch Pokemon from ${url}:`, error)
        return null
      }
    })

    const batchResults = await Promise.all(batchPromises)
    results.push(...batchResults.filter((pokemon): pokemon is Pokemon => pokemon !== null))

    // Small delay between batches to be respectful to the API
    if (i + batchSize < urls.length) {
      await new Promise((resolve) => setTimeout(resolve, 200))
    }
  }

  return results
}
