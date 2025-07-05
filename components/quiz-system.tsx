"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, Trophy, Brain, RotateCcw, CheckCircle, XCircle } from "lucide-react"
import { PokemonImage } from "@/components/pokemon-image"
import type { QuizQuestion, QuizSession, Pokemon } from "@/types/enhanced-features"

interface QuizSystemProps {
  pokemon: Pokemon[]
}

const generateQuestions = (pokemon: Pokemon[]): QuizQuestion[] => {
  const questions: QuizQuestion[] = []
  const shuffledPokemon = [...pokemon].sort(() => Math.random() - 0.5).slice(0, 20)

  shuffledPokemon.forEach((poke, index) => {
    // Type identification question
    if (Math.random() > 0.5) {
      const wrongTypes = ["fire", "water", "grass", "electric", "psychic", "dark"]
        .filter((type) => !poke.types.includes(type))
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)

      questions.push({
        id: `type-${index}`,
        type: "multiple-choice",
        question: `What type is ${poke.name}?`,
        options: [poke.types[0], ...wrongTypes].sort(() => Math.random() - 0.5),
        correctAnswer: poke.types[0],
        explanation: `${poke.name} is a ${poke.types.join("/")} type Pokémon.`,
        difficulty: "easy",
        category: "types",
        image: poke.image,
      })
    } else {
      // Name identification question
      const wrongNames = pokemon
        .filter((p) => p.id !== poke.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((p) => p.name)

      questions.push({
        id: `name-${index}`,
        type: "image-guess",
        question: "What Pokémon is this?",
        options: [poke.name, ...wrongNames].sort(() => Math.random() - 0.5),
        correctAnswer: poke.name,
        explanation: `This is ${poke.name}, a ${poke.types.join("/")} type Pokémon from ${poke.region}.`,
        difficulty: "medium",
        category: "general",
        image: poke.image,
      })
    }
  })

  return questions.slice(0, 10)
}

