import { HistoryList } from "@/components/history-list";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AnalysisRecord } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("analyses")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(50);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-ink">History</h1>
        <p className="mt-2 text-muted">Review, copy, or regenerate previous analyses.</p>
      </div>
      <HistoryList analyses={(data ?? []) as AnalysisRecord[]} />
    </div>
  );
}
