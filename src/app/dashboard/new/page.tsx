import { AnalysisForm } from "@/components/analysis-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getUsageSummary } from "@/lib/usage";

export default async function NewAnalysisPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const usageSummary = user ? await getUsageSummary(supabase, user.id) : undefined;

  return <AnalysisForm usageSummary={usageSummary} />;
}
