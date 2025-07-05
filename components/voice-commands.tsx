"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff } from "lucide-react"
import type { Pokemon } from "@/types/pokemon"

interface VoiceCommandsProps {
  pokemon: Pokemon[]
  onPokemonSelect: (pokemon: Pokemon) => void
  onSearch: (query: string) => void
  onNavigate: (page: string) => void
}

declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
    SpeechSynthesisUtterance: any
    speechSynthesis: any
  }
}

export function VoiceCommands({ pokemon, onPokemonSelect, onSearch, onNavigate }: VoiceCommandsProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [confidence, setConfidence] = useState(0)
  const [lastCommand, setLastCommand] = useState("")
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    // Check for speech recognition support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      setIsSupported(true)
      const recognition = new SpeechRecognition()

      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = "en-US"

      recognition.onstart = () => setIsListening(true)
      recognition.onend = () => setIsListening(false)

      recognition.onresult = (event) => {
        const result = event.results[event.results.length - 1]
        const transcript = result[0].transcript.toLowerCase().trim()
        const confidence = result[0].confidence

        setTranscript(transcript)
        setConfidence(confidence)

        if (result.isFinal && confidence > 0.7) {
          processVoiceCommand(transcript)
        }
      }

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error)
        setIsListening(false)
      }

      recognitionRef.current = recognition
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const processVoiceCommand = (command: string) => {
    setLastCommand(command)

    // Navigation commands
    if (command.includes("go to") || command.includes("navigate to")) {
      if (command.includes("home")) onNavigate("/")
      else if (command.includes("explore") || command.includes("pokedex")) onNavigate("/explore")
      else if (command.includes("compare")) onNavigate("/explore?tab=comparison")
      else if (command.includes("battle")) onNavigate("/explore?tab=battle")
      else if (command.includes("team")) onNavigate("/explore?tab=teams")
      return
    }

    // Search commands
    if (command.includes("search for") || command.includes("find")) {
      const searchTerm = command.replace(/search for|find/g, "").trim()
      onSearch(searchTerm)
      return
    }

    // Pokemon selection commands
    if (command.includes("show me") || command.includes("select")) {
      const pokemonName = command.replace(/show me|select/g, "").trim()
      const foundPokemon = pokemon.find(
        (p) => p.name.toLowerCase().includes(pokemonName) || pokemonName.includes(p.name.toLowerCase()),
      )
      if (foundPokemon) {
        onPokemonSelect(foundPokemon)
        speak(`Showing ${foundPokemon.name}`)
      } else {
        speak(`Sorry, I couldn't find ${pokemonName}`)
      }
      return
    }

    // Random Pokemon command
    if (command.includes("random") || command.includes("surprise me")) {
      const randomPokemon = pokemon[Math.floor(Math.random() * pokemon.length)]
      onPokemonSelect(randomPokemon)
      speak(`Here's ${randomPokemon.name}!`)
      return
    }

    // Help command
    if (command.includes("help") || command.includes("what can you do")) {
      speak(
        "I can help you navigate, search for Pokemon, or show specific Pokemon. Try saying 'show me Pikachu' or 'search for fire types'",
      )
      return
    }

    // Default response
    speak("I didn't understand that command. Say 'help' to learn what I can do.")
  }

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1.1
      speechSynthesis.speak(utterance)
    }
  }

  const toggleListening = () => {
    if (!recognitionRef.current) return

    if (isListening) {
      recognitionRef.current.stop()
    } else {
      recognitionRef.current.start()
    }
  }

  if (!isSupported) {
    return (
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-4 text-center">
          <MicOff className="w-8 h-8 text-orange-500 mx-auto mb-2" />
          <div className="text-sm text-orange-700">Voice commands not supported in this browser</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`border-2 transition-all ${isListening ? "border-green-400 bg-green-50" : "border-gray-200"}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Button
              onClick={toggleListening}
              className={`${
                isListening ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-blue-500 hover:bg-blue-600"
              } text-white`}
              size="sm"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
            <div>
              <div className="font-medium text-sm">{isListening ? "Listening..." : "Voice Commands"}</div>
              <div className="text-xs text-gray-600">{isListening ? "Say a command" : "Click to activate"}</div>
            </div>
          </div>

          {confidence > 0 && (
            <Badge variant={confidence > 0.8 ? "default" : "secondary"}>
              {Math.round(confidence * 100)}% confident
            </Badge>
          )}
        </div>

        {transcript && (
          <div className="mb-3 p-2 bg-gray-100 rounded text-sm">
            <strong>Heard:</strong> "{transcript}"
          </div>
        )}

        {lastCommand && (
          <div className="mb-3 p-2 bg-blue-100 rounded text-sm">
            <strong>Last command:</strong> "{lastCommand}"
          </div>
        )}

        <div className="text-xs text-gray-600 space-y-1">
          <div>
            <strong>Try saying:</strong>
          </div>
          <div>• "Show me Pikachu"</div>
          <div>• "Search for fire types"</div>
          <div>• "Go to battle simulator"</div>
          <div>• "Random Pokemon"</div>
          <div>• "Help"</div>
        </div>
      </CardContent>
    </Card>
  )
}
