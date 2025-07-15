import type { Move } from "@/types/battle"

const allMoves: Move[] = [
  // Normal moves
  {
    id: 1,
    name: "Tackle",
    type: "normal",
    category: "physical",
    power: 40,
    accuracy: 100,
    pp: 35,
    currentPp: 35,
    description: "A physical attack in which the user charges and slams into the target with its whole body.",
  },
  {
    id: 2,
    name: "Quick Attack",
    type: "normal",
    category: "physical",
    power: 40,
    accuracy: 100,
    pp: 30,
    currentPp: 30,
    description:
      "The user lunges at the target at a speed that makes it almost invisible. This move always goes first.",
  },
  {
    id: 3,
    name: "Body Slam",
    type: "normal",
    category: "physical",
    power: 85,
    accuracy: 100,
    pp: 15,
    currentPp: 15,
    description:
      "The user drops onto the target with its full body weight. This may also leave the target with paralysis.",
  },

  // Fire moves
  {
    id: 10,
    name: "Ember",
    type: "fire",
    category: "special",
    power: 40,
    accuracy: 100,
    pp: 25,
    currentPp: 25,
    description: "The target is attacked with small flames. This may also leave the target with a burn.",
  },
  {
    id: 11,
    name: "Flamethrower",
    type: "fire",
    category: "special",
    power: 90,
    accuracy: 100,
    pp: 15,
    currentPp: 15,
    description: "The target is scorched with an intense blast of fire. This may also leave the target with a burn.",
  },
  {
    id: 12,
    name: "Fire Blast",
    type: "fire",
    category: "special",
    power: 110,
    accuracy: 85,
    pp: 5,
    currentPp: 5,
    description:
      "The target is attacked with an intense blast of all-consuming fire. This may also leave the target with a burn.",
  },

  // Water moves
  {
    id: 20,
    name: "Water Gun",
    type: "water",
    category: "special",
    power: 40,
    accuracy: 100,
    pp: 25,
    currentPp: 25,
    description: "The target is blasted with a forceful shot of water.",
  },
  {
    id: 21,
    name: "Bubble Beam",
    type: "water",
    category: "special",
    power: 65,
    accuracy: 100,
    pp: 20,
    currentPp: 20,
    description:
      "A spray of countless bubbles is jetted at the opposing Pokémon. This may also lower their Speed stat.",
  },
  {
    id: 22,
    name: "Hydro Pump",
    type: "water",
    category: "special",
    power: 110,
    accuracy: 80,
    pp: 5,
    currentPp: 5,
    description: "The target is blasted by a huge volume of water launched under great pressure.",
  },

  // Electric moves
  {
    id: 30,
    name: "Thunder Shock",
    type: "electric",
    category: "special",
    power: 40,
    accuracy: 100,
    pp: 30,
    currentPp: 30,
    description:
      "A jolt of electricity crashes down on the target to inflict damage. This may also leave the target with paralysis.",
  },
  {
    id: 31,
    name: "Thunderbolt",
    type: "electric",
    category: "special",
    power: 90,
    accuracy: 100,
    pp: 15,
    currentPp: 15,
    description: "A strong electric blast crashes down on the target. This may also leave the target with paralysis.",
  },
  {
    id: 32,
    name: "Thunder",
    type: "electric",
    category: "special",
    power: 110,
    accuracy: 70,
    pp: 10,
    currentPp: 10,
    description:
      "A wicked thunderbolt is dropped on the target to inflict damage. This may also leave the target with paralysis.",
  },

  // Grass moves
  {
    id: 40,
    name: "Vine Whip",
    type: "grass",
    category: "physical",
    power: 45,
    accuracy: 100,
    pp: 25,
    currentPp: 25,
    description: "The target is struck with slender, whiplike vines to inflict damage.",
  },
  {
    id: 41,
    name: "Razor Leaf",
    type: "grass",
    category: "physical",
    power: 55,
    accuracy: 95,
    pp: 25,
    currentPp: 25,
    description: "Sharp-edged leaves are launched to slash at the opposing Pokémon. Critical hits land more easily.",
  },
  {
    id: 42,
    name: "Solar Beam",
    type: "grass",
    category: "special",
    power: 120,
    accuracy: 100,
    pp: 10,
    currentPp: 10,
    description: "A two-turn attack. The user gathers light, then blasts a bundled beam on the next turn.",
  },

  // Ice moves
  {
    id: 43,
    name: "Ice Beam",
    type: "ice",
    category: "special",
    power: 90,
    accuracy: 100,
    pp: 10,
    currentPp: 10,
    description: "The target is struck with an icy-cold beam of energy. This may also leave the target frozen.",
  },
  {
    id: 44,
    name: "Blizzard",
    type: "ice",
    category: "special",
    power: 110,
    accuracy: 70,
    pp: 5,
    currentPp: 5,
    description:
      "A howling blizzard is summoned to strike opposing Pokémon. This may also leave the opposing Pokémon frozen.",
  },

  // Fighting moves
  {
    id: 45,
    name: "Karate Chop",
    type: "fighting",
    category: "physical",
    power: 50,
    accuracy: 100,
    pp: 25,
    currentPp: 25,
    description: "The target is attacked with a sharp chop. Critical hits land more easily.",
  },
  {
    id: 46,
    name: "Low Kick",
    type: "fighting",
    category: "physical",
    power: 60,
    accuracy: 100,
    pp: 20,
    currentPp: 20,
    description:
      "A powerful low kick that makes the target fall over. The heavier the target, the greater the move's power.",
  },

  // Poison moves
  {
    id: 47,
    name: "Poison Sting",
    type: "poison",
    category: "physical",
    power: 15,
    accuracy: 100,
    pp: 35,
    currentPp: 35,
    description: "The user stabs the target with a poisonous stinger. This may also poison the target.",
  },
  {
    id: 48,
    name: "Sludge Bomb",
    type: "poison",
    category: "special",
    power: 90,
    accuracy: 100,
    pp: 10,
    currentPp: 10,
    description: "Unsanitary sludge is hurled at the target. This may also poison the target.",
  },

  // Ground moves
  {
    id: 49,
    name: "Earthquake",
    type: "ground",
    category: "physical",
    power: 100,
    accuracy: 100,
    pp: 10,
    currentPp: 10,
    description: "The user sets off an earthquake that strikes every Pokémon around it.",
  },

  // Flying moves
  {
    id: 50,
    name: "Gust",
    type: "flying",
    category: "special",
    power: 40,
    accuracy: 100,
    pp: 35,
    currentPp: 35,
    description: "A gust of wind is whipped up by wings and launched at the target to inflict damage.",
  },
  {
    id: 51,
    name: "Wing Attack",
    type: "flying",
    category: "physical",
    power: 60,
    accuracy: 100,
    pp: 35,
    currentPp: 35,
    description: "The target is struck with large, imposing wings spread wide to inflict damage.",
  },

  // Psychic moves
  {
    id: 52,
    name: "Confusion",
    type: "psychic",
    category: "special",
    power: 50,
    accuracy: 100,
    pp: 25,
    currentPp: 25,
    description: "The target is hit by a weak telekinetic force. This may also confuse the target.",
  },
  {
    id: 53,
    name: "Psychic",
    type: "psychic",
    category: "special",
    power: 90,
    accuracy: 100,
    pp: 10,
    currentPp: 10,
    description: "The target is hit by a strong telekinetic force. This may also lower the target's Sp. Def stat.",
  },

  // Bug moves
  {
    id: 54,
    name: "String Shot",
    type: "bug",
    category: "status",
    power: null,
    accuracy: 95,
    pp: 40,
    currentPp: 40,
    description:
      "The opposing Pokémon are bound with silk blown from the user's mouth that harshly lowers the Speed stat.",
  },
  {
    id: 55,
    name: "Bug Bite",
    type: "bug",
    category: "physical",
    power: 60,
    accuracy: 100,
    pp: 20,
    currentPp: 20,
    description: "The user bites the target. If the target is holding a Berry, the user eats it and gains its effect.",
  },

  // Rock moves
  {
    id: 56,
    name: "Rock Throw",
    type: "rock",
    category: "physical",
    power: 50,
    accuracy: 90,
    pp: 15,
    currentPp: 15,
    description: "The user picks up and throws a small rock at the target to attack.",
  },
  {
    id: 57,
    name: "Rock Slide",
    type: "rock",
    category: "physical",
    power: 75,
    accuracy: 90,
    pp: 10,
    currentPp: 10,
    description:
      "Large boulders are hurled at the opposing Pokémon to inflict damage. This may also make the opposing Pokémon flinch.",
  },

  // Ghost moves
  {
    id: 58,
    name: "Lick",
    type: "ghost",
    category: "physical",
    power: 30,
    accuracy: 100,
    pp: 30,
    currentPp: 30,
    description:
      "The target is licked with a long tongue, causing damage. This may also leave the target with paralysis.",
  },
  {
    id: 59,
    name: "Shadow Ball",
    type: "ghost",
    category: "special",
    power: 80,
    accuracy: 100,
    pp: 15,
    currentPp: 15,
    description: "The user hurls a shadowy blob at the target. This may also lower the target's Sp. Def stat.",
  },

  // Dragon moves
  {
    id: 60,
    name: "Dragon Rage",
    type: "dragon",
    category: "special",
    power: 40,
    accuracy: 100,
    pp: 10,
    currentPp: 10,
    description:
      "This attack hits the target with a shock wave of pure rage. This attack always inflicts 40 HP damage.",
  },
  {
    id: 61,
    name: "Dragon Claw",
    type: "dragon",
    category: "physical",
    power: 80,
    accuracy: 100,
    pp: 15,
    currentPp: 15,
    description: "The user slashes the target with huge, sharp claws.",
  },

  // Dark moves
  {
    id: 62,
    name: "Bite",
    type: "dark",
    category: "physical",
    power: 60,
    accuracy: 100,
    pp: 25,
    currentPp: 25,
    description: "The target is bitten with viciously sharp fangs. This may also make the target flinch.",
  },
  {
    id: 63,
    name: "Crunch",
    type: "dark",
    category: "physical",
    power: 80,
    accuracy: 100,
    pp: 15,
    currentPp: 15,
    description: "The user crunches up the target with sharp fangs. This may also lower the target's Defense stat.",
  },

  // Steel moves
  {
    id: 64,
    name: "Metal Claw",
    type: "steel",
    category: "physical",
    power: 50,
    accuracy: 95,
    pp: 35,
    currentPp: 35,
    description: "The target is raked with steel claws. This may also raise the user's Attack stat.",
  },
  {
    id: 65,
    name: "Iron Tail",
    type: "steel",
    category: "physical",
    power: 100,
    accuracy: 75,
    pp: 15,
    currentPp: 15,
    description: "The target is slammed with a steel-hard tail. This may also lower the target's Defense stat.",
  },

  // Fairy moves
  {
    id: 66,
    name: "Fairy Wind",
    type: "fairy",
    category: "special",
    power: 40,
    accuracy: 100,
    pp: 30,
    currentPp: 30,
    description: "The user stirs up a fairy wind and strikes the target with it.",
  },
  {
    id: 67,
    name: "Moonblast",
    type: "fairy",
    category: "special",
    power: 95,
    accuracy: 100,
    pp: 15,
    currentPp: 15,
    description:
      "Borrowing the power of the moon, the user attacks the target. This may also lower the target's Sp. Atk stat.",
  },
]

