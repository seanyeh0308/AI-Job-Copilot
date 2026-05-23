"use client";

import { clsx } from "clsx";
import { ExternalLink, Mail, QrCode } from "lucide-react";
import type { ButtonVariant } from "./ui/button";
import { siteConfig } from "@/lib/site";

type UpgradeButtonProps = {
  label?: string;
  variant?: ButtonVariant;
  className?: string;
};

export function UpgradeButton({
  label = "Upgrade to Pro",
  variant = "primary",
  className
}: UpgradeButtonProps) {
  return (
    <div
      className={clsx(
        "rounded-lg border border-line bg-white p-4 shadow-sm",
        variant === "secondary" ? "bg-slate-50" : null,
        className
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="mx-auto flex h-48 w-44 shrink-0 items-center justify-center rounded-md border border-line bg-white p-2">
          <img
            src={siteConfig.paypalQrCodePath}
            alt={`PayPal payment QR code for ${siteConfig.name}`}
            className="h-full w-full object-contain"
          />
        </div>

        <div className="min-w-0 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-brand">
            <QrCode className="h-4 w-4" />
            <span>{label}</span>
          </div>
          <p className="text-sm leading-6 text-muted">
            Scan the PayPal QR code to buy Pro access, or open the PayPal payment page directly.
          </p>
          <p className="text-xs leading-5 text-muted">
            After payment, email your account address and receipt to {siteConfig.contactEmail} so we can activate Pro
            access.
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href={siteConfig.paypalPaymentLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-brand px-3 text-sm font-semibold text-white transition hover:bg-blue-900"
            >
              <ExternalLink className="h-4 w-4" />
              Open PayPal
            </a>
            <a
              href={`mailto:${siteConfig.contactEmail}?subject=AI%20Job%20Copilot%20Pro%20activation`}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-line bg-white px-3 text-sm font-semibold text-ink transition hover:bg-slate-50"
            >
              <Mail className="h-4 w-4" />
              Email receipt
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
