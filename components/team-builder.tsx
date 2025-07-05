"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, X, Users, BarChart3, Save, Share2 } from "lucide-react"
import { PokemonImage } from "@/components/pokemon-image"
import { TypeBadge } from "@/components/type-badge"
import type { Pokemon, TeamPokemon, Team, TeamAnalysis } from "@/types/enhanced-features"

interface TeamBuilderProps {
  pokemon: Pokemon[]
}

const pokemonRoles = ["sweeper", "tank", "support", "wall", "utility"] as const

export function TeamBuilder({ pokemon }: TeamBuilderProps) {
  const [team, setTeam] = useState<TeamPokemon[]>([])
  const [teamName, setTeamName] = useState("")
  const [teamDescription, setTeamDescription] = useState("")
  const [selectedPokemon, setSelectedPokemon] = useState<string>("")
  const [showAnalysis, setShowAnalysis] = useState(false)

  const addPokemonToTeam = () => {
    if (!selectedPokemon || team.length >= 6) return

    const poke = pokemon.find((p) => p.id.toString() === selectedPokemon)
    if (!poke || team.some((t) => t.pokemon.id === poke.id)) return

    const newTeamPokemon: TeamPokemon = {
      pokemon: poke,
      level: 50,
      moves: [],
      role: "sweeper",
      nature: "Hardy",
    }

    setTeam([...team, newTeamPokemon])
    setSelectedPokemon("")
  }

  const removePokemonFromTeam = (index: number) => {
    setTeam(team.filter((_, i) => i !== index))
  }

  const updatePokemonRole = (index: number, role: string) => {
    const updatedTeam = [...team]
    updatedTeam[index].role = role as any
    setTeam(updatedTeam)
  }

  const updatePokemonNickname = (index: number, nickname: string) => {
    const updatedTeam = [...team]
    updatedTeam[index].nickname = nickname
    setTeam(updatedTeam)
  }

  const teamAnalysis = useMemo((): TeamAnalysis => {
    const typeCount: Record<string, number> = {}
    const roleCount: Record<string, number> = {}
    const weaknesses: Record<string, number> = {}

    // Count types and roles
    team.forEach((member) => {
      member.pokemon.types.forEach((type) => {
        typeCount[type] = (typeCount[type] || 0) + 1
      })
      roleCount[member.role] = (roleCount[member.role] || 0) + 1
    })

    // Calculate common weaknesses
    const allTypes = [
      "fire",
      "water",
      "grass",
      "electric",
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

    allTypes.forEach((attackType) => {
      let totalEffectiveness = 0
      team.forEach((member) => {
        // Simplified effectiveness calculation
        let effectiveness = 1
        member.pokemon.types.forEach((defenseType) => {
          // This would use the actual type chart
          if (attackType === "water" && defenseType === "fire") effectiveness *= 2
          if (attackType === "fire" && defenseType === "grass") effectiveness *= 2
          if (attackType === "grass" && defenseType === "water") effectiveness *= 2
          // Add more type matchups...
        })
        totalEffectiveness += effectiveness
      })

      if (totalEffectiveness > team.length * 1.5) {
        weaknesses[attackType] = totalEffectiveness / team.length
      }
    })

    const suggestions: string[] = []

    if (team.length < 6) {
      suggestions.push(`Add ${6 - team.length} more Pokémon to complete your team`)
    }

    if (!roleCount.tank && !roleCount.wall) {
      suggestions.push("Consider adding a defensive Pokémon (Tank or Wall)")
    }

    if (!roleCount.support) {
      suggestions.push("A support Pokémon could help with healing and status effects")
    }

    if (Object.keys(weaknesses).length > 3) {
      suggestions.push("Your team has several common weaknesses - consider type diversity")
    }

    const score = Math.max(0, 100 - Object.keys(weaknesses).length * 10 - (6 - team.length) * 5)

    return {
      typeCoverage: {
        offensive: typeCount,
        defensive: typeCount,
      },
      weaknesses: Object.keys(weaknesses),
      strengths: Object.keys(typeCount),
      roles: roleCount,
      suggestions,
      score,
    }
  }, [team])

  const saveTeam = () => {
    if (!teamName.trim()) return

    const newTeam: Team = {
      id: Date.now().toString(),
      name: teamName,
      pokemon: team,
      description: teamDescription,
      createdAt: new Date(),
      updatedAt: new Date(),
      rating: 0,
      tags: [],
    }

    // Save to localStorage for demo
    const savedTeams = JSON.parse(localStorage.getItem("pokemon-teams") || "[]")
    savedTeams.push(newTeam)
    localStorage.setItem("pokemon-teams", JSON.stringify(savedTeams))

    alert("Team saved successfully!")
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Team Builder</h2>
        <p className="text-gray-600 mb-8">Build the perfect Pokémon team with advanced analysis</p>
      </div>

      {/* Team Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Team Setup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Team Name</label>
              <Input placeholder="Enter team name..." value={teamName} onChange={(e) => setTeamName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Add Pokémon</label>
              <div className="flex gap-2">
                <Select value={selectedPokemon} onValueChange={setSelectedPokemon}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Choose Pokémon..." />
                  </SelectTrigger>
                  <SelectContent>
                    {pokemon.slice(0, 100).map((poke) => (
                      <SelectItem key={poke.id} value={poke.id.toString()}>
                        #{poke.id.toString().padStart(3, "0")} {poke.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={addPokemonToTeam} disabled={!selectedPokemon || team.length >= 6} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              placeholder="Describe your team strategy..."
              value={teamDescription}
              onChange={(e) => setTeamDescription(e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Team Members */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => {
          const member = team[index]

          return (
            <Card key={index} className={member ? "border-green-200" : "border-dashed border-gray-300"}>
              <CardContent className="p-4">
                {member ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="text-center flex-1">
                        <PokemonImage
                          src={member.pokemon.image}
                          alt={member.pokemon.name}
                          width={80}
                          height={80}
                          className="mx-auto mb-2"
                          pokemonId={member.pokemon.id}
                        />
                        <h3 className="font-semibold">{member.nickname || member.pokemon.name}</h3>
                        <div className="flex gap-1 justify-center mt-1">
                          {member.pokemon.types.map((type) => (
                            <TypeBadge key={type} type={type} size="sm" />
                          ))}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removePokemonFromTeam(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-gray-600">Nickname</label>
                        <Input
                          placeholder={member.pokemon.name}
                          value={member.nickname || ""}
                          onChange={(e) => updatePokemonNickname(index, e.target.value)}
                          className="h-8 text-sm"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-gray-600">Role</label>
                        <Select value={member.role} onValueChange={(value) => updatePokemonRole(index, value)}>
                          <SelectTrigger className="h-8 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {pokemonRoles.map((role) => (
                              <SelectItem key={role} value={role}>
                                {role.charAt(0).toUpperCase() + role.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="text-xs text-gray-600">
                        <div>Level: {member.level}</div>
                        <div>HP: {member.pokemon.stats.hp}</div>
                        <div>Atk: {member.pokemon.stats.attack}</div>
                        <div>Def: {member.pokemon.stats.defense}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-48 flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <Plus className="w-8 h-8 mx-auto mb-2" />
                      <div className="text-sm">Empty Slot</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Team Analysis */}
      {team.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Team Analysis
              </div>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                Score: {teamAnalysis.score}/100
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Type Coverage */}
            <div>
              <h4 className="font-semibold mb-3">Type Coverage</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(teamAnalysis.typeCoverage.offensive).map(([type, count]) => (
                  <div key={type} className="flex items-center gap-1">
                    <TypeBadge type={type} size="sm" />
                    <span className="text-sm text-gray-600">×{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Role Distribution */}
            <div>
              <h4 className="font-semibold mb-3">Role Distribution</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(teamAnalysis.roles).map(([role, count]) => (
                  <Badge key={role} variant="outline" className="gap-1">
                    {role.charAt(0).toUpperCase() + role.slice(1)}: {count}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Weaknesses */}
            {teamAnalysis.weaknesses.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3 text-red-600">Common Weaknesses</h4>
                <div className="flex flex-wrap gap-2">
                  {teamAnalysis.weaknesses.map((weakness) => (
                    <TypeBadge key={weakness} type={weakness} size="sm" className="opacity-75" />
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {teamAnalysis.suggestions.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">Suggestions</h4>
                <ul className="space-y-1">
                  {teamAnalysis.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      {team.length > 0 && (
        <div className="flex gap-4 justify-center">
          <Button onClick={saveTeam} disabled={!teamName.trim()} className="gap-2">
            <Save className="w-4 h-4" />
            Save Team
          </Button>
          <Button variant="outline" className="gap-2">
            <Share2 className="w-4 h-4" />
            Share Team
          </Button>
        </div>
      )}
    </div>
  )
}
