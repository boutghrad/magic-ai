'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calculator,
  Loader2,
  Send,
  History,
  Shapes,
  BarChart3,
  Triangle,
  Sparkles,
  ChevronRight,
  X,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'

const categories = [
  { label: 'Algebra', icon: Calculator },
  { label: 'Calculus', icon: BarChart3 },
  { label: 'Geometry', icon: Shapes },
  { label: 'Statistics', icon: BarChart3 },
  { label: 'Trigonometry', icon: Triangle },
]



function MarkdownRenderer({ content }: { content: string }) {
  const html = content
    .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mt-5 mb-2 magic-text">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-6 mb-3">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
    .replace(/^- (.*$)/gm, '<li class="ml-4 list-disc text-muted-foreground">$1</li>')
    .replace(/^(\d+)\. (.*$)/gm, '<li class="ml-4 list-decimal text-muted-foreground">$2</li>')
    .replace(/\n{2,}/g, '</p><p class="mb-3 leading-relaxed">')
    .replace(/\n/g, '<br />')
  return (
    <div
      className="markdown-content prose prose-sm dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

export default function MathSolverPage() {
  const [problem, setProblem] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Algebra')
  const [loading, setLoading] = useState(false)
  const [solution, setSolution] = useState('')
  const [showHistory, setShowHistory] = useState(true)
  const [history, setHistory] = useState<Array<{ id: string; problem: string; createdAt: string }>>([])
  const [historyLoading, setHistoryLoading] = useState(true)

  // Fetch real history from API
  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch('/api/math/history')
        if (res.ok) {
          const data = await res.json()
          setHistory(data.history || [])
        }
      } catch {
        // silently fail
      } finally {
        setHistoryLoading(false)
      }
    }
    fetchHistory()
  }, [solution]) // refetch after new solution is generated

  const handleSolve = async () => {
    if (!problem.trim()) {
      toast.error('Please enter a math problem')
      return
    }
    setLoading(true)
    setSolution('')
    try {
      const res = await fetch('/api/ai/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem }),
      })
      const data = await res.json()
      if (data.error) {
        toast.error(data.error)
        return
      }
      setSolution(data.solution)
      toast.success('Solution generated!')
    } catch {
      toast.error('Failed to solve problem. Please try again.')
    } finally {
      setLoading(false)
    }
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
            <Calculator className="text-primary" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Math Solver</h1>
            <p className="text-muted-foreground text-sm">
              Get step-by-step solutions to any math problem
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main content */}
          <div className="lg:col-span-3 space-y-4">
            {/* Input card */}
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Enter Your Problem</CardTitle>
                <CardDescription>
                  Type your math problem and get a detailed solution
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Category buttons */}
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => {
                    const Icon = cat.icon
                    const isActive = selectedCategory === cat.label
                    return (
                      <Button
                        key={cat.label}
                        variant={isActive ? 'default' : 'outline'}
                        size="sm"
                        className="gap-1.5"
                        onClick={() => setSelectedCategory(cat.label)}
                      >
                        <Icon size={14} />
                        {cat.label}
                      </Button>
                    )
                  })}
                </div>

                {/* Textarea */}
                <Textarea
                  placeholder="Enter your math problem here... e.g., Solve x² - 5x + 6 = 0"
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  className="min-h-[120px] resize-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                      handleSolve()
                    }
                  }}
                />

                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    Press Ctrl+Enter to solve
                  </p>
                  <Button
                    onClick={handleSolve}
                    disabled={loading || !problem.trim()}
                    className="gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <Send size={16} />
                    )}
                    {loading ? 'Solving...' : 'Solve'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Solution card */}
            <AnimatePresence>
              {(loading || solution) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-0 shadow-md">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="text-primary" size={18} />
                        <CardTitle className="text-base">Solution</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-3">
                          <div className="relative">
                            <Loader2 className="animate-spin text-primary" size={32} />
                            <Sparkles
                              className="absolute -top-1 -right-1 text-primary animate-pulse"
                              size={14}
                            />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            AI is solving your problem...
                          </p>
                        </div>
                      ) : (
                        <div className="rounded-lg bg-muted/50 p-4 md:p-6">
                          <MarkdownRenderer content={solution} />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* History sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <History className="text-primary" size={16} />
                    <CardTitle className="text-base">History</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="lg:hidden h-7 w-7 p-0"
                    onClick={() => setShowHistory(!showHistory)}
                  >
                    {showHistory ? <X size={14} /> : <ChevronRight size={14} />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className={showHistory ? '' : 'hidden lg:block'}>
                <ScrollArea className="max-h-[400px]">
                  {historyLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : history.length > 0 ? (
                    <div className="space-y-2">
                      {history.map((item) => (
                        <button
                          key={item.id}
                          className="w-full text-left p-3 rounded-lg hover:bg-accent/50 transition-colors group"
                          onClick={() => setProblem(item.problem)}
                        >
                          <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                            {item.problem}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </p>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <History className="h-8 w-8 text-muted-foreground/30 mb-2" />
                      <p className="text-xs text-muted-foreground">No history yet</p>
                      <p className="text-xs text-muted-foreground">Solve a problem to see it here</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
