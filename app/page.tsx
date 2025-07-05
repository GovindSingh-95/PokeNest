"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Sparkles, Search, GitCompare, Map, Home } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-orange-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                <div className="w-5 h-5 bg-white rounded-full"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">PokéNest</h1>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="flex items-center gap-2 text-orange-600 font-medium hover:text-orange-700 transition-colors"
              >
                <Home className="w-4 h-4" />
                Home
              </Link>
              <Link
                href="/explore"
                className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors"
              >
                <Search className="w-4 h-4" />
                Pokédex
              </Link>
              <Link
                href="/explore?tab=comparison"
                className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors"
              >
                <GitCompare className="w-4 h-4" />
                Compare
              </Link>
              <Link
                href="/explore?tab=regions"
                className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors"
              >
                <Map className="w-4 h-4" />
                Regions
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button variant="ghost" size="sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            {/* Main Logo */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-2xl">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-orange-500" />
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-pink-400 rounded-full animate-bounce"></div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                PokéNest
              </span>
            </h1>

            {/* Tagline */}
            <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed">
              A cozy, clean home for all your <span className="font-semibold text-orange-600">Pokémon discoveries</span>
            </p>

            {/* CTA Button */}
            <div className="mb-16">
              <Link href="/explore">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 gap-3"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  Explore Pokémon
                  <ArrowRight className={`w-5 h-5 transition-transform ${isHovered ? "translate-x-1" : ""}`} />
                </Button>
              </Link>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="bg-white/70 backdrop-blur-sm border-orange-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Discover</h3>
                <p className="text-gray-600 text-sm">
                  Explore thousands of Pokémon with detailed information, stats, and beautiful artwork
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-orange-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GitCompare className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Compare</h3>
                <p className="text-gray-600 text-sm">
                  Side-by-side comparisons of stats, types, and abilities to help you make informed decisions
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-orange-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Map className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Explore</h3>
                <p className="text-gray-600 text-sm">
                  Journey through different regions and generations to discover Pokémon from every era
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Stats Section */}
          <div className="mt-20 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Your Pokémon Journey Awaits</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">1000+</div>
                <div className="text-gray-600 text-sm">Pokémon</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">18</div>
                <div className="text-gray-600 text-sm">Types</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">9</div>
                <div className="text-gray-600 text-sm">Regions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">9</div>
                <div className="text-gray-600 text-sm">Generations</div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-pink-200 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute bottom-20 left-20 w-12 h-12 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-40 right-10 w-24 h-24 bg-green-200 rounded-full opacity-20 animate-bounce"></div>
      </main>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-orange-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <span className="font-semibold text-gray-900">PokéNest</span>
          </div>
          <p className="text-gray-600 text-sm">Made with ❤️ for Pokémon trainers everywhere</p>
          <div className="mt-4">
            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
              Powered by PokéAPI
            </Badge>
          </div>
        </div>
      </footer>
    </div>
  )
}
