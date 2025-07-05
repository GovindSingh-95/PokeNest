"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Heart, Users, Zap, TrendingUp, Target, Clock, Award, Home } from "lucide-react"
import Link from "next/link"
import { PokemonOfTheDay } from "@/components/pokemon-of-the-day"
import { RandomPokemon } from "@/components/random-pokemon"
import { FavoritesSystem } from "@/components/favorites-system"
import { AchievementSystem } from "@/components/achievement-system"
import { usePokemonData } from "@/hooks/use-pokemon-data"
import { PokemonModal } from "@/components/pokemon-modal"
import type { Pokemon } from "@/types/pokemon"
import type { UserStats, DailyChallenge } from "@/types/enhanced-features"

export default function DashboardPage() {
  const { pokemon, loading } = usePokemonData()
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null)
  const [userStats, setUserStats] = useState<UserStats>({
    pokemonSeen: 0,
    pokemonCaught: 0,
    battlesWon: 0,
    battlesLost: 0,
    teamsCreated: 0,
    achievementsUnlocked: 0,
    daysActive: 1,
    currentStreak: 1,
    longestStreak: 1,
  })

  const [dailyChallenges] = useState<DailyChallenge[]>([
    {
      id: "daily-1",
      date: new Date(),
      type: "explore",
      title: "Pokédex Explorer",
      description: "View 10 different Pokémon today",
      requirements: { pokemonToView: 10 },
      reward: { type: "xp", value: 100 },
      completed: false,
      progress: 3,
      maxProgress: 10,
    },
    {
      id: "daily-2",
      date: new Date(),
      type: "quiz",
      title: "Knowledge Test",
      description: "Complete a quiz with 80% accuracy",
      requirements: { accuracy: 80 },
      reward: { type: "badge", value: "Quiz Master" },
      completed: false,
      progress: 0,
      maxProgress: 1,
    },
    {
      id: "daily-3",
      date: new Date(),
      type: "team-build",
      title: "Team Strategy",
      description: "Create a balanced team with all roles",
      requirements: { roles: ["sweeper", "tank", "support"] },
      reward: { type: "title", value: "Strategist" },
      completed: false,
      progress: 0,
      maxProgress: 1,
    },
  ])

  useEffect(() => {
    // Update user stats based on localStorage and current data
    const favorites = JSON.parse(localStorage.getItem("pokemon-favorites") || "[]")
    const teams = JSON.parse(localStorage.getItem("pokemon-teams") || "[]")
    const achievements = JSON.parse(localStorage.getItem("pokemon-achievements") || "[]")

    setUserStats({
      pokemonSeen: pokemon.length,
      pokemonCaught: favorites.length,
      battlesWon: Math.floor(Math.random() * 10), // Demo data
      battlesLost: Math.floor(Math.random() * 5),
      teamsCreated: teams.length,
      achievementsUnlocked: achievements.filter((a: any) => a.unlockedAt).length,
      daysActive: 1,
      currentStreak: 1,
      longestStreak: 1,
    })
  }, [pokemon])

  // Safe calculation functions to prevent NaN
  const safePercentage = (value: number, total: number): number => {
    if (!total || total === 0) return 0
    return Math.min(Math.round((value / total) * 100), 100)
  }

  const safeBattleWinRate = (): number => {
    const totalBattles = userStats.battlesWon + userStats.battlesLost
    if (totalBattles === 0) return 0
    return Math.round((userStats.battlesWon / totalBattles) * 100)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-orange-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                  <div className="w-5 h-5 bg-white rounded-full"></div>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">PokéNest</h1>
                </div>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/explore">
                <Button variant="outline" size="sm" className="gap-2">
                  <Home className="w-4 h-4" />
                  Explore
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" size="sm">
                  Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Pokémon Dashboard</h1>
          <p className="text-gray-600">Track your progress, discover new Pokémon, and manage your collection</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{userStats.pokemonSeen || 0}</div>
              <div className="text-sm text-gray-600">Pokémon Seen</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{userStats.pokemonCaught || 0}</div>
              <div className="text-sm text-gray-600">Favorites</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{userStats.teamsCreated || 0}</div>
              <div className="text-sm text-gray-600">Teams Built</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{userStats.achievementsUnlocked || 0}</div>
              <div className="text-sm text-gray-600">Achievements</div>
            </CardContent>
          </Card>
        </div>

        {/* Daily Challenges */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Daily Challenges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {dailyChallenges.map((challenge) => (
                <div key={challenge.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{challenge.title}</h4>
                    <Badge variant={challenge.completed ? "default" : "secondary"}>
                      {challenge.completed ? "Complete" : "Active"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Progress</span>
                      <span>
                        {challenge.progress}/{challenge.maxProgress}
                      </span>
                    </div>
                    <Progress value={safePercentage(challenge.progress, challenge.maxProgress)} className="h-2" />
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Reward: {challenge.reward.value} {challenge.reward.type}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 bg-white/70 backdrop-blur-sm">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="random">Random</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <Trophy className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Viewed {userStats.pokemonSeen || 0} Pokémon</div>
                        <div className="text-sm text-gray-600">Exploration progress</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                        <Heart className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Added {userStats.pokemonCaught || 0} favorites</div>
                        <div className="text-sm text-gray-600">Collection building</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Created {userStats.teamsCreated || 0} teams</div>
                        <div className="text-sm text-gray-600">Team building</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Link href="/explore">
                      <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                        <TrendingUp className="w-6 h-6" />
                        <span className="text-sm">Explore Pokédex</span>
                      </Button>
                    </Link>

                    <Link href="/explore?tab=battle">
                      <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                        <Zap className="w-6 h-6" />
                        <span className="text-sm">Battle Simulator</span>
                      </Button>
                    </Link>

                    <Link href="/explore?tab=teams">
                      <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                        <Users className="w-6 h-6" />
                        <span className="text-sm">Team Builder</span>
                      </Button>
                    </Link>

                    <Link href="/explore?tab=quiz">
                      <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                        <Award className="w-6 h-6" />
                        <span className="text-sm">Take Quiz</span>
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Progress Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Your Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Pokédex Completion</span>
                        <span>{safePercentage(userStats.pokemonSeen, 1000)}%</span>
                      </div>
                      <Progress value={safePercentage(userStats.pokemonSeen, 1000)} className="h-3" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Collection Progress</span>
                        <span>{safePercentage(userStats.pokemonCaught, 100)}%</span>
                      </div>
                      <Progress value={safePercentage(userStats.pokemonCaught, 100)} className="h-3" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Battle Win Rate</span>
                        <span>{safeBattleWinRate()}%</span>
                      </div>
                      <Progress value={safeBattleWinRate()} className="h-3" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Achievement Progress</span>
                        <span>{safePercentage(userStats.achievementsUnlocked, 10)}%</span>
                      </div>
                      <Progress value={safePercentage(userStats.achievementsUnlocked, 10)} className="h-3" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="daily">
            <PokemonOfTheDay pokemon={pokemon} onPokemonSelect={setSelectedPokemon} />
          </TabsContent>

          <TabsContent value="random">
            <RandomPokemon pokemon={pokemon} onPokemonSelect={setSelectedPokemon} />
          </TabsContent>

          <TabsContent value="favorites">
            <FavoritesSystem pokemon={pokemon} />
          </TabsContent>

          <TabsContent value="achievements">
            <AchievementSystem userStats={userStats} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Pokemon Modal */}
      <PokemonModal pokemon={selectedPokemon} isOpen={!!selectedPokemon} onClose={() => setSelectedPokemon(null)} />
    </div>
  )
}
