import type { BattlePokemon, Move, StatusEffect } from "@/types/enhanced-features"

export class BattleEngine {
  private typeChart: Record<string, Record<string, number>> = {
    normal: { rock: 0.5, ghost: 0, steel: 0.5 },
    fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
    water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
    electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
    grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
    ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
    fighting: {
      normal: 2,
      ice: 2,
      poison: 0.5,
      flying: 0.5,
      psychic: 0.5,
      bug: 0.5,
      rock: 2,
      ghost: 0,
      dark: 2,
      steel: 2,
      fairy: 0.5,
    },
    poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
    ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
    flying: { electric: 0.5, grass: 2, ice: 0.5, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
    psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
    bug: {
      fire: 0.5,
      grass: 2,
      fighting: 0.5,
      poison: 0.5,
      flying: 0.5,
      psychic: 2,
      ghost: 0.5,
      dark: 2,
      steel: 0.5,
      fairy: 0.5,
    },
    rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
    ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
    dragon: { dragon: 2, steel: 0.5, fairy: 0 },
    dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
    steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
    fairy: { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 },
  }

  calculateDamage(attacker: BattlePokemon, defender: BattlePokemon, move: Move): number {
    if (move.category === "status") return 0

    const level = attacker.level
    const power = move.power || 0
    const attack = move.category === "physical" ? attacker.stats.attack : attacker.stats.specialAttack
    const defense = move.category === "physical" ? defender.stats.defense : defender.stats.specialDefense

    // Base damage calculation
    let damage = (((2 * level) / 5 + 2) * power * attack) / defense / 50 + 2

    // STAB (Same Type Attack Bonus)
    if (attacker.types.includes(move.type)) {
      damage *= 1.5
    }

    // Type effectiveness
    let effectiveness = 1
    for (const defenderType of defender.types) {
      const typeMultiplier = this.typeChart[move.type]?.[defenderType] ?? 1
      effectiveness *= typeMultiplier
    }
    damage *= effectiveness

    // Random factor (85-100%)
    damage *= Math.random() * 0.15 + 0.85

    // Status effect modifiers
    if (attacker.statusEffect?.name === "burn" && move.category === "physical") {
      damage *= 0.5
    }

    return Math.floor(damage)
  }

  getTypeEffectiveness(moveType: string, defenderTypes: string[]): number {
    let effectiveness = 1
    for (const defenderType of defenderTypes) {
      const multiplier = this.typeChart[moveType]?.[defenderType] ?? 1
      effectiveness *= multiplier
    }
    return effectiveness
  }

  applyStatusEffect(pokemon: BattlePokemon, effect: StatusEffect): void {
    pokemon.statusEffect = effect
  }

  processStatusDamage(pokemon: BattlePokemon): number {
    if (!pokemon.statusEffect) return 0

    let damage = 0
    switch (pokemon.statusEffect.name) {
      case "burn":
      case "poison":
        damage = Math.floor(pokemon.stats.hp / 8)
        break
      default:
        break
    }

    pokemon.statusEffect.turnsRemaining--
    if (pokemon.statusEffect.turnsRemaining <= 0) {
      pokemon.statusEffect = undefined
    }

    return damage
  }

  canUseMove(pokemon: BattlePokemon, move: Move): boolean {
    if (move.currentPp <= 0) return false
    if (pokemon.statusEffect?.name === "sleep") return Math.random() < 0.33
    if (pokemon.statusEffect?.name === "freeze") return Math.random() < 0.2
    if (pokemon.statusEffect?.name === "paralysis") return Math.random() < 0.75
    return true
  }

  executeMove(
    attacker: BattlePokemon,
    defender: BattlePokemon,
    move: Move,
  ): {
    damage: number
    effectiveness: number
    critical: boolean
    statusApplied?: StatusEffect
    message: string
  } {
    const damage = this.calculateDamage(attacker, defender, move)
    const effectiveness = this.getTypeEffectiveness(move.type, defender.types)
    const critical = Math.random() < 0.0625 // 1/16 chance

    let message = `${attacker.name} used ${move.name}!`

    if (effectiveness > 1) {
      message += " It's super effective!"
    } else if (effectiveness < 1 && effectiveness > 0) {
      message += " It's not very effective..."
    } else if (effectiveness === 0) {
      message += " It had no effect!"
    }

    if (critical) {
      message += " A critical hit!"
    }

    move.currentPp--

    return {
      damage: critical ? Math.floor(damage * 1.5) : damage,
      effectiveness,
      critical,
      message,
    }
  }
}
