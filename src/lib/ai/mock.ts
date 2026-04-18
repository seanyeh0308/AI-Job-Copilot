import type { AnalysisModule } from "@/lib/constants";
import type { AnalysisResultPayload } from "@/lib/types";

export function buildMockResult(module: AnalysisModule, jdText: string, resumeText: string) {
  const jdKeywords = extractKeywords(jdText);
  const resumeKeywords = extractKeywords(resumeText);
  const missing = jdKeywords.filter((keyword) => !resumeText.toLowerCase().includes(keyword.toLowerCase())).slice(0, 6);

  const payload: AnalysisResultPayload = {};

  if (module === "resume_optimization") {
    payload.resume_optimization = {
      jd_requirements: {
        responsibilities: ["交付岗位核心业务目标", "跨团队协作推进项目", "基于数据或业务反馈持续优化"],
        hard_skills: jdKeywords.slice(0, 8),
        soft_skills: ["沟通协作", "问题拆解", "结果导向"],
        keywords: jdKeywords,
        nice_to_have: missing.slice(0, 3)
      },
      gap_analysis: missing.length
        ? missing.map((keyword) => `简历中缺少或未突出 “${keyword}” 相关证据。`)
        : ["简历与 JD 的关键词覆盖较好，建议进一步补充量化结果。"],
      suggestions: {
        summary: ["在 Summary 中加入目标岗位关键词，并用 1 句话说明核心优势。"],
        experience: ["每段经历用“动作 + 方法 + 结果”表达，补充指标、规模、影响。"],
        skills: ["将 JD 高频硬技能前置，并区分熟练、使用过、了解。"],
        education: ["如果课程、项目或证书与岗位相关，补充到 Education 或 Projects。"]
      },
      rewrites: [
        {
          before: "负责相关项目工作。",
          after: "负责从需求拆解到上线复盘的完整项目推进，协调产品、设计与工程团队交付关键里程碑。",
          reason: "强化职责范围和协作场景，但不虚构具体指标。"
        }
      ],
      ats_keywords: jdKeywords.slice(0, 12),
      missing_information: ["建议补充最近 2-3 段经历的量化成果、工具栈和业务指标。"]
    };
  }

  if (module === "interview_qa") {
    payload.interview_qa = {
      questions: [
        {
          category: "general",
          question: "请用 2 分钟介绍一下你自己，并说明为什么适合这个岗位。",
          answer_approach_zh: "围绕目标岗位要求，按背景、核心能力、代表经历、求职动机组织。",
          concise_answer_en: "I have relevant experience in the key areas required for this role and can connect business needs with practical execution."
        },
        {
          category: "role_related",
          question: `你过去如何使用 ${jdKeywords[0] ?? "核心技能"} 解决实际问题？`,
          answer_approach_zh: "选择真实经历，说明问题背景、你的动作、使用的方法和结果。",
          concise_answer_en: "In my previous work, I used this skill to clarify the problem, execute the plan, and improve the outcome."
        },
        {
          category: "behavioral_star",
          question: "讲一次你在资源有限的情况下推动项目完成的经历。",
          answer_approach_zh: "用 STAR：情境、任务、行动、结果，重点讲取舍和沟通。",
          concise_answer_en: "I prioritized the highest-impact work, aligned stakeholders, and delivered the project within constraints."
        },
        {
          category: "resume_follow_up",
          question: "简历中最能证明你胜任该岗位的一段经历是什么？",
          answer_approach_zh: "选择与 JD 最匹配的经历，避免泛泛复述简历。",
          concise_answer_en: "The most relevant experience is the one where I delivered measurable outcomes in a similar context."
        }
      ]
    };
  }

  if (module === "match_analysis") {
    const score = Math.max(45, 82 - missing.length * 5);
    payload.match_analysis = {
      overall_score: score,
      dimension_scores: {
        experience: score,
        skills: Math.max(40, score - 8),
        industry_relevance: Math.max(45, score - 5),
        language: 70,
        nice_to_have: Math.max(35, score - 15)
      },
      strengths: resumeKeywords.slice(0, 4).map((keyword) => `简历已体现 ${keyword} 相关能力。`),
      weaknesses: missing.map((keyword) => `JD 强调 ${keyword}，但简历证据不足。`),
      priority_actions: ["补充与岗位关键词直接相关的项目成果", "将最匹配经历放到简历前半部分", "为关键技能增加量化结果或业务场景"],
      risks: missing.length ? ["可能因硬技能覆盖不足影响 ATS 或初筛通过率。"] : ["当前主要风险是量化成果表达不够充分。"],
      recommendation: score >= 75 ? "建议投递" : score >= 60 ? "谨慎投递" : "不建议优先投递"
    };
  }

  return payload[module];
}

function extractKeywords(text: string) {
  const matches = text
    .replace(/[^\p{L}\p{N}\s+#.]/gu, " ")
    .split(/\s+/)
    .filter((word) => word.length >= 3)
    .slice(0, 80);

  return Array.from(new Set(matches)).slice(0, 16);
}
