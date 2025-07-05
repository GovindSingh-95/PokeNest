// Battle System Types
export interface BattlePokemon {
  id: number
  name: string
  types: string[]
  stats: {
    hp: number
    attack: number
    defense: number
    specialAttack: number
    specialDefense: number
    speed: number
  }
  currentHp: number
  level: number
  moves: Move[]
  ability?: string
  statusEffect?: StatusEffect
}

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
  name: "burn" | "freeze" | "paralysis" | "poison" | "sleep"
  turnsRemaining: number
}

export interface BattleState {
  player: BattlePokemon
  opponent: BattlePokemon
  turn: "player" | "opponent"
  battleLog: string[]
  isComplete: boolean
  winner?: "player" | "opponent"
}

// Team Builder Types
export interface Pokemon {
  id: number
  name: string
  types: string[]
  imageUrl: string
}

export interface TeamPokemon {
  pokemon: Pokemon
  nickname?: string
  level: number
  moves: Move[]
  ability?: string
  nature?: string
  role: "sweeper" | "tank" | "support" | "wall" | "utility"
}

export interface Team {
  id: string
  name: string
  pokemon: TeamPokemon[]
  description?: string
  createdAt: Date
  updatedAt: Date
  rating: number
  tags: string[]
}

export interface TeamAnalysis {
  typeCoverage: {
    offensive: Record<string, number>
    defensive: Record<string, number>
  }
  weaknesses: string[]
  strengths: string[]
  roles: Record<string, number>
  suggestions: string[]
  score: number
}

// User System Types
export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  createdAt: Date
  preferences: UserPreferences
  achievements: Achievement[]
  stats: UserStats
}

export interface UserPreferences {
  theme: "light" | "dark" | "auto"
  colorScheme: "default" | "kanto" | "johto" | "hoenn" | "sinnoh"
  soundEnabled: boolean
  animationsEnabled: boolean
  language: string
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: "collection" | "battle" | "social" | "exploration"
  rarity: "common" | "rare" | "epic" | "legendary"
  unlockedAt?: Date
  progress: number
  maxProgress: number
}

export interface UserStats {
  pokemonSeen: number
  pokemonCaught: number
  battlesWon: number
  battlesLost: number
  teamsCreated: number
  achievementsUnlocked: number
  daysActive: number
  currentStreak: number
  longestStreak: number
}

// Quiz System Types
export interface QuizQuestion {
  id: string
  type: "multiple-choice" | "true-false" | "image-guess" | "type-match"
  question: string
  options?: string[]
  correctAnswer: string
  explanation: string
  difficulty: "easy" | "medium" | "hard"
  category: "general" | "types" | "stats" | "moves" | "abilities"
  image?: string
}

export interface QuizSession {
  id: string
  questions: QuizQuestion[]
  currentQuestion: number
  score: number
  timeStarted: Date
  timeCompleted?: Date
  answers: Record<string, string>
}

// Collection System Types
export interface PokemonCollection {
  userId: string
  pokemon: CollectedPokemon[]
  completionRate: number
  lastUpdated: Date
}

export interface CollectedPokemon {
  pokemonId: number
  caughtAt: Date
  isShiny: boolean
  isFavorite: boolean
  nickname?: string
  notes?: string
  location?: string
}

// Move Database Types
export interface MoveDetails extends Move {
  learnedBy: {
    pokemonId: number
    method: "level-up" | "tm" | "egg" | "tutor" | "evolution"
    level?: number
  }[]
  generation: number
  contestType?: string
  priority: number
  target: string
  damageClass: "physical" | "special" | "status"
}

// Ability Types
export interface Ability {
  id: number
  name: string
  description: string
  effect: string
  generation: number
  pokemon: {
    pokemonId: number
    isHidden: boolean
    slot: number
  }[]
}

// Location Types
export interface Location {
  id: number
  name: string
  region: string
  pokemon: {
    pokemonId: number
    rarity: "common" | "uncommon" | "rare" | "very-rare"
    method: string[]
    games: string[]
  }[]
}

// Analytics Types
export interface PokemonUsageStats {
  pokemonId: number
  usage: number
  winRate: number
  popularMoves: string[]
  commonTeammates: number[]
  tier: "OU" | "UU" | "RU" | "NU" | "PU" | "Uber"
}

export interface MetaAnalysis {
  topPokemon: PokemonUsageStats[]
  typeDistribution: Record<string, number>
  abilityUsage: Record<string, number>
  moveUsage: Record<string, number>
  lastUpdated: Date
}

// Social Features Types
export interface Comment {
  id: string
  userId: string
  username: string
  avatar?: string
  content: string
  createdAt: Date
  likes: number
  replies: Comment[]
  pokemonId?: number
  teamId?: string
}

export interface Rating {
  userId: string
  rating: number
  review?: string
  createdAt: Date
}

// Breeding Calculator Types
export interface BreedingPair {
  parent1: Pokemon
  parent2: Pokemon
  compatibility: number
  eggMoves: Move[]
  inheritedStats: string[]
  estimatedSteps: number
}

export interface EggGroup {
  name: string
  pokemon: number[]
}

// Daily Challenge Types
export interface DailyChallenge {
  id: string
  date: Date
  type: "catch" | "battle" | "quiz" | "team-build" | "explore"
  title: string
  description: string
  requirements: Record<string, any>
  reward: {
    type: "xp" | "badge" | "title" | "avatar"
    value: string | number
  }
  completed: boolean
  progress: number
  maxProgress: number
}

// Notification Types
export interface Notification {
  id: string
  userId: string
  type: "achievement" | "challenge" | "social" | "system"
  title: string
  message: string
  read: boolean
  createdAt: Date
  actionUrl?: string
  icon?: string
}
