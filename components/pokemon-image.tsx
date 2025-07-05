"use client"

import { useState } from "react"
import Image from "next/image"
import { ImageOff } from "lucide-react"

interface PokemonImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  pokemonId?: number
}

export function PokemonImage({ src, alt, width, height, className, pokemonId }: PokemonImageProps) {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const fallbackSrc = pokemonId
    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`
    : "/placeholder.svg"

  const handleError = () => {
    if (!imageError) {
      setImageError(true)
      setIsLoading(false)
    }
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  if (imageError && !pokemonId) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`} style={{ width, height }}>
        <ImageOff className="w-8 h-8 text-gray-400" />
      </div>
    )
  }

  return (
    <div className="relative">
      {isLoading && (
        <div
          className={`absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse ${className}`}
          style={{ width, height }}
        >
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        </div>
      )}
      <Image
        src={imageError ? fallbackSrc : src}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-200`}
        onError={handleError}
        onLoad={handleLoad}
        loading="lazy"
      />
    </div>
  )
}
