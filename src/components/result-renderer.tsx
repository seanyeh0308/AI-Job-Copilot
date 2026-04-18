"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Lightbulb,
  MessageSquareText
} from "lucide-react";
import { MODULE_LABELS, type AnalysisModule } from "@/lib/constants";
import type { AnalysisResultPayload } from "@/lib/types";
import { CopyButton } from "./copy-button";
import { Card, CardContent, CardHeader } from "./ui/card";

export function ResultRenderer({
  results,
  selectedModules
}: {
  results: AnalysisResultPayload;
  selectedModules: AnalysisModule[];
}) {
  const availableModules = selectedModules.filter((module) => results[module]);
  const [active, setActive] = useState<AnalysisModule>(availableModules[0] ?? selectedModules[0]);
  const activeResult = results[active];
  const copyValue = useMemo(() => JSON.stringify(activeResult ?? {}, null, 2), [activeResult]);

  if (!availableModules.length) {
    return (
      <Card>
        <CardContent>
          <p className="text-sm text-muted">还没有可展示的分析结果。</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-ink">Analysis Report</h2>
            <p className="mt-1 text-sm text-muted">Review AI-generated insights by module.</p>
          </div>
          <CopyButton value={copyValue} />
        </CardHeader>
        <CardContent className="pb-0">
          <div className="flex flex-wrap gap-2 border-b border-line">
            {availableModules.map((module) => (
              <button
                key={module}
                onClick={() => setActive(module)}
                className={`-mb-px inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
                  active === module
                    ? "border-brand text-brand"
                    : "border-transparent text-muted hover:border-slate-300 hover:text-ink"
                }`}
                type="button"
              >
                {module === "resume_optimization" ? <FileText className="h-4 w-4" /> : null}
                {module === "interview_qa" ? <MessageSquareText className="h-4 w-4" /> : null}
                {module === "match_analysis" ? <BarChart3 className="h-4 w-4" /> : null}
                {MODULE_LABELS[module]}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {active === "resume_optimization" && results.resume_optimization ? (
        <BusinessResumeOptimizationView result={results.resume_optimization} />
      ) : null}
      {active === "interview_qa" && results.interview_qa ? <BusinessInterviewView result={results.interview_qa} /> : null}
      {active === "match_analysis" && results.match_analysis ? <BusinessMatchView result={results.match_analysis} /> : null}
    </div>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <section>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">{title}</h3>
      {items.length ? (
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={`${item}-${index}`} className="rounded-md bg-slate-50 p-3 text-sm leading-6 text-ink">
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted">暂无内容</p>
      )}
    </section>
  );
}

function ResumeOptimizationView({ result }: { result: NonNullable<AnalysisResultPayload["resume_optimization"]> }) {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2">
        <Section title="职责" items={result.jd_requirements.responsibilities} />
        <Section title="硬技能" items={result.jd_requirements.hard_skills} />
        <Section title="软技能" items={result.jd_requirements.soft_skills} />
        <Section title="关键词" items={result.jd_requirements.keywords} />
      </div>
      <Section title="差距分析" items={result.gap_analysis} />
      <div className="grid gap-4 md:grid-cols-2">
        <Section title="Summary 建议" items={result.suggestions.summary} />
        <Section title="Experience 建议" items={result.suggestions.experience} />
        <Section title="Skills 建议" items={result.suggestions.skills} />
        <Section title="Education 建议" items={result.suggestions.education} />
      </div>
      <section>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">优化前 / 推荐改写后</h3>
        <div className="space-y-3">
          {result.rewrites.map((rewrite, index) => (
            <div key={index} className="grid gap-3 rounded-lg border border-line p-4 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold text-muted">优化前</p>
                <p className="mt-2 text-sm leading-6 text-ink">{rewrite.before}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted">推荐改写后</p>
                <p className="mt-2 text-sm leading-6 text-ink">{rewrite.after}</p>
                <p className="mt-2 text-xs text-muted">{rewrite.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Section title="ATS 关键词" items={result.ats_keywords} />
      <Section title="建议补充信息" items={result.missing_information} />
    </div>
  );
}

function InterviewView({ result }: { result: NonNullable<AnalysisResultPayload["interview_qa"]> }) {
  return (
    <div className="space-y-4">
      {result.questions.map((item, index) => (
        <article key={index} className="rounded-lg border border-line p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-muted">{item.category}</span>
            <h3 className="text-base font-semibold text-ink">{item.question}</h3>
          </div>
          <p className="mt-3 text-sm leading-6 text-ink">{item.answer_approach_zh}</p>
          <p className="mt-3 rounded-md bg-blue-50 p-3 text-sm leading-6 text-blue-900">{item.concise_answer_en}</p>
        </article>
      ))}
    </div>
  );
}

function MatchView({ result }: { result: NonNullable<AnalysisResultPayload["match_analysis"]> }) {
  const dimensions = Object.entries(result.dimension_scores);

  return (
    <div className="space-y-8">
      <div className="rounded-lg bg-slate-900 p-6 text-white">
        <p className="text-sm text-slate-300">总体匹配度</p>
        <div className="mt-2 flex flex-wrap items-end gap-4">
          <span className="text-5xl font-bold">{result.overall_score}</span>
          <span className="mb-2 rounded-md bg-white px-3 py-1 text-sm font-semibold text-slate-900">
            {result.recommendation}
          </span>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-5">
        {dimensions.map(([name, score]) => (
          <div key={name} className="rounded-lg border border-line p-4">
            <p className="text-xs font-semibold uppercase text-muted">{name.replace("_", " ")}</p>
            <p className="mt-2 text-2xl font-bold text-ink">{score}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Section title="优势总结" items={result.strengths} />
        <Section title="主要短板" items={result.weaknesses} />
        <Section title="优先补强建议" items={result.priority_actions} />
        <Section title="风险提示" items={result.risks} />
      </div>
    </div>
  );
}

function BusinessReportCard({
  title,
  description,
  children
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <h3 className="font-semibold text-ink">{title}</h3>
        {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function BusinessMetricCard({
  label,
  value,
  tone = "neutral"
}: {
  label: string;
  value: string | number;
  tone?: "neutral" | "success" | "warning" | "info";
}) {
  const toneClass = {
    neutral: "bg-slate-50 text-ink",
    success: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-50 text-amber-700",
    info: "bg-blue-50 text-blue-700"
  }[tone];

  return (
    <div className="rounded-lg border border-line bg-white p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className={`mt-3 inline-flex rounded-md px-3 py-1 text-2xl font-semibold ${toneClass}`}>{value}</p>
    </div>
  );
}

function BusinessTagCloud({
  items,
  tone = "neutral"
}: {
  items: string[];
  tone?: "neutral" | "blue" | "green" | "amber";
}) {
  const toneClass = {
    neutral: "border-slate-200 bg-slate-50 text-slate-700",
    blue: "border-blue-100 bg-blue-50 text-blue-800",
    green: "border-emerald-100 bg-emerald-50 text-emerald-700",
    amber: "border-amber-100 bg-amber-50 text-amber-700"
  }[tone];

  if (!items.length) {
    return <p className="text-sm text-muted">No content yet.</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, index) => (
        <span key={`${item}-${index}`} className={`rounded-md border px-2.5 py-1 text-xs font-semibold ${toneClass}`}>
          {item}
        </span>
      ))}
    </div>
  );
}

function BusinessInsightList({
  items,
  tone = "neutral"
}: {
  items: string[];
  tone?: "neutral" | "warning" | "success";
}) {
  const iconClass =
    tone === "warning"
      ? "bg-amber-50 text-amber-700"
      : tone === "success"
        ? "bg-emerald-50 text-emerald-700"
        : "bg-blue-50 text-blue-700";

  if (!items.length) {
    return <p className="text-sm text-muted">No content yet.</p>;
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={`${item}-${index}`} className="flex gap-3 rounded-lg border border-line bg-white p-4">
          <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${iconClass}`}>
            {tone === "warning" ? <AlertTriangle className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
          </span>
          <p className="text-sm leading-6 text-ink">{item}</p>
        </div>
      ))}
    </div>
  );
}

function BusinessResumeOptimizationView({ result }: { result: NonNullable<AnalysisResultPayload["resume_optimization"]> }) {
  const keywordCount = result.jd_requirements.keywords.length;
  const gapCount = result.gap_analysis.length;
  const atsCount = result.ats_keywords.length;
  const missingCount = result.missing_information.length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <BusinessMetricCard label="JD Keywords" value={keywordCount} tone="info" />
        <BusinessMetricCard label="Resume Gaps" value={gapCount} tone={gapCount ? "warning" : "success"} />
        <BusinessMetricCard label="ATS Keywords" value={atsCount} tone="success" />
        <BusinessMetricCard label="Info to Add" value={missingCount} tone={missingCount ? "warning" : "neutral"} />
      </div>

      <BusinessReportCard title="JD Core Requirements" description="Key responsibilities, skills, and preferred qualifications extracted from the JD.">
        <div className="grid gap-5 lg:grid-cols-2">
          <BusinessRequirementBlock title="Responsibilities" items={result.jd_requirements.responsibilities} />
          <BusinessRequirementBlock title="Hard Skills" items={result.jd_requirements.hard_skills} tone="blue" />
          <BusinessRequirementBlock title="Soft Skills" items={result.jd_requirements.soft_skills} tone="green" />
          <BusinessRequirementBlock title="Nice-to-have" items={result.jd_requirements.nice_to_have} tone="amber" />
        </div>
      </BusinessReportCard>

      <BusinessReportCard title="Resume Gap Analysis" description="Prioritized issues to address before submitting this application.">
        <BusinessInsightList items={result.gap_analysis} tone="warning" />
      </BusinessReportCard>

      <BusinessReportCard title="Optimization Suggestions" description="Concrete edits grouped by resume section.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <BusinessSuggestionBlock title="Summary" items={result.suggestions.summary} />
          <BusinessSuggestionBlock title="Experience" items={result.suggestions.experience} />
          <BusinessSuggestionBlock title="Skills" items={result.suggestions.skills} />
          <BusinessSuggestionBlock title="Education" items={result.suggestions.education} />
        </div>
      </BusinessReportCard>

      <BusinessReportCard title="Before / Recommended Rewrite" description="Copy-ready phrasing that keeps the user's actual experience intact.">
        <div className="space-y-4">
          {result.rewrites.map((rewrite, index) => (
            <div key={index} className="rounded-lg border border-line bg-white">
              <div className="grid gap-0 lg:grid-cols-2">
                <div className="border-b border-line p-5 lg:border-b-0 lg:border-r">
                  <p className="text-xs font-semibold uppercase text-muted">Before</p>
                  <p className="mt-3 text-sm leading-7 text-slate-700">{rewrite.before}</p>
                </div>
                <div className="bg-blue-50/60 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold uppercase text-brand">Recommended Rewrite</p>
                    <CopyButton value={rewrite.after} />
                  </div>
                  <p className="mt-3 text-sm font-medium leading-7 text-ink">{rewrite.after}</p>
                </div>
              </div>
              <div className="border-t border-line bg-slate-50 px-5 py-3">
                <p className="text-xs font-semibold uppercase text-muted">Rationale</p>
                <p className="mt-1 text-sm leading-6 text-muted">{rewrite.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </BusinessReportCard>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <BusinessReportCard title="ATS Keyword Suggestions" description="Add these where they are true and supported by experience.">
          <div className="space-y-5">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase text-muted">Must Cover</p>
              <BusinessTagCloud items={result.ats_keywords.slice(0, 6)} tone="blue" />
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase text-muted">Recommended</p>
              <BusinessTagCloud items={result.ats_keywords.slice(6, 12)} tone="green" />
            </div>
          </div>
        </BusinessReportCard>
        <BusinessReportCard title="Information to Add" description="Missing evidence that would make the resume stronger.">
          <div className="rounded-lg border border-amber-100 bg-amber-50 p-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
              <div>
                <p className="font-semibold text-amber-900">Suggested additions</p>
                <div className="mt-3">
                  <BusinessInsightList items={result.missing_information} tone="warning" />
                </div>
              </div>
            </div>
          </div>
        </BusinessReportCard>
      </div>
    </div>
  );
}

function BusinessRequirementBlock({
  title,
  items,
  tone = "neutral"
}: {
  title: string;
  items: string[];
  tone?: "neutral" | "blue" | "green" | "amber";
}) {
  return (
    <div className="rounded-lg border border-line bg-slate-50 p-4">
      <p className="mb-3 text-sm font-semibold text-ink">{title}</p>
      <BusinessTagCloud items={items} tone={tone} />
    </div>
  );
}

function BusinessSuggestionBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-line bg-white p-4">
      <div className="mb-3 flex items-center gap-2">
        <ClipboardCheck className="h-4 w-4 text-brand" />
        <p className="font-semibold text-ink">{title}</p>
      </div>
      <BusinessInsightList items={items} />
    </div>
  );
}

function BusinessInterviewView({ result }: { result: NonNullable<AnalysisResultPayload["interview_qa"]> }) {
  const categories = Array.from(new Set(result.questions.map((question) => question.category)));

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <span key={category} className="rounded-md border border-line bg-white px-3 py-2 text-sm font-semibold text-muted">
              {category}
            </span>
          ))}
        </CardContent>
      </Card>

      <div className="space-y-4">
        {result.questions.map((item, index) => (
          <Card key={`${item.question}-${index}`}>
            <CardContent>
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-800">
                    {item.category}
                  </span>
                  <h3 className="mt-3 text-base font-semibold leading-7 text-ink">{item.question}</h3>
                </div>
                <CopyButton value={`${item.question}\n\n${item.answer_approach_zh}\n\n${item.concise_answer_en}`} />
              </div>
              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                <div className="rounded-lg border border-line bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase text-muted">中文答题思路</p>
                  <p className="mt-2 text-sm leading-7 text-ink">{item.answer_approach_zh}</p>
                </div>
                <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                  <p className="text-xs font-semibold uppercase text-blue-800">English concise answer</p>
                  <p className="mt-2 text-sm leading-7 text-blue-950">{item.concise_answer_en}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function BusinessMatchView({ result }: { result: NonNullable<AnalysisResultPayload["match_analysis"]> }) {
  const dimensions = Object.entries(result.dimension_scores);
  const strong = result.overall_score >= 75;
  const caution = result.overall_score >= 60 && result.overall_score < 75;

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardContent className="bg-slate-950 p-8 text-white">
          <div className="grid gap-8 lg:grid-cols-[220px_1fr] lg:items-center">
            <div className="flex h-40 w-40 items-center justify-center rounded-full border-4 border-white/20 bg-white/10">
              <span className="text-5xl font-semibold">{result.overall_score}</span>
            </div>
            <div>
              <span
                className={`rounded-md px-3 py-1 text-sm font-semibold ${
                  strong ? "bg-emerald-100 text-emerald-800" : caution ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"
                }`}
              >
                {result.recommendation}
              </span>
              <h2 className="mt-4 text-3xl font-semibold">Job Match Assessment</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                The score combines experience, skills, industry relevance, language ability, and nice-to-have qualifications.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <BusinessReportCard title="Dimension Breakdown" description="How the resume matches across key hiring criteria.">
        <div className="space-y-5">
          {dimensions.map(([name, score]) => (
            <div key={name}>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold text-ink">{businessDimensionLabel(name)}</p>
                <p className="text-sm font-semibold text-muted">{score}/100</p>
              </div>
              <div className="h-2.5 rounded-full bg-slate-100">
                <div
                  className={`h-2.5 rounded-full ${score >= 75 ? "bg-success" : score >= 60 ? "bg-warning" : "bg-red-500"}`}
                  style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </BusinessReportCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <BusinessReportCard title="Key Strengths" description="Why this application is competitive.">
          <BusinessInsightList items={result.strengths} tone="success" />
        </BusinessReportCard>
        <BusinessReportCard title="Areas to Strengthen" description="Gaps to address before applying.">
          <BusinessInsightList items={result.weaknesses} tone="warning" />
        </BusinessReportCard>
      </div>

      <BusinessReportCard title="Priority Action Items" description="The highest leverage edits before submission.">
        <BusinessInsightList items={result.priority_actions} />
      </BusinessReportCard>

      <div className="rounded-lg border border-amber-100 bg-amber-50 p-5">
        <div className="flex gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
          <div>
            <h3 className="font-semibold text-amber-950">Risk Notes</h3>
            <ul className="mt-3 space-y-2">
              {result.risks.map((risk, index) => (
                <li key={`${risk}-${index}`} className="text-sm leading-6 text-amber-900">
                  {risk}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function businessDimensionLabel(name: string) {
  const labels: Record<string, string> = {
    experience: "Experience",
    skills: "Skills",
    industry_relevance: "Industry Relevance",
    language: "Language Ability",
    nice_to_have: "Nice-to-have"
  };

  return labels[name] ?? name;
}