export function getMovesByTypes(types: string[]): Move[] {
  // Get moves that match the Pokemon's types
  const typeMoves = allMoves.filter((move) => types.includes(move.type))

  // Always include Tackle as a fallback
  const tackle = allMoves.find((move) => move.name === "Tackle")!

  // Select 4 moves: prioritize type matches, then add tackle if needed
  const selectedMoves: Move[] = []

  // Add type-matching moves first
  for (const type of types) {
    const moveOfType = typeMoves.find(
      (move) => move.type === type && !selectedMoves.some((selected) => selected.id === move.id),
    )
    if (moveOfType && selectedMoves.length < 4) {
      selectedMoves.push({ ...moveOfType, currentPp: moveOfType.pp })
    }
  }

  // Fill remaining slots with other type moves or tackle
  while (selectedMoves.length < 4) {
    const availableMove = typeMoves.find((move) => !selectedMoves.some((selected) => selected.id === move.id)) || tackle

    if (!selectedMoves.some((selected) => selected.id === availableMove.id)) {
      selectedMoves.push({ ...availableMove, currentPp: availableMove.pp })
    } else {
      break
    }
  }

  // Ensure we have exactly 4 moves
  while (selectedMoves.length < 4) {
    selectedMoves.push({ ...tackle, currentPp: tackle.pp })
  }

  return selectedMoves.slice(0, 4)
}
