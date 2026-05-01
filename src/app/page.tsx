import { ArrowRight, BarChart3, CheckCircle2, FileCheck2, MessageSquareText, ShieldCheck } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/lib/site";

const features = [
  {
    title: "Resume optimization",
    description: "Turn a job description and resume into targeted bullet suggestions, keyword gaps, and stronger positioning.",
    icon: FileCheck2
  },
  {
    title: "Interview preparation",
    description: "Generate role-specific questions, answer outlines, and follow-up prompts based on the role you want.",
    icon: MessageSquareText
  },
  {
    title: "Job fit analysis",
    description: "See a practical match score, strengths, risks, and next actions before you spend time applying.",
    icon: BarChart3
  }
];

const deliverables = [
  "Resume improvement report",
  "Interview question set",
  "Job fit score and recommendation"
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-surface">
      <section className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-5">
          <a className="text-base font-bold text-ink" href="/">
            {siteConfig.name}
          </a>
          <nav className="flex flex-wrap items-center gap-4 text-sm font-medium text-muted">
            <a className="hover:text-ink" href="/pricing">
              Pricing
            </a>
            <a className="hover:text-ink" href="/terms">
              Terms
            </a>
            <a className="hover:text-ink" href="/privacy">
              Privacy
            </a>
            <a className="hover:text-ink" href="/refund-policy">
              Refunds
            </a>
          </nav>
        </div>
      </section>

      <section className="border-b border-line bg-white">
        <div className="mx-auto grid min-h-[620px] max-w-7xl items-center gap-10 px-4 py-12 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-accent">Resume, interview, job fit</p>
            <h1 className="mt-4 max-w-3xl text-5xl font-bold leading-tight text-ink md:text-6xl">
              AI help for sharper job applications
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
              Paste a job description and your resume, then get targeted resume suggestions, interview preparation,
              and a clear job fit analysis in one workflow.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/auth">
                Start free <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink href="/pricing" variant="secondary">
                View pricing
              </ButtonLink>
            </div>
            <div className="mt-8 grid gap-3 text-sm text-muted sm:grid-cols-3">
              {deliverables.map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-line bg-slate-950 p-5 text-white shadow-soft">
            <div className="rounded-md bg-white p-5 text-ink">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Match Score</span>
                <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">
                  Strong fit
                </span>
              </div>
              <p className="mt-5 text-6xl font-bold">82</p>
              <div className="mt-6 space-y-3">
                {["Product strategy", "SQL", "Stakeholder management"].map((item) => (
                  <div key={item} className="flex items-center justify-between rounded-md bg-slate-50 p-3">
                    <span className="text-sm">{item}</span>
                    <span className="text-sm font-semibold text-brand">Matched</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3 text-sm text-slate-200">
              <ShieldCheck className="h-5 w-5 text-sky-300" />
              <span>Built for job seekers who want faster, clearer application decisions.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardContent>
                <feature.icon className="h-8 w-8 text-brand" />
                <h2 className="mt-5 text-lg font-semibold text-ink">{feature.title}</h2>
                <p className="mt-3 text-sm leading-6 text-muted">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <footer className="border-t border-line bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-muted md:flex-row md:items-center md:justify-between">
          <p>&copy; 2026 {siteConfig.legalName}. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <a className="hover:text-ink" href="/terms">
              Terms
            </a>
            <a className="hover:text-ink" href="/privacy">
              Privacy
            </a>
            <a className="hover:text-ink" href="/refund-policy">
              Refund Policy
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
