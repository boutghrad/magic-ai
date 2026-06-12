'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, Brain, Atom, Calculator, BookOpen, GraduationCap,
  Zap, BarChart3, Calendar, Sun, Moon, Menu, X, ChevronRight,
  Star, Quote, ArrowRight, Check, Shield, Users, Trophy
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } }
}

const features = [
  {
    icon: Calculator,
    title: 'AI Math Solver',
    description: 'Step-by-step solutions for algebra, calculus, geometry, and more. Get detailed explanations in student-friendly format.',
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-500/10',
    text: 'text-violet-400'
  },
  {
    icon: Atom,
    title: 'Science Tutor',
    description: 'Expert tutoring in Physics, Chemistry, Biology, and Computer Science with real-world examples and practice.',
    color: 'from-cyan-500 to-blue-600',
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-400'
  },
  {
    icon: BookOpen,
    title: 'Homework Helper',
    description: 'Upload images of exercises and get instant solutions with detailed explanations and methodology.',
    color: 'from-emerald-500 to-green-600',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400'
  },
  {
    icon: Brain,
    title: 'Quiz Generator',
    description: 'Auto-generate quizzes from any topic with multiple-choice, true/false, and open-ended questions.',
    color: 'from-pink-500 to-rose-600',
    bg: 'bg-pink-500/10',
    text: 'text-pink-400'
  },
  {
    icon: Calendar,
    title: 'Study Planner',
    description: 'AI creates personalized study schedules based on your goals, subjects, and available time.',
    color: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400'
  },
  {
    icon: BarChart3,
    title: 'Progress Tracking',
    description: 'Track your learning progress with detailed analytics, performance insights, and milestone achievements.',
    color: 'from-fuchsia-500 to-purple-600',
    bg: 'bg-fuchsia-500/10',
    text: 'text-fuchsia-400'
  }
]

const stats = [
  { value: '50K+', label: 'Active Students', icon: Users },
  { value: '1M+', label: 'Questions Answered', icon: Zap },
  { value: '4.9', label: 'Average Rating', icon: Star },
  { value: '100+', label: 'Subjects Covered', icon: Trophy }
]

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Computer Science Student',
    text: 'Magic AI transformed how I study. The step-by-step math solutions are incredibly clear, and the quiz generator helps me prepare for exams efficiently.',
    avatar: 'SC'
  },
  {
    name: 'James Rodriguez',
    role: 'Physics Major',
    text: 'The science tutor is like having a personal professor available 24/7. It explains complex concepts with real-world examples that actually make sense.',
    avatar: 'JR'
  },
  {
    name: 'Emily Watson',
    role: 'High School Student',
    text: 'I went from struggling with chemistry to acing my exams. The homework helper and study planner kept me organized and on track all semester.',
    avatar: 'EW'
  }
]

const steps = [
  { number: '01', title: 'Ask', description: 'Type your question, upload homework, or pick a topic. Our AI understands any subject.', icon: Sparkles },
  { number: '02', title: 'Learn', description: 'Get step-by-step explanations, examples, and practice problems tailored to your level.', icon: BookOpen },
  { number: '03', title: 'Excel', description: 'Track your progress, take quizzes, and watch your understanding grow with each session.', icon: GraduationCap }
]

