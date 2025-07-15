"use client"

export const dynamic = "force-dynamic"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Sword, Users, Trophy, Heart, Shuffle, Calendar, TrendingUp, Target, Zap, Star } from "lucide-react"
import { BattleSimulator } from "@/components/battle-simulator"
import { TeamBuilder } from "@/components/team-builder"
import { QuizSystem } from "@/components/quiz-system"
import { AchievementSystem } from "@/components/achievement-system"
import { FavoritesSystem } from "@/components/favorites-system"
import { RandomPokemon } from "@/components/random-pokemon"
import { PokemonOfTheDay } from "@/components/pokemon-of-the-day"
import { usePokemonData } from "@/hooks/use-pokemon-data"
import { PokemonLoadingProgress } from "@/components/pokemon-loading"

export default function DashboardPage() {
  const { pokemon, loading, error } = usePokemonData()
  const [activeTab, setActiveTab] = useState("overview")

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-7xl mx-auto">
          <PokemonLoadingProgress />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-7xl mx-auto text-center py-20">
          <h1 className="text-2xl font-bold text-red-600 mb-4">⚠️ Dashboard Error</h1>
          <p className="text-gray-600 mb-4">Unable to load dashboard data.</p>
          <p className="text-sm text-gray-500">Error: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🎮 PokéNest Dashboard</h1>
          <p className="text-gray-600 text-lg">Your ultimate Pokémon companion experience</p>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="battle" className="flex items-center gap-2">
              <Sword className="w-4 h-4" />
              <span className="hidden sm:inline">Battle</span>
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Team</span>
            </TabsTrigger>
            <TabsTrigger value="quiz" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Quiz</span>
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">Awards</span>
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Favorites</span>
            </TabsTrigger>
            <TabsTrigger value="random" className="flex items-center gap-2">
              <Shuffle className="w-4 h-4" />
              <span className="hidden sm:inline">Random</span>
            </TabsTrigger>
            <TabsTrigger value="daily" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Daily</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Quick Stats */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Pokémon</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pokemon?.length || 0}</div>
                  <p className="text-xs text-muted-foreground">Available for battles</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Battle Ready</CardTitle>
                  <Sword className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">151</div>
                  <p className="text-xs text-muted-foreground">Gen 1 Pokémon</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Features</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground">Interactive tools</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Status</CardTitle>
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">All systems operational</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sword className="w-5 h-5" />
                    Battle Simulator
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Experience realistic Pokémon battles with full damage calculations and type effectiveness.
                  </p>
                  <Button
                    onClick={() => setActiveTab("battle")}
                    className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                  >
                    Start Battle
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Team Builder
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Create and analyze competitive Pokémon teams with advanced strategy tools.
                  </p>
                  <Button onClick={() => setActiveTab("team")} variant="outline" className="w-full">
                    Build Team
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Knowledge Quiz
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Test your Pokémon knowledge with interactive quizzes and challenges.
                  </p>
                  <Button onClick={() => setActiveTab("quiz")} variant="outline" className="w-full">
                    Take Quiz
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Featured Components */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PokemonOfTheDay />
              <RandomPokemon />
            </div>
          </TabsContent>

          {/* Battle Tab */}
          <TabsContent value="battle">{pokemon && <BattleSimulator pokemon={pokemon} />}</TabsContent>

          {/* Team Builder Tab */}
          <TabsContent value="team">{pokemon && <TeamBuilder pokemon={pokemon} />}</TabsContent>

          {/* Quiz Tab */}
          <TabsContent value="quiz">{pokemon && <QuizSystem pokemon={pokemon} />}</TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements">
            <AchievementSystem />
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites">{pokemon && <FavoritesSystem pokemon={pokemon} />}</TabsContent>

          {/* Random Tab */}
          <TabsContent value="random">
            <RandomPokemon />
          </TabsContent>

          {/* Daily Tab */}
          <TabsContent value="daily">
            <PokemonOfTheDay />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
