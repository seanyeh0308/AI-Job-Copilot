import { siteConfig } from "@/lib/site";

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-white">
      <article className="mx-auto max-w-3xl px-4 py-14">
        <a className="text-sm font-semibold text-brand" href="/">
          {siteConfig.name}
        </a>
        <h1 className="mt-6 text-4xl font-bold text-ink">Refund Policy</h1>
        <p className="mt-3 text-sm text-muted">Effective date: {siteConfig.effectiveDate}</p>

        <div className="mt-10 space-y-8 text-sm leading-7 text-muted">
          <section>
            <h2 className="text-xl font-semibold text-ink">1. Refund window</h2>
            <p className="mt-3">
              You may request a refund within 14 days of purchase if the service does not work as described or if you
              purchased by mistake and have not made substantial use of the paid features.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-ink">2. Non-refundable cases</h2>
            <p className="mt-3">
              Refunds may be declined for abuse, fraud, repeated refund requests, completed chargebacks, or heavy use of
              paid features after purchase.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-ink">3. How to request a refund</h2>
            <p className="mt-3">
              Email {siteConfig.contactEmail} with the email used for purchase, purchase date, and a short explanation.
              We aim to respond within 5 business days.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-ink">4. Processing</h2>
            <p className="mt-3">
              Approved refunds are returned to the original payment method through our payment provider. Bank or card
              processing times may vary.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
