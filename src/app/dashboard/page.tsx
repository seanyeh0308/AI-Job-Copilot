import { BarChart3, FileCheck2, MessageSquareText, Plus } from "lucide-react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { HistoryList } from "@/components/history-list";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AnalysisRecord } from "@/lib/types";

export const dynamic = "force-dynamic";

const modules = [
  { title: "JD 解析与简历优化", description: "获得差距分析、ATS 关键词和可替换表达。", icon: FileCheck2 },
  { title: "面试问答生成器", description: "准备通用、岗位、行为和简历追问。", icon: MessageSquareText },
  { title: "JD 匹配分析", description: "判断投递优先级和主要风险。", icon: BarChart3 }
];

export default async function DashboardPage() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("analyses")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(5);

  const analyses = (data ?? []) as AnalysisRecord[];
  const latest = analyses[0];

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ink">Dashboard</h1>
          <p className="mt-2 text-muted">创建一次分析任务，保存结果，并随时重新生成。</p>
        </div>
        <ButtonLink href="/dashboard/new">
          <Plus className="h-4 w-4" />
          新建分析
        </ButtonLink>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {modules.map((module) => (
          <Card key={module.title}>
            <CardContent>
              <module.icon className="h-8 w-8 text-brand" />
              <h2 className="mt-5 font-semibold text-ink">{module.title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted">{module.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-ink">最近一次任务</h2>
          </CardHeader>
          <CardContent>
            {latest ? (
              <Link href={`/dashboard/results/${latest.id}`} className="block">
                <h3 className="text-lg font-semibold text-ink">{latest.job_title || "未命名岗位"}</h3>
                <p className="mt-1 text-sm text-muted">{latest.company_name || "未填写公司"}</p>
                <p className="mt-4 line-clamp-4 text-sm leading-6 text-muted">{latest.jd_text}</p>
              </Link>
            ) : (
              <EmptyState title="还没有任务" description="开始第一次 JD 与简历分析。" actionHref="/dashboard/new" actionLabel="新建分析" />
            )}
          </CardContent>
        </Card>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-ink">历史分析</h2>
            <Link href="/dashboard/history" className="text-sm font-semibold text-brand">
              查看全部
            </Link>
          </div>
          <HistoryList analyses={analyses} />
        </div>
      </section>
    </div>
  );
}
