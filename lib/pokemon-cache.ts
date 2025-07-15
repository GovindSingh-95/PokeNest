// Advanced caching system with multiple layers
interface CacheEntry<T> {
  data: T
  timestamp: number
  expiresAt: number
}

interface CacheStats {
  hits: number
  misses: number
  size: number
}

class PokemonCache {
  private memoryCache = new Map<string, CacheEntry<any>>()
  private stats: CacheStats = { hits: 0, misses: 0, size: 0 }
  private readonly DEFAULT_TTL = 5 * 60 * 1000 // 5 minutes
  private readonly MAX_CACHE_SIZE = 1000

  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    // Implement LRU eviction if cache is full
    if (this.memoryCache.size >= this.MAX_CACHE_SIZE) {
      const oldestKey = this.memoryCache.keys().next().value
      this.memoryCache.delete(oldestKey)
    }

    const now = Date.now()
    this.memoryCache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + ttl,
    })
    this.stats.size = this.memoryCache.size
  }

  get<T>(key: string): T | null {
    const entry = this.memoryCache.get(key)

    if (!entry) {
      this.stats.misses++
      return null
    }

    if (Date.now() > entry.expiresAt) {
      this.memoryCache.delete(key)
      this.stats.misses++
      this.stats.size = this.memoryCache.size
      return null
    }

    this.stats.hits++
    return entry.data
  }

  has(key: string): boolean {
    const entry = this.memoryCache.get(key)
    return entry ? Date.now() <= entry.expiresAt : false
  }

  clear(): void {
    this.memoryCache.clear()
    this.stats = { hits: 0, misses: 0, size: 0 }
  }

  getStats(): CacheStats {
    return { ...this.stats }
  }

  // Preload critical data
  async preloadCriticalData(): Promise<void> {
    const criticalPokemonIds = [1, 4, 7, 25, 150, 151] // Popular Pokemon

    for (const id of criticalPokemonIds) {
      if (!this.has(`pokemon-${id}`)) {
        try {
          const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
          if (response.ok) {
            const data = await response.json()
            this.set(`pokemon-${id}`, data, 30 * 60 * 1000) // 30 minutes for critical data
          }
        } catch (error) {
          console.warn(`Failed to preload Pokemon ${id}:`, error)
        }
      }
    }
  }
}

export const pokemonCache = new PokemonCache()

// Browser storage cache for persistence
export class PersistentCache {
  private static readonly STORAGE_KEY = "pokemon-cache"
  private static readonly VERSION = "1.0"

  static save(key: string, data: any, ttl: number = 24 * 60 * 60 * 1000): void {
    if (typeof window === "undefined") return

    try {
      const cacheData = {
        version: this.VERSION,
        data,
        timestamp: Date.now(),
        expiresAt: Date.now() + ttl,
      }

      localStorage.setItem(`${this.STORAGE_KEY}-${key}`, JSON.stringify(cacheData))
    } catch (error) {
      console.warn("Failed to save to localStorage:", error)
    }
  }

  static load<T>(key: string): T | null {
    if (typeof window === "undefined") return null

    try {
      const cached = localStorage.getItem(`${this.STORAGE_KEY}-${key}`)
      if (!cached) return null

      const cacheData = JSON.parse(cached)

      if (cacheData.version !== this.VERSION || Date.now() > cacheData.expiresAt) {
        localStorage.removeItem(`${this.STORAGE_KEY}-${key}`)
        return null
      }

      return cacheData.data
    } catch (error) {
      console.warn("Failed to load from localStorage:", error)
      return null
    }
  }

  static clear(): void {
    if (typeof window === "undefined") return

    try {
      const keys = Object.keys(localStorage).filter((key) => key.startsWith(this.STORAGE_KEY))
      keys.forEach((key) => localStorage.removeItem(key))
    } catch (error) {
      console.warn("Failed to clear localStorage:", error)
    }
  }
}
