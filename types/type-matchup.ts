export interface TypeMatchupData {
  name: string
  damage_relations: {
    double_damage_from: TypeReference[]
    double_damage_to: TypeReference[]
    half_damage_from: TypeReference[]
    half_damage_to: TypeReference[]
    no_damage_from: TypeReference[]
    no_damage_to: TypeReference[]
  }
}

export interface TypeReference {
  name: string
  url: string
}

export interface ProcessedTypeMatchup {
  type: string
  offensive: {
    superEffective: string[]
    notVeryEffective: string[]
    noEffect: string[]
  }
  defensive: {
    weakTo: string[]
    resistantTo: string[]
    immuneTo: string[]
  }
}

export interface DualTypeMatchup {
  types: [string, string]
  offensive: {
    superEffective: string[]
    notVeryEffective: string[]
    noEffect: string[]
  }
  defensive: {
    weakTo: string[]
    resistantTo: string[]
    immuneTo: string[]
    doubleWeakTo: string[]
    doubleResistantTo: string[]
  }
}
