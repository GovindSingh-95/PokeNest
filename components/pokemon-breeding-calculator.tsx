"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Heart, Egg, Clock, Star, Zap, Info } from "lucide-react"
import { PokemonImage } from "@/components/pokemon-image"
import type { Pokemon } from "@/types/pokemon"

interface BreedingResult {
  compatibility: number
  eggMoves: string[]
  inheritedStats: string[]
  estimatedSteps: number
  possibleNatures: string[]
  shinyOdds: number
  eggGroups: string[]
}

interface BreedingCalculatorProps {
  pokemon: Pokemon[]
}

const eggGroups: Record<string, string[]> = {
  Monster: ["Bulbasaur", "Charmander", "Squirtle", "Nidoran♀", "Nidoran♂"],
  "Water 1": ["Psyduck", "Golduck", "Poliwag", "Poliwhirl", "Tentacool"],
  Bug: ["Caterpie", "Weedle", "Paras", "Venonat", "Scyther"],
  Flying: ["Pidgey", "Spearow", "Zubat", "Farfetch'd", "Doduo"],
  Field: ["Rattata", "Pikachu", "Sandshrew", "Vulpix", "Growlithe"],
  Fairy: ["Clefairy", "Jigglypuff", "Togepi", "Marill", "Snubbull"],
  Grass: ["Oddish", "Bellsprout", "Exeggcute", "Tangela", "Chikorita"],
  "Human-Like": ["Abra", "Machop", "Hitmonlee", "Hitmonchan", "Mr. Mime"],
  "Water 3": ["Magikarp", "Goldeen", "Staryu", "Horsea", "Remoraid"],
  Mineral: ["Geodude", "Magnemite", "Onix", "Voltorb", "Rhyhorn"],
  Amorphous: ["Grimer", "Gastly", "Koffing", "Ditto", "Slugma"],
  "Water 2": ["Goldeen", "Seaking", "Staryu", "Starmie", "Magikarp"],
  Ditto: ["Ditto"],
  Dragon: ["Dratini", "Dragonair", "Dragonite", "Kingdra", "Vibrava"],
  Undiscovered: ["Articuno", "Zapdos", "Moltres", "Mewtwo", "Mew"],
}

const natures = [
  "Hardy",
  "Lonely",
  "Brave",
  "Adamant",
  "Naughty",
  "Bold",
  "Docile",
  "Relaxed",
  "Impish",
  "Lax",
  "Timid",
  "Hasty",
  "Serious",
  "Jolly",
  "Naive",
  "Modest",
  "Mild",
  "Quiet",
  "Bashful",
  "Rash",
  "Calm",
  "Gentle",
  "Sassy",
  "Careful",
  "Quirky",
]

