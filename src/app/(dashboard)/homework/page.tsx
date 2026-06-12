'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  Loader2,
  Upload,
  Send,
  Sparkles,
  ImagePlus,
  X,
  FileText,
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
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

const subjectOptions = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'English',
  'History',
  'General',
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

export default function HomeworkPage() {
  const [question, setQuestion] = useState('')
  const [subject, setSubject] = useState('General')
  const [imageUrl, setImageUrl] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [solution, setSolution] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB')
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setImagePreview(result)
      // In a real app, we'd upload to a storage service and get a URL
      setImageUrl(`uploaded:${file.name}`)
    }
    reader.readAsDataURL(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileSelect(file)
  }

  const removeImage = () => {
    setImagePreview(null)
    setImageUrl('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async () => {
    if (!question.trim() && !imageUrl) {
      toast.error('Please enter a question or upload an image')
      return
    }
    setLoading(true)
    setSolution('')
    try {
      const res = await fetch('/api/ai/homework', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question || 'Please solve the problem shown in the uploaded image',
          imageUrl: imageUrl || undefined,
          subject,
        }),
      })
      const data = await res.json()
      if (data.error) {
        toast.error(data.error)
        return
      }
      setSolution(data.solution)
      toast.success('Solution generated!')
    } catch {
      toast.error('Failed to analyze homework. Please try again.')
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
            <BookOpen className="text-primary" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Homework Assistant</h1>
            <p className="text-muted-foreground text-sm">
              Upload your homework and get step-by-step solutions
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input section */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Your Homework</CardTitle>
                <CardDescription>
                  Upload an image or type your question
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Image upload area */}
                <div
                  className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 cursor-pointer ${
                    isDragging
                      ? 'border-primary bg-primary/5 scale-[1.02]'
                      : imagePreview
                      ? 'border-primary/30 bg-primary/5'
                      : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-accent/50'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  {imagePreview ? (
                    <div className="relative inline-block">
                      <img
                        src={imagePreview}
                        alt="Homework preview"
                        className="max-h-48 rounded-lg mx-auto"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeImage()
                        }}
                      >
                        <X size={12} />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3 py-4">
                      <div className="rounded-full bg-primary/10 p-4">
                        <Upload className="text-primary" size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          Drag & drop your homework image here
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          or click to browse (PNG, JPG up to 10MB)
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Subject selector */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Subject</Label>
                  <Select value={subject} onValueChange={setSubject}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjectOptions.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Question input */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Describe your question
                  </Label>
                  <Textarea
                    placeholder="Type your homework question here, or describe what you need help with..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="min-h-[100px] resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                        handleSubmit()
                      }
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    Press Ctrl+Enter to submit
                  </p>
                  <Button
                    onClick={handleSubmit}
                    disabled={
                      loading || (!question.trim() && !imageUrl)
                    }
                    className="gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <Send size={16} />
                    )}
                    {loading ? 'Analyzing...' : 'Get Solution'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Solution */}
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
                        {subject && (
                          <Badge variant="secondary" className="ml-2">
                            {subject}
                          </Badge>
                        )}
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
                            Analyzing your homework...
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

          {/* Tips sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="text-primary" size={16} />
                  <CardTitle className="text-base">Tips</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex gap-2">
                    <span className="text-primary font-bold">1.</span>
                    <p>Upload a clear image of your homework for best results</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-primary font-bold">2.</span>
                    <p>Add a brief description of what you need help with</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-primary font-bold">3.</span>
                    <p>Select the correct subject for more accurate solutions</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-primary font-bold">4.</span>
                    <p>Review the step-by-step explanation to understand the method</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <ImagePlus className="text-primary" size={16} />
                  <CardTitle className="text-base">Supported Formats</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">PNG</Badge>
                  <Badge variant="secondary">JPG</Badge>
                  <Badge variant="secondary">JPEG</Badge>
                  <Badge variant="secondary">WebP</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Maximum file size: 10MB
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
