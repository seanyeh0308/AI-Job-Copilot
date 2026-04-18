import { NextResponse } from "next/server";
import { analysisInputSchema } from "@/lib/validations";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { generateModuleResult } from "@/lib/ai/openai";
import { assertWithinFreeLimit, recordUsage } from "@/lib/usage";
import type { AnalysisModule } from "@/lib/constants";

const activeRequests = new Map<string, number>();

export async function GET() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("analyses")
    .select("*, analysis_results(*)")
    .order("updated_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ analyses: data });
}

export async function POST(request: Request) {
  const supabase = createSupabaseServerClient();
  let analysisId: string | null = null;
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (isDuplicate(user.id)) {
    return NextResponse.json({ error: "请等待当前分析完成后再提交。" }, { status: 429 });
  }

  activeRequests.set(user.id, Date.now());

  try {
    const body = await request.json();
    const input = analysisInputSchema.parse(body);

    await assertWithinFreeLimit(supabase, user.id);

    const { data: analysis, error: insertError } = await supabase
      .from("analyses")
      .insert({
        user_id: user.id,
        job_title: input.jobTitle || null,
        company_name: input.companyName || null,
        jd_text: input.jdText,
        resume_text: input.resumeText,
        selected_modules: input.selectedModules,
        status: "processing"
      })
      .select()
      .single();

    if (insertError || !analysis) {
      throw new Error(insertError?.message ?? "Unable to create analysis.");
    }

    analysisId = analysis.id;
    await generateAndSaveResults(supabase, analysis.id, input.selectedModules as AnalysisModule[], input.jdText, input.resumeText);
    await recordUsage(supabase, user.id, analysis.id);

    await supabase.from("analyses").update({ status: "completed" }).eq("id", analysis.id);

    return NextResponse.json({ id: analysis.id });
  } catch (error) {
    if (analysisId) {
      await supabase.from("analyses").update({ status: "failed" }).eq("id", analysisId);
    }
    const message = error instanceof Error ? error.message : "分析生成失败。";
    return NextResponse.json({ error: message }, { status: 400 });
  } finally {
    activeRequests.delete(user.id);
  }
}

function isDuplicate(userId: string) {
  const last = activeRequests.get(userId);
  return Boolean(last && Date.now() - last < 60_000);
}

async function generateAndSaveResults(
  supabase: ReturnType<typeof createSupabaseServerClient>,
  analysisId: string,
  modules: AnalysisModule[],
  jdText: string,
  resumeText: string
) {
  const results = await Promise.all(
    modules.map(async (module) => ({
      analysis_id: analysisId,
      module,
      result_json: await generateModuleResult(module, jdText, resumeText)
    }))
  );

  const { error } = await supabase.from("analysis_results").insert(results);
  if (error) {
    throw new Error(error.message);
  }
}
