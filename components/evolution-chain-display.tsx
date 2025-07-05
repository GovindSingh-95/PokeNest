"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Zap, Heart, Sun, Moon, Swords, Shield, ArrowUpDown } from "lucide-react"
import { PokemonImage } from "@/components/pokemon-image"
import type { EvolutionChain } from "@/types/pokemon"

interface EvolutionChainDisplayProps {
  evolutionChain: EvolutionChain
  currentPokemonId: number
}

export function EvolutionChainDisplay({ evolutionChain, currentPokemonId }: EvolutionChainDisplayProps) {
  const getMethodIcon = (method?: string) => {
    if (!method) return null

    const methodLower = method.toLowerCase()

    if (methodLower.includes("stone")) {
      return <Zap className="w-3 h-3" />
    }
    if (methodLower.includes("friendship") || methodLower.includes("affection")) {
      return <Heart className="w-3 h-3" />
    }
    if (methodLower.includes("day")) {
      return <Sun className="w-3 h-3" />
    }
    if (methodLower.includes("night")) {
      return <Moon className="w-3 h-3" />
    }
    if (methodLower.includes("attack") && methodLower.includes("defense")) {
      return <ArrowUpDown className="w-3 h-3" />
    }
    if (methodLower.includes("attack")) {
      return <Swords className="w-3 h-3" />
    }
    if (methodLower.includes("defense")) {
      return <Shield className="w-3 h-3" />
    }

    return null
  }

  const getMethodColor = (method?: string) => {
    if (!method) return "bg-gray-100 text-gray-600"

    const methodLower = method.toLowerCase()

    if (methodLower.includes("stone")) {
      return "bg-yellow-100 text-yellow-800"
    }
    if (methodLower.includes("friendship") || methodLower.includes("affection")) {
      return "bg-pink-100 text-pink-800"
    }
    if (methodLower.includes("trade")) {
      return "bg-blue-100 text-blue-800"
    }
    if (methodLower.includes("level")) {
      return "bg-green-100 text-green-800"
    }

    return "bg-gray-100 text-gray-600"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <ArrowRight className="w-5 h-5" />
          Evolution Chain
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {/* Stage 1 */}
          <div className="text-center">
            <div
              className={`w-20 h-20 rounded-lg flex items-center justify-center mb-2 transition-all ${
                currentPokemonId === evolutionChain.stage1.id ? "bg-blue-100 ring-2 ring-blue-500" : "bg-gray-50"
              }`}
            >
              <PokemonImage
                src={evolutionChain.stage1.image}
                alt={evolutionChain.stage1.name}
                width={60}
                height={60}
                className="object-contain"
                pokemonId={evolutionChain.stage1.id}
              />
            </div>
            <div className="text-sm font-medium">{evolutionChain.stage1.name}</div>
            <div className="text-xs text-gray-500">#{evolutionChain.stage1.id.toString().padStart(3, "0")}</div>
          </div>

          {/* Arrow and Evolution Method for Stage 2 */}
          {evolutionChain.stage2 && (
            <>
              <div className="flex flex-col items-center">
                <ArrowRight className="w-6 h-6 text-gray-400 mb-1" />
                <Badge
                  variant="secondary"
                  className={`text-xs px-2 py-1 flex items-center gap-1 ${getMethodColor(evolutionChain.stage2.method)}`}
                >
                  {getMethodIcon(evolutionChain.stage2.method)}
                  <span className="max-w-20 truncate">{evolutionChain.stage2.method || "Unknown"}</span>
                </Badge>
              </div>

              {/* Stage 2 */}
              <div className="text-center">
                <div
                  className={`w-20 h-20 rounded-lg flex items-center justify-center mb-2 transition-all ${
                    currentPokemonId === evolutionChain.stage2.id ? "bg-blue-100 ring-2 ring-blue-500" : "bg-gray-50"
                  }`}
                >
                  <PokemonImage
                    src={evolutionChain.stage2.image}
                    alt={evolutionChain.stage2.name}
                    width={60}
                    height={60}
                    className="object-contain"
                    pokemonId={evolutionChain.stage2.id}
                  />
                </div>
                <div className="text-sm font-medium">{evolutionChain.stage2.name}</div>
                <div className="text-xs text-gray-500">#{evolutionChain.stage2.id.toString().padStart(3, "0")}</div>
              </div>
            </>
          )}

          {/* Arrow and Evolution Method for Stage 3 */}
          {evolutionChain.stage3 && (
            <>
              <div className="flex flex-col items-center">
                <ArrowRight className="w-6 h-6 text-gray-400 mb-1" />
                <Badge
                  variant="secondary"
                  className={`text-xs px-2 py-1 flex items-center gap-1 ${getMethodColor(evolutionChain.stage3.method)}`}
                >
                  {getMethodIcon(evolutionChain.stage3.method)}
                  <span className="max-w-20 truncate">{evolutionChain.stage3.method || "Unknown"}</span>
                </Badge>
              </div>

              {/* Stage 3 */}
              <div className="text-center">
                <div
                  className={`w-20 h-20 rounded-lg flex items-center justify-center mb-2 transition-all ${
                    currentPokemonId === evolutionChain.stage3.id ? "bg-blue-100 ring-2 ring-blue-500" : "bg-gray-50"
                  }`}
                >
                  <PokemonImage
                    src={evolutionChain.stage3.image}
                    alt={evolutionChain.stage3.name}
                    width={60}
                    height={60}
                    className="object-contain"
                    pokemonId={evolutionChain.stage3.id}
                  />
                </div>
                <div className="text-sm font-medium">{evolutionChain.stage3.name}</div>
                <div className="text-xs text-gray-500">#{evolutionChain.stage3.id.toString().padStart(3, "0")}</div>
              </div>
            </>
          )}
        </div>

        {/* Evolution Requirements Summary */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Evolution Requirements</h4>
          <div className="space-y-2">
            {evolutionChain.stage2 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  {evolutionChain.stage1.name} → {evolutionChain.stage2.name}
                </span>
                <Badge variant="outline" className="text-xs">
                  {evolutionChain.stage2.method || "Unknown"}
                </Badge>
              </div>
            )}
            {evolutionChain.stage3 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  {evolutionChain.stage2?.name} → {evolutionChain.stage3.name}
                </span>
                <Badge variant="outline" className="text-xs">
                  {evolutionChain.stage3.method || "Unknown"}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
