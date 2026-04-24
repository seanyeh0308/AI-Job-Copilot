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
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      await syncSubscriptionPlan(supabase, event.data.object as Stripe.Subscription);
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
  const subscriptionId =
    typeof session.subscription === "string" ? session.subscription : session.subscription?.id ?? null;

  await supabase.from("profiles").update({ plan: "pro" }).eq("id", userId);

  await supabase.from("payment_records").insert({
    user_id: userId,
    stripe_customer_id: customerId,
    stripe_subscription_id: subscriptionId,
    status: session.payment_status,
    amount: session.amount_total,
    currency: session.currency,
    raw_payload: session
  });
}

async function syncSubscriptionPlan(
  supabase: ReturnType<typeof createSupabaseAdminClient>,
  subscription: Stripe.Subscription
) {
  const nextPlan = ["active", "trialing"].includes(subscription.status) ? "pro" : "free";

  const { data: paymentRecord } = await supabase
    .from("payment_records")
    .select("user_id")
    .eq("stripe_subscription_id", subscription.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!paymentRecord?.user_id) {
    return;
  }

  await supabase.from("profiles").update({ plan: nextPlan }).eq("id", paymentRecord.user_id);
  await supabase.from("payment_records").insert({
    user_id: paymentRecord.user_id,
    stripe_customer_id: typeof subscription.customer === "string" ? subscription.customer : subscription.customer?.id ?? null,
    stripe_subscription_id: subscription.id,
    status: subscription.status,
    raw_payload: subscription
  });
}
