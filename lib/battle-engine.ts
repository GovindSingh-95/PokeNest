import type { BattlePokemon, Move, MoveResult } from "@/types/battle"

export class BattleEngine {
  private typeChart: Record<string, Record<string, number>> = {
    normal: { rock: 0.5, ghost: 0, steel: 0.5 },
    fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
    water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
    electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
    grass: {
      fire: 0.5,
      water: 2,
      grass: 0.5,
      poison: 0.5,
      ground: 2,
      flying: 0.5,
      bug: 0.5,
      rock: 2,
      dragon: 0.5,
      steel: 0.5,
    },
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

  getTypeEffectiveness(attackType: string, defenseTypes: string[]): number {
    let effectiveness = 1

    for (const defenseType of defenseTypes) {
      const multiplier = this.typeChart[attackType]?.[defenseType] ?? 1
      effectiveness *= multiplier
    }

    return effectiveness
  }

  canUseMove(pokemon: BattlePokemon, move: Move): boolean {
    return move.currentPp > 0 && !pokemon.statusEffect?.name.includes("sleep")
  }

  executeMove(attacker: BattlePokemon, defender: BattlePokemon, move: Move): MoveResult {
    // Consume PP
    move.currentPp = Math.max(0, move.currentPp - 1)

    // Check if move hits
    const hitChance = Math.random() * 100
    const hit = hitChance <= move.accuracy

    if (!hit) {
      return {
        damage: 0,
        message: `${attacker.name} used ${move.name}, but it missed!`,
        hit: false,
        critical: false,
        effectiveness: 1,
      }
    }

    // Calculate damage for non-status moves
    let damage = 0
    let critical = false
    let effectiveness = 1

    if (move.power && move.power > 0) {
      // Type effectiveness
      effectiveness = this.getTypeEffectiveness(move.type, defender.types)

      // STAB (Same Type Attack Bonus)
      const stab = attacker.types.includes(move.type) ? 1.5 : 1

      // Critical hit (1/16 chance)
      critical = Math.random() < 1 / 16

      // Base damage calculation
      const attackStat = move.category === "physical" ? attacker.stats.attack : attacker.stats.specialAttack
      const defenseStat = move.category === "physical" ? defender.stats.defense : defender.stats.specialDefense

      const baseDamage = (((2 * attacker.level) / 5 + 2) * move.power * attackStat) / defenseStat / 50 + 2

      // Apply modifiers
      damage = Math.floor(baseDamage * stab * effectiveness * (critical ? 1.5 : 1) * (0.85 + Math.random() * 0.15))
      damage = Math.max(1, damage) // Minimum 1 damage
    }

    // Generate battle message
    let message = `${attacker.name} used ${move.name}!`

    if (critical) {
      message += " Critical hit!"
    }

    if (effectiveness > 1) {
      message += " It's super effective!"
    } else if (effectiveness < 1 && effectiveness > 0) {
      message += " It's not very effective..."
    } else if (effectiveness === 0) {
      message += " It had no effect!"
    }

    return {
      damage,
      message,
      hit: true,
      critical,
      effectiveness,
    }
  }
}
