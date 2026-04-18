import { NextResponse } from "next/server";
import { analysisInputSchema } from "@/lib/validations";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { generateModuleResult } from "@/lib/ai/openai";
import { assertWithinFreeLimit, recordUsage } from "@/lib/usage";
import type { AnalysisModule } from "@/lib/constants";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
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
    .eq("id", params.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json({ analysis: data });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const input = analysisInputSchema.parse(body);

    await assertWithinFreeLimit(supabase, user.id);

    const { error: updateError } = await supabase
      .from("analyses")
      .update({
        job_title: input.jobTitle || null,
        company_name: input.companyName || null,
        jd_text: input.jdText,
        resume_text: input.resumeText,
        selected_modules: input.selectedModules,
        status: "processing",
        updated_at: new Date().toISOString()
      })
      .eq("id", params.id);

    if (updateError) {
      throw new Error(updateError.message);
    }

    await supabase.from("analysis_results").delete().eq("analysis_id", params.id);

    const results = await Promise.all(
      (input.selectedModules as AnalysisModule[]).map(async (module) => ({
        analysis_id: params.id,
        module,
        result_json: await generateModuleResult(module, input.jdText, input.resumeText)
      }))
    );

    const { error: resultsError } = await supabase.from("analysis_results").insert(results);
    if (resultsError) {
      throw new Error(resultsError.message);
    }

    await recordUsage(supabase, user.id, params.id);
    await supabase.from("analyses").update({ status: "completed" }).eq("id", params.id);

    return NextResponse.json({ id: params.id });
  } catch (error) {
    await supabase.from("analyses").update({ status: "failed" }).eq("id", params.id);
    const message = error instanceof Error ? error.message : "重新生成失败。";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
