"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Camera, Maximize, RotateCcw, Zap, Smartphone } from "lucide-react"
import type { Pokemon } from "@/types/pokemon"

interface ARPokemonViewerProps {
  pokemon: Pokemon
  isOpen: boolean
  onClose: () => void
}

export function ARPokemonViewer({ pokemon, isOpen, onClose }: ARPokemonViewerProps) {
  const [isARSupported, setIsARSupported] = useState(false)
  const [isARActive, setIsARActive] = useState(false)
  const [cameraPermission, setCameraPermission] = useState<"granted" | "denied" | "prompt">("prompt")
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Check for WebXR AR support
    if ("xr" in navigator) {
      navigator.xr?.isSessionSupported("immersive-ar").then(setIsARSupported)
    }

    // Check camera permissions
    navigator.permissions
      ?.query({ name: "camera" as PermissionName })
      .then((result) => setCameraPermission(result.state as any))
  }, [])

  const startARSession = async () => {
    try {
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsARActive(true)
      }
    } catch (error) {
      console.error("AR session failed:", error)
    }
  }

  const stopARSession = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
    }
    setIsARActive(false)
  }

  const captureARPhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const ctx = canvas.getContext("2d")

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      ctx?.drawImage(video, 0, 0)

      // Add Pokemon overlay
      const pokemonImg = new Image()
      pokemonImg.onload = () => {
        ctx?.drawImage(pokemonImg, canvas.width / 2 - 100, canvas.height / 2 - 100, 200, 200)

        // Download the image
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `${pokemon.name}-ar-photo.png`
            a.click()
            URL.revokeObjectURL(url)
          }
        })
      }
      pokemonImg.src = pokemon.image || "/placeholder.svg"
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Camera className="w-6 h-6 text-blue-600" />
              AR Pokémon Viewer - {pokemon.name}
            </div>
            <Button variant="ghost" onClick={onClose}>
              ×
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {!isARSupported && (
            <div className="p-8 text-center">
              <Smartphone className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">AR Not Supported</h3>
              <p className="text-gray-600 mb-4">
                Your device doesn't support WebXR AR. Try using a modern mobile browser.
              </p>
              <Badge variant="outline">Requires: Chrome/Safari on mobile</Badge>
            </div>
          )}

          {isARSupported && !isARActive && (
            <div className="p-8 text-center space-y-6">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <img
                  src={pokemon.image || "/placeholder.svg"}
                  alt={pokemon.name}
                  className="w-24 h-24 object-contain"
                />
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-2">View {pokemon.name} in AR</h3>
                <p className="text-gray-600 mb-6">
                  Place {pokemon.name} in your real environment using augmented reality
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Camera className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="font-medium">Point Camera</div>
                  <div className="text-sm text-gray-600">Aim at a flat surface</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Zap className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="font-medium">Tap to Place</div>
                  <div className="text-sm text-gray-600">Position your Pokémon</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Maximize className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="font-medium">Interact</div>
                  <div className="text-sm text-gray-600">Resize and rotate</div>
                </div>
              </div>

              <Button
                onClick={startARSession}
                className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                size="lg"
              >
                <Camera className="w-5 h-5" />
                Start AR Experience
              </Button>
            </div>
          )}

          {isARActive && (
            <div className="relative">
              <video ref={videoRef} autoPlay playsInline className="w-full h-96 object-cover" />

              {/* AR Overlay Controls */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
                <Button onClick={captureARPhoto} className="bg-white text-gray-900 hover:bg-gray-100" size="sm">
                  <Camera className="w-4 h-4 mr-2" />
                  Capture
                </Button>
                <Button
                  onClick={stopARSession}
                  variant="outline"
                  className="bg-white text-gray-900 hover:bg-gray-100"
                  size="sm"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Stop AR
                </Button>
              </div>

              {/* Pokemon Stats Overlay */}
              <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-lg p-3">
                <div className="text-sm font-medium">{pokemon.name}</div>
                <div className="text-xs text-gray-600">
                  HP: {pokemon.stats.hp} | ATK: {pokemon.stats.attack}
                </div>
              </div>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </CardContent>
      </Card>
    </div>
  )
}
