'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Check, Zap, Building, Sparkles, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession } from 'next-auth/react'

interface PlanFeature {
  text: string
  included: boolean
}

interface Plan {
  name: string
  icon: React.ReactNode
  monthlyPrice: number
  description: string
  features: PlanFeature[]
  cta: string
  popular: boolean
  gradient: string
}

const plans: Plan[] = [
  {
    name: 'Free',
    icon: <Sparkles className="h-6 w-6" />,
    monthlyPrice: 0,
    description: 'Perfect for getting started with AI-powered learning',
    features: [
      { text: '5 AI questions per day', included: true },
      { text: 'Basic math solver', included: true },
      { text: 'Limited quiz generation (3/month)', included: true },
      { text: 'Community support', included: true },
      { text: '1 study plan', included: true },
      { text: 'Step-by-step solutions', included: false },
      { text: 'Homework image upload', included: false },
      { text: 'API access', included: false },
    ],
    cta: 'Get Started Free',
    popular: false,
    gradient: 'from-slate-500 to-slate-600',
  },
  {
    name: 'Pro',
    icon: <Zap className="h-6 w-6" />,
    monthlyPrice: 9.99,
    description: 'For serious learners who want unlimited AI assistance',
    features: [
      { text: 'Unlimited AI questions', included: true },
      { text: 'Advanced math solver with step-by-step', included: true },
      { text: 'Unlimited quiz generation', included: true },
      { text: 'Homework image upload', included: true },
      { text: 'Study planner', included: true },
      { text: 'Priority support', included: true },
      { text: '10 study plans', included: true },
      { text: 'API access', included: false },
    ],
    cta: 'Start Pro Trial',
    popular: true,
    gradient: 'from-violet-600 to-purple-600',
  },
  {
    name: 'Enterprise',
    icon: <Building className="h-6 w-6" />,
    monthlyPrice: 29.99,
    description: 'For teams and institutions that need full power',
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'Team management', included: true },
      { text: 'Custom AI training', included: true },
      { text: 'API access', included: true },
      { text: 'Dedicated support', included: true },
      { text: 'Analytics dashboard', included: true },
      { text: 'SSO authentication', included: true },
      { text: 'Unlimited study plans', included: true },
    ],
    cta: 'Contact Sales',
    popular: false,
    gradient: 'from-purple-600 to-fuchsia-600',
  },
]

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: 'Can I switch plans at any time?',
    answer:
      'Yes! You can upgrade or downgrade your plan at any time. When upgrading, you\'ll get immediate access to new features and be prorated for the remainder of your billing cycle. Downgrades take effect at the start of your next billing period.',
  },
  {
    question: 'Is there a free trial for Pro or Enterprise?',
    answer:
      'Yes, both Pro and Enterprise plans come with a 14-day free trial. No credit card required to start. You\'ll have full access to all features during the trial period.',
  },
  {
    question: 'How does the annual billing work?',
    answer:
      'Annual billing gives you a 20% discount compared to monthly pricing. You pay for the full year upfront and save significantly. For example, Pro annual is $95.90/year instead of $119.88/year.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for Enterprise plans. All payments are securely processed through Stripe.',
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer:
      'Absolutely. You can cancel your subscription at any time from your account settings. You\'ll continue to have access to your plan features until the end of your current billing period. No cancellation fees apply.',
  },
]

