"use client";

import { CreditCard, Loader2 } from "lucide-react";
import { useState } from "react";
import type { ButtonVariant } from "./ui/button";
import { Button } from "./ui/button";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function startCheckout() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(data.error ?? "Unable to start checkout.");
      }

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to start checkout.");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <Button type="button" variant={variant} className={className} onClick={startCheckout} disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
        {loading ? "Redirecting..." : label}
      </Button>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
