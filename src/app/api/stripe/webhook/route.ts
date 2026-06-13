import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { db } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const headersList = await headers()
    const signature = headersList.get("stripe-signature")

    if (!signature) {
      return NextResponse.json({ error: "No signature" }, { status: 400 })
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    )

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any
        const userId = session.metadata?.userId
        const plan = session.metadata?.plan

        if (userId && plan) {
          await db.user.update({
            where: { id: userId },
            data: { plan },
          })
        }
        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as any
        const customerId = subscription.customer as string

        const user = await db.user.findFirst({
          where: { stripeCustomerId: customerId },
        })

        if (user) {
          await db.user.update({
            where: { id: user.id },
            data: { plan: subscription.metadata?.plan || user.plan },
          })
        }
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as any
        const customerId = subscription.customer as string

        const user = await db.user.findFirst({
          where: { stripeCustomerId: customerId },
        })

        if (user) {
          await db.user.update({
            where: { id: user.id },
            data: { plan: "free" },
          })
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    )
  }
}
