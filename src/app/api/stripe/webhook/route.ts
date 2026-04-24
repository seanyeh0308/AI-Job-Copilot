import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getStripeClient } from "@/lib/stripe";

export async function POST(request: Request) {
  const stripe = getStripeClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");

  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Stripe webhook is not configured yet." }, { status: 501 });
  }

  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid webhook signature.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();

  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(supabase, event.data.object as Stripe.Checkout.Session);
      break;
    default:
      break;
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(
  supabase: ReturnType<typeof createSupabaseAdminClient>,
  session: Stripe.Checkout.Session
) {
  const userId = session.metadata?.user_id ?? session.client_reference_id;
  if (!userId) {
    return;
  }

  const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id ?? null;

  await supabase.from("profiles").update({ plan: "pro" }).eq("id", userId);

  await supabase.from("payment_records").insert({
    user_id: userId,
    stripe_customer_id: customerId,
    stripe_subscription_id: null,
    status: session.payment_status,
    amount: session.amount_total,
    currency: session.currency,
    raw_payload: session
  });
}
