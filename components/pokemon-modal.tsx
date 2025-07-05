import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { Pokemon } from "@/types/pokemon"
import { PokemonImage } from "@/components/pokemon-image"
import { EvolutionChainDisplay } from "@/components/evolution-chain-display"

interface PokemonModalProps {
  pokemon: Pokemon | null
  isOpen: boolean
  onClose: () => void
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

export function PokemonModal({ pokemon, isOpen, onClose }: PokemonModalProps) {
  if (!pokemon) return null

  const maxStat = 255 // Maximum possible stat value for progress bars

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-2xl font-bold">{pokemon.name}</span>
            <Badge variant="secondary" className="text-sm">
              #{pokemon.id.toString().padStart(3, "0")}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Pokemon Image and Basic Info */}
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <PokemonImage
                src={pokemon.image || "/placeholder.svg"}
                alt={pokemon.name}
                width={200}
                height={200}
                className="mx-auto object-contain"
                pokemonId={pokemon.id}
              />
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {pokemon.types.map((type) => (
                <Badge key={type} className={`font-medium ${typeColors[type] || "bg-gray-400 text-white"}`}>
                  {type.toUpperCase()}
                </Badge>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm text-gray-600">Height</div>
                <div className="font-semibold">{pokemon.height}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm text-gray-600">Weight</div>
                <div className="font-semibold">{pokemon.weight}</div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-sm text-gray-600">Region</div>
              <div className="font-semibold">
                {pokemon.region} (Generation {pokemon.generation})
              </div>
            </div>
          </div>

          {/* Stats and Description */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed">{pokemon.description}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Base Stats</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">HP</span>
                    <span>{pokemon.stats.hp}</span>
                  </div>
                  <Progress value={(pokemon.stats.hp / maxStat) * 100} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">Attack</span>
                    <span>{pokemon.stats.attack}</span>
                  </div>
                  <Progress value={(pokemon.stats.attack / maxStat) * 100} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">Defense</span>
                    <span>{pokemon.stats.defense}</span>
                  </div>
                  <Progress value={(pokemon.stats.defense / maxStat) * 100} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">Sp. Attack</span>
                    <span>{pokemon.stats.specialAttack}</span>
                  </div>
                  <Progress value={(pokemon.stats.specialAttack / maxStat) * 100} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">Sp. Defense</span>
                    <span>{pokemon.stats.specialDefense}</span>
                  </div>
                  <Progress value={(pokemon.stats.specialDefense / maxStat) * 100} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">Speed</span>
                    <span>{pokemon.stats.speed}</span>
                  </div>
                  <Progress value={(pokemon.stats.speed / maxStat) * 100} className="h-2" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Evolution Chain */}
        {pokemon.evolutionChain && (
          <div className="mt-8">
            <EvolutionChainDisplay evolutionChain={pokemon.evolutionChain} currentPokemonId={pokemon.id} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
