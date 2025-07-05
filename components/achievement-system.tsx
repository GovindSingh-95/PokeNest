"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Trophy, Star, Crown, Award, Lock, CheckCircle } from "lucide-react"
import type { Achievement, UserStats } from "@/types/enhanced-features"

const achievementTemplates: Omit<Achievement, "id" | "unlockedAt" | "progress">[] = [
  {
    name: "First Steps",
    description: "View your first Pokémon",
    icon: "👶",
    category: "exploration",
    rarity: "common",
    maxProgress: 1,
  },
  {
    name: "Pokédex Explorer",
    description: "View 50 different Pokémon",
    icon: "📖",
    category: "exploration",
    rarity: "common",
    maxProgress: 50,
  },
  {
    name: "Gotta See 'Em All",
    description: "View 150 different Pokémon",
    icon: "👀",
    category: "exploration",
    rarity: "rare",
    maxProgress: 150,
  },
  {
    name: "Type Master",
    description: "Use the type matchup calculator 10 times",
    icon: "⚔️",
    category: "battle",
    rarity: "common",
    maxProgress: 10,
  },
  {
    name: "Team Builder",
    description: "Create your first team",
    icon: "👥",
    category: "collection",
    rarity: "common",
    maxProgress: 1,
  },
  {
    name: "Quiz Novice",
    description: "Complete your first quiz",
    icon: "🧠",
    category: "battle",
    rarity: "common",
    maxProgress: 1,
  },
  {
    name: "Quiz Master",
    description: "Score 100% on a quiz",
    icon: "🎯",
    category: "battle",
    rarity: "epic",
    maxProgress: 1,
  },
  {
    name: "Battle Veteran",
    description: "Win 10 battles",
    icon: "⚡",
    category: "battle",
    rarity: "rare",
    maxProgress: 10,
  },
  {
    name: "Legendary Trainer",
    description: "View all legendary Pokémon",
    icon: "👑",
    category: "exploration",
    rarity: "legendary",
    maxProgress: 5,
  },
  {
    name: "Daily Dedication",
    description: "Visit PokéNest for 7 consecutive days",
    icon: "📅",
    category: "social",
    rarity: "rare",
    maxProgress: 7,
  },
]

interface AchievementSystemProps {
  userStats: UserStats
}

