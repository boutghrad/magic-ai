'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain,
  Loader2,
  Sparkles,
  CheckCircle2,
  XCircle,
  ChevronRight,
  RotateCcw,
  Trophy,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

const difficulties = [
  { value: 'easy', label: 'Easy', description: 'Basic concepts' },
  { value: 'medium', label: 'Medium', description: 'Intermediate level' },
  { value: 'hard', label: 'Hard', description: 'Advanced problems' },
]

const questionTypeOptions = [
  { id: 'multiple_choice', label: 'Multiple Choice' },
  { id: 'true_false', label: 'True / False' },
  { id: 'open_ended', label: 'Open-ended' },
]

interface QuizQuestion {
  id: number
  type: string
  question: string
  options?: string[]
  answer: string
  explanation: string
}

interface QuizData {
  title: string
  questions: QuizQuestion[]
  raw?: string
}

export default function QuizGeneratorPage() {
  const [topic, setTopic] = useState('')
  const [numQuestions, setNumQuestions] = useState([5])
  const [difficulty, setDifficulty] = useState('medium')
  const [selectedTypes, setSelectedTypes] = useState<string[]>([
    'multiple_choice',
    'true_false',
  ])
  const [loading, setLoading] = useState(false)
  const [quiz, setQuiz] = useState<QuizData | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({})

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    )
  }

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic')
      return
    }
    if (selectedTypes.length === 0) {
      toast.error('Select at least one question type')
      return
    }
    setLoading(true)
    setQuiz(null)
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
    setShowExplanation({})
    try {
      const res = await fetch('/api/ai/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          numQuestions: numQuestions[0],
          difficulty,
          questionTypes: selectedTypes,
        }),
      })
      const data = await res.json()
      if (data.error) {
        toast.error(data.error)
        return
      }
      setQuiz(data.quiz)
      toast.success('Quiz generated!')
    } catch {
      toast.error('Failed to generate quiz. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswer = (questionId: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }

  const getScore = () => {
    if (!quiz?.questions) return 0
    return quiz.questions.reduce((score, q) => {
      const userAnswer = answers[q.id]
      if (!userAnswer) return score
      const correct = q.answer.toLowerCase().trim()
      const given = userAnswer.toLowerCase().trim()
      // Handle both "A" and "A) Option" style answers
      if (correct === given || given.startsWith(correct)) return score + 1
      // For true/false
      if (
        (correct === 'true' && given === 'true') ||
        (correct === 'false' && given === 'false')
      )
        return score + 1
      return score
    }, 0)
  }

  const isCorrectAnswer = (question: QuizQuestion) => {
    const userAnswer = answers[question.id]
    if (!userAnswer) return null
    const correct = question.answer.toLowerCase().trim()
    const given = userAnswer.toLowerCase().trim()
    if (correct === given || given.startsWith(correct)) return true
    if (
      (correct === 'true' && given === 'true') ||
      (correct === 'false' && given === 'false')
    )
      return true
    return false
  }

  const resetQuiz = () => {
    setQuiz(null)
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
    setShowExplanation({})
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-3">
            <Brain className="text-primary" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Quiz Generator</h1>
            <p className="text-muted-foreground text-sm">
              Create custom quizzes on any topic
            </p>
          </div>
        </div>

        {!quiz ? (
          /* Quiz Configuration */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Configure Your Quiz</CardTitle>
                  <CardDescription>
                    Customize your quiz settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Topic */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Topic</Label>
                    <Input
                      placeholder="e.g., Newton's Laws, World War II, Python Basics..."
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                    />
                  </div>

                  {/* Number of questions */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">
                        Number of Questions
                      </Label>
                      <Badge variant="secondary" className="font-mono">
                        {numQuestions[0]}
                      </Badge>
                    </div>
                    <Slider
                      value={numQuestions}
                      onValueChange={setNumQuestions}
                      min={3}
                      max={20}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>3</span>
                      <span>20</span>
                    </div>
                  </div>

                  {/* Difficulty */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Difficulty</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {difficulties.map((d) => (
                        <button
                          key={d.value}
                          className={`p-3 rounded-lg border-2 text-center transition-all ${
                            difficulty === d.value
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border hover:border-primary/50'
                          }`}
                          onClick={() => setDifficulty(d.value)}
                        >
                          <p className="text-sm font-medium">{d.label}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            {d.description}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Question types */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      Question Types
                    </Label>
                    <div className="space-y-3">
                      {questionTypeOptions.map((type) => (
                        <div
                          key={type.id}
                          className="flex items-center space-x-3"
                        >
                          <Checkbox
                            id={type.id}
                            checked={selectedTypes.includes(type.id)}
                            onCheckedChange={() => toggleType(type.id)}
                          />
                          <Label
                            htmlFor={type.id}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {type.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={handleGenerate}
                    disabled={loading || !topic.trim() || selectedTypes.length === 0}
                    className="w-full gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white h-11"
                    size="lg"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <Sparkles size={18} />
                    )}
                    {loading ? 'Generating...' : 'Generate Quiz'}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Info sidebar */}
            <div className="lg:col-span-1">
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">How It Works</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm text-muted-foreground">
                    <div className="flex gap-3">
                      <div className="rounded-full bg-primary/10 w-6 h-6 flex items-center justify-center shrink-0">
                        <span className="text-primary text-xs font-bold">1</span>
                      </div>
                      <p>Enter a topic you want to be quizzed on</p>
                    </div>
                    <div className="flex gap-3">
                      <div className="rounded-full bg-primary/10 w-6 h-6 flex items-center justify-center shrink-0">
                        <span className="text-primary text-xs font-bold">2</span>
                      </div>
                      <p>Adjust difficulty and question types</p>
                    </div>
                    <div className="flex gap-3">
                      <div className="rounded-full bg-primary/10 w-6 h-6 flex items-center justify-center shrink-0">
                        <span className="text-primary text-xs font-bold">3</span>
                      </div>
                      <p>Generate your custom quiz</p>
                    </div>
                    <div className="flex gap-3">
                      <div className="rounded-full bg-primary/10 w-6 h-6 flex items-center justify-center shrink-0">
                        <span className="text-primary text-xs font-bold">4</span>
                      </div>
                      <p>Answer questions and track your score</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          /* Quiz Display */
          <div className="space-y-4">
            {/* Quiz header with progress */}
            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold">{quiz.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      {quiz.questions.length} questions · {difficulty} difficulty
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-medium">
                      {Object.keys(answers).length}/{quiz.questions.length} answered
                    </div>
                    <Button variant="outline" size="sm" onClick={resetQuiz}>
                      <RotateCcw size={14} className="mr-1.5" />
                      New Quiz
                    </Button>
                  </div>
                </div>
                <Progress
                  value={
                    (Object.keys(answers).length / quiz.questions.length) * 100
                  }
                  className="mt-3 h-2"
                />
              </CardContent>
            </Card>

            {/* Questions */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3 space-y-4">
                <AnimatePresence mode="wait">
                  {quiz.questions.map((q, idx) => {
                    // Show all questions or current one at a time
                    if (showResults || idx === currentQuestion) {
                      return (
                        <motion.div
                          key={q.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Card className="border-0 shadow-md">
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-2">
                                  <Badge variant="secondary">
                                    Q{idx + 1}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs capitalize">
                                    {q.type.replace('_', ' ')}
                                  </Badge>
                                </div>
                                {showResults && (
                                  isCorrectAnswer(q) ? (
                                    <CheckCircle2 className="text-emerald-500" size={20} />
                                  ) : (
                                    <XCircle className="text-destructive" size={20} />
                                  )
                                )}
                              </div>
                              <CardTitle className="text-base mt-2">
                                {q.question}
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              {q.type === 'multiple_choice' && q.options ? (
                                <RadioGroup
                                  value={answers[q.id] || ''}
                                  onValueChange={(val) =>
                                    handleAnswer(q.id, val)
                                  }
                                  disabled={showResults}
                                >
                                  {q.options.map((opt, optIdx) => {
                                    const letter = String.fromCharCode(65 + optIdx)
                                    const isSelected = answers[q.id] === opt
                                    const isCorrect = q.answer.toLowerCase().startsWith(letter.toLowerCase())
                                    const showCorrectness = showResults && isCorrect

                                    return (
                                      <div
                                        key={optIdx}
                                        className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                                          showCorrectness
                                            ? 'border-emerald-500 bg-emerald-500/10'
                                            : isSelected && showResults
                                            ? 'border-destructive bg-destructive/10'
                                            : isSelected
                                            ? 'border-primary bg-primary/5'
                                            : 'border-border hover:border-primary/50'
                                        }`}
                                      >
                                        <RadioGroupItem
                                          value={opt}
                                          id={`${q.id}-${optIdx}`}
                                        />
                                        <Label
                                          htmlFor={`${q.id}-${optIdx}`}
                                          className="flex-1 cursor-pointer text-sm"
                                        >
                                          {opt}
                                        </Label>
                                      </div>
                                    )
                                  })}
                                </RadioGroup>
                              ) : q.type === 'true_false' && q.options ? (
                                <RadioGroup
                                  value={answers[q.id] || ''}
                                  onValueChange={(val) =>
                                    handleAnswer(q.id, val)
                                  }
                                  disabled={showResults}
                                >
                                  {q.options.map((opt, optIdx) => {
                                    const isSelected = answers[q.id] === opt
                                    const isCorrect = q.answer.toLowerCase() === opt.toLowerCase()
                                    const showCorrectness = showResults && isCorrect

                                    return (
                                      <div
                                        key={optIdx}
                                        className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                                          showCorrectness
                                            ? 'border-emerald-500 bg-emerald-500/10'
                                            : isSelected && showResults
                                            ? 'border-destructive bg-destructive/10'
                                            : isSelected
                                            ? 'border-primary bg-primary/5'
                                            : 'border-border hover:border-primary/50'
                                        }`}
                                      >
                                        <RadioGroupItem
                                          value={opt}
                                          id={`${q.id}-${optIdx}`}
                                        />
                                        <Label
                                          htmlFor={`${q.id}-${optIdx}`}
                                          className="flex-1 cursor-pointer text-sm"
                                        >
                                          {opt}
                                        </Label>
                                      </div>
                                    )
                                  })}
                                </RadioGroup>
                              ) : (
                                /* Open-ended */
                                <div className="space-y-2">
                                  <Input
                                    placeholder="Type your answer..."
                                    value={answers[q.id] || ''}
                                    onChange={(e) =>
                                      handleAnswer(q.id, e.target.value)
                                    }
                                    disabled={showResults}
                                  />
                                </div>
                              )}

                              {/* Explanation */}
                              {showResults && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <div className="mt-3 p-3 rounded-lg bg-muted/50">
                                    <p className="text-xs font-semibold text-primary mb-1">
                                      Explanation:
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {q.explanation}
                                    </p>
                                    <p className="text-xs text-emerald-500 mt-1 font-medium">
                                      Correct answer: {q.answer}
                                    </p>
                                  </div>
                                </motion.div>
                              )}
                            </CardContent>
                          </Card>
                        </motion.div>
                      )
                    }
                    return null
                  })}
                </AnimatePresence>

                {/* Navigation */}
                {!showResults && (
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      onClick={() =>
                        setCurrentQuestion((prev) =>
                          Math.max(0, prev - 1)
                        )
                      }
                      disabled={currentQuestion === 0}
                    >
                      Previous
                    </Button>
                    {currentQuestion < quiz.questions.length - 1 ? (
                      <Button
                        onClick={() =>
                          setCurrentQuestion((prev) => prev + 1)
                        }
                        className="gap-1"
                      >
                        Next
                        <ChevronRight size={16} />
                      </Button>
                    ) : (
                      <Button
                        onClick={() => setShowResults(true)}
                        className="gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
                        disabled={
                          Object.keys(answers).length <
                          quiz.questions.length
                        }
                      >
                        <Trophy size={16} />
                        View Results
                      </Button>
                    )}
                  </div>
                )}

                {/* Results */}
                {showResults && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card className="border-0 shadow-md bg-gradient-to-br from-violet-500/10 to-purple-500/10">
                      <CardContent className="p-6 text-center">
                        <Trophy className="text-primary mx-auto mb-3" size={48} />
                        <h2 className="text-2xl font-bold">Quiz Complete!</h2>
                        <p className="text-4xl font-bold magic-text mt-3">
                          {getScore()}/{quiz.questions.length}
                        </p>
                        <p className="text-muted-foreground mt-1">
                          {Math.round(
                            (getScore() / quiz.questions.length) * 100
                          )}
                          % correct
                        </p>
                        <div className="flex items-center justify-center gap-3 mt-5">
                          <Button onClick={resetQuiz} variant="outline">
                            <RotateCcw size={14} className="mr-1.5" />
                            Try Another Quiz
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </div>

              {/* Question navigator sidebar */}
              <div className="lg:col-span-1">
                <Card className="border-0 shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold">
                      Questions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-5 lg:grid-cols-4 gap-2">
                      {quiz.questions.map((q, idx) => {
                        const isAnswered = answers[q.id] !== undefined
                        const isCurrent = idx === currentQuestion
                        return (
                          <button
                            key={q.id}
                            className={`h-9 w-9 rounded-lg text-xs font-medium transition-all ${
                              isCurrent
                                ? 'bg-primary text-primary-foreground'
                                : showResults
                                ? isCorrectAnswer(q)
                                  ? 'bg-emerald-500/20 text-emerald-500'
                                  : 'bg-destructive/20 text-destructive'
                                : isAnswered
                                ? 'bg-primary/20 text-primary'
                                : 'bg-muted text-muted-foreground hover:bg-accent'
                            }`}
                            onClick={() => setCurrentQuestion(idx)}
                          >
                            {idx + 1}
                          </button>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
