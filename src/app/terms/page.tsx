import { siteConfig } from "@/lib/site";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <article className="mx-auto max-w-3xl px-4 py-14">
        <a className="text-sm font-semibold text-brand" href="/">
          {siteConfig.name}
        </a>
        <h1 className="mt-6 text-4xl font-bold text-ink">Terms and Conditions</h1>
        <p className="mt-3 text-sm text-muted">Effective date: {siteConfig.effectiveDate}</p>

        <div className="mt-10 space-y-8 text-sm leading-7 text-muted">
          <section>
            <h2 className="text-xl font-semibold text-ink">1. Service</h2>
            <p className="mt-3">
              {siteConfig.name} provides AI-assisted resume optimization, interview preparation, and job fit analysis
              for informational and productivity purposes. The service does not guarantee job interviews, job offers,
              immigration outcomes, salary outcomes, or hiring decisions.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-ink">2. User responsibilities</h2>
            <p className="mt-3">
              You are responsible for the information you submit and for reviewing AI-generated output before using it.
              Do not submit information that you do not have the right to use, and do not use the service for unlawful,
              misleading, discriminatory, or harmful purposes.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-ink">3. Payments</h2>
            <p className="mt-3">
              Paid access is sold as a one-time purchase unless a checkout page states otherwise. Taxes may be calculated
              and collected at checkout by our payment provider. Access may be limited, suspended, or terminated if a
              payment is reversed, disputed, or found to be fraudulent.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-ink">4. Refunds</h2>
            <p className="mt-3">
              Refund requests are handled under our Refund Policy. You can review it at /refund-policy or contact us at
              {" "}{siteConfig.contactEmail}.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-ink">5. Intellectual property</h2>
            <p className="mt-3">
              The service, software, design, and brand materials belong to {siteConfig.legalName}. You retain rights to
              your submitted resume and job materials. You may use generated outputs for your personal job search,
              subject to these terms.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-ink">6. Contact</h2>
            <p className="mt-3">For support or legal questions, contact {siteConfig.contactEmail}.</p>
          </section>
        </div>
      </article>
    </main>
  );
}