export function AchievementSystem({ userStats }: AchievementSystemProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [newUnlocks, setNewUnlocks] = useState<Achievement[]>([])

  useEffect(() => {
    // Initialize achievements from templates
    const initialAchievements = achievementTemplates.map((template, index) => ({
      ...template,
      id: `achievement-${index}`,
      progress: 0,
      unlockedAt: undefined,
    }))

    // Load saved progress from localStorage
    const savedAchievements = localStorage.getItem("pokemon-achievements")
    if (savedAchievements) {
      const parsed = JSON.parse(savedAchievements)
      setAchievements(parsed)
    } else {
      setAchievements(initialAchievements)
    }
  }, [])

  useEffect(() => {
    // Update achievement progress based on user stats
    const updatedAchievements = achievements.map((achievement) => {
      let newProgress = achievement.progress

      switch (achievement.name) {
        case "First Steps":
          newProgress = userStats.pokemonSeen >= 1 ? 1 : 0
          break
        case "Pokédex Explorer":
          newProgress = Math.min(userStats.pokemonSeen, 50)
          break
        case "Gotta See 'Em All":
          newProgress = Math.min(userStats.pokemonSeen, 150)
          break
        case "Team Builder":
          newProgress = userStats.teamsCreated >= 1 ? 1 : 0
          break
        case "Battle Veteran":
          newProgress = Math.min(userStats.battlesWon, 10)
          break
        case "Daily Dedication":
          newProgress = Math.min(userStats.currentStreak, 7)
          break
        default:
          break
      }

      // Check if achievement was just unlocked
      const wasUnlocked = achievement.unlockedAt !== undefined
      const isNowUnlocked = newProgress >= achievement.maxProgress

      if (!wasUnlocked && isNowUnlocked) {
        const unlockedAchievement = {
          ...achievement,
          progress: newProgress,
          unlockedAt: new Date(),
        }
        setNewUnlocks((prev) => [...prev, unlockedAchievement])
        return unlockedAchievement
      }

      return {
        ...achievement,
        progress: newProgress,
      }
    })

    setAchievements(updatedAchievements)
    localStorage.setItem("pokemon-achievements", JSON.stringify(updatedAchievements))
  }, [userStats])

  const dismissNewUnlock = (achievementId: string) => {
    setNewUnlocks((prev) => prev.filter((a) => a.id !== achievementId))
  }

  const getRarityColor = (rarity: Achievement["rarity"]) => {
    switch (rarity) {
      case "common":
        return "bg-gray-100 text-gray-800 border-gray-300"
      case "rare":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "epic":
        return "bg-purple-100 text-purple-800 border-purple-300"
      case "legendary":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getRarityIcon = (rarity: Achievement["rarity"]) => {
    switch (rarity) {
      case "common":
        return <Award className="w-4 h-4" />
      case "rare":
        return <Star className="w-4 h-4" />
      case "epic":
        return <Trophy className="w-4 h-4" />
      case "legendary":
        return <Crown className="w-4 h-4" />
      default:
        return <Award className="w-4 h-4" />
    }
  }

  const unlockedCount = achievements.filter((a) => a.unlockedAt).length
  const totalCount = achievements.length

  return (
    <div className="space-y-8">
      {/* New Achievement Notifications */}
      {newUnlocks.map((achievement) => (
        <Card key={achievement.id} className="border-yellow-300 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center text-2xl">
                  {achievement.icon}
                </div>
                <div>
                  <h3 className="font-bold text-yellow-900">Achievement Unlocked!</h3>
                  <p className="text-yellow-800">{achievement.name}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => dismissNewUnlock(achievement.id)}
                className="text-yellow-700 hover:text-yellow-900"
              >
                <CheckCircle className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Achievements</h2>
        <p className="text-gray-600 mb-8">Track your progress and unlock rewards</p>

        <div className="flex items-center justify-center gap-4 mb-8">
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {unlockedCount} / {totalCount} Unlocked
          </Badge>
          <Progress value={(unlockedCount / totalCount) * 100} className="w-48" />
        </div>
      </div>

      {/* Achievement Categories */}
      {(["exploration", "battle", "collection", "social"] as const).map((category) => {
        const categoryAchievements = achievements.filter((a) => a.category === category)
        const categoryUnlocked = categoryAchievements.filter((a) => a.unlockedAt).length

        return (
          <div key={category}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold capitalize">{category}</h3>
              <Badge variant="outline">
                {categoryUnlocked} / {categoryAchievements.length}
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryAchievements.map((achievement) => {
                const isUnlocked = achievement.unlockedAt !== undefined
                const progressPercentage = (achievement.progress / achievement.maxProgress) * 100

                return (
                  <Card
                    key={achievement.id}
                    className={`${isUnlocked ? "border-green-300 bg-green-50" : "border-gray-200"} transition-all`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                            isUnlocked ? "bg-green-200" : "bg-gray-200"
                          }`}
                        >
                          {isUnlocked ? achievement.icon : <Lock className="w-6 h-6 text-gray-400" />}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={`font-semibold ${isUnlocked ? "text-green-900" : "text-gray-700"}`}>
                              {achievement.name}
                            </h4>
                            <Badge variant="outline" className={`text-xs ${getRarityColor(achievement.rarity)}`}>
                              {getRarityIcon(achievement.rarity)}
                              {achievement.rarity}
                            </Badge>
                          </div>

                          <p className={`text-sm mb-3 ${isUnlocked ? "text-green-800" : "text-gray-600"}`}>
                            {achievement.description}
                          </p>

                          <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span>Progress</span>
                              <span>
                                {achievement.progress} / {achievement.maxProgress}
                              </span>
                            </div>
                            <Progress value={progressPercentage} className="h-2" />
                          </div>

                          {isUnlocked && achievement.unlockedAt && (
                            <div className="text-xs text-green-600 mt-2">
                              Unlocked {achievement.unlockedAt.toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
