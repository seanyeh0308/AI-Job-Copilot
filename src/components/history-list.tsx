import Link from "next/link";
import { MODULE_LABELS } from "@/lib/constants";
import type { AnalysisRecord } from "@/lib/types";
import { EmptyState } from "./ui/empty-state";

export function HistoryList({ analyses }: { analyses: AnalysisRecord[] }) {
  if (!analyses.length) {
    return (
      <EmptyState
        title="暂无历史记录"
        description="新建一次分析任务后，结果会自动保存到这里。"
        actionHref="/dashboard/new"
        actionLabel="新建分析"
      />
    );
  }

  return (
    <div className="space-y-3">
      {analyses.map((analysis) => (
        <Link
          key={analysis.id}
          href={`/dashboard/results/${analysis.id}`}
          className="block rounded-lg border border-line bg-white p-5 shadow-sm transition hover:border-brand hover:shadow-soft"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-semibold text-ink">{analysis.job_title || "未命名岗位"}</h3>
              <p className="mt-1 text-sm text-muted">{analysis.company_name || "未填写公司"}</p>
            </div>
            <span className="text-sm text-muted">{new Date(analysis.updated_at).toLocaleString("zh-CN")}</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {analysis.selected_modules.map((module) => (
              <span key={module} className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-muted">
                {MODULE_LABELS[module]}
              </span>
            ))}
            <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
              {analysis.status}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
