import { siteConfig } from "@/lib/site";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      <article className="mx-auto max-w-3xl px-4 py-14">
        <a className="text-sm font-semibold text-brand" href="/">
          {siteConfig.name}
        </a>
        <h1 className="mt-6 text-4xl font-bold text-ink">Privacy Policy</h1>
        <p className="mt-3 text-sm text-muted">Effective date: {siteConfig.effectiveDate}</p>

        <div className="mt-10 space-y-8 text-sm leading-7 text-muted">
          <section>
            <h2 className="text-xl font-semibold text-ink">1. Information we collect</h2>
            <p className="mt-3">
              We may collect account information, email address, authentication data, payment status, product usage data,
              job descriptions, resumes, and other text you submit to generate results.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-ink">2. How we use information</h2>
            <p className="mt-3">
              We use information to provide the service, generate AI results, maintain accounts, process payments,
              prevent abuse, improve reliability, and respond to support requests.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-ink">3. Service providers</h2>
            <p className="mt-3">
              We may use trusted providers for hosting, authentication, database storage, AI processing, and payments.
              These providers process information only as needed to deliver their services.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-ink">4. Data retention</h2>
            <p className="mt-3">
              We retain account and analysis data while your account is active or as needed for security, support,
              accounting, and legal obligations. You may request deletion by contacting us.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-ink">5. Your choices</h2>
            <p className="mt-3">
              You may request access, correction, or deletion of your personal information by contacting
              {" "}{siteConfig.contactEmail}. Some records may need to be retained for legal, tax, security, or fraud
              prevention reasons.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-ink">6. Contact</h2>
            <p className="mt-3">For privacy questions, contact {siteConfig.contactEmail}.</p>
          </section>
        </div>
      </article>
    </main>
  );
}
