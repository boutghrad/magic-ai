'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Atom,
  Loader2,
  Send,
  Sparkles,
  FlaskConical,
  Microscope,
  Code2,
  Lightbulb,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'

const subjects = [
  {
    id: 'physics',
    label: 'Physics',
    icon: Atom,
    color: 'from-blue-500/20 to-cyan-500/20',
    suggestions: [
      "Explain Newton's Laws of Motion with real-world examples",
      'How does quantum entanglement work?',
      'What is the difference between speed and velocity?',
      'Explain the theory of relativity in simple terms',
    ],
  },
  {
    id: 'chemistry',
    label: 'Chemistry',
    icon: FlaskConical,
    color: 'from-emerald-500/20 to-green-500/20',
    suggestions: [
      'How do chemical bonds form?',
      'Explain the periodic table trends',
      'What is the difference between acids and bases?',
      'How does photosynthesis work at the molecular level?',
    ],
  },
  {
    id: 'biology',
    label: 'Biology',
    icon: Microscope,
    color: 'from-rose-500/20 to-pink-500/20',
    suggestions: [
      'How does DNA replication work?',
      'Explain the process of natural selection',
      'What is the role of mitochondria in cells?',
      'How does the immune system fight infections?',
    ],
  },
  {
    id: 'computer-science',
    label: 'Computer Science',
    icon: Code2,
    color: 'from-violet-500/20 to-purple-500/20',
    suggestions: [
      'Explain Big O notation with examples',
      'How do binary search trees work?',
      'What is the difference between SQL and NoSQL?',
      'Explain how the internet works from request to response',
    ],
  },
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

export default function ScienceTutorPage() {
  const [activeSubject, setActiveSubject] = useState('physics')
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [answer, setAnswer] = useState('')

  const currentSubject = subjects.find((s) => s.id === activeSubject)!

  const handleAsk = async () => {
    if (!question.trim()) {
      toast.error('Please enter a question')
      return
    }
    setLoading(true)
    setAnswer('')
    try {
      const res = await fetch('/api/ai/science', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: currentSubject.label,
          question,
        }),
      })
      const data = await res.json()
      if (data.error) {
        toast.error(data.error)
        return
      }
      setAnswer(data.answer)
      toast.success('Answer generated!')
    } catch {
      toast.error('Failed to get answer. Please try again.')
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
            <Atom className="text-primary" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Science Tutor</h1>
            <p className="text-muted-foreground text-sm">
              Ask questions about any science subject
            </p>
          </div>
        </div>

        {/* Subject tabs */}
        <Tabs
          value={activeSubject}
          onValueChange={(val) => {
            setActiveSubject(val)
            setQuestion('')
            setAnswer('')
          }}
        >
          <TabsList className="w-full sm:w-auto">
            {subjects.map((sub) => {
              const Icon = sub.icon
              return (
                <TabsTrigger
                  key={sub.id}
                  value={sub.id}
                  className="gap-1.5 flex-1 sm:flex-initial"
                >
                  <Icon size={14} />
                  <span className="hidden sm:inline">{sub.label}</span>
                  <span className="sm:hidden text-xs">{sub.label.slice(0, 4)}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>

          {subjects.map((sub) => (
            <TabsContent key={sub.id} value={sub.id}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Q&A area */}
                <div className="lg:col-span-2 space-y-4">
                  <Card className="border-0 shadow-md">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <sub.icon className="text-primary" size={18} />
                        Ask about {sub.label}
                      </CardTitle>
                      <CardDescription>
                        Type your question and get a detailed explanation
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Textarea
                        placeholder={`What would you like to know about ${sub.label.toLowerCase()}?`}
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        className="min-h-[120px] resize-none"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                            handleAsk()
                          }
                        }}
                      />
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          Press Ctrl+Enter to ask
                        </p>
                        <Button
                          onClick={handleAsk}
                          disabled={loading || !question.trim()}
                          className="gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
                        >
                          {loading ? (
                            <Loader2 className="animate-spin" size={16} />
                          ) : (
                            <Send size={16} />
                          )}
                          {loading ? 'Thinking...' : 'Ask'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Answer */}
                  <AnimatePresence>
                    {(loading || answer) && (
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
                              <CardTitle className="text-base">
                                Answer
                              </CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent>
                            {loading ? (
                              <div className="flex flex-col items-center justify-center py-12 gap-3">
                                <div className="relative">
                                  <Loader2
                                    className="animate-spin text-primary"
                                    size={32}
                                  />
                                  <Sparkles
                                    className="absolute -top-1 -right-1 text-primary animate-pulse"
                                    size={14}
                                  />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  AI tutor is thinking...
                                </p>
                              </div>
                            ) : (
                              <div className="rounded-lg bg-muted/50 p-4 md:p-6">
                                <MarkdownRenderer content={answer} />
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Suggestions sidebar */}
                <div className="lg:col-span-1">
                  <Card className="border-0 shadow-md">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="text-primary" size={16} />
                        <CardTitle className="text-base">
                          Suggested Questions
                        </CardTitle>
                      </div>
                      <CardDescription>
                        Click to ask a popular question
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {sub.suggestions.map((suggestion, i) => (
                          <button
                            key={i}
                            className="w-full text-left p-3 rounded-lg hover:bg-accent/50 transition-colors group text-sm"
                            onClick={() => {
                              setQuestion(suggestion)
                            }}
                          >
                            <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                              {suggestion}
                            </span>
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </motion.div>
    </div>
  )
}
