"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sword, Zap, RotateCcw } from "lucide-react"
import { BattleEngine } from "@/lib/battle-engine"
import { PokemonImage } from "@/components/pokemon-image"
import type { BattlePokemon, Move, BattleState, Pokemon } from "@/types/enhanced-features"

interface BattleSimulatorProps {
  pokemon: Pokemon[]
}

const sampleMoves: Move[] = [
  {
    id: 1,
    name: "Tackle",
    type: "normal",
    category: "physical",
    power: 40,
    accuracy: 100,
    pp: 35,
    currentPp: 35,
    description: "A physical attack",
  },
  {
    id: 2,
    name: "Thunderbolt",
    type: "electric",
    category: "special",
    power: 90,
    accuracy: 100,
    pp: 15,
    currentPp: 15,
    description: "An electric attack",
  },
  {
    id: 3,
    name: "Flamethrower",
    type: "fire",
    category: "special",
    power: 90,
    accuracy: 100,
    pp: 15,
    currentPp: 15,
    description: "A fire attack",
  },
  {
    id: 4,
    name: "Water Gun",
    type: "water",
    category: "special",
    power: 40,
    accuracy: 100,
    pp: 25,
    currentPp: 25,
    description: "A water attack",
  },
]

export function BattleSimulator({ pokemon }: BattleSimulatorProps) {
  const [battleEngine] = useState(new BattleEngine())
  const [battleState, setBattleState] = useState<BattleState | null>(null)
  const [selectedPlayerPokemon, setSelectedPlayerPokemon] = useState<string>("")
  const [selectedOpponentPokemon, setSelectedOpponentPokemon] = useState<string>("")
  const [battleLog, setBattleLog] = useState<string[]>([])

  const createBattlePokemon = (poke: Pokemon): BattlePokemon => ({
    id: poke.id,
    name: poke.name,
    types: poke.types,
    stats: poke.stats,
    currentHp: poke.stats.hp,
    level: 50,
    moves: sampleMoves.slice(0, 4),
    statusEffect: undefined,
  })

  const startBattle = () => {
    const playerPoke = pokemon.find((p) => p.id.toString() === selectedPlayerPokemon)
    const opponentPoke = pokemon.find((p) => p.id.toString() === selectedOpponentPokemon)

    if (!playerPoke || !opponentPoke) return

    const player = createBattlePokemon(playerPoke)
    const opponent = createBattlePokemon(opponentPoke)

    setBattleState({
      player,
      opponent,
      turn: player.stats.speed >= opponent.stats.speed ? "player" : "opponent",
      battleLog: [`${player.name} vs ${opponent.name}!`, "Battle begins!"],
      isComplete: false,
    })
    setBattleLog([`${player.name} vs ${opponent.name}!`, "Battle begins!"])
  }

  const executePlayerMove = (moveIndex: number) => {
    if (!battleState || battleState.turn !== "player" || battleState.isComplete) return

    const move = battleState.player.moves[moveIndex]
    if (!battleEngine.canUseMove(battleState.player, move)) {
      const newLog = [...battleLog, `${battleState.player.name} can't use ${move.name}!`]
      setBattleLog(newLog)
      return
    }

    const result = battleEngine.executeMove(battleState.player, battleState.opponent, move)
    battleState.opponent.currentHp = Math.max(0, battleState.opponent.currentHp - result.damage)

    const newLog = [...battleLog, result.message]
    if (result.damage > 0) {
      newLog.push(`${battleState.opponent.name} took ${result.damage} damage!`)
    }

    if (battleState.opponent.currentHp <= 0) {
      newLog.push(`${battleState.opponent.name} fainted!`)
      setBattleState({
        ...battleState,
        isComplete: true,
        winner: "player",
        battleLog: newLog,
      })
    } else {
      setBattleState({
        ...battleState,
        turn: "opponent",
        battleLog: newLog,
      })

      // AI opponent move after delay
      setTimeout(() => executeOpponentMove(), 1500)
    }

    setBattleLog(newLog)
  }

  const executeOpponentMove = () => {
    if (!battleState || battleState.turn !== "opponent" || battleState.isComplete) return

    const availableMoves = battleState.opponent.moves.filter((move) =>
      battleEngine.canUseMove(battleState.opponent, move),
    )

    if (availableMoves.length === 0) return

    const move = availableMoves[Math.floor(Math.random() * availableMoves.length)]
    const result = battleEngine.executeMove(battleState.opponent, battleState.player, move)
    battleState.player.currentHp = Math.max(0, battleState.player.currentHp - result.damage)

    const newLog = [...battleLog, result.message]
    if (result.damage > 0) {
      newLog.push(`${battleState.player.name} took ${result.damage} damage!`)
    }

    if (battleState.player.currentHp <= 0) {
      newLog.push(`${battleState.player.name} fainted!`)
      setBattleState({
        ...battleState,
        isComplete: true,
        winner: "opponent",
        battleLog: newLog,
      })
    } else {
      setBattleState({
        ...battleState,
        turn: "player",
        battleLog: newLog,
      })
    }

    setBattleLog(newLog)
  }

  const resetBattle = () => {
    setBattleState(null)
    setBattleLog([])
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Battle Simulator</h2>
        <p className="text-gray-600 mb-8">Experience realistic Pokémon battles with full damage calculations</p>
      </div>

      {!battleState ? (
        <Card>
          <CardHeader>
            <CardTitle>Select Your Pokémon</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-medium">Your Pokémon</label>
                <Select value={selectedPlayerPokemon} onValueChange={setSelectedPlayerPokemon}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose your fighter..." />
                  </SelectTrigger>
                  <SelectContent>
                    {pokemon.slice(0, 50).map((poke) => (
                      <SelectItem key={poke.id} value={poke.id.toString()}>
                        #{poke.id.toString().padStart(3, "0")} {poke.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Opponent</label>
                <Select value={selectedOpponentPokemon} onValueChange={setSelectedOpponentPokemon}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose opponent..." />
                  </SelectTrigger>
                  <SelectContent>
                    {pokemon.slice(0, 50).map((poke) => (
                      <SelectItem key={poke.id} value={poke.id.toString()}>
                        #{poke.id.toString().padStart(3, "0")} {poke.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="text-center">
              <Button
                onClick={startBattle}
                disabled={!selectedPlayerPokemon || !selectedOpponentPokemon}
                className="gap-2 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
              >
                <Sword className="w-4 h-4" />
                Start Battle!
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Battle Arena */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pokemon Display */}
            <div className="grid grid-cols-2 gap-6">
              {/* Player Pokemon */}
              <Card className={`${battleState.turn === "player" ? "ring-2 ring-blue-500" : ""}`}>
                <CardContent className="p-4">
                  <div className="text-center space-y-3">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      Your Pokémon
                    </Badge>
                    <PokemonImage
                      src={pokemon.find((p) => p.id === battleState.player.id)?.image || ""}
                      alt={battleState.player.name}
                      width={120}
                      height={120}
                      className="mx-auto"
                      pokemonId={battleState.player.id}
                    />
                    <h3 className="font-bold text-lg">{battleState.player.name}</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>HP</span>
                        <span>
                          {battleState.player.currentHp}/{battleState.player.stats.hp}
                        </span>
                      </div>
                      <Progress
                        value={(battleState.player.currentHp / battleState.player.stats.hp) * 100}
                        className="h-3"
                      />
                    </div>
                    {battleState.player.statusEffect && (
                      <Badge variant="destructive" className="text-xs">
                        {battleState.player.statusEffect.name.toUpperCase()}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Opponent Pokemon */}
              <Card className={`${battleState.turn === "opponent" ? "ring-2 ring-red-500" : ""}`}>
                <CardContent className="p-4">
                  <div className="text-center space-y-3">
                    <Badge variant="secondary" className="bg-red-100 text-red-800">
                      Opponent
                    </Badge>
                    <PokemonImage
                      src={pokemon.find((p) => p.id === battleState.opponent.id)?.image || ""}
                      alt={battleState.opponent.name}
                      width={120}
                      height={120}
                      className="mx-auto"
                      pokemonId={battleState.opponent.id}
                    />
                    <h3 className="font-bold text-lg">{battleState.opponent.name}</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>HP</span>
                        <span>
                          {battleState.opponent.currentHp}/{battleState.opponent.stats.hp}
                        </span>
                      </div>
                      <Progress
                        value={(battleState.opponent.currentHp / battleState.opponent.stats.hp) * 100}
                        className="h-3"
                      />
                    </div>
                    {battleState.opponent.statusEffect && (
                      <Badge variant="destructive" className="text-xs">
                        {battleState.opponent.statusEffect.name.toUpperCase()}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Move Selection */}
            {!battleState.isComplete && battleState.turn === "player" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Choose Your Move</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {battleState.player.moves.map((move, index) => (
                      <Button
                        key={move.id}
                        onClick={() => executePlayerMove(index)}
                        disabled={move.currentPp <= 0}
                        variant="outline"
                        className="h-auto p-4 flex flex-col items-start"
                      >
                        <div className="flex justify-between w-full mb-1">
                          <span className="font-semibold">{move.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {move.type.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-600 text-left">
                          Power: {move.power || "N/A"} | PP: {move.currentPp}/{move.pp}
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Battle Complete */}
            {battleState.isComplete && (
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="space-y-4">
                    <div className="text-2xl font-bold">
                      {battleState.winner === "player" ? "🎉 Victory!" : "💀 Defeat!"}
                    </div>
                    <p className="text-gray-600">
                      {battleState.winner === "player"
                        ? `${battleState.player.name} wins the battle!`
                        : `${battleState.opponent.name} wins the battle!`}
                    </p>
                    <Button onClick={resetBattle} className="gap-2">
                      <RotateCcw className="w-4 h-4" />
                      New Battle
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Battle Log */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Battle Log
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {battleLog.map((message, index) => (
                  <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                    {message}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
