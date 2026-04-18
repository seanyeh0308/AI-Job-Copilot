import { FREE_USAGE_LIMIT } from "./constants";

type UsageClient = {
  // Supabase query builders are PromiseLike and heavily generic; this narrow helper
  // keeps usage logic isolated without coupling it to generated database types.
  from: (table: string) => any;
};

export async function assertWithinFreeLimit(client: UsageClient, userId: string) {
  const { count, error } = await client
    .from("usage_logs")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  if (error) {
    throw new Error("Unable to validate usage limit.");
  }

  if ((count ?? 0) >= FREE_USAGE_LIMIT) {
    throw new Error(`免费试用次数已用完。当前 MVP 限制为 ${FREE_USAGE_LIMIT} 次，请接入 Stripe 后升级。`);
  }
}

export async function recordUsage(client: UsageClient, userId: string, analysisId: string) {
  const { error } = await client.from("usage_logs").insert({
    user_id: userId,
    analysis_id: analysisId,
    action: "generate_analysis"
  });

  if (error) {
    throw new Error("Unable to record usage.");
  }
}
