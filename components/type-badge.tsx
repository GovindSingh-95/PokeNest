"use client"

import { Badge } from "@/components/ui/badge"

interface TypeBadgeProps {
  type: string
  size?: "sm" | "md" | "lg"
  className?: string
}

const typeColors: Record<string, { bg: string; text: string }> = {
  normal: { bg: "bg-gray-400", text: "text-white" },
  fire: { bg: "bg-red-500", text: "text-white" },
  water: { bg: "bg-blue-500", text: "text-white" },
  electric: { bg: "bg-yellow-400", text: "text-gray-900" },
  grass: { bg: "bg-green-500", text: "text-white" },
  ice: { bg: "bg-cyan-300", text: "text-gray-900" },
  fighting: { bg: "bg-red-700", text: "text-white" },
  poison: { bg: "bg-purple-500", text: "text-white" },
  ground: { bg: "bg-yellow-600", text: "text-white" },
  flying: { bg: "bg-indigo-400", text: "text-white" },
  psychic: { bg: "bg-pink-500", text: "text-white" },
  bug: { bg: "bg-green-400", text: "text-gray-900" },
  rock: { bg: "bg-yellow-800", text: "text-white" },
  ghost: { bg: "bg-purple-700", text: "text-white" },
  dragon: { bg: "bg-indigo-700", text: "text-white" },
  dark: { bg: "bg-gray-800", text: "text-white" },
  steel: { bg: "bg-gray-500", text: "text-white" },
  fairy: { bg: "bg-pink-300", text: "text-gray-900" },
}

const sizeClasses = {
  sm: "text-xs px-2 py-1",
  md: "text-sm px-3 py-1",
  lg: "text-base px-4 py-2",
}

export function TypeBadge({ type, size = "md", className = "" }: TypeBadgeProps) {
  const colors = typeColors[type.toLowerCase()] || typeColors.normal
  const typeName = type.charAt(0).toUpperCase() + type.slice(1)

  return (
    <Badge
      className={`
        ${colors.bg} ${colors.text} ${sizeClasses[size]} font-medium border-0
        ${className}
      `}
    >
      {typeName}
    </Badge>
  )
}
