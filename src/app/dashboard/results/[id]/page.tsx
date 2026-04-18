import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil } from "lucide-react";
import { AnalysisForm } from "@/components/analysis-form";
import { ResultRenderer } from "@/components/result-renderer";
import { ButtonLink } from "@/components/ui/button";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AnalysisRecord, AnalysisResultPayload } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ResultPage({ params }: { params: { id: string } }) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("analyses")
    .select("*, analysis_results(*)")
    .eq("id", params.id)
    .single();

  if (error || !data) {
    notFound();
  }

  const analysis = data as AnalysisRecord;
  const results = (analysis.analysis_results ?? []).reduce((acc, item) => {
    if (item.module === "resume_optimization") {
      acc.resume_optimization = item.result_json as AnalysisResultPayload["resume_optimization"];
    }
    if (item.module === "interview_qa") {
      acc.interview_qa = item.result_json as AnalysisResultPayload["interview_qa"];
    }
    if (item.module === "match_analysis") {
      acc.match_analysis = item.result_json as AnalysisResultPayload["match_analysis"];
    }
    return acc;
  }, {} as AnalysisResultPayload);

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <Link href="/dashboard/history" className="text-sm font-semibold text-brand">
            返回历史
          </Link>
          <h1 className="mt-3 text-3xl font-bold text-ink">{analysis.job_title || "未命名岗位"}</h1>
          <p className="mt-2 text-muted">{analysis.company_name || "未填写公司"}</p>
        </div>
        <ButtonLink href={`/dashboard/results/${analysis.id}#edit`} variant="secondary">
          <Pencil className="h-4 w-4" />
          再次编辑
        </ButtonLink>
      </section>

      <ResultRenderer results={results} selectedModules={analysis.selected_modules} />

      <div id="edit">
        <AnalysisForm
          analysisId={analysis.id}
          initialValues={{
            jobTitle: analysis.job_title,
            companyName: analysis.company_name,
            jdText: analysis.jd_text,
            resumeText: analysis.resume_text,
            selectedModules: analysis.selected_modules
          }}
        />
      </div>
    </div>
  );
}
