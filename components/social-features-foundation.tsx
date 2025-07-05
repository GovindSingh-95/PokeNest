"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Share2, Heart, MessageCircle, Trophy, Star, Globe, Lock, Eye } from "lucide-react"
import type { Pokemon, Team } from "@/types/enhanced-features"

interface UserProfile {
  id: string
  username: string
  avatar?: string
  level: number
  xp: number
  title: string
  joinDate: Date
  stats: {
    pokemonSeen: number
    teamsCreated: number
    battlesWon: number
    achievements: number
  }
  badges: string[]
  favoriteTypes: string[]
}

interface SharedTeam {
  id: string
  name: string
  description: string
  author: UserProfile
  pokemon: Pokemon[]
  likes: number
  comments: number
  isLiked: boolean
  visibility: "public" | "friends" | "private"
  tags: string[]
  createdAt: Date
}

interface SocialFeaturesProps {
  currentUser: UserProfile
  teams: Team[]
}

export function SocialFeatures({ currentUser, teams }: SocialFeaturesProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "community" | "share">("profile")
  const [sharedTeams, setSharedTeams] = useState<SharedTeam[]>([])
  const [newTeamShare, setNewTeamShare] = useState({
    teamId: "",
    description: "",
    visibility: "public" as const,
    tags: [] as string[],
  })

  // Mock data for demonstration
  useEffect(() => {
    const mockSharedTeams: SharedTeam[] = [
      {
        id: "1",
        name: "Competitive Dragons",
        description: "A powerful dragon-type team for ranked battles. Focus on speed and raw power.",
        author: {
          id: "user1",
          username: "DragonMaster",
          level: 42,
          xp: 15600,
          title: "Elite Trainer",
          joinDate: new Date("2023-01-15"),
          stats: { pokemonSeen: 650, teamsCreated: 23, battlesWon: 156, achievements: 34 },
          badges: ["Dragon Tamer", "Speed Demon"],
          favoriteTypes: ["dragon", "flying"],
        },
        pokemon: [], // Would be populated with actual Pokemon
        likes: 127,
        comments: 23,
        isLiked: false,
        visibility: "public",
        tags: ["competitive", "dragons", "meta"],
        createdAt: new Date("2024-01-10"),
      },
      {
        id: "2",
        name: "Balanced Starter Squad",
        description: "Perfect team for beginners featuring starter Pokemon from different regions.",
        author: {
          id: "user2",
          username: "ProfessorOak",
          level: 67,
          xp: 28900,
          title: "Pokemon Professor",
          joinDate: new Date("2022-08-20"),
          stats: { pokemonSeen: 890, teamsCreated: 45, battlesWon: 234, achievements: 67 },
          badges: ["Researcher", "Mentor", "Starter Specialist"],
          favoriteTypes: ["grass", "fire", "water"],
        },
        pokemon: [],
        likes: 89,
        comments: 15,
        isLiked: true,
        visibility: "public",
        tags: ["beginner", "starters", "balanced"],
        createdAt: new Date("2024-01-08"),
      },
    ]
    setSharedTeams(mockSharedTeams)
  }, [])

  const handleLikeTeam = (teamId: string) => {
    setSharedTeams((prev) =>
      prev.map((team) =>
        team.id === teamId
          ? {
              ...team,
              likes: team.isLiked ? team.likes - 1 : team.likes + 1,
              isLiked: !team.isLiked,
            }
          : team,
      ),
    )
  }

  const handleShareTeam = () => {
    // Implementation for sharing a team
    console.log("Sharing team:", newTeamShare)
  }

  const getUserLevelInfo = (xp: number) => {
    const level = Math.floor(xp / 500) + 1
    const currentLevelXP = xp % 500
    const nextLevelXP = 500
    const progress = (currentLevelXP / nextLevelXP) * 100

    return { level, currentLevelXP, nextLevelXP, progress }
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
          <Users className="w-8 h-8 text-blue-600" />
          Social Hub
        </h2>
        <p className="text-gray-600 mb-8">Connect with trainers, share teams, and discover new strategies</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
          {[
            { key: "profile", label: "Profile", icon: Users },
            { key: "community", label: "Community", icon: Globe },
            { key: "share", label: "Share Team", icon: Share2 },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                activeTab === key ? "bg-white shadow-sm text-blue-600 font-medium" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* User Profile Card */}
          <Card className="lg:col-span-1">
            <CardHeader className="text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src={currentUser.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {currentUser.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl">{currentUser.username}</CardTitle>
              <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">{currentUser.title}</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Level Progress */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Level {getUserLevelInfo(currentUser.xp).level}</span>
                  <span>
                    {getUserLevelInfo(currentUser.xp).currentLevelXP}/{getUserLevelInfo(currentUser.xp).nextLevelXP} XP
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all"
                    style={{ width: `${getUserLevelInfo(currentUser.xp).progress}%` }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">{currentUser.stats.pokemonSeen}</div>
                  <div className="text-xs text-gray-600">Pokémon Seen</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-lg font-bold text-green-600">{currentUser.stats.teamsCreated}</div>
                  <div className="text-xs text-gray-600">Teams Created</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-lg font-bold text-purple-600">{currentUser.stats.battlesWon}</div>
                  <div className="text-xs text-gray-600">Battles Won</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-lg font-bold text-orange-600">{currentUser.stats.achievements}</div>
                  <div className="text-xs text-gray-600">Achievements</div>
                </div>
              </div>

              {/* Badges */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Badges</h4>
                <div className="flex flex-wrap gap-2">
                  {currentUser.badges.map((badge) => (
                    <Badge key={badge} variant="outline" className="text-xs">
                      <Trophy className="w-3 h-3 mr-1" />
                      {badge}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Favorite Types */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Favorite Types</h4>
                <div className="flex flex-wrap gap-2">
                  {currentUser.favoriteTypes.map((type) => (
                    <Badge key={type} className="text-xs capitalize">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <Trophy className="w-5 h-5 text-green-600" />
                    <div className="flex-1">
                      <div className="font-medium">Achievement Unlocked!</div>
                      <div className="text-sm text-gray-600">Earned "Team Builder" badge</div>
                    </div>
                    <div className="text-xs text-gray-500">2 hours ago</div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600" />
                    <div className="flex-1">
                      <div className="font-medium">Team Shared</div>
                      <div className="text-sm text-gray-600">Shared "Balanced Starters" with the community</div>
                    </div>
                    <div className="text-xs text-gray-500">1 day ago</div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <Star className="w-5 h-5 text-purple-600" />
                    <div className="flex-1">
                      <div className="font-medium">Level Up!</div>
                      <div className="text-sm text-gray-600">Reached Level {currentUser.level}</div>
                    </div>
                    <div className="text-xs text-gray-500">3 days ago</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Community Tab */}
      {activeTab === "community" && (
        <div className="space-y-6">
          {/* Community Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">1,247</div>
                <div className="text-sm text-gray-600">Active Trainers</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">3,891</div>
                <div className="text-sm text-gray-600">Shared Teams</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">12,456</div>
                <div className="text-sm text-gray-600">Team Likes</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">2,134</div>
                <div className="text-sm text-gray-600">Comments</div>
              </CardContent>
            </Card>
          </div>

          {/* Shared Teams */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Community Teams</h3>
            {sharedTeams.map((team) => (
              <Card key={team.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={team.author.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          {team.author.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">{team.author.username}</div>
                        <div className="text-sm text-gray-600">{team.author.title}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">{team.createdAt.toLocaleDateString()}</div>
                      <Badge variant="outline" className="mt-1">
                        <Eye className="w-3 h-3 mr-1" />
                        {team.visibility}
                      </Badge>
                    </div>
                  </div>

                  <h4 className="text-lg font-semibold mb-2">{team.name}</h4>
                  <p className="text-gray-600 mb-4">{team.description}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {team.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLikeTeam(team.id)}
                        className={`flex items-center gap-2 px-3 py-1 rounded-full transition-colors ${
                          team.isLiked
                            ? "bg-red-100 text-red-600"
                            : "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600"
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${team.isLiked ? "fill-current" : ""}`} />
                        {team.likes}
                      </button>
                      <button className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        {team.comments}
                      </button>
                    </div>
                    <Button variant="outline" size="sm">
                      View Team
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Share Team Tab */}
      {activeTab === "share" && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              Share Your Team
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Select Team</label>
              <select
                className="w-full p-3 border rounded-lg"
                value={newTeamShare.teamId}
                onChange={(e) => setNewTeamShare((prev) => ({ ...prev, teamId: e.target.value }))}
              >
                <option value="">Choose a team to share...</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                placeholder="Describe your team strategy, strengths, and how others can use it..."
                value={newTeamShare.description}
                onChange={(e) => setNewTeamShare((prev) => ({ ...prev, description: e.target.value }))}
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Visibility</label>
              <div className="flex gap-3">
                {[
                  { key: "public", label: "Public", icon: Globe, desc: "Everyone can see" },
                  { key: "friends", label: "Friends", icon: Users, desc: "Friends only" },
                  { key: "private", label: "Private", icon: Lock, desc: "Only you" },
                ].map(({ key, label, icon: Icon, desc }) => (
                  <button
                    key={key}
                    onClick={() => setNewTeamShare((prev) => ({ ...prev, visibility: key as any }))}
                    className={`flex-1 p-3 border rounded-lg text-center transition-colors ${
                      newTeamShare.visibility === key
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="w-5 h-5 mx-auto mb-1" />
                    <div className="font-medium">{label}</div>
                    <div className="text-xs text-gray-500">{desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <Input
                placeholder="competitive, beginner, dragons (comma separated)"
                onChange={(e) =>
                  setNewTeamShare((prev) => ({
                    ...prev,
                    tags: e.target.value
                      .split(",")
                      .map((tag) => tag.trim())
                      .filter(Boolean),
                  }))
                }
              />
            </div>

            <Button
              onClick={handleShareTeam}
              className="w-full gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={!newTeamShare.teamId || !newTeamShare.description}
            >
              <Share2 className="w-4 h-4" />
              Share Team with Community
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
