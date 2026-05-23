import { CheckCircle2 } from "lucide-react";
import { UpgradeButton } from "@/components/upgrade-button";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/lib/site";

const included = [
  "Resume optimization suggestions for a target role",
  "Interview questions and answer outlines",
  "Job fit score, risks, and application recommendation",
  "History access while your account remains active"
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-surface">
      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-4xl px-4 py-16">
          <a className="text-sm font-semibold text-brand" href="/">
            {siteConfig.name}
          </a>
          <h1 className="mt-6 text-4xl font-bold text-ink">Simple one-time pricing</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
            Buy Pro access once and use AI Job Copilot to prepare stronger applications without a recurring
            subscription.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12">
        <Card>
          <CardContent className="space-y-8">
            <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-accent">Pro access</p>
                <p className="mt-4 text-5xl font-bold text-ink">{siteConfig.price}</p>
                <p className="mt-3 text-sm text-muted">One-time payment via PayPal.</p>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-ink">Included deliverables</h2>
                <div className="mt-5 space-y-4">
                  {included.map((item) => (
                    <div key={item} className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                      <span className="text-sm leading-6 text-muted">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <UpgradeButton label="Pay with PayPal" />
          </CardContent>
        </Card>
      </section>

      <footer className="border-t border-line bg-white">
        <div className="mx-auto flex max-w-4xl flex-col gap-3 px-4 py-8 text-sm text-muted md:flex-row md:items-center md:justify-between">
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
