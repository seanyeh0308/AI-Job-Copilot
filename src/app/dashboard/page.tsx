import { BarChart3, CheckCircle2, FileCheck2, MessageSquareText, Plus } from "lucide-react";
import Link from "next/link";
import { UpgradeButton } from "@/components/upgrade-button";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { HistoryList } from "@/components/history-list";
import { syncPaidCheckoutSession } from "@/lib/billing";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getUsageSummary } from "@/lib/usage";
import type { AnalysisRecord } from "@/lib/types";

export const dynamic = "force-dynamic";

const modules = [
  {
    title: "Resume Optimization",
    description: "Extract JD requirements, surface gaps, and generate ATS-friendly rewrites.",
    icon: FileCheck2
  },
  {
    title: "Interview Q&A Generator",
    description: "Prepare general, role-specific, STAR, and resume follow-up questions with answer guidance.",
    icon: MessageSquareText
  },
  {
    title: "JD Match Analysis",
    description: "Score overall fit, identify risks, and decide whether the role is worth prioritizing.",
    icon: BarChart3
  }
];

export default async function DashboardPage({
  searchParams
}: {
  searchParams?: { checkout?: string; session_id?: string };
}) {
  const supabase = createSupabaseServerClient();
  const [
    {
      data: { user }
    },
    analysesQuery
  ] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from("analyses").select("*").order("updated_at", { ascending: false }).limit(5)
  ]);

  if (!user) {
    return null;
  }

  const checkoutState = searchParams?.checkout;
  const checkoutSync =
    checkoutState === "success" ? await syncPaidCheckoutSession(user.id, searchParams?.session_id) : undefined;
  const usageSummary = await getUsageSummary(supabase, user.id);
  const analyses = (analysesQuery.data ?? []) as AnalysisRecord[];
  const latest = analyses[0];

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ink">Dashboard</h1>
          <p className="mt-2 text-muted">Create a new analysis, review your recent work, and manage your upgrade path.</p>
        </div>
        <ButtonLink href="/dashboard/new">
          <Plus className="h-4 w-4" />
          New Analysis
        </ButtonLink>
      </section>

      {checkoutState === "success" ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          {checkoutSync?.upgraded
            ? "Payment confirmed. Your Pro plan is active."
            : "Payment received. If your plan badge has not switched to Pro yet, wait a few seconds and refresh the page."}
        </div>
      ) : null}

      {checkoutState === "cancelled" ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          Checkout was cancelled. Your free plan is still active and you can upgrade again anytime.
        </div>
      ) : null}

      <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <Card>
          <CardContent className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                  {usageSummary.plan === "pro" ? "Pro Plan" : "Free Plan"}
                </span>
                {usageSummary.plan === "pro" ? (
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" />
                    Unlimited analyses
                  </span>
                ) : (
                  <span className="text-sm text-muted">
                    {usageSummary.usedCount}/{usageSummary.limit} analyses used
                  </span>
                )}
              </div>

              <div>
                <h2 className="text-xl font-semibold text-ink">
                  {usageSummary.plan === "pro" ? "Your Pro workflow is active." : "You are in the free trial window."}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
                  {usageSummary.plan === "pro"
                    ? "Keep generating resume rewrites, interview prep, and fit analysis without the free usage cap."
                    : usageSummary.isLimitReached
                      ? "You have used all free analyses. Upgrade to Pro to keep generating new results and edits."
                      : `${usageSummary.remainingCount} free analyses remain before the upgrade gate appears.`}
                </p>
              </div>
            </div>

            {usageSummary.plan === "free" ? (
              <UpgradeButton
                className="w-full lg:w-auto"
                label={usageSummary.isLimitReached ? "Unlock Pro Now" : "Upgrade to Pro"}
              />
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-semibold text-ink">Current Plan</h2>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border border-line bg-slate-50 p-4">
              <p className="text-sm text-muted">Plan Status</p>
              <p className="mt-2 text-2xl font-semibold text-ink">{usageSummary.plan === "pro" ? "Pro" : "Free"}</p>
            </div>
            <div className="rounded-lg border border-line bg-slate-50 p-4">
              <p className="text-sm text-muted">Usage</p>
              <p className="mt-2 text-2xl font-semibold text-ink">
                {usageSummary.plan === "pro" ? "Unlimited" : `${usageSummary.remainingCount} left`}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {modules.map((module) => (
          <Card key={module.title}>
            <CardContent>
              <module.icon className="h-8 w-8 text-brand" />
              <h2 className="mt-5 font-semibold text-ink">{module.title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted">{module.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-ink">Latest Analysis</h2>
          </CardHeader>
          <CardContent>
            {latest ? (
              <Link href={`/dashboard/results/${latest.id}`} className="block">
                <h3 className="text-lg font-semibold text-ink">{latest.job_title || "Untitled role"}</h3>
                <p className="mt-1 text-sm text-muted">{latest.company_name || "Company not specified"}</p>
                <p className="mt-4 line-clamp-4 text-sm leading-6 text-muted">{latest.jd_text}</p>
              </Link>
            ) : (
              <EmptyState
                title="No analyses yet"
                description="Start with a job description and resume to generate the first result."
                actionHref="/dashboard/new"
                actionLabel="Create Analysis"
              />
            )}
          </CardContent>
        </Card>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-ink">Recent History</h2>
            <Link href="/dashboard/history" className="text-sm font-semibold text-brand">
              View all
            </Link>
          </div>
          <HistoryList analyses={analyses} />
        </div>
      </section>
    </div>
  );
}
