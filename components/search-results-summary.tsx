"use client"

import { Badge } from "@/components/ui/badge"
import { Search, Filter } from "lucide-react"

interface SearchResultsSummaryProps {
  totalResults: number
  searchTerm: string
  selectedType: string
  totalPokemon: number
}

export function SearchResultsSummary({
  totalResults,
  searchTerm,
  selectedType,
  totalPokemon,
}: SearchResultsSummaryProps) {
  const hasFilters = searchTerm || selectedType !== "all"

  if (!hasFilters) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-600">
          Showing <span className="font-semibold">{totalResults}</span> of{" "}
          <span className="font-semibold">{totalPokemon}</span> Pokémon
        </p>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">
            Found <span className="font-bold">{totalResults}</span> Pokémon
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {searchTerm && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-300">
              <Search className="w-3 h-3 mr-1" />"{searchTerm}"
            </Badge>
          )}
          {selectedType !== "all" && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-300">
              <Filter className="w-3 h-3 mr-1" />
              {selectedType === "multiple"
                ? "Multiple Types"
                : selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}
            </Badge>
          )}
        </div>
      </div>

      {totalResults === 0 && (
        <div className="mt-3 pt-3 border-t border-blue-200">
          <p className="text-sm text-blue-700">
            Try adjusting your search terms or removing some filters to see more results.
          </p>
        </div>
      )}
    </div>
  )
}
