import { FREE_USAGE_LIMIT } from "./constants";

type UsageClient = {
  from: (table: string) => any;
};

export type UsageSummary = {
  plan: "free" | "pro";
  usedCount: number;
  limit: number;
  remainingCount: number;
  isLimitReached: boolean;
};

export class FreeLimitReachedError extends Error {
  code = "FREE_LIMIT_REACHED" as const;

  constructor(limit: number) {
    super(`免费试用次数已用完。当前限制为 ${limit} 次，请升级到 Pro 后继续生成。`);
    this.name = "FreeLimitReachedError";
  }
}

export async function getUsageSummary(client: UsageClient, userId: string): Promise<UsageSummary> {
  const [{ count, error: usageError }, { data: profile, error: profileError }] = await Promise.all([
    client
      .from("usage_logs")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
    client.from("profiles").select("plan").eq("id", userId).single()
  ]);

  if (usageError || profileError) {
    throw new Error("Unable to load usage summary.");
  }

  const usedCount = count ?? 0;
  const plan = (profile?.plan ?? "free") as "free" | "pro";
  const remainingCount = Math.max(FREE_USAGE_LIMIT - usedCount, 0);

  return {
    plan,
    usedCount,
    limit: FREE_USAGE_LIMIT,
    remainingCount,
    isLimitReached: plan !== "pro" && usedCount >= FREE_USAGE_LIMIT
  };
}

export async function assertWithinFreeLimit(client: UsageClient, userId: string) {
  const summary = await getUsageSummary(client, userId);

  if (summary.plan === "pro") {
    return summary;
  }

  if (summary.isLimitReached) {
    throw new FreeLimitReachedError(summary.limit);
  }

  return summary;
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
