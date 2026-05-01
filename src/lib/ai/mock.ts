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
        responsibilities: ["Own core role outcomes", "Coordinate cross-functional delivery", "Use feedback and data to improve execution"],
        hard_skills: jdKeywords.slice(0, 8),
        soft_skills: ["Communication", "Problem decomposition", "Outcome orientation"],
        keywords: jdKeywords,
        nice_to_have: missing.slice(0, 3)
      },
      gap_analysis: missing.length
        ? missing.map((keyword) => `The resume does not clearly show evidence for "${keyword}".`)
        : ["The resume covers the core JD keywords well. Add more quantified outcomes where possible."],
      suggestions: {
        summary: ["Add target-role keywords to the summary and state the strongest relevant advantage in one sentence."],
        experience: ["Rewrite each experience bullet with action, method, and outcome. Add metrics, scale, or business impact where true."],
        skills: ["Move high-frequency JD skills higher and separate expert, hands-on, and familiar skills."],
        education: ["Add relevant coursework, projects, or certifications if they support the target role."]
      },
      rewrites: [
        {
          before: "Responsible for related project work.",
          after: "Led project delivery from requirement breakdown to launch review, coordinating product, design, and engineering stakeholders to hit key milestones.",
          reason: "Clarifies ownership and collaboration without inventing specific metrics."
        }
      ],
      ats_keywords: jdKeywords.slice(0, 12),
      missing_information: ["Add quantified outcomes, tools used, business context, and scale for the most recent two to three roles."]
    };
  }

  if (module === "interview_qa") {
    payload.interview_qa = {
      questions: [
        {
          category: "general",
          question: "Walk me through your background and explain why you are a strong fit for this role.",
          answer_approach_zh: "Structure the answer around your background, core strengths, most relevant experience, and motivation for this role.",
          concise_answer_en: "My background aligns with the key responsibilities in this role, and I can connect business needs with practical execution."
        },
        {
          category: "role_related",
          question: `How have you used ${jdKeywords[0] ?? "a core skill"} to solve a practical problem?`,
          answer_approach_zh: "Choose a real example, explain the context, the action you took, the method used, and the result.",
          concise_answer_en: "I used this skill to clarify the problem, execute the plan, and improve the outcome in a measurable way."
        },
        {
          category: "behavioral_star",
          question: "Tell me about a time you delivered a project with limited resources.",
          answer_approach_zh: "Use STAR: situation, task, action, and result. Emphasize prioritization and stakeholder alignment.",
          concise_answer_en: "I focused on the highest-impact work, aligned stakeholders early, and delivered the project within constraints."
        },
        {
          category: "resume_follow_up",
          question: "Which resume experience best proves you can succeed in this role?",
          answer_approach_zh: "Pick the experience that maps most directly to the JD and avoid simply repeating the resume.",
          concise_answer_en: "The most relevant experience is the one where I delivered similar outcomes in a comparable context."
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
      strengths: resumeKeywords.slice(0, 4).map((keyword) => `The resume already shows capability related to ${keyword}.`),
      weaknesses: missing.map((keyword) => `The JD emphasizes ${keyword}, but the resume evidence is not yet strong enough.`),
      priority_actions: [
        "Add project outcomes that directly support the JD's highest-priority keywords.",
        "Move the most relevant experience into the top half of the resume.",
        "Add measurable results or business context for critical skills."
      ],
      risks: missing.length
        ? ["Insufficient coverage of required hard skills may reduce ATS or recruiter screening performance."]
        : ["The main remaining risk is that quantified results are not specific enough."],
      recommendation: score >= 75 ? "Strong fit" : score >= 60 ? "Apply with caution" : "Low priority"
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
