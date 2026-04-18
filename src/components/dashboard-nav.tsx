"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BriefcaseBusiness, History, LayoutDashboard, LogOut, Plus } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "./ui/button";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/new", label: "New Analysis", icon: Plus },
  { href: "/dashboard/history", label: "History", icon: History }
];

export function DashboardNav({ email }: { email?: string }) {
  const router = useRouter();

  async function signOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/auth");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-ink">
          <BriefcaseBusiness className="h-5 w-5 text-brand" />
          AI Job Copilot
        </Link>
        <nav className="flex flex-wrap items-center gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex h-10 items-center gap-2 rounded-md px-3 text-sm font-medium text-muted hover:bg-slate-100 hover:text-ink"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {email ? <span className="max-w-48 truncate text-sm text-muted">{email}</span> : null}
          <Button type="button" variant="secondary" onClick={signOut}>
            <LogOut className="h-4 w-4" />
            退出
          </Button>
        </div>
      </div>
    </header>
  );
}