function FAQAccordion({ item, index }: { item: FAQItem; index: number }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="glass-card rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors duration-200"
      >
        <span className="font-semibold text-foreground pr-4">{item.question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 text-muted-foreground leading-relaxed">
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false)
  const { data: session } = useSession()

  const getPrice = (monthlyPrice: number) => {
    if (monthlyPrice === 0) return 0
    return isAnnual
      ? Number((monthlyPrice * 0.8).toFixed(2))
      : monthlyPrice
  }

  const getAnnualTotal = (monthlyPrice: number) => {
    if (monthlyPrice === 0) return 0
    return Number((monthlyPrice * 0.8 * 12).toFixed(2))
  }

  const handleCTA = (plan: Plan) => {
    if (plan.monthlyPrice === 0) {
      window.location.assign('/register')
      return
    }
    if (session) {
      window.location.assign('/api/stripe/checkout')
    } else {
      window.location.assign('/register')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-[128px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-fuchsia-500/5 rounded-full blur-[128px]" />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Pricing Plans</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Choose Your{' '}
              <span className="magic-text">Learning Path</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Unlock the full power of AI-driven education. From free basics to enterprise solutions,
              find the perfect plan for your learning journey.
            </p>

            {/* Billing Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center justify-center gap-4"
            >
              <span
                className={`text-sm font-medium transition-colors duration-200 ${
                  !isAnnual ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                Monthly
              </span>
              <div className="relative">
                <Switch
                  checked={isAnnual}
                  onCheckedChange={setIsAnnual}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
              <span
                className={`text-sm font-medium transition-colors duration-200 ${
                  isAnnual ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                Annual
              </span>
              <Badge
                variant="secondary"
                className="bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20"
              >
                Save 20%
              </Badge>
            </motion.div>
          </motion.div>
        </section>

        {/* Pricing Cards */}
        <section className="pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">
              {plans.map((plan, index) => {
                const price = getPrice(plan.monthlyPrice)
                const isPopular = plan.popular

                return (
                  <motion.div
                    key={plan.name}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                    viewport={{ once: true }}
                    className={`relative ${isPopular ? 'md:-mt-4 md:mb-[-16px]' : ''}`}
                  >
                    {/* Popular glow effect */}
                    {isPopular && (
                      <div className="absolute -inset-[2px] rounded-2xl magic-gradient opacity-75 blur-sm" />
                    )}

                    <Card
                      className={`relative overflow-hidden transition-all duration-300 ${
                        isPopular
                          ? 'border-primary/50 shadow-2xl shadow-primary/20 bg-card/80 backdrop-blur-xl'
                          : 'glass-card bg-card/50 backdrop-blur-xl'
                      }`}
                    >
                      {/* Popular Badge */}
                      {isPopular && (
                        <div className="absolute top-0 right-0">
                          <div className="relative">
                            <div className="magic-gradient text-primary-foreground text-xs font-bold px-8 py-1.5 rounded-bl-xl">
                              Most Popular
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Gradient top accent */}
                      <div
                        className={`h-1 w-full bg-gradient-to-r ${plan.gradient}`}
                      />

                      <CardHeader className="pb-4 pt-6">
                        <div className="flex items-center gap-3 mb-2">
                          <div
                            className={`p-2.5 rounded-xl bg-gradient-to-br ${plan.gradient} text-white shadow-lg`}
                          >
                            {plan.icon}
                          </div>
                          <CardTitle className="text-xl font-bold">
                            {plan.name}
                          </CardTitle>
                        </div>
                        <CardDescription className="text-muted-foreground">
                          {plan.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="pb-6">
                        {/* Price */}
                        <div className="mb-6">
                          <div className="flex items-baseline gap-1">
                            <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                              ${price}
                            </span>
                            {plan.monthlyPrice > 0 && (
                              <span className="text-muted-foreground text-sm font-medium">
                                /{isAnnual ? 'mo' : 'mo'}
                              </span>
                            )}
                          </div>
                          {plan.monthlyPrice > 0 && isAnnual && (
                            <motion.p
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="text-sm text-muted-foreground mt-1"
                            >
                              ${getAnnualTotal(plan.monthlyPrice)} billed annually
                            </motion.p>
                          )}
                          {plan.monthlyPrice > 0 && !isAnnual && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Billed monthly
                            </p>
                          )}
                          {plan.monthlyPrice === 0 && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Free forever
                            </p>
                          )}
                        </div>

                        {/* Features */}
                        <ul className="space-y-3">
                          {plan.features.map((feature, featureIndex) => (
                            <motion.li
                              key={featureIndex}
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{
                                duration: 0.3,
                                delay: index * 0.15 + featureIndex * 0.05,
                              }}
                              viewport={{ once: true }}
                              className={`flex items-start gap-3 text-sm ${
                                feature.included
                                  ? 'text-foreground'
                                  : 'text-muted-foreground/40'
                              }`}
                            >
                              <div
                                className={`mt-0.5 flex-shrink-0 rounded-full p-0.5 ${
                                  feature.included
                                    ? 'bg-green-500/15 text-green-400'
                                    : 'bg-muted/50 text-muted-foreground/30'
                                }`}
                              >
                                <Check className="h-3.5 w-3.5" />
                              </div>
                              <span className={feature.included ? '' : 'line-through'}>
                                {feature.text}
                              </span>
                            </motion.li>
                          ))}
                        </ul>
                      </CardContent>

                      <CardFooter className="pb-6">
                        <Button
                          onClick={() => handleCTA(plan)}
                          className={`w-full py-5 text-sm font-semibold rounded-xl transition-all duration-300 ${
                            isPopular
                              ? 'magic-gradient text-white hover:opacity-90 shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02]'
                              : plan.monthlyPrice === 0
                              ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:scale-[1.02]'
                              : 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white hover:opacity-90 shadow-lg hover:scale-[1.02]'
                          }`}
                          size="lg"
                        >
                          {plan.cta}
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Comparison note */}
        <section className="pb-16 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="glass-card rounded-2xl p-6 sm:p-8">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Zap className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">All plans include</h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                256-bit SSL encryption &bull; 99.9% uptime guarantee &bull; Regular updates &bull;
                Mobile-friendly interface &bull; Multi-device sync &bull; GDPR compliant
              </p>
            </div>
          </motion.div>
        </section>

        {/* FAQ Section */}
        <section className="pb-20 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                Frequently Asked{' '}
                <span className="magic-text">Questions</span>
              </h2>
              <p className="text-muted-foreground text-lg">
                Everything you need to know about our pricing and plans.
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <FAQAccordion key={index} item={faq} index={index} />
              ))}
            </div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="pb-20 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="relative overflow-hidden rounded-3xl">
              <div className="absolute inset-0 magic-gradient opacity-90" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_70%)]" />

              <div className="relative z-10 px-6 sm:px-12 py-12 sm:py-16 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  Ready to Transform Your Learning?
                </h2>
                <p className="text-white/80 text-lg max-w-xl mx-auto mb-8">
                  Join thousands of students already using Magic AI to ace their exams and master
                  complex subjects.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button
                    size="lg"
                    className="bg-white text-purple-700 hover:bg-white/90 font-semibold px-8 py-5 rounded-xl shadow-lg hover:scale-[1.02] transition-all duration-300"
                    onClick={() => {
                      window.location.assign(session ? '/api/stripe/checkout' : '/register')
                    }}
                  >
                    Start Free Trial
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-5 rounded-xl transition-all duration-300"
                    onClick={() => {
                      const faqSection = document.querySelector('#contact')
                      if (faqSection) {
                        faqSection.scrollIntoView({ behavior: 'smooth' })
                      }
                    }}
                  >
                    Talk to Sales
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/50 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-semibold magic-text">Magic AI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Magic AI. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
