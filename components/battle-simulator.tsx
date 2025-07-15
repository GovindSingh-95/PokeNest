"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Sword, Zap, RotateCcw, Heart, Shield, Swords, AlertTriangle } from "lucide-react"
import { BattleEngine } from "@/lib/battle-engine"
import { getMovesByTypes } from "@/lib/battle-moves-data"
import { PokemonImage } from "@/components/pokemon-image"
import { PokemonSelector } from "@/components/pokemon-selector"
import type { BattlePokemon, BattleState, BattlePokemonData } from "@/types/battle"
import type { Pokemon } from "@/types/pokemon"

interface BattleSimulatorProps {
  pokemon: Pokemon[]
}

export function BattleSimulator({ pokemon }: BattleSimulatorProps) {
  const [battleEngine] = useState(() => new BattleEngine())
  const [battleState, setBattleState] = useState<BattleState | null>(null)
  const [selectedPlayerPokemon, setSelectedPlayerPokemon] = useState<string>("")
  const [selectedOpponentPokemon, setSelectedOpponentPokemon] = useState<string>("")
  const [battleLog, setBattleLog] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [battleError, setBattleError] = useState<string | null>(null)

  // Refs for battle state management
  const battleStateRef = useRef<BattleState | null>(null)
  const processingRef = useRef(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Update refs when state changes
  useEffect(() => {
    battleStateRef.current = battleState
  }, [battleState])

  useEffect(() => {
    processingRef.current = isProcessing
  }, [isProcessing])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Convert Pokemon to BattlePokemonData
  const convertToBattlePokemon = useCallback(
    (poke: Pokemon): BattlePokemonData => ({
      id: poke.id,
      name: poke.name,
      types: poke.types,
      image: poke.image,
      stats: poke.stats,
    }),
    [],
  )

  // Create a battle-ready Pokemon
  const createBattlePokemon = useCallback((pokemonData: BattlePokemonData): BattlePokemon => {
    const moves = getMovesByTypes(pokemonData.types)

    return {
      ...pokemonData,
      currentHp: pokemonData.stats.hp,
      level: 50,
      moves,
      statusEffect: undefined,
    }
  }, [])

  const addToBattleLog = useCallback((message: string) => {
    setBattleLog((prev) => [...prev, message])
  }, [])

  const updateBattleState = useCallback((updater: (prev: BattleState) => BattleState) => {
    setBattleState((prev) => {
      if (!prev) return null
      const newState = updater(prev)
      battleStateRef.current = newState
      return newState
    })
  }, [])

  const startBattle = useCallback(() => {
    setBattleError(null)
    setIsProcessing(false)
    processingRef.current = false

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    const playerPoke = pokemon.find((p) => p.id.toString() === selectedPlayerPokemon)
    const opponentPoke = pokemon.find((p) => p.id.toString() === selectedOpponentPokemon)

    if (!playerPoke || !opponentPoke) {
      setBattleError("Please select both Pokémon to start the battle")
      return
    }

    try {
      const playerData = convertToBattlePokemon(playerPoke)
      const opponentData = convertToBattlePokemon(opponentPoke)

      const player = createBattlePokemon(playerData)
      const opponent = createBattlePokemon(opponentData)

      const initialLog = [
        `🔥 ${player.name} vs ${opponent.name}!`,
        "⚔️ Battle begins!",
        `${player.stats.speed >= opponent.stats.speed ? player.name : opponent.name} goes first!`,
      ]

      const newBattleState: BattleState = {
        player,
        opponent,
        turn: player.stats.speed >= opponent.stats.speed ? "player" : "opponent",
        battleLog: initialLog,
        isComplete: false,
        turnCount: 1,
      }

      setBattleState(newBattleState)
      setBattleLog(initialLog)
      battleStateRef.current = newBattleState

      // If opponent goes first, execute their move after a short delay
      if (newBattleState.turn === "opponent") {
        timeoutRef.current = setTimeout(() => {
          executeOpponentMove(newBattleState)
        }, 1000)
      }
    } catch (error) {
      console.error("Error starting battle:", error)
      setBattleError("Failed to start battle. Please try again.")
      setBattleLog(["❌ Error starting battle. Please try again."])
    }
  }, [selectedPlayerPokemon, selectedOpponentPokemon, pokemon, convertToBattlePokemon, createBattlePokemon])

  const executePlayerMove = useCallback(
    async (moveIndex: number) => {
      const currentState = battleStateRef.current

      if (!currentState || currentState.turn !== "player" || currentState.isComplete || processingRef.current) {
        return
      }

      setIsProcessing(true)
      processingRef.current = true
      setBattleError(null)

      try {
        const move = currentState.player.moves[moveIndex]

        if (!battleEngine.canUseMove(currentState.player, move)) {
          addToBattleLog(`💤 ${currentState.player.name} can't use ${move.name}!`)
          setIsProcessing(false)
          processingRef.current = false
          return
        }

        const result = battleEngine.executeMove(currentState.player, currentState.opponent, move)

        // Apply damage
        const newOpponentHp = Math.max(0, currentState.opponent.currentHp - result.damage)

        const newLog = [result.message]
        if (result.damage > 0) {
          newLog.push(`💥 ${currentState.opponent.name} took ${result.damage} damage!`)
        }

        // Update state with damage
        updateBattleState((prev) => ({
          ...prev,
          opponent: {
            ...prev.opponent,
            currentHp: newOpponentHp,
          },
          battleLog: [...prev.battleLog, ...newLog],
        }))

        // Add to battle log
        newLog.forEach((msg) => addToBattleLog(msg))

        // Check if opponent fainted
        if (newOpponentHp <= 0) {
          const winMessages = [`💀 ${currentState.opponent.name} fainted!`, `🎉 ${currentState.player.name} wins!`]

          winMessages.forEach((msg) => addToBattleLog(msg))

          updateBattleState((prev) => ({
            ...prev,
            isComplete: true,
            winner: "player",
          }))

          setIsProcessing(false)
          processingRef.current = false
          return
        }

        // Switch to opponent turn
        updateBattleState((prev) => ({
          ...prev,
          turn: "opponent",
          turnCount: prev.turnCount + 1,
        }))

        setIsProcessing(false)
        processingRef.current = false

        // Execute opponent move after delay
        timeoutRef.current = setTimeout(() => {
          const latestState = battleStateRef.current
          if (latestState && !latestState.isComplete) {
            executeOpponentMove(latestState)
          }
        }, 1500)
      } catch (error) {
        console.error("Error executing player move:", error)
        setBattleError("Error executing move. Please try again.")
        addToBattleLog("❌ Error executing move. Please try again.")
        setIsProcessing(false)
        processingRef.current = false
      }
    },
    [battleEngine, addToBattleLog, updateBattleState],
  )

  const executeOpponentMove = useCallback(
    (currentState: BattleState) => {
      // Prevent multiple simultaneous executions
      if (processingRef.current || currentState.turn !== "opponent" || currentState.isComplete) {
        return
      }

      setIsProcessing(true)
      processingRef.current = true

      try {
        const availableMoves = currentState.opponent.moves.filter((move) =>
          battleEngine.canUseMove(currentState.opponent, move),
        )

        if (availableMoves.length === 0) {
          addToBattleLog(`💤 ${currentState.opponent.name} has no available moves!`)
          setIsProcessing(false)
          processingRef.current = false
          return
        }

        // AI move selection with some strategy
        let selectedMove = availableMoves[0]

        // Prefer super effective moves
        const superEffectiveMoves = availableMoves.filter((move) => {
          const effectiveness = battleEngine.getTypeEffectiveness(move.type, currentState.player.types)
          return effectiveness > 1
        })

        if (superEffectiveMoves.length > 0) {
          selectedMove = superEffectiveMoves[Math.floor(Math.random() * superEffectiveMoves.length)]
        } else {
          // Random selection from available moves
          selectedMove = availableMoves[Math.floor(Math.random() * availableMoves.length)]
        }

        const result = battleEngine.executeMove(currentState.opponent, currentState.player, selectedMove)

        // Apply damage
        const newPlayerHp = Math.max(0, currentState.player.currentHp - result.damage)

        const newLog = [result.message]
        if (result.damage > 0) {
          newLog.push(`💥 ${currentState.player.name} took ${result.damage} damage!`)
        }

        // Update state with damage
        updateBattleState((prev) => ({
          ...prev,
          player: {
            ...prev.player,
            currentHp: newPlayerHp,
          },
          battleLog: [...prev.battleLog, ...newLog],
        }))

        // Add to battle log
        newLog.forEach((msg) => addToBattleLog(msg))

        // Check if player fainted
        if (newPlayerHp <= 0) {
          const loseMessages = [`💀 ${currentState.player.name} fainted!`, `🎉 ${currentState.opponent.name} wins!`]

          loseMessages.forEach((msg) => addToBattleLog(msg))

          updateBattleState((prev) => ({
            ...prev,
            isComplete: true,
            winner: "opponent",
          }))

          setIsProcessing(false)
          processingRef.current = false
          return
        }

        // Switch back to player turn
        updateBattleState((prev) => ({
          ...prev,
          turn: "player",
          turnCount: prev.turnCount + 1,
        }))

        setIsProcessing(false)
        processingRef.current = false
      } catch (error) {
        console.error("Error executing opponent move:", error)
        setBattleError("Error during opponent's turn. Resetting to player turn.")
        addToBattleLog("❌ Error during opponent's turn.")

        // Force switch to player turn to prevent deadlock
        updateBattleState((prev) => ({
          ...prev,
          turn: "player",
        }))

        setIsProcessing(false)
        processingRef.current = false
      }
    },
    [battleEngine, addToBattleLog, updateBattleState],
  )

  const resetBattle = useCallback(() => {
    // Clear timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    setBattleState(null)
    setBattleLog([])
    setIsProcessing(false)
    setBattleError(null)
    processingRef.current = false
    battleStateRef.current = null
  }, [])

  const forcePlayerTurn = useCallback(() => {
    if (battleState && !battleState.isComplete) {
      updateBattleState((prev) => ({
        ...prev,
        turn: "player",
      }))
      setIsProcessing(false)
      processingRef.current = false
      setBattleError(null)
      addToBattleLog("🔄 Turn forced to player")
    }
  }, [battleState, updateBattleState, addToBattleLog])

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">⚔️ Battle Simulator</h2>
        <p className="text-gray-600 mb-8">
          Experience realistic Pokémon battles with full damage calculations and type effectiveness!
        </p>
      </div>

      {/* Error Display */}
      {battleError && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">{battleError}</span>
              {battleState && !battleState.isComplete && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={forcePlayerTurn}
                  className="ml-auto text-xs bg-transparent"
                >
                  Force Player Turn
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {!battleState ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Swords className="w-5 h-5" />
              Select Your Pokémon
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-500" />
                  Your Pokémon
                </label>
                <PokemonSelector
                  pokemon={pokemon}
                  selectedPokemon={selectedPlayerPokemon}
                  onSelect={setSelectedPlayerPokemon}
                  placeholder="Choose your fighter..."
                  excludeIds={selectedOpponentPokemon ? [Number.parseInt(selectedOpponentPokemon)] : []}
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Sword className="w-4 h-4 text-red-500" />
                  Opponent
                </label>
                <PokemonSelector
                  pokemon={pokemon}
                  selectedPokemon={selectedOpponentPokemon}
                  onSelect={setSelectedOpponentPokemon}
                  placeholder="Choose opponent..."
                  excludeIds={selectedPlayerPokemon ? [Number.parseInt(selectedPlayerPokemon)] : []}
                />
              </div>
            </div>

            <div className="text-center">
              <Button
                onClick={startBattle}
                disabled={!selectedPlayerPokemon || !selectedOpponentPokemon}
                className="gap-2 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                size="lg"
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
            {/* Battle Status */}
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>Turn: {battleState.turnCount}</span>
                  <span className="font-medium">
                    {battleState.isComplete
                      ? "Battle Complete!"
                      : `${battleState.turn === "player" ? "Your" : "Opponent's"} Turn`}
                  </span>
                  <span>{battleState.isComplete ? "🏆" : "⚔️"}</span>
                </div>
                {isProcessing && (
                  <div className="mt-2 text-center">
                    <div className="inline-flex items-center gap-2 text-xs text-blue-600">
                      <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pokemon Display */}
            <div className="grid grid-cols-2 gap-6">
              {/* Player Pokemon */}
              <Card
                className={`${battleState.turn === "player" && !battleState.isComplete ? "ring-2 ring-blue-500" : ""}`}
              >
                <CardContent className="p-4">
                  <div className="text-center space-y-3">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      Your Pokémon
                    </Badge>
                    <PokemonImage
                      src={battleState.player.image}
                      alt={battleState.player.name}
                      width={120}
                      height={120}
                      className="mx-auto"
                      pokemonId={battleState.player.id}
                    />
                    <h3 className="font-bold text-lg">{battleState.player.name}</h3>
                    <div className="flex gap-1 justify-center">
                      {battleState.player.types.map((type) => (
                        <Badge key={type} variant="outline" className="text-xs">
                          {type.toUpperCase()}
                        </Badge>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          HP
                        </span>
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
              <Card
                className={`${battleState.turn === "opponent" && !battleState.isComplete ? "ring-2 ring-red-500" : ""}`}
              >
                <CardContent className="p-4">
                  <div className="text-center space-y-3">
                    <Badge variant="secondary" className="bg-red-100 text-red-800">
                      Opponent
                    </Badge>
                    <PokemonImage
                      src={battleState.opponent.image}
                      alt={battleState.opponent.name}
                      width={120}
                      height={120}
                      className="mx-auto"
                      pokemonId={battleState.opponent.id}
                    />
                    <h3 className="font-bold text-lg">{battleState.opponent.name}</h3>
                    <div className="flex gap-1 justify-center">
                      {battleState.opponent.types.map((type) => (
                        <Badge key={type} variant="outline" className="text-xs">
                          {type.toUpperCase()}
                        </Badge>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          HP
                        </span>
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
            {!battleState.isComplete && battleState.turn === "player" && !isProcessing && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Choose Your Move</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {battleState.player.moves.map((move, index) => {
                      const effectiveness = battleEngine.getTypeEffectiveness(move.type, battleState.opponent.types)
                      let effectivenessText = ""
                      let effectivenessColor = ""

                      if (effectiveness > 1) {
                        effectivenessText = "Super Effective!"
                        effectivenessColor = "text-green-600"
                      } else if (effectiveness < 1 && effectiveness > 0) {
                        effectivenessText = "Not Very Effective"
                        effectivenessColor = "text-red-600"
                      } else if (effectiveness === 0) {
                        effectivenessText = "No Effect"
                        effectivenessColor = "text-gray-600"
                      }

                      return (
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
                          <div className="text-xs text-gray-600 text-left w-full">
                            <div>
                              Power: {move.power || "N/A"} | PP: {move.currentPp}/{move.pp}
                            </div>
                            {effectivenessText && (
                              <div className={`font-medium ${effectivenessColor}`}>{effectivenessText}</div>
                            )}
                          </div>
                        </Button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Processing State */}
            {isProcessing && (
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="space-y-4">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                    <p className="text-gray-600">
                      {battleState.turn === "player" ? "Processing your move..." : "Opponent is thinking..."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Battle Complete */}
            {battleState.isComplete && (
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="space-y-4">
                    <div className="text-3xl">{battleState.winner === "player" ? "🎉" : "💀"}</div>
                    <div className="text-2xl font-bold">{battleState.winner === "player" ? "Victory!" : "Defeat!"}</div>
                    <p className="text-gray-600">
                      {battleState.winner === "player"
                        ? `${battleState.player.name} wins the battle!`
                        : `${battleState.opponent.name} wins the battle!`}
                    </p>
                    <Button onClick={resetBattle} className="gap-2" size="lg">
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
                {battleLog.length === 0 && (
                  <div className="text-sm text-gray-500 italic text-center py-4">Battle log will appear here...</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