export function PokemonBreedingCalculator({ pokemon }: BreedingCalculatorProps) {
  const [parent1Id, setParent1Id] = useState<string>("")
  const [parent2Id, setParent2Id] = useState<string>("")
  const [showAdvanced, setShowAdvanced] = useState(false)

  const parent1 = pokemon.find((p) => p.id.toString() === parent1Id)
  const parent2 = pokemon.find((p) => p.id.toString() === parent2Id)

  const breedingResult = useMemo((): BreedingResult | null => {
    if (!parent1 || !parent2) return null

    // Get egg groups for both parents
    const getEggGroups = (pokemonName: string): string[] => {
      const groups: string[] = []
      Object.entries(eggGroups).forEach(([group, members]) => {
        if (members.some((member) => member.toLowerCase().includes(pokemonName.toLowerCase()))) {
          groups.push(group)
        }
      })
      return groups.length > 0 ? groups : ["Field"] // Default group
    }

    const parent1Groups = getEggGroups(parent1.name)
    const parent2Groups = getEggGroups(parent2.name)

    // Calculate compatibility
    let compatibility = 0
    const hasSharedGroup = parent1Groups.some((group) => parent2Groups.includes(group))
    const hasDitto = parent1Groups.includes("Ditto") || parent2Groups.includes("Ditto")

    if (hasDitto) {
      compatibility = 100
    } else if (hasSharedGroup) {
      compatibility = parent1.id === parent2.id ? 25 : 75 // Same species vs different species
    } else {
      compatibility = 0
    }

    // Calculate egg moves (simplified)
    const eggMoves = ["Tackle", "Growl", "Quick Attack", "Thunder Shock", "Ember", "Bubble"].slice(
      0,
      Math.floor(Math.random() * 4) + 1,
    )

    // Inherited stats
    const inheritedStats = ["HP", "Attack", "Defense"].slice(0, Math.floor(Math.random() * 3) + 1)

    // Estimated steps (based on compatibility)
    const baseSteps = 5120 // Standard egg steps
    const stepMultiplier = compatibility > 75 ? 0.8 : compatibility > 50 ? 1.0 : 1.5
    const estimatedSteps = Math.floor(baseSteps * stepMultiplier)

    // Possible natures (random selection)
    const possibleNatures = natures.slice(0, Math.floor(Math.random() * 5) + 3)

    // Shiny odds
    const shinyOdds = 1 / 4096 // Modern shiny odds

    return {
      compatibility,
      eggMoves,
      inheritedStats,
      estimatedSteps,
      possibleNatures,
      shinyOdds,
      eggGroups: [...new Set([...parent1Groups, ...parent2Groups])],
    }
  }, [parent1, parent2])

  const getCompatibilityColor = (compatibility: number) => {
    if (compatibility >= 75) return "text-green-600 bg-green-100"
    if (compatibility >= 50) return "text-yellow-600 bg-yellow-100"
    if (compatibility >= 25) return "text-orange-600 bg-orange-100"
    return "text-red-600 bg-red-100"
  }

  const getCompatibilityText = (compatibility: number) => {
    if (compatibility >= 75) return "Excellent"
    if (compatibility >= 50) return "Good"
    if (compatibility >= 25) return "Poor"
    return "Incompatible"
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
          <Egg className="w-8 h-8 text-pink-600" />
          Breeding Calculator
        </h2>
        <p className="text-gray-600 mb-8">Calculate breeding compatibility and predict offspring characteristics</p>
      </div>

      {/* Parent Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-500" />
            Select Breeding Pair
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Parent 1 */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Parent 1</label>
              <Select value={parent1Id} onValueChange={setParent1Id}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose first parent..." />
                </SelectTrigger>
                <SelectContent>
                  {pokemon.slice(0, 100).map((poke) => (
                    <SelectItem key={poke.id} value={poke.id.toString()}>
                      #{poke.id.toString().padStart(3, "0")} {poke.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {parent1 && (
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <PokemonImage
                    src={parent1.image}
                    alt={parent1.name}
                    width={48}
                    height={48}
                    className="object-contain"
                    pokemonId={parent1.id}
                  />
                  <div>
                    <div className="font-medium">{parent1.name}</div>
                    <div className="flex gap-1">
                      {parent1.types.map((type) => (
                        <Badge key={type} variant="secondary" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Parent 2 */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Parent 2</label>
              <Select value={parent2Id} onValueChange={setParent2Id}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose second parent..." />
                </SelectTrigger>
                <SelectContent>
                  {pokemon.slice(0, 100).map((poke) => (
                    <SelectItem key={poke.id} value={poke.id.toString()}>
                      #{poke.id.toString().padStart(3, "0")} {poke.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {parent2 && (
                <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-lg">
                  <PokemonImage
                    src={parent2.image}
                    alt={parent2.name}
                    width={48}
                    height={48}
                    className="object-contain"
                    pokemonId={parent2.id}
                  />
                  <div>
                    <div className="font-medium">{parent2.name}</div>
                    <div className="flex gap-1">
                      {parent2.types.map((type) => (
                        <Badge key={type} variant="secondary" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Breeding Results */}
      {breedingResult && (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Compatibility */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Breeding Compatibility
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getCompatibilityColor(breedingResult.compatibility)}`}
                >
                  <span className="text-2xl font-bold">{breedingResult.compatibility}%</span>
                  <span className="font-medium">{getCompatibilityText(breedingResult.compatibility)}</span>
                </div>
                <Progress value={breedingResult.compatibility} className="mt-4" />
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Egg Groups</h4>
                  <div className="flex flex-wrap gap-2">
                    {breedingResult.eggGroups.map((group) => (
                      <Badge key={group} variant="outline">
                        {group}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <Clock className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                    <div className="font-semibold">{breedingResult.estimatedSteps.toLocaleString()}</div>
                    <div className="text-xs text-gray-600">Steps to Hatch</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <Star className="w-6 h-6 text-yellow-600 mx-auto mb-1" />
                    <div className="font-semibold">1/{Math.floor(1 / breedingResult.shinyOdds).toLocaleString()}</div>
                    <div className="text-xs text-gray-600">Shiny Odds</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Offspring Predictions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Egg className="w-5 h-5 text-green-500" />
                Offspring Predictions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  Possible Egg Moves
                </h4>
                <div className="flex flex-wrap gap-2">
                  {breedingResult.eggMoves.map((move) => (
                    <Badge key={move} className="bg-yellow-100 text-yellow-800">
                      {move}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Inherited Stats</h4>
                <div className="flex flex-wrap gap-2">
                  {breedingResult.inheritedStats.map((stat) => (
                    <Badge key={stat} variant="secondary">
                      {stat}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Possible Natures</h4>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  {breedingResult.possibleNatures.slice(0, 6).map((nature) => (
                    <div key={nature} className="p-2 bg-gray-50 rounded text-center">
                      {nature}
                    </div>
                  ))}
                </div>
              </div>

              <Button variant="outline" onClick={() => setShowAdvanced(!showAdvanced)} className="w-full gap-2">
                <Info className="w-4 h-4" />
                {showAdvanced ? "Hide" : "Show"} Advanced Details
              </Button>

              {showAdvanced && (
                <div className="space-y-3 p-4 bg-gray-50 rounded-lg text-sm">
                  <div>
                    <strong>Breeding Tips:</strong>
                  </div>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Use Everstone to pass down nature</li>
                    <li>• Destiny Knot passes 5 random IVs</li>
                    <li>• Flame Body ability halves egg steps</li>
                    <li>• Masuda Method increases shiny odds</li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {!parent1 || !parent2 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Egg className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Select Two Pokémon</h3>
            <p className="text-gray-600">Choose two Pokémon to calculate their breeding compatibility</p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
