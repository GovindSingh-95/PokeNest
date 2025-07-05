import { PokemonLoadingProgress } from "@/components/pokemon-loading"

export default function Loading() {
  return (
    <PokemonLoadingProgress
      progress={{
        current: 0,
        total: 1000,
        currentRegion: "Kanto",
      }}
    />
  )
}
