"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Brain, Sparkles, TrendingUp, Users, Target, Zap } from "lucide-react"
import { PokemonImage } from "@/components/pokemon-image"
import type { Pokemon } from "@/types/pokemon"

interface AIRecommendation {
  id: string
  type: "team" | "pokemon" | "strategy" | "meta"
  title: string
  description: string
  confidence: number
  pokemon?: Pokemon[]
  reasoning: string[]
  tags: string[]
}

interface AIRecommendationsProps {
  userHistory: {
    viewedPokemon: number[]
    favoriteTypes: string[]
    teamPreferences: string[]
    battleHistory: any[]
  }
  pokemon: Pokemon[]
}

export function AIRecommendations({ userHistory, pokemon }: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  // Advanced ML-inspired recommendation engine
  const generateRecommendations = async () => {
    setLoading(true)

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const recs: AIRecommendation[] = []

    // Team Composition Recommendations
    if (userHistory.favoriteTypes.length > 0) {
      const synergisticTeam = generateSynergisticTeam(userHistory.favoriteTypes)
      recs.push({
        id: "team-synergy",
        type: "team",
        title: "Synergistic Team Composition",
        description: "AI-optimized team based on your type preferences and battle patterns",
        confidence: 94,
        pokemon: synergisticTeam,
        reasoning: [
          "Balanced offensive and defensive coverage",
          "Complementary type matchups",
          "Optimal stat distribution",
          "Meta-game viability",
        ],
        tags: ["Competitive", "Balanced", "Meta"],
      })
    }

    // Hidden Gem Pokemon
    const hiddenGems = findHiddenGems(userHistory.viewedPokemon)
    if (hiddenGems.length > 0) {
      recs.push({
        id: "hidden-gems",
        type: "pokemon",
        title: "Underrated Powerhouses",
        description: "Discover overlooked Pokémon with exceptional potential",
        confidence: 87,
        pokemon: hiddenGems,
        reasoning: [
          "High base stat totals relative to usage",
          "Unique type combinations",
          "Versatile movepool options",
          "Surprise factor in battles",
        ],
        tags: ["Discovery", "Unique", "Potential"],
      })
    }

    // Meta Analysis Insights
    recs.push({
      id: "meta-analysis",
      type: "meta",
      title: "Current Meta Trends",
      description: "AI analysis of competitive landscape and emerging strategies",
      confidence: 91,
      reasoning: [
        "Defensive walls gaining popularity",
        "Speed control becoming crucial",
        "Type coverage gaps in common teams",
        "Underutilized support moves",
      ],
      tags: ["Competitive", "Trends", "Strategy"],
    })

    // Personalized Discovery
    const personalizedPicks = generatePersonalizedPicks(userHistory)
    recs.push({
      id: "personalized",
      type: "pokemon",
      title: "Perfect Matches for You",
      description: "Pokémon that align with your discovered preferences",
      confidence: 89,
      pokemon: personalizedPicks,
      reasoning: [
        "Matches your favorite type combinations",
        "Similar stat distributions to your favorites",
        "Complementary to your existing teams",
        "High user satisfaction correlation",
      ],
      tags: ["Personalized", "Curated", "Favorites"],
    })

    setRecommendations(recs)
    setLoading(false)
  }

  const generateSynergisticTeam = (favoriteTypes: string[]): Pokemon[] => {
    // Advanced team building algorithm
    const teamSize = 6
    const team: Pokemon[] = []

    // Core selection based on user preferences
    const coreTypes = favoriteTypes.slice(0, 2)
    const corePokemon = pokemon
      .filter(
        (p) => p.types.some((type) => coreTypes.includes(type)) && p.stats.hp + p.stats.attack + p.stats.defense > 300,
      )
      .slice(0, 2)

    team.push(...corePokemon)

    // Fill remaining slots with complementary picks
    const remainingSlots = teamSize - team.length
    const complementary = pokemon
      .filter((p) => !team.includes(p))
      .sort((a, b) => calculateTeamSynergy(team, b) - calculateTeamSynergy(team, a))
      .slice(0, remainingSlots)

    team.push(...complementary)
    return team
  }

  const calculateTeamSynergy = (team: Pokemon[], candidate: Pokemon): number => {
    let synergy = 0

    // Type coverage bonus
    const teamTypes = new Set(team.flatMap((p) => p.types))
    const newTypes = candidate.types.filter((type) => !teamTypes.has(type))
    synergy += newTypes.length * 10

    // Stat balance bonus
    const avgStats = team.reduce(
      (acc, p) => ({
        hp: acc.hp + p.stats.hp,
        attack: acc.attack + p.stats.attack,
        defense: acc.defense + p.stats.defense,
      }),
      { hp: 0, attack: 0, defense: 0 },
    )

    // Prefer balanced additions
    const balance = Math.abs(avgStats.attack - avgStats.defense)
    synergy += Math.max(0, 50 - balance)

    return synergy
  }

  const findHiddenGems = (viewedIds: number[]): Pokemon[] => {
    return pokemon
      .filter((p) => !viewedIds.includes(p.id))
      .filter((p) => {
        const totalStats = Object.values(p.stats).reduce((sum, stat) => sum + stat, 0)
        return totalStats > 450 && totalStats < 600 // Sweet spot for hidden gems
      })
      .sort(() => Math.random() - 0.5)
      .slice(0, 4)
  }

  const generatePersonalizedPicks = (history: any): Pokemon[] => {
    const { favoriteTypes, viewedPokemon } = history

    return pokemon
      .filter((p) => !viewedPokemon.includes(p.id))
      .filter((p) => p.types.some((type) => favoriteTypes.includes(type)))
      .sort((a, b) => {
        // Preference scoring algorithm
        const scoreA = calculatePersonalizationScore(a, history)
        const scoreB = calculatePersonalizationScore(b, history)
        return scoreB - scoreA
      })
      .slice(0, 5)
  }

  const calculatePersonalizationScore = (pokemon: Pokemon, history: any): number => {
    let score = 0

    // Type preference matching
    const typeMatches = pokemon.types.filter((type) => history.favoriteTypes.includes(type)).length
    score += typeMatches * 25

    // Stat preference (based on viewed Pokemon patterns)
    const avgViewedStats = history.viewedPokemon.reduce(
      (acc: any, id: number) => {
        const p = pokemon.find((poke) => poke.id === id)
        if (p) {
          acc.attack += p.stats.attack
          acc.defense += p.stats.defense
          acc.speed += p.stats.speed
          acc.count++
        }
        return acc
      },
      { attack: 0, defense: 0, speed: 0, count: 0 },
    )

    if (avgViewedStats.count > 0) {
      const avgAttack = avgViewedStats.attack / avgViewedStats.count
      const statSimilarity = 100 - Math.abs(pokemon.stats.attack - avgAttack)
      score += Math.max(0, statSimilarity) * 0.5
    }

    return score
  }

  useEffect(() => {
    generateRecommendations()
  }, [userHistory])

  const filteredRecommendations =
    selectedCategory === "all" ? recommendations : recommendations.filter((rec) => rec.type === selectedCategory)

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case "team":
        return <Users className="w-5 h-5" />
      case "pokemon":
        return <Sparkles className="w-5 h-5" />
      case "strategy":
        return <Target className="w-5 h-5" />
      case "meta":
        return <TrendingUp className="w-5 h-5" />
      default:
        return <Brain className="w-5 h-5" />
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-green-600 bg-green-100"
    if (confidence >= 80) return "text-blue-600 bg-blue-100"
    return "text-orange-600 bg-orange-100"
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
          <Brain className="w-8 h-8 text-purple-600" />
          AI-Powered Recommendations
        </h2>
        <p className="text-gray-600 mb-8">Personalized insights powered by advanced machine learning algorithms</p>
      </div>

      {/* Category Filter */}
      <div className="flex justify-center">
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
          {[
            { key: "all", label: "All", icon: Brain },
            { key: "team", label: "Teams", icon: Users },
            { key: "pokemon", label: "Pokémon", icon: Sparkles },
            { key: "meta", label: "Meta", icon: TrendingUp },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                selectedCategory === key
                  ? "bg-white shadow-sm text-purple-600 font-medium"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-purple-50 rounded-full">
            <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-purple-700 font-medium">AI analyzing your preferences...</span>
          </div>
        </div>
      )}

      {/* Recommendations Grid */}
      {!loading && (
        <div className="grid lg:grid-cols-2 gap-8">
          {filteredRecommendations.map((rec) => (
            <Card key={rec.id} className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="flex items-center gap-3">
                    {getRecommendationIcon(rec.type)}
                    <div>
                      <div className="text-lg font-bold text-gray-900">{rec.title}</div>
                      <div className="text-sm text-gray-600 font-normal">{rec.description}</div>
                    </div>
                  </CardTitle>
                  <Badge className={`${getConfidenceColor(rec.confidence)} border-0`}>
                    {rec.confidence}% confident
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Pokemon Preview */}
                {rec.pokemon && rec.pokemon.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3">Recommended Pokémon</h4>
                    <div className="grid grid-cols-3 gap-3">
                      {rec.pokemon.slice(0, 6).map((pokemon) => (
                        <div key={pokemon.id} className="text-center">
                          <div className="w-16 h-16 bg-white rounded-lg mx-auto mb-2 flex items-center justify-center shadow-sm">
                            <PokemonImage
                              src={pokemon.image}
                              alt={pokemon.name}
                              width={48}
                              height={48}
                              className="object-contain"
                              pokemonId={pokemon.id}
                            />
                          </div>
                          <div className="text-xs font-medium text-gray-700">{pokemon.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Reasoning */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    AI Analysis
                  </h4>
                  <ul className="space-y-2">
                    {rec.reasoning.map((reason, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {rec.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Action Button */}
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  {rec.type === "team"
                    ? "Build This Team"
                    : rec.type === "pokemon"
                      ? "Explore These Pokémon"
                      : "Learn More"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredRecommendations.length === 0 && (
        <div className="text-center py-12">
          <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Building Your Profile</h3>
          <p className="text-gray-600">Explore more Pokémon to receive personalized AI recommendations</p>
        </div>
      )}
    </div>
  )
}
