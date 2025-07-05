export interface Pokemon {
  id: number
  name: string
  types: string[]
  image: string
  stats: {
    hp: number
    attack: number
    defense: number
    specialAttack: number
    specialDefense: number
    speed: number
  }
  height: string
  weight: string
  description: string
  region: string
  generation: number
  evolutionChain?: EvolutionChain
}

export interface EvolutionChain {
  stage1: EvolutionStage
  stage2?: EvolutionStage
  stage3?: EvolutionStage
}

export interface EvolutionStage {
  id: number
  name: string
  image: string
  level?: number
  method?: string
}

export interface Region {
  name: string
  generation: number
  pokemonIds: number[]
}

// PokéAPI response types
export interface PokeAPIListResponse {
  count: number
  next: string | null
  previous: string | null
  results: {
    name: string
    url: string
  }[]
}

export interface PokeAPIPokemon {
  id: number
  name: string
  height: number
  weight: number
  types: {
    slot: number
    type: {
      name: string
      url: string
    }
  }[]
  stats: {
    base_stat: number
    effort: number
    stat: {
      name: string
      url: string
    }
  }[]
  sprites: {
    other: {
      "official-artwork": {
        front_default: string | null
      }
    }
  }
  species: {
    name: string
    url: string
  }
}

export interface PokeAPISpecies {
  id: number
  name: string
  flavor_text_entries: {
    flavor_text: string
    language: {
      name: string
    }
  }[]
  generation: {
    name: string
    url: string
  }
  evolution_chain: {
    url: string
  }
}

// PokéAPI Evolution Chain types
export interface PokeAPIEvolutionChain {
  id: number
  chain: EvolutionChainLink
}

export interface EvolutionChainLink {
  species: {
    name: string
    url: string
  }
  evolution_details: EvolutionDetail[]
  evolves_to: EvolutionChainLink[]
}

export interface EvolutionDetail {
  min_level: number | null
  trigger: {
    name: string
    url: string
  }
  item: {
    name: string
    url: string
  } | null
  held_item: {
    name: string
    url: string
  } | null
  known_move: {
    name: string
    url: string
  } | null
  min_happiness: number | null
  min_beauty: number | null
  min_affection: number | null
  relative_physical_stats: number | null
  party_species: {
    name: string
    url: string
  } | null
  party_type: {
    name: string
    url: string
  } | null
  trade_species: {
    name: string
    url: string
  } | null
  needs_overworld_rain: boolean
  turn_upside_down: boolean
  time_of_day: string
  location: {
    name: string
    url: string
  } | null
  gender: number | null
}
