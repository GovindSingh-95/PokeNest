"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MapPin, Navigation, Clock, Star, Search } from "lucide-react"
import type { Pokemon } from "@/types/pokemon"

interface PokemonLocation {
  id: string
  name: string
  region: string
  area: string
  method: string[]
  rarity: "common" | "uncommon" | "rare" | "very-rare" | "legendary"
  timeOfDay: string[]
  season: string[]
  weather?: string[]
  level: string
  pokemon: Pokemon[]
}

interface LocationTrackerProps {
  pokemon: Pokemon[]
}

const mockLocations: PokemonLocation[] = [
  {
    id: "1",
    name: "Viridian Forest",
    region: "Kanto",
    area: "Forest",
    method: ["Walking", "Tall Grass"],
    rarity: "common",
    timeOfDay: ["Morning", "Day", "Night"],
    season: ["Spring", "Summer"],
    weather: ["Clear", "Rain"],
    level: "3-5",
    pokemon: [],
  },
  {
    id: "2",
    name: "Cerulean Cave",
    region: "Kanto",
    area: "Cave",
    method: ["Walking", "Surfing"],
    rarity: "legendary",
    timeOfDay: ["Any"],
    season: ["Any"],
    level: "70",
    pokemon: [],
  },
  {
    id: "3",
    name: "Route 1",
    region: "Kanto",
    area: "Route",
    method: ["Walking", "Tall Grass"],
    rarity: "common",
    timeOfDay: ["Any"],
    season: ["Any"],
    level: "2-4",
    pokemon: [],
  },
]

export function PokemonLocationTracker({ pokemon }: LocationTrackerProps) {
  const [locations, setLocations] = useState<PokemonLocation[]>(mockLocations)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRegion, setSelectedRegion] = useState<string>("all")
  const [selectedRarity, setSelectedRarity] = useState<string>("all")
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    // Get user's location for nearby suggestions
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => console.log("Location access denied"),
      )
    }
  }, [])

  const filteredLocations = locations.filter((location) => {
    const matchesSearch =
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.region.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRegion = selectedRegion === "all" || location.region === selectedRegion
    const matchesRarity = selectedRarity === "all" || location.rarity === selectedRarity

    return matchesSearch && matchesRegion && matchesRarity
  })

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-green-100 text-green-800"
      case "uncommon":
        return "bg-blue-100 text-blue-800"
      case "rare":
        return "bg-purple-100 text-purple-800"
      case "very-rare":
        return "bg-orange-100 text-orange-800"
      case "legendary":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case "walking":
        return "🚶"
      case "surfing":
        return "🏄"
      case "fishing":
        return "🎣"
      case "tall grass":
        return "🌾"
      default:
        return "📍"
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
          <MapPin className="w-8 h-8 text-green-600" />
          Location Tracker
        </h2>
        <p className="text-gray-600 mb-8">Find where to catch specific Pokémon in different regions</p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search locations or regions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="all">All Regions</option>
                <option value="Kanto">Kanto</option>
                <option value="Johto">Johto</option>
                <option value="Hoenn">Hoenn</option>
                <option value="Sinnoh">Sinnoh</option>
              </select>
            </div>

            <div>
              <select
                value={selectedRarity}
                onChange={(e) => setSelectedRarity(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="all">All Rarities</option>
                <option value="common">Common</option>
                <option value="uncommon">Uncommon</option>
                <option value="rare">Rare</option>
                <option value="very-rare">Very Rare</option>
                <option value="legendary">Legendary</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Location */}
      {userLocation && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Navigation className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-medium">Your Location Detected</div>
                <div className="text-sm text-gray-600">
                  Lat: {userLocation.lat.toFixed(4)}, Lng: {userLocation.lng.toFixed(4)}
                </div>
              </div>
              <Badge className="ml-auto bg-blue-100 text-blue-800">Nearby suggestions available</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Locations Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {filteredLocations.map((location) => (
          <Card key={location.id} className="border-l-4 border-l-green-500">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-green-600" />
                    {location.name}
                  </CardTitle>
                  <div className="text-sm text-gray-600 mt-1">
                    {location.region} • {location.area}
                  </div>
                </div>
                <Badge className={getRarityColor(location.rarity)}>{location.rarity}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Methods */}
              <div>
                <h4 className="font-semibold text-sm mb-2">Encounter Methods</h4>
                <div className="flex flex-wrap gap-2">
                  {location.method.map((method) => (
                    <Badge key={method} variant="outline" className="text-xs">
                      {getMethodIcon(method)} {method}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Time and Conditions */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-sm mb-2">Time of Day</h4>
                  <div className="flex flex-wrap gap-1">
                    {location.timeOfDay.map((time) => (
                      <Badge key={time} variant="secondary" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {time}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-2">Level Range</h4>
                  <Badge className="bg-orange-100 text-orange-800">Lv. {location.level}</Badge>
                </div>
              </div>

              {/* Weather Conditions */}
              {location.weather && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">Weather</h4>
                  <div className="flex flex-wrap gap-1">
                    {location.weather.map((weather) => (
                      <Badge key={weather} variant="outline" className="text-xs">
                        {weather === "Clear" ? "☀️" : weather === "Rain" ? "🌧️" : "🌤️"} {weather}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Seasons */}
              <div>
                <h4 className="font-semibold text-sm mb-2">Seasons</h4>
                <div className="flex flex-wrap gap-1">
                  {location.season.map((season) => (
                    <Badge key={season} variant="secondary" className="text-xs">
                      {season === "Spring" ? "🌸" : season === "Summer" ? "☀️" : season === "Fall" ? "🍂" : "❄️"} {season}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Star className="w-4 h-4 mr-2" />
                  Add to Favorites
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Navigation className="w-4 h-4 mr-2" />
                  Get Directions
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredLocations.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Locations Found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
