"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, Swords, Shield, RotateCcw, Plus, X } from "lucide-react"
import { TypeBadge } from "@/components/type-badge"
import { processTypeMatchup, processDualTypeMatchup } from "@/lib/type-matchup-api"
import type { ProcessedTypeMatchup, DualTypeMatchup } from "@/types/type-matchup"

const pokemonTypes = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
]

export function TypeMatchupCalculator() {
  const [selectedType1, setSelectedType1] = useState<string>("")
  const [selectedType2, setSelectedType2] = useState<string>("")
  const [isDualType, setIsDualType] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [singleTypeMatchup, setSingleTypeMatchup] = useState<ProcessedTypeMatchup | null>(null)
  const [dualTypeMatchup, setDualTypeMatchup] = useState<DualTypeMatchup | null>(null)

  const handleCalculate = async () => {
    if (!selectedType1) return

    setLoading(true)
    setError(null)
    setSingleTypeMatchup(null)
    setDualTypeMatchup(null)

    try {
      if (isDualType && selectedType2) {
        const result = await processDualTypeMatchup(selectedType1, selectedType2)
        setDualTypeMatchup(result)
      } else {
        const result = await processTypeMatchup(selectedType1)
        setSingleTypeMatchup(result)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to calculate type matchups")
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setSelectedType1("")
    setSelectedType2("")
    setIsDualType(false)
    setSingleTypeMatchup(null)
    setDualTypeMatchup(null)
    setError(null)
  }

  useEffect(() => {
    if (selectedType1 && (!isDualType || selectedType2)) {
      handleCalculate()
    }
  }, [selectedType1, selectedType2, isDualType])

  const EffectivenessSection = ({
    title,
    types,
    effectiveness,
    icon,
  }: {
    title: string
    types: string[]
    effectiveness: string
    icon: React.ReactNode
  }) => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {icon}
        <h4 className="font-semibold text-gray-700">{title}</h4>
        <Badge variant="outline" className="text-xs">
          {effectiveness}
        </Badge>
      </div>
      <div className="flex flex-wrap gap-2">
        {types.length > 0 ? (
          types.map((type) => <TypeBadge key={type} type={type} size="sm" />)
        ) : (
          <span className="text-gray-500 text-sm italic">None</span>
        )}
      </div>
    </div>
  )

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Type Matchup Calculator</h2>
        <p className="text-gray-600 mb-8">
          Calculate type effectiveness for offensive and defensive matchups using real PokéAPI data
        </p>
      </div>

      {/* Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Select Type(s)</span>
            <div className="flex items-center gap-2">
              <Button
                variant={isDualType ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setIsDualType(!isDualType)
                  if (!isDualType) setSelectedType2("")
                }}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Dual Type
              </Button>
              {(selectedType1 || selectedType2) && (
                <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </Button>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Primary Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">{isDualType ? "Primary Type" : "Type"}</label>
              <Select value={selectedType1} onValueChange={setSelectedType1}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a type..." />
                </SelectTrigger>
                <SelectContent>
                  {pokemonTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      <div className="flex items-center gap-2">
                        <TypeBadge type={type} size="sm" />
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Secondary Type */}
            {isDualType && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Secondary Type</label>
                <Select value={selectedType2} onValueChange={setSelectedType2}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a second type..." />
                  </SelectTrigger>
                  <SelectContent>
                    {pokemonTypes
                      .filter((type) => type !== selectedType1)
                      .map((type) => (
                        <SelectItem key={type} value={type}>
                          <div className="flex items-center gap-2">
                            <TypeBadge type={type} size="sm" />
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Selected Types Display */}
          {selectedType1 && (
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Selected:</span>
              <TypeBadge type={selectedType1} />
              {isDualType && selectedType2 && (
                <>
                  <X className="w-4 h-4 text-gray-400" />
                  <TypeBadge type={selectedType2} />
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <span className="text-gray-600">Calculating type matchups...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <p className="font-medium">Error calculating matchups</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Single Type Results */}
      {singleTypeMatchup && !loading && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Offensive Matchups */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Swords className="w-5 h-5 text-red-600" />
                Offensive Matchups
                <TypeBadge type={singleTypeMatchup.type} size="sm" />
              </CardTitle>
              <p className="text-sm text-gray-600">
                How effective <TypeBadge type={singleTypeMatchup.type} size="sm" className="mx-1" />
                type moves are against other types
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <EffectivenessSection
                title="Super Effective Against"
                types={singleTypeMatchup.offensive.superEffective}
                effectiveness="2× damage"
                icon={<div className="w-3 h-3 bg-green-500 rounded-full" />}
              />
              <EffectivenessSection
                title="Not Very Effective Against"
                types={singleTypeMatchup.offensive.notVeryEffective}
                effectiveness="0.5× damage"
                icon={<div className="w-3 h-3 bg-orange-500 rounded-full" />}
              />
              <EffectivenessSection
                title="No Effect Against"
                types={singleTypeMatchup.offensive.noEffect}
                effectiveness="0× damage"
                icon={<div className="w-3 h-3 bg-red-500 rounded-full" />}
              />
            </CardContent>
          </Card>

          {/* Defensive Matchups */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Defensive Matchups
                <TypeBadge type={singleTypeMatchup.type} size="sm" />
              </CardTitle>
              <p className="text-sm text-gray-600">
                How other types affect <TypeBadge type={singleTypeMatchup.type} size="sm" className="mx-1" />
                type Pokémon
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <EffectivenessSection
                title="Weak To"
                types={singleTypeMatchup.defensive.weakTo}
                effectiveness="Takes 2× damage"
                icon={<div className="w-3 h-3 bg-red-500 rounded-full" />}
              />
              <EffectivenessSection
                title="Resistant To"
                types={singleTypeMatchup.defensive.resistantTo}
                effectiveness="Takes 0.5× damage"
                icon={<div className="w-3 h-3 bg-green-500 rounded-full" />}
              />
              <EffectivenessSection
                title="Immune To"
                types={singleTypeMatchup.defensive.immuneTo}
                effectiveness="Takes 0× damage"
                icon={<div className="w-3 h-3 bg-blue-500 rounded-full" />}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Dual Type Results */}
      {dualTypeMatchup && !loading && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Offensive Matchups */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Swords className="w-5 h-5 text-red-600" />
                Offensive Matchups
                <div className="flex items-center gap-1">
                  <TypeBadge type={dualTypeMatchup.types[0]} size="sm" />
                  <X className="w-3 h-3 text-gray-400" />
                  <TypeBadge type={dualTypeMatchup.types[1]} size="sm" />
                </div>
              </CardTitle>
              <p className="text-sm text-gray-600">Combined offensive capabilities of both types</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <EffectivenessSection
                title="Super Effective Against"
                types={dualTypeMatchup.offensive.superEffective}
                effectiveness="2× damage"
                icon={<div className="w-3 h-3 bg-green-500 rounded-full" />}
              />
              <EffectivenessSection
                title="Not Very Effective Against"
                types={dualTypeMatchup.offensive.notVeryEffective}
                effectiveness="0.5× damage"
                icon={<div className="w-3 h-3 bg-orange-500 rounded-full" />}
              />
              <EffectivenessSection
                title="No Effect Against"
                types={dualTypeMatchup.offensive.noEffect}
                effectiveness="0× damage"
                icon={<div className="w-3 h-3 bg-red-500 rounded-full" />}
              />
            </CardContent>
          </Card>

          {/* Defensive Matchups */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Defensive Matchups
                <div className="flex items-center gap-1">
                  <TypeBadge type={dualTypeMatchup.types[0]} size="sm" />
                  <X className="w-3 h-3 text-gray-400" />
                  <TypeBadge type={dualTypeMatchup.types[1]} size="sm" />
                </div>
              </CardTitle>
              <p className="text-sm text-gray-600">Combined defensive resistances and weaknesses</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {dualTypeMatchup.defensive.doubleWeakTo.length > 0 && (
                <EffectivenessSection
                  title="Double Weak To"
                  types={dualTypeMatchup.defensive.doubleWeakTo}
                  effectiveness="Takes 4× damage"
                  icon={<div className="w-3 h-3 bg-red-700 rounded-full" />}
                />
              )}
              <EffectivenessSection
                title="Weak To"
                types={dualTypeMatchup.defensive.weakTo}
                effectiveness="Takes 2× damage"
                icon={<div className="w-3 h-3 bg-red-500 rounded-full" />}
              />
              <EffectivenessSection
                title="Resistant To"
                types={dualTypeMatchup.defensive.resistantTo}
                effectiveness="Takes 0.5× damage"
                icon={<div className="w-3 h-3 bg-green-500 rounded-full" />}
              />
              {dualTypeMatchup.defensive.doubleResistantTo.length > 0 && (
                <EffectivenessSection
                  title="Double Resistant To"
                  types={dualTypeMatchup.defensive.doubleResistantTo}
                  effectiveness="Takes 0.25× damage"
                  icon={<div className="w-3 h-3 bg-green-700 rounded-full" />}
                />
              )}
              <EffectivenessSection
                title="Immune To"
                types={dualTypeMatchup.defensive.immuneTo}
                effectiveness="Takes 0× damage"
                icon={<div className="w-3 h-3 bg-blue-500 rounded-full" />}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {!selectedType1 && !loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Swords className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Type Matchup Calculator</h3>
            <p className="text-gray-600">
              Select one or two Pokémon types above to see their offensive and defensive matchups
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
