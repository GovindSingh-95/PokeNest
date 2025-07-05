"use client"

interface TypeFilterButtonProps {
  type: string
  isSelected: boolean
  onClick: () => void
}

const typeColors: Record<string, { bg: string; text: string; border: string; hover: string }> = {
  normal: {
    bg: "bg-gray-400",
    text: "text-white",
    border: "border-gray-500",
    hover: "hover:bg-gray-500",
  },
  fire: {
    bg: "bg-red-500",
    text: "text-white",
    border: "border-red-600",
    hover: "hover:bg-red-600",
  },
  water: {
    bg: "bg-blue-500",
    text: "text-white",
    border: "border-blue-600",
    hover: "hover:bg-blue-600",
  },
  electric: {
    bg: "bg-yellow-400",
    text: "text-gray-900",
    border: "border-yellow-500",
    hover: "hover:bg-yellow-500",
  },
  grass: {
    bg: "bg-green-500",
    text: "text-white",
    border: "border-green-600",
    hover: "hover:bg-green-600",
  },
  ice: {
    bg: "bg-cyan-300",
    text: "text-gray-900",
    border: "border-cyan-400",
    hover: "hover:bg-cyan-400",
  },
  fighting: {
    bg: "bg-red-700",
    text: "text-white",
    border: "border-red-800",
    hover: "hover:bg-red-800",
  },
  poison: {
    bg: "bg-purple-500",
    text: "text-white",
    border: "border-purple-600",
    hover: "hover:bg-purple-600",
  },
  ground: {
    bg: "bg-yellow-600",
    text: "text-white",
    border: "border-yellow-700",
    hover: "hover:bg-yellow-700",
  },
  flying: {
    bg: "bg-indigo-400",
    text: "text-white",
    border: "border-indigo-500",
    hover: "hover:bg-indigo-500",
  },
  psychic: {
    bg: "bg-pink-500",
    text: "text-white",
    border: "border-pink-600",
    hover: "hover:bg-pink-600",
  },
  bug: {
    bg: "bg-green-400",
    text: "text-gray-900",
    border: "border-green-500",
    hover: "hover:bg-green-500",
  },
  rock: {
    bg: "bg-yellow-800",
    text: "text-white",
    border: "border-yellow-900",
    hover: "hover:bg-yellow-900",
  },
  ghost: {
    bg: "bg-purple-700",
    text: "text-white",
    border: "border-purple-800",
    hover: "hover:bg-purple-800",
  },
  dragon: {
    bg: "bg-indigo-700",
    text: "text-white",
    border: "border-indigo-800",
    hover: "hover:bg-indigo-800",
  },
  dark: {
    bg: "bg-gray-800",
    text: "text-white",
    border: "border-gray-900",
    hover: "hover:bg-gray-900",
  },
  steel: {
    bg: "bg-gray-500",
    text: "text-white",
    border: "border-gray-600",
    hover: "hover:bg-gray-600",
  },
  fairy: {
    bg: "bg-pink-300",
    text: "text-gray-900",
    border: "border-pink-400",
    hover: "hover:bg-pink-400",
  },
}

export function TypeFilterButton({ type, isSelected, onClick }: TypeFilterButtonProps) {
  const colors = typeColors[type] || typeColors.normal
  const typeName = type.charAt(0).toUpperCase() + type.slice(1)

  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 border-2
        ${colors.bg} ${colors.text} ${colors.border} ${colors.hover}
        ${
          isSelected
            ? "ring-2 ring-offset-2 ring-blue-500 scale-105 shadow-lg"
            : "hover:scale-105 hover:shadow-md opacity-80 hover:opacity-100"
        }
      `}
    >
      {typeName}
    </button>
  )
}
