import type Stripe from "stripe";
import { createSupabaseAdminClient } from "./supabase/admin";
import { getStripeClient } from "./stripe";

export async function syncPaidCheckoutSession(userId: string, sessionId?: string) {
  if (!sessionId || !sessionId.startsWith("cs_")) {
    return { upgraded: false, reason: "missing_session" };
  }

  const stripe = getStripeClient();
  if (!stripe) {
    return { upgraded: false, reason: "stripe_not_configured" };
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const sessionUserId = session.metadata?.user_id ?? session.client_reference_id;

  if (sessionUserId !== userId) {
    return { upgraded: false, reason: "user_mismatch" };
  }

  if (session.payment_status !== "paid") {
    return { upgraded: false, reason: "not_paid" };
  }

  await grantProAccess(userId, session);
  return { upgraded: true, reason: "paid" };
}

export async function grantProAccess(userId: string, session: Stripe.Checkout.Session) {
  const supabase = createSupabaseAdminClient();
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
