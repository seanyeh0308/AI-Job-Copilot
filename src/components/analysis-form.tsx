"use client";

import { Loader2, Wand2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { UpgradeButton } from "./upgrade-button";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { ModuleSelector } from "./module-selector";
import { MODULES, type AnalysisModule } from "@/lib/constants";
import type { UsageSummary } from "@/lib/usage";

type InitialValues = {
  jobTitle?: string | null;
  companyName?: string | null;
  jdText?: string;
  resumeText?: string;
  selectedModules?: AnalysisModule[];
};

type ApiErrorResponse = {
  error?: string;
  code?: string;
};

export function AnalysisForm({
  initialValues,
  analysisId,
  usageSummary
}: {
  initialValues?: InitialValues;
  analysisId?: string;
  usageSummary?: UsageSummary;
}) {
  const router = useRouter();
  const [jobTitle, setJobTitle] = useState(initialValues?.jobTitle ?? "");
  const [companyName, setCompanyName] = useState(initialValues?.companyName ?? "");
  const [jdText, setJdText] = useState(initialValues?.jdText ?? "");
  const [resumeText, setResumeText] = useState(initialValues?.resumeText ?? "");
  const [selectedModules, setSelectedModules] = useState<AnalysisModule[]>(
    initialValues?.selectedModules ?? MODULES.map((module) => module.id)
  );
  const [error, setError] = useState("");
  const [limitReached, setLimitReached] = useState(usageSummary?.isLimitReached ?? false);
  const [loading, setLoading] = useState(false);

  const currentUsage = useMemo(() => {
    if (!usageSummary) {
      return undefined;
    }

    return {
      ...usageSummary,
      isLimitReached: usageSummary.plan === "pro" ? false : limitReached || usageSummary.isLimitReached
    };
  }, [limitReached, usageSummary]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(analysisId ? `/api/analyses/${analysisId}` : "/api/analyses", {
        method: analysisId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle, companyName, jdText, resumeText, selectedModules })
      });

      const data = (await response.json()) as ApiErrorResponse & { id?: string };
      if (!response.ok) {
        if (data.code === "FREE_LIMIT_REACHED") {
          setLimitReached(true);
        }

        throw new Error(data.error ?? "Failed to generate analysis.");
      }

      router.push(`/dashboard/results/${data.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate analysis.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-semibold text-ink">{analysisId ? "Edit and Regenerate" : "Create a New Analysis"}</h1>
          <p className="mt-1 text-sm text-muted">
            Paste the job description and resume, choose the modules you want, and generate structured AI output.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentUsage ? (
            <div className="rounded-lg border border-line bg-slate-50 p-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                      {currentUsage.plan === "pro" ? "Pro Plan" : "Free Plan"}
                    </span>
                    {currentUsage.plan === "free" ? (
                      <span className="text-sm text-muted">
                        {currentUsage.usedCount}/{currentUsage.limit} analyses used
                      </span>
                    ) : (
                      <span className="text-sm text-emerald-600">Unlimited analyses unlocked</span>
                    )}
                  </div>
                  <p className="text-sm leading-6 text-muted">
                    {currentUsage.plan === "pro"
                      ? "Your account can keep generating resume optimization, interview Q&A, and match analysis."
                      : currentUsage.isLimitReached
                        ? "You have reached the free usage limit. Upgrade to Pro to continue generating new results."
                        : `${currentUsage.remainingCount} free analyses remaining before the upgrade prompt appears.`}
                  </p>
                </div>

                {currentUsage.plan === "free" ? (
                  <UpgradeButton
                    variant={currentUsage.isLimitReached ? "primary" : "secondary"}
                    label={currentUsage.isLimitReached ? "Unlock Pro" : "Upgrade Early"}
                  />
                ) : null}
              </div>
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-ink">Job Title</span>
              <input
                value={jobTitle}
                onChange={(event) => setJobTitle(event.target.value)}
                className="h-11 w-full rounded-md border border-line bg-white px-3 outline-none focus:border-brand"
                placeholder="Senior Product Manager"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-ink">Company Name</span>
              <input
                value={companyName}
                onChange={(event) => setCompanyName(event.target.value)}
                className="h-11 w-full rounded-md border border-line bg-white px-3 outline-none focus:border-brand"
                placeholder="Company"
              />
            </label>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <label className="block space-y-2 rounded-lg border border-line bg-slate-50 p-4">
              <span className="text-sm font-semibold text-ink">Job Description</span>
              <textarea
                value={jdText}
                onChange={(event) => setJdText(event.target.value)}
                className="min-h-[360px] w-full resize-y rounded-md border border-line bg-white p-4 text-sm leading-7 outline-none transition focus:border-brand focus:ring-2 focus:ring-blue-100"
                placeholder="Paste the full JD, including responsibilities, required skills, and preferred qualifications."
              />
            </label>

            <label className="block space-y-2 rounded-lg border border-line bg-slate-50 p-4">
              <span className="text-sm font-semibold text-ink">Resume Content</span>
              <textarea
                value={resumeText}
                onChange={(event) => setResumeText(event.target.value)}
                className="min-h-[360px] w-full resize-y rounded-md border border-line bg-white p-4 text-sm leading-7 outline-none transition focus:border-brand focus:ring-2 focus:ring-blue-100"
                placeholder="Paste the current resume text. File upload can be added in the next iteration."
              />
            </label>
          </div>

          <div className="space-y-2">
            <span className="text-sm font-medium text-ink">Choose Modules</span>
            <ModuleSelector value={selectedModules} onChange={setSelectedModules} />
          </div>

          {error ? (
            <div className="space-y-3 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <p>{error}</p>
              {limitReached ? <UpgradeButton label="Continue with Pro" /> : null}
            </div>
          ) : null}

          <div className="flex justify-end">
            <Button type="submit" disabled={loading || currentUsage?.isLimitReached}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
              {loading ? "Generating..." : "Generate Analysis"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
