"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Home, Search, GitCompare, Map, Trophy, X } from "lucide-react"
import Link from "next/link"

interface MobileNavigationProps {
  activeTab?: string
  onTabChange?: (tab: string) => void
}

export function MobileNavigation({ activeTab, onTabChange }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)

  const navigationItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/explore", label: "Pokédex", icon: Search, tab: "pokedex" },
    { href: "/explore?tab=comparison", label: "Compare", icon: GitCompare, tab: "comparison" },
    { href: "/explore?tab=regions", label: "Regions", icon: Map, tab: "regions" },
    { href: "/dashboard", label: "Dashboard", icon: Trophy },
  ]

  const handleNavigation = (item: (typeof navigationItems)[0]) => {
    if (item.tab && onTabChange) {
      onTabChange(item.tab)
    }
    setIsOpen(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-64">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <span className="font-bold text-gray-900">PokéNest</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.tab || (item.href === "/" && !activeTab)

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => handleNavigation(item)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-orange-100 text-orange-600 font-medium"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">Made with ❤️ for Pokémon trainers</div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
