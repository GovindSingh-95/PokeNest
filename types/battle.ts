export interface Move {
  id: number
  name: string
  type: string
  category: "physical" | "special" | "status"
  power: number | null
  accuracy: number
  pp: number
  currentPp: number
  description: string
  effect?: string
}

export interface StatusEffect {
  name: "burn" | "poison" | "paralysis" | "sleep" | "freeze"
  duration: number
  damage?: number
}

export interface BattlePokemonData {
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
}

export interface BattlePokemon extends BattlePokemonData {
  currentHp: number
  level: number
  moves: Move[]
  statusEffect?: StatusEffect
}

export interface BattleState {
  player: BattlePokemon
  opponent: BattlePokemon
  turn: "player" | "opponent"
  battleLog: string[]
  isComplete: boolean
  winner?: "player" | "opponent"
  turnCount: number
}

export interface MoveResult {
  damage: number
  message: string
  hit: boolean
  critical: boolean
  effectiveness: number
  statusEffect?: StatusEffect
}
