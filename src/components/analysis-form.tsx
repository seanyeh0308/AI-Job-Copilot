"use client";

import { Loader2, Wand2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { ModuleSelector } from "./module-selector";
import { MODULES, type AnalysisModule } from "@/lib/constants";

type InitialValues = {
  jobTitle?: string | null;
  companyName?: string | null;
  jdText?: string;
  resumeText?: string;
  selectedModules?: AnalysisModule[];
};

export function AnalysisForm({ initialValues, analysisId }: { initialValues?: InitialValues; analysisId?: string }) {
  const router = useRouter();
  const [jobTitle, setJobTitle] = useState(initialValues?.jobTitle ?? "");
  const [companyName, setCompanyName] = useState(initialValues?.companyName ?? "");
  const [jdText, setJdText] = useState(initialValues?.jdText ?? "");
  const [resumeText, setResumeText] = useState(initialValues?.resumeText ?? "");
  const [selectedModules, setSelectedModules] = useState<AnalysisModule[]>(
    initialValues?.selectedModules ?? MODULES.map((module) => module.id)
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(analysisId ? `/api/analyses/${analysisId}` : "/api/analyses", {
        method: analysisId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle, companyName, jdText, resumeText, selectedModules })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "生成失败，请稍后重试。");
      }

      router.push(`/dashboard/results/${data.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成失败，请稍后重试。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-semibold text-ink">{analysisId ? "编辑并重新生成" : "新建分析任务"}</h1>
          <p className="mt-1 text-sm text-muted">粘贴 JD 与简历，选择需要生成的模块。</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-ink">岗位名称</span>
              <input
                value={jobTitle}
                onChange={(event) => setJobTitle(event.target.value)}
                className="h-11 w-full rounded-md border border-line bg-white px-3 outline-none focus:border-brand"
                placeholder="Product Manager"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-ink">公司名称</span>
              <input
                value={companyName}
                onChange={(event) => setCompanyName(event.target.value)}
                className="h-11 w-full rounded-md border border-line bg-white px-3 outline-none focus:border-brand"
                placeholder="Company"
              />
            </label>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <label className="block space-y-2 rounded-lg border border-line bg-slate-50 p-4">
              <span className="text-sm font-semibold text-ink">职位描述 JD</span>
              <textarea
                value={jdText}
                onChange={(event) => setJdText(event.target.value)}
                className="min-h-[360px] w-full resize-y rounded-md border border-line bg-white p-4 text-sm leading-7 outline-none transition focus:border-brand focus:ring-2 focus:ring-blue-100"
                placeholder="粘贴完整职位描述，包括职责、要求、加分项等。"
              />
            </label>

            <label className="block space-y-2 rounded-lg border border-line bg-slate-50 p-4">
              <span className="text-sm font-semibold text-ink">简历内容</span>
              <textarea
                value={resumeText}
                onChange={(event) => setResumeText(event.target.value)}
                className="min-h-[360px] w-full resize-y rounded-md border border-line bg-white p-4 text-sm leading-7 outline-none transition focus:border-brand focus:ring-2 focus:ring-blue-100"
                placeholder="粘贴简历文本。文件上传已预留，可在后续迭代接入 PDF 解析。"
              />
            </label>
          </div>

          <div className="space-y-2">
            <span className="text-sm font-medium text-ink">选择功能模块</span>
            <ModuleSelector value={selectedModules} onChange={setSelectedModules} />
          </div>

          {error ? <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
              {loading ? "生成中" : "生成分析"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