export default function HomePage() {
  const { theme, setTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // mounted flag for hydration-safe theme toggle
  React.useEffect(() => {
    requestAnimationFrame(() => { setMounted(true) })
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg magic-gradient flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold magic-text">Magic AI</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</Link>
              <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
              <Link href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link>
            </div>

            <div className="hidden md:flex items-center gap-3">
              {mounted && (
                <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                  {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              )}
              <Link href="/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="magic-gradient text-white border-0 hover:opacity-90">
                  Get Started
                </Button>
              </Link>
            </div>

            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl"
            >
              <div className="px-4 py-4 space-y-3">
                <Link href="#features" className="block py-2 text-sm" onClick={() => setMobileMenuOpen(false)}>Features</Link>
                <Link href="/pricing" className="block py-2 text-sm" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
                <Link href="#about" className="block py-2 text-sm" onClick={() => setMobileMenuOpen(false)}>About</Link>
                <div className="flex gap-2 pt-2">
                  <Link href="/login" className="flex-1"><Button variant="outline" className="w-full" size="sm">Log in</Button></Link>
                  <Link href="/register" className="flex-1"><Button className="w-full magic-gradient text-white border-0" size="sm">Get Started</Button></Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary mb-8">
              <Sparkles className="h-3.5 w-3.5" />
              AI-Powered Learning Platform
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight"
          >
            Learn Smarter
            <br />
            <span className="magic-text">with AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Master Mathematics, Physics, Chemistry, Biology, and Computer Science
            with AI-powered tutoring, step-by-step solutions, and personalized study plans.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/register">
              <Button size="lg" className="magic-gradient text-white border-0 hover:opacity-90 px-8 h-12 text-base">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg" className="px-8 h-12 text-base">
                View Pricing
              </Button>
            </Link>
          </motion.div>

          {/* Floating icons */}
          <div className="absolute inset-0 pointer-events-none hidden lg:block">
            <motion.div animate={{ y: [-10, 10, -10] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-20 left-[15%]">
              <div className="h-12 w-12 rounded-xl bg-violet-500/10 flex items-center justify-center"><Brain className="h-6 w-6 text-violet-400" /></div>
            </motion.div>
            <motion.div animate={{ y: [10, -10, 10] }} transition={{ duration: 5, repeat: Infinity }} className="absolute top-40 right-[12%]">
              <div className="h-12 w-12 rounded-xl bg-cyan-500/10 flex items-center justify-center"><Atom className="h-6 w-6 text-cyan-400" /></div>
            </motion.div>
            <motion.div animate={{ y: [-15, 5, -15] }} transition={{ duration: 6, repeat: Infinity }} className="absolute bottom-40 left-[10%]">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center"><Calculator className="h-6 w-6 text-emerald-400" /></div>
            </motion.div>
            <motion.div animate={{ y: [5, -15, 5] }} transition={{ duration: 4.5, repeat: Infinity }} className="absolute bottom-32 right-[15%]">
              <div className="h-12 w-12 rounded-xl bg-pink-500/10 flex items-center justify-center"><GraduationCap className="h-6 w-6 text-pink-400" /></div>
            </motion.div>
          </div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16 flex items-center justify-center gap-8 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
              <span className="ml-1">4.9 Rating</span>
            </div>
            <div>50K+ Students</div>
            <div className="hidden sm:block">Free to Start</div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Everything You Need to <span className="magic-text">Excel</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful AI tools designed to help you understand, practice, and master any subject.
            </p>
          </motion.div>

          <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <Card className="group relative overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardContent className="relative pt-6">
                    <div className={`h-12 w-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}>
                      <feature.icon className={`h-6 w-6 ${feature.text}`} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">
              How It <span className="magic-text">Works</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">Three simple steps to transform your learning experience.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-violet-500 via-purple-500 to-blue-500 opacity-20" />
            {steps.map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }} className="text-center relative">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl magic-gradient text-white text-lg font-bold mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-2xl p-8 sm:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                  <stat.icon className="h-6 w-6 text-primary mx-auto mb-2" />
                  <div className="text-3xl sm:text-4xl font-bold magic-text">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="about" className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Loved by <span className="magic-text">Students</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">See what our students have to say about Magic AI.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                <Card className="h-full border-border/50">
                  <CardContent className="pt-6">
                    <Quote className="h-8 w-8 text-primary/30 mb-4" />
                    <p className="text-sm leading-relaxed mb-6 text-muted-foreground">&ldquo;{t.text}&rdquo;</p>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full magic-gradient flex items-center justify-center text-white text-sm font-bold">
                        {t.avatar}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{t.name}</div>
                        <div className="text-xs text-muted-foreground">{t.role}</div>
                      </div>
                    </div>
                    <div className="flex gap-0.5 mt-3">
                      {[...Array(5)].map((_, j) => <Star key={j} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <Card className="magic-gradient border-0 text-white overflow-hidden relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />
              <CardContent className="relative py-16 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Transform Your Learning?</h2>
                <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
                  Join thousands of students already excelling with Magic AI. Start for free, no credit card required.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/register">
                    <Button size="lg" className="bg-white text-purple-700 hover:bg-white/90 px-8 h-12 text-base font-semibold">
                      Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/pricing">
                    <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 h-12 text-base">
                      View Plans
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-16 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg magic-gradient flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-bold magic-text">Magic AI</span>
              </div>
              <p className="text-sm text-muted-foreground">AI-powered learning for every student. Master any subject with intelligent tutoring.</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4">Product</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <Link href="/math-solver" className="block hover:text-foreground transition-colors">Math Solver</Link>
                <Link href="/science-tutor" className="block hover:text-foreground transition-colors">Science Tutor</Link>
                <Link href="/quiz-generator" className="block hover:text-foreground transition-colors">Quiz Generator</Link>
                <Link href="/pricing" className="block hover:text-foreground transition-colors">Pricing</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4">Resources</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="hover:text-foreground transition-colors cursor-pointer">Documentation</div>
                <div className="hover:text-foreground transition-colors cursor-pointer">Blog</div>
                <div className="hover:text-foreground transition-colors cursor-pointer">Tutorials</div>
                <div className="hover:text-foreground transition-colors cursor-pointer">API</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4">Company</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="hover:text-foreground transition-colors cursor-pointer">About</div>
                <div className="hover:text-foreground transition-colors cursor-pointer">Careers</div>
                <div className="hover:text-foreground transition-colors cursor-pointer">Contact</div>
                <Link href="/admin" className="block hover:text-foreground transition-colors">Admin</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4">Legal</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="hover:text-foreground transition-colors cursor-pointer">Privacy</div>
                <div className="hover:text-foreground transition-colors cursor-pointer">Terms</div>
                <div className="hover:text-foreground transition-colors cursor-pointer">Cookie Policy</div>
              </div>
            </div>
          </div>
          <div className="border-t border-border mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">&copy; 2024 Magic AI. All rights reserved.</p>
            <div className="flex items-center gap-4 text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span className="text-xs">SOC 2 Compliant</span>
              <span className="text-xs text-muted-foreground/50">|</span>
              <span className="text-xs">GDPR Ready</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
