"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PokemonImage } from "@/components/pokemon-image"
import { MapPin } from "lucide-react"
import type { Pokemon } from "@/types/pokemon"

interface PokemonCardProps {
  pokemon: Pokemon
  onClick: () => void
}

const typeColors: Record<string, string> = {
  normal: "bg-gray-400",
  fire: "bg-red-500",
  water: "bg-blue-500",
  electric: "bg-yellow-400 text-gray-900",
  grass: "bg-green-500",
  ice: "bg-cyan-300 text-gray-900",
  fighting: "bg-red-700",
  poison: "bg-purple-500",
  ground: "bg-yellow-600",
  flying: "bg-indigo-400",
  psychic: "bg-pink-500",
  bug: "bg-green-400 text-gray-900",
  rock: "bg-yellow-800",
  ghost: "bg-purple-700",
  dragon: "bg-indigo-700",
  dark: "bg-gray-800",
  steel: "bg-gray-500",
  fairy: "bg-pink-300 text-gray-900",
}

export function PokemonCard({ pokemon, onClick }: PokemonCardProps) {
  return (
    <Card
      className="cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg bg-white/80 backdrop-blur-sm border-orange-200 hover:border-orange-300"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="text-center space-y-3">
          <div className="relative">
            <div className="w-full h-32 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg flex items-center justify-center mb-2">
              <PokemonImage
                src={pokemon.image}
                alt={pokemon.name}
                width={120}
                height={120}
                className="object-contain"
                pokemonId={pokemon.id}
              />
            </div>
            <Badge variant="secondary" className="absolute top-2 right-2 text-xs bg-orange-100 text-orange-800">
              #{pokemon.id.toString().padStart(3, "0")}
            </Badge>
          </div>

          <h3 className="font-semibold text-lg text-gray-900 mb-2">{pokemon.name}</h3>

          <div className="flex flex-wrap gap-1 justify-center mb-3">
            {pokemon.types.map((type) => (
              <Badge key={type} className={`text-xs font-medium ${typeColors[type] || "bg-gray-400 text-white"}`}>
                {type.toUpperCase()}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-center gap-1 text-xs text-gray-600">
            <MapPin className="w-3 h-3" />
            <span>{pokemon.region}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
