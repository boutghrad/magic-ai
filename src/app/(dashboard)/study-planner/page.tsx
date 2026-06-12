'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  Loader2,
  Sparkles,
  Clock,
  Target,
  BookOpen,
  CheckSquare,
  Square,
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
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

const subjectOptions = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'English',
  'History',
  'Economics',
]

const durationOptions = [
  { value: '1 week', label: '1 Week', description: 'Quick intensive' },
  { value: '2 weeks', label: '2 Weeks', description: 'Short-term plan' },
  { value: '1 month', label: '1 Month', description: 'Standard plan' },
  { value: '3 months', label: '3 Months', description: 'Comprehensive plan' },
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

export default function StudyPlannerPage() {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [goals, setGoals] = useState('')
  const [availableHours, setAvailableHours] = useState([4])
  const [duration, setDuration] = useState('1 month')
  const [loading, setLoading] = useState(false)
  const [plan, setPlan] = useState('')

  const toggleSubject = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    )
  }

  const handleCreatePlan = async () => {
    if (selectedSubjects.length === 0) {
      toast.error('Please select at least one subject')
      return
    }
    setLoading(true)
    setPlan('')
    try {
      const res = await fetch('/api/ai/study-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjects: selectedSubjects,
          goals: goals || 'Master all selected subjects',
          availableHours: availableHours[0],
          duration,
        }),
      })
      const data = await res.json()
      if (data.error) {
        toast.error(data.error)
        return
      }
      setPlan(data.plan)
      toast.success('Study plan created!')
    } catch {
      toast.error('Failed to create study plan. Please try again.')
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
            <Calendar className="text-primary" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Study Planner</h1>
            <p className="text-muted-foreground text-sm">
              Create a personalized study schedule with AI
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Plan Configuration</CardTitle>
                <CardDescription>
                  Customize your study plan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Subject selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <BookOpen size={14} className="text-primary" />
                    Select Subjects
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {subjectOptions.map((subject) => {
                      const isSelected = selectedSubjects.includes(subject)
                      return (
                        <button
                          key={subject}
                          className={`flex items-center gap-2 p-3 rounded-lg border-2 text-left transition-all text-sm ${
                            isSelected
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border hover:border-primary/50'
                          }`}
                          onClick={() => toggleSubject(subject)}
                        >
                          {isSelected ? (
                            <CheckSquare size={16} className="shrink-0" />
                          ) : (
                            <Square size={16} className="shrink-0" />
                          )}
                          <span className="truncate">{subject}</span>
                        </button>
                      )
                    })}
                  </div>
                  {selectedSubjects.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {selectedSubjects.map((s) => (
                        <Badge key={s} variant="secondary" className="text-xs">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Goals */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Target size={14} className="text-primary" />
                    Learning Goals
                  </Label>
                  <Textarea
                    placeholder="Describe your learning goals... e.g., Prepare for final exams, learn calculus fundamentals, master organic chemistry reactions..."
                    value={goals}
                    onChange={(e) => setGoals(e.target.value)}
                    className="min-h-[80px] resize-none"
                  />
                </div>

                {/* Available hours */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Clock size={14} className="text-primary" />
                      Available Hours per Day
                    </Label>
                    <Badge variant="secondary" className="font-mono">
                      {availableHours[0]}h
                    </Badge>
                  </div>
                  <Slider
                    value={availableHours}
                    onValueChange={setAvailableHours}
                    min={1}
                    max={12}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1h</span>
                    <span>12h</span>
                  </div>
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Duration</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {durationOptions.map((d) => (
                      <button
                        key={d.value}
                        className={`p-3 rounded-lg border-2 text-center transition-all ${
                          duration === d.value
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setDuration(d.value)}
                      >
                        <p className="text-sm font-medium">{d.label}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {d.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleCreatePlan}
                  disabled={loading || selectedSubjects.length === 0}
                  className="w-full gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white h-11"
                  size="lg"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Sparkles size={18} />
                  )}
                  {loading ? 'Creating Plan...' : 'Create Study Plan'}
                </Button>
              </CardContent>
            </Card>

            {/* Generated Plan */}
            <AnimatePresence>
              {(loading || plan) && (
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
                          Your Study Plan
                        </CardTitle>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {selectedSubjects.map((s) => (
                          <Badge key={s} variant="secondary" className="text-xs">
                            {s}
                          </Badge>
                        ))}
                        <Badge variant="outline" className="text-xs">
                          {duration}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {availableHours[0]}h/day
                        </Badge>
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
                            Creating your personalized study plan...
                          </p>
                        </div>
                      ) : (
                        <div className="rounded-lg bg-muted/50 p-4 md:p-6">
                          <MarkdownRenderer content={plan} />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar info */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Study Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex gap-2">
                    <span className="text-primary font-bold">💡</span>
                    <p>Break study sessions into 25-minute focused blocks (Pomodoro technique)</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-primary font-bold">📖</span>
                    <p>Review previous material before starting new topics</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-primary font-bold">🧪</span>
                    <p>Practice with quizzes after each study session</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-primary font-bold">😴</span>
                    <p>Get adequate sleep — it consolidates memories</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-primary font-bold">🔄</span>
                    <p>Space out your learning with regular review sessions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subjects</span>
                    <span className="font-medium">
                      {selectedSubjects.length || '—'}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Hours/day</span>
                    <span className="font-medium">
                      {availableHours[0]}h
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">{duration}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total hours</span>
                    <span className="font-medium">
                      {availableHours[0] *
                        parseInt(duration) *
                        (duration.includes('month') ? 30 : 7)}h
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
