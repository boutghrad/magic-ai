import Stripe from "stripe"

// Stripe is only initialized when the secret key is available
// This prevents errors when Stripe is not configured
let stripeInstance: Stripe | null = null

function getStripe(): Stripe {
  if (!stripeInstance) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY is not configured")
    }
    stripeInstance = new Stripe(key, {
      apiVersion: "2023-10-16" as any,
    })
  }
  return stripeInstance
}

// Export a proxy that lazily initializes Stripe
export const stripe = new Proxy({} as Stripe, {
  get(target, prop) {
    const instance = getStripe()
    const value = (instance as any)[prop]
    return typeof value === 'function' ? value.bind(instance) : value
  },
})

export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    features: [
      "5 AI questions per day",
      "Basic math solver",
      "Limited quiz generation",
      "Community support",
    ],
    limits: { questionsPerDay: 5, quizzesPerMonth: 3, studyPlans: 1 },
  },
  pro: {
    name: "Pro",
    price: 9.99,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    features: [
      "Unlimited AI questions",
      "Advanced math solver with step-by-step",
      "Unlimited quiz generation",
      "Homework image upload",
      "Study planner",
      "Priority support",
    ],
    limits: { questionsPerDay: -1, quizzesPerMonth: -1, studyPlans: 10 },
  },
  enterprise: {
    name: "Enterprise",
    price: 29.99,
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
    features: [
      "Everything in Pro",
      "Team management",
      "Custom AI training",
      "API access",
      "Dedicated support",
      "Analytics dashboard",
      "SSO authentication",
    ],
    limits: { questionsPerDay: -1, quizzesPerMonth: -1, studyPlans: -1 },
  },
}

export type PlanType = keyof typeof PLANS