export function QuizSystem({ pokemon }: QuizSystemProps) {
  const [quizSession, setQuizSession] = useState<QuizSession | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<string>("")
  const [showResult, setShowResult] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [isAnswered, setIsAnswered] = useState(false)

  useEffect(() => {
    if (quizSession && !showResult && !isAnswered && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !isAnswered) {
      handleAnswer("")
    }
  }, [timeLeft, quizSession, showResult, isAnswered])

  const startQuiz = () => {
    const questions = generateQuestions(pokemon)
    setQuizSession({
      id: Date.now().toString(),
      questions,
      currentQuestion: 0,
      score: 0,
      timeStarted: new Date(),
      answers: {},
    })
    setTimeLeft(30)
    setShowResult(false)
    setIsAnswered(false)
    setSelectedAnswer("")
  }

  const handleAnswer = (answer: string) => {
    if (!quizSession || isAnswered) return

    const currentQ = quizSession.questions[quizSession.currentQuestion]
    const isCorrect = answer === currentQ.correctAnswer

    setSelectedAnswer(answer)
    setIsAnswered(true)
    setShowResult(true)

    const updatedSession = {
      ...quizSession,
      score: isCorrect ? quizSession.score + 1 : quizSession.score,
      answers: {
        ...quizSession.answers,
        [currentQ.id]: answer,
      },
    }

    setQuizSession(updatedSession)
  }

  const nextQuestion = () => {
    if (!quizSession) return

    if (quizSession.currentQuestion < quizSession.questions.length - 1) {
      setQuizSession({
        ...quizSession,
        currentQuestion: quizSession.currentQuestion + 1,
      })
      setSelectedAnswer("")
      setShowResult(false)
      setIsAnswered(false)
      setTimeLeft(30)
    } else {
      // Quiz complete
      setQuizSession({
        ...quizSession,
        timeCompleted: new Date(),
      })
    }
  }

  const resetQuiz = () => {
    setQuizSession(null)
    setSelectedAnswer("")
    setShowResult(false)
    setIsAnswered(false)
    setTimeLeft(30)
  }

  if (!quizSession) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Pokémon Quiz</h2>
          <p className="text-gray-600 mb-8">Test your Pokémon knowledge with interactive quizzes</p>
        </div>

        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Brain className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Test Your Knowledge?</h3>
            <p className="text-gray-600 mb-8">
              Challenge yourself with 10 questions about Pokémon types, names, and more!
            </p>
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">10</div>
                <div className="text-sm text-gray-600">Questions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">30s</div>
                <div className="text-sm text-gray-600">Per Question</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">100</div>
                <div className="text-sm text-gray-600">Max Score</div>
              </div>
            </div>
            <Button onClick={startQuiz} size="lg" className="gap-2">
              <Trophy className="w-5 h-5" />
              Start Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentQuestion = quizSession.questions[quizSession.currentQuestion]
  const isComplete = quizSession.timeCompleted !== undefined

  if (isComplete) {
    const percentage = Math.round((quizSession.score / quizSession.questions.length) * 100)

    return (
      <div className="space-y-8">
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-400 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Quiz Complete!</h3>
            <div className="text-6xl font-bold text-green-600 mb-4">
              {quizSession.score}/{quizSession.questions.length}
            </div>
            <div className="text-xl text-gray-600 mb-8">{percentage}% Correct</div>

            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{quizSession.score}</div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {quizSession.questions.length - quizSession.score}
                </div>
                <div className="text-sm text-gray-600">Incorrect</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round((quizSession.timeCompleted!.getTime() - quizSession.timeStarted.getTime()) / 1000)}s
                </div>
                <div className="text-sm text-gray-600">Total Time</div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button onClick={startQuiz} className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Try Again
              </Button>
              <Button variant="outline" onClick={resetQuiz}>
                Back to Menu
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Quiz Header */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant="secondary">
                Question {quizSession.currentQuestion + 1} of {quizSession.questions.length}
              </Badge>
              <div className="text-sm text-gray-600">
                Score: {quizSession.score}/{quizSession.questions.length}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-600" />
              <span className={`font-mono text-lg ${timeLeft <= 10 ? "text-red-600" : "text-gray-900"}`}>
                {timeLeft}s
              </span>
            </div>
          </div>
          <Progress value={((quizSession.currentQuestion + 1) / quizSession.questions.length) * 100} className="mt-3" />
        </CardContent>
      </Card>

      {/* Question */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-xl">{currentQuestion.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Question Image */}
          {currentQuestion.image && (
            <div className="text-center">
              <div className="w-48 h-48 mx-auto bg-gray-50 rounded-lg flex items-center justify-center">
                <PokemonImage
                  src={currentQuestion.image}
                  alt="Quiz Pokemon"
                  width={180}
                  height={180}
                  className="object-contain"
                />
              </div>
            </div>
          )}

          {/* Answer Options */}
          <div className="grid grid-cols-2 gap-4">
            {currentQuestion.options?.map((option, index) => (
              <Button
                key={index}
                variant={
                  showResult
                    ? option === currentQuestion.correctAnswer
                      ? "default"
                      : option === selectedAnswer
                        ? "destructive"
                        : "outline"
                    : selectedAnswer === option
                      ? "secondary"
                      : "outline"
                }
                onClick={() => handleAnswer(option)}
                disabled={isAnswered}
                className="h-auto p-4 text-left justify-start"
              >
                <div className="flex items-center gap-3">
                  {showResult && (
                    <>
                      {option === currentQuestion.correctAnswer && <CheckCircle className="w-5 h-5 text-green-600" />}
                      {option === selectedAnswer && option !== currentQuestion.correctAnswer && (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                    </>
                  )}
                  <span>{option}</span>
                </div>
              </Button>
            ))}
          </div>

          {/* Explanation */}
          {showResult && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Explanation</h4>
              <p className="text-blue-800 text-sm">{currentQuestion.explanation}</p>
            </div>
          )}

          {/* Next Button */}
          {showResult && (
            <div className="text-center">
              <Button onClick={nextQuestion} size="lg">
                {quizSession.currentQuestion < quizSession.questions.length - 1 ? "Next Question" : "Finish Quiz"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
