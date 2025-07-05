import type { TypeMatchupData, ProcessedTypeMatchup, DualTypeMatchup } from "@/types/type-matchup"

const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2"

// Cache for type matchup data
const typeMatchupCache = new Map<string, TypeMatchupData>()

export async function fetchTypeMatchupData(typeName: string): Promise<TypeMatchupData> {
  if (typeMatchupCache.has(typeName)) {
    return typeMatchupCache.get(typeName)!
  }

  try {
    const response = await fetch(`${POKEAPI_BASE_URL}/type/${typeName.toLowerCase()}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch type data for ${typeName}`)
    }

    const data = await response.json()
    typeMatchupCache.set(typeName, data)
    return data
  } catch (error) {
    console.error(`Error fetching type matchup data for ${typeName}:`, error)
    throw error
  }
}

export async function processTypeMatchup(typeName: string): Promise<ProcessedTypeMatchup> {
  const typeData = await fetchTypeMatchupData(typeName)

  return {
    type: typeName,
    offensive: {
      superEffective: typeData.damage_relations.double_damage_to.map((t) => t.name),
      notVeryEffective: typeData.damage_relations.half_damage_to.map((t) => t.name),
      noEffect: typeData.damage_relations.no_damage_to.map((t) => t.name),
    },
    defensive: {
      weakTo: typeData.damage_relations.double_damage_from.map((t) => t.name),
      resistantTo: typeData.damage_relations.half_damage_from.map((t) => t.name),
      immuneTo: typeData.damage_relations.no_damage_from.map((t) => t.name),
    },
  }
}

export async function processDualTypeMatchup(type1: string, type2: string): Promise<DualTypeMatchup> {
  const [matchup1, matchup2] = await Promise.all([processTypeMatchup(type1), processTypeMatchup(type2)])

  // Calculate offensive matchups (intersection for dual-type moves)
  const offensive = {
    superEffective: [...new Set([...matchup1.offensive.superEffective, ...matchup2.offensive.superEffective])],
    notVeryEffective: [...new Set([...matchup1.offensive.notVeryEffective, ...matchup2.offensive.notVeryEffective])],
    noEffect: [...new Set([...matchup1.offensive.noEffect, ...matchup2.offensive.noEffect])],
  }

  // Calculate defensive matchups (multiplicative effects)
  const defensiveMap = new Map<string, number>()

  // Initialize all types with 1x effectiveness
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

  allTypes.forEach((type) => defensiveMap.set(type, 1))

  // Apply type 1 resistances/weaknesses
  matchup1.defensive.weakTo.forEach((type) => defensiveMap.set(type, (defensiveMap.get(type) || 1) * 2))
  matchup1.defensive.resistantTo.forEach((type) => defensiveMap.set(type, (defensiveMap.get(type) || 1) * 0.5))
  matchup1.defensive.immuneTo.forEach((type) => defensiveMap.set(type, 0))

  // Apply type 2 resistances/weaknesses
  matchup2.defensive.weakTo.forEach((type) => defensiveMap.set(type, (defensiveMap.get(type) || 1) * 2))
  matchup2.defensive.resistantTo.forEach((type) => defensiveMap.set(type, (defensiveMap.get(type) || 1) * 0.5))
  matchup2.defensive.immuneTo.forEach((type) => defensiveMap.set(type, 0))

  // Categorize final effectiveness
  const defensive = {
    doubleWeakTo: [] as string[],
    weakTo: [] as string[],
    resistantTo: [] as string[],
    doubleResistantTo: [] as string[],
    immuneTo: [] as string[],
  }

  defensiveMap.forEach((effectiveness, type) => {
    if (effectiveness === 0) {
      defensive.immuneTo.push(type)
    } else if (effectiveness === 4) {
      defensive.doubleWeakTo.push(type)
    } else if (effectiveness === 2) {
      defensive.weakTo.push(type)
    } else if (effectiveness === 0.5) {
      defensive.resistantTo.push(type)
    } else if (effectiveness === 0.25) {
      defensive.doubleResistantTo.push(type)
    }
  })

  return {
    types: [type1, type2],
    offensive,
    defensive,
  }
}
