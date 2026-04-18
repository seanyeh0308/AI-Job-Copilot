import type { AnalysisModule } from "@/lib/constants";

const sharedRules = `
你是 AI Job Copilot，一个严谨的求职辅导助手。
必须遵守：
- 只基于用户提供的 JD 与简历内容分析，不虚构用户经历、公司、项目、证书或年限。
- 如果信息不足，明确写入 missing_information 或建议补充信息。
- 输出要具体、可执行，贴近真实招聘语境，避免空泛套话。
- 返回严格 JSON，不要 Markdown，不要解释 JSON 外的内容。
`;

export function buildPrompt(module: AnalysisModule, jdText: string, resumeText: string) {
  const input = `
职位描述 JD：
${jdText}

用户简历：
${resumeText}
`;

  if (module === "resume_optimization") {
    return `${sharedRules}
任务：完成 JD 解析与简历优化。
JSON 结构：
{
  "jd_requirements": {
    "responsibilities": ["..."],
    "hard_skills": ["..."],
    "soft_skills": ["..."],
    "keywords": ["..."],
    "nice_to_have": ["..."]
  },
  "gap_analysis": ["..."],
  "suggestions": {
    "summary": ["..."],
    "experience": ["..."],
    "skills": ["..."],
    "education": ["..."]
  },
  "rewrites": [
    {"before": "简历原句或概括", "after": "可直接替换的优化表达", "reason": "为什么这样改"}
  ],
  "ats_keywords": ["..."],
  "missing_information": ["..."]
}
${input}`;
  }

  if (module === "interview_qa") {
    return `${sharedRules}
任务：生成面试问答清单。至少包含 12 个问题，覆盖 general、role_related、behavioral_star、resume_follow_up。
每个问题必须有中文答题思路和英文简答版。
JSON 结构：
{
  "questions": [
    {
      "category": "general",
      "question": "...",
      "answer_approach_zh": "...",
      "concise_answer_en": "..."
    }
  ]
}
${input}`;
  }

  return `${sharedRules}
任务：完成 JD 匹配分析。评分必须为 0-100 的整数，结论只能是“建议投递”“谨慎投递”“不建议优先投递”之一。
JSON 结构：
{
  "overall_score": 75,
  "dimension_scores": {
    "experience": 0,
    "skills": 0,
    "industry_relevance": 0,
    "language": 0,
    "nice_to_have": 0
  },
  "strengths": ["..."],
  "weaknesses": ["..."],
  "priority_actions": ["..."],
  "risks": ["..."],
  "recommendation": "谨慎投递"
}
${input}`;
}
