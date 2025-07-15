"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, Plus, X, RotateCcw, Download, Share2, Zap } from "lucide-react"
import { PokemonImage } from "@/components/pokemon-image"
import { PokemonSelector } from "@/components/pokemon-selector"
import { TypeBadge } from "@/components/type-badge"
import type { Pokemon } from "@/types/pokemon"

interface TeamBuilderProps {
  pokemon: Pokemon[]
}

interface TeamMember {
  pokemon: Pokemon
  nickname?: string
  level: number
}

interface TeamAnalysis {
  typesCovered: string[]
  weaknesses: string[]
  strengths: string[]
  totalStats: number
  averageStats: number
}

export function TeamBuilder({ pokemon }: TeamBuilderProps) {
  const [team, setTeam] = useState<TeamMember[]>([])
  const [selectedPokemon, setSelectedPokemon] = useState<string>("")
  const [teamName, setTeamName] = useState("My Team")

  const addToTeam = useCallback(() => {
    if (!selectedPokemon || team.length >= 6) return

    const pokemonData = pokemon.find((p) => p.id.toString() === selectedPokemon)
    if (!pokemonData) return

    // Check if Pokemon is already in team
    if (team.some((member) => member.pokemon.id === pokemonData.id)) {
      return
    }

    const newMember: TeamMember = {
      pokemon: pokemonData,
      level: 50,
    }

    setTeam((prev) => [...prev, newMember])
    setSelectedPokemon("")
  }, [selectedPokemon, team, pokemon])

  const removeFromTeam = useCallback((index: number) => {
    setTeam((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const clearTeam = useCallback(() => {
    setTeam([])
  }, [])

  const getUsedPokemonIds = useCallback(() => {
    return team.map((member) => member.pokemon.id)
  }, [team])

  const analyzeTeam = useCallback((): TeamAnalysis => {
    if (team.length === 0) {
      return {
        typesCovered: [],
        weaknesses: [],
        strengths: [],
        totalStats: 0,
        averageStats: 0,
      }
    }

    const allTypes = team.flatMap((member) => member.pokemon.types)
    const typesCovered = [...new Set(allTypes)]

    const totalStats = team.reduce((sum, member) => {
      return sum + Object.values(member.pokemon.stats).reduce((statSum, stat) => statSum + stat, 0)
    }, 0)

    const averageStats = totalStats / team.length

    // Simple weakness analysis (this could be more sophisticated)
    const commonWeaknesses = ["rock", "electric", "ice", "fire", "water"]
    const weaknesses = commonWeaknesses.filter((type) => {
      return !typesCovered.includes(type)
    })

    const strengths = typesCovered.filter((type) => {
      const count = allTypes.filter((t) => t === type).length
      return count >= 2
    })

    return {
      typesCovered,
      weaknesses: weaknesses.slice(0, 3),
      strengths: strengths.slice(0, 3),
      totalStats,
      averageStats,
    }
  }, [team])

  const analysis = analyzeTeam()

  const exportTeam = useCallback(() => {
    const teamData = {
      name: teamName,
      members: team.map((member) => ({
        id: member.pokemon.id,
        name: member.pokemon.name,
        nickname: member.nickname,
        level: member.level,
      })),
    }

    const dataStr = JSON.stringify(teamData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)

    const link = document.createElement("a")
    link.href = url
    link.download = `${teamName.replace(/\s+/g, "_")}.json`
    link.click()

    URL.revokeObjectURL(url)
  }, [team, teamName])

  const shareTeam = useCallback(() => {
    const teamText = `${teamName}\n${team.map((member) => `• ${member.pokemon.name} (Lv.${member.level})`).join("\n")}`

    if (navigator.share) {
      navigator.share({
        title: teamName,
        text: teamText,
      })
    } else {
      navigator.clipboard.writeText(teamText)
      // You could show a toast notification here
    }
  }, [team, teamName])

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">👥 Team Builder</h2>
        <p className="text-gray-600 mb-8">
          Build your perfect Pokémon team with strategic type coverage and balanced stats!
        </p>
      </div>

      {/* Team Name Input */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Team Name:</label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter team name..."
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={exportTeam}
                disabled={team.length === 0}
                className="gap-2 bg-transparent"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={shareTeam}
                disabled={team.length === 0}
                className="gap-2 bg-transparent"
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Pokemon Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Pokémon to Team ({team.length}/6)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <PokemonSelector
                pokemon={pokemon}
                selectedPokemon={selectedPokemon}
                onSelect={setSelectedPokemon}
                placeholder="Search for a Pokémon to add..."
                excludeIds={getUsedPokemonIds()}
                disabled={team.length >= 6}
              />
            </div>
            <Button onClick={addToTeam} disabled={!selectedPokemon || team.length >= 6} className="gap-2">
              <Plus className="w-4 h-4" />
              Add to Team
            </Button>
          </div>

          {team.length >= 6 && (
            <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
              ⚠️ Team is full! Remove a Pokémon to add a new one.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Team Display */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Your Team
              </CardTitle>
              {team.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearTeam}
                  className="gap-2 text-red-600 hover:text-red-700 bg-transparent"
                >
                  <RotateCcw className="w-4 h-4" />
                  Clear Team
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {team.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No Pokémon in your team yet</p>
                  <p className="text-sm">Add up to 6 Pokémon to build your perfect team!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {team.map((member, index) => (
                    <div
                      key={`${member.pokemon.id}-${index}`}
                      className="relative p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromTeam(index)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </Button>

                      <div className="flex items-center gap-3 mb-3">
                        <PokemonImage
                          src={member.pokemon.image}
                          alt={member.pokemon.name}
                          width={60}
                          height={60}
                          className="object-contain"
                          pokemonId={member.pokemon.id}
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-lg">{member.pokemon.name}</h3>
                          <p className="text-sm text-gray-600">
                            #{member.pokemon.id.toString().padStart(3, "0")} • Level {member.level}
                          </p>
                          <div className="flex gap-1 mt-1">
                            {member.pokemon.types.map((type) => (
                              <TypeBadge key={type} type={type} size="sm" />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Stats Preview */}
                      <div className="space-y-1">
                        {Object.entries(member.pokemon.stats).map(([stat, value]) => (
                          <div key={stat} className="flex justify-between text-xs">
                            <span className="capitalize">{stat.replace(/([A-Z])/g, " $1").trim()}:</span>
                            <span className="font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Empty slots */}
                  {Array.from({ length: 6 - team.length }).map((_, index) => (
                    <div
                      key={`empty-${index}`}
                      className="p-4 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400"
                    >
                      <div className="text-center">
                        <Plus className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Empty Slot</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Team Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Team Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {team.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p className="text-sm">Add Pokémon to see team analysis</p>
              </div>
            ) : (
              <>
                {/* Type Coverage */}
                <div>
                  <h4 className="font-medium mb-2">Type Coverage</h4>
                  <div className="flex flex-wrap gap-1">
                    {analysis.typesCovered.map((type) => (
                      <TypeBadge key={type} type={type} size="sm" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{analysis.typesCovered.length} types covered</p>
                </div>

                {/* Team Stats */}
                <div>
                  <h4 className="font-medium mb-2">Team Stats</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total BST:</span>
                      <span className="font-medium">{analysis.totalStats}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Average BST:</span>
                      <span className="font-medium">{Math.round(analysis.averageStats)}</span>
                    </div>
                    <Progress value={(analysis.averageStats / 600) * 100} className="h-2" />
                  </div>
                </div>

                {/* Strengths */}
                {analysis.strengths.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 text-green-700">Strengths</h4>
                    <div className="flex flex-wrap gap-1">
                      {analysis.strengths.map((type) => (
                        <Badge key={type} variant="secondary" className="text-xs bg-green-100 text-green-800">
                          {type.toUpperCase()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Potential Weaknesses */}
                {analysis.weaknesses.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 text-red-700">Potential Gaps</h4>
                    <div className="flex flex-wrap gap-1">
                      {analysis.weaknesses.map((type) => (
                        <Badge key={type} variant="secondary" className="text-xs bg-red-100 text-red-800">
                          {type.toUpperCase()}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Consider adding Pokémon with these types</p>
                  </div>
                )}

                {/* Team Completion */}
                <div>
                  <h4 className="font-medium mb-2">Team Progress</h4>
                  <Progress value={(team.length / 6) * 100} className="h-3" />
                  <p className="text-xs text-gray-600 mt-1">
                    {team.length}/6 Pokémon ({Math.round((team.length / 6) * 100)}% complete)
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
