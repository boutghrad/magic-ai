import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { stripe, PLANS } from "@/lib/stripe"
import { db } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { plan } = await req.json()
    if (!plan || !["pro", "enterprise"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email! },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const planConfig = PLANS[plan as keyof typeof PLANS]
    if (!planConfig.priceId) {
      return NextResponse.json({ error: "Payment not configured yet" }, { status: 503 })
    }

    let customerId = user.stripeCustomerId

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        metadata: { userId: user.id },
      })
      customerId = customer.id
      await db.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      })
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: planConfig.priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?upgraded=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/pricing`,
      metadata: { userId: user.id, plan },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error("Stripe checkout error:", error)
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    )
  }
}
