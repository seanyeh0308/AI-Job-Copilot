export const MODULES = [
  {
    id: "resume_optimization",
    title: "JD 解析与简历优化",
    description: "提取岗位要求，给出差距、关键词和可替换表达。"
  },
  {
    id: "interview_qa",
    title: "面试问答生成器",
    description: "生成通用、岗位、行为和简历追问，并附答题思路。"
  },
  {
    id: "match_analysis",
    title: "JD 匹配分析",
    description: "输出 0-100 匹配分、短板、风险和投递建议。"
  }
] as const;

export const FREE_USAGE_LIMIT = 3;

export type AnalysisModule = (typeof MODULES)[number]["id"];

export const MODULE_LABELS: Record<AnalysisModule, string> = {
  resume_optimization: "简历优化",
  interview_qa: "面试问答",
  match_analysis: "匹配分析"
};
