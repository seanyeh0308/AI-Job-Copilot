import { ArrowRight, BarChart3, FileCheck2, MessageSquareText } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    title: "简历按 JD 优化",
    description: "提取岗位职责、硬技能、关键词和加分项，给出可替换的简历表达。",
    icon: FileCheck2
  },
  {
    title: "面试问答准备",
    description: "生成通用、岗位、行为面试和简历追问，附中文思路与英文简答。",
    icon: MessageSquareText
  },
  {
    title: "岗位匹配分析",
    description: "输出总分、维度分、短板、风险和投递建议，帮助判断投入优先级。",
    icon: BarChart3
  }
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-surface">
      <section className="border-b border-line bg-white">
        <div className="mx-auto grid min-h-[680px] max-w-7xl items-center gap-10 px-4 py-12 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-accent">Resume, interview, job fit</p>
            <h1 className="mt-4 max-w-3xl text-5xl font-bold leading-tight text-ink md:text-6xl">AI Job Copilot</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
              面向求职者的 AI 求职助手。把职位描述和简历放在同一个上下文中，快速获得简历优化、面试准备和岗位匹配判断。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/auth">
                免费试用 <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink href="/auth" variant="secondary">
                登录
              </ButtonLink>
            </div>
          </div>
          <div className="rounded-lg border border-line bg-slate-950 p-5 text-white shadow-soft">
            <div className="rounded-md bg-white p-5 text-ink">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Match Score</span>
                <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">建议投递</span>
              </div>
              <p className="mt-5 text-6xl font-bold">82</p>
              <div className="mt-6 space-y-3">
                {["Product strategy", "SQL", "Stakeholder management"].map((item) => (
                  <div key={item} className="flex items-center justify-between rounded-md bg-slate-50 p-3">
                    <span className="text-sm">{item}</span>
                    <span className="text-sm font-semibold text-brand">Matched</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardContent>
                <feature.icon className="h-8 w-8 text-brand" />
                <h2 className="mt-5 text-lg font-semibold text-ink">{feature.title}</h2>
                <p className="mt-3 text-sm leading-6 text-muted">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
