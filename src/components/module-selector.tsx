"use client";

import { CheckCircle2 } from "lucide-react";
import { clsx } from "clsx";
import { MODULES, type AnalysisModule } from "@/lib/constants";

export function ModuleSelector({
  value,
  onChange
}: {
  value: AnalysisModule[];
  onChange: (modules: AnalysisModule[]) => void;
}) {
  function toggle(module: AnalysisModule) {
    if (value.includes(module)) {
      onChange(value.filter((item) => item !== module));
      return;
    }

    onChange([...value, module]);
  }

  return (
    <div className="grid gap-3 md:grid-cols-3">
      {MODULES.map((module) => {
        const active = value.includes(module.id);
        return (
          <button
            key={module.id}
            type="button"
            onClick={() => toggle(module.id)}
            className={clsx(
              "min-h-32 rounded-lg border p-4 text-left transition",
              active ? "border-brand bg-blue-50 shadow-sm" : "border-line bg-white hover:border-slate-300 hover:bg-slate-50"
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-ink">{module.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{module.description}</p>
              </div>
              <CheckCircle2 className={clsx("h-5 w-5 shrink-0", active ? "text-brand" : "text-slate-300")} />
            </div>
          </button>
        );
      })}
    </div>
  );
}
