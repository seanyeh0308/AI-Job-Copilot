import type { AnalysisModule } from "@/lib/constants";

const sharedRules = `
You are AI Job Copilot, a careful career application assistant.
Rules:
- Analyze only the job description and resume content provided by the user.
- Do not invent experience, employers, projects, certifications, metrics, or years of experience.
- If information is missing, list it in missing_information or as a recommended addition.
- Make the output specific, practical, and close to real hiring language.
- Return strict JSON only. Do not include Markdown or explanatory text outside JSON.
- All user-facing output must be written in English.
`;

export function buildPrompt(module: AnalysisModule, jdText: string, resumeText: string) {
  const input = `
Job description:
${jdText}

Resume:
${resumeText}
`;

  if (module === "resume_optimization") {
    return `${sharedRules}
Task: complete job-description analysis and resume optimization.
JSON schema:
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
    {"before": "original resume sentence or summary", "after": "copy-ready improved wording", "reason": "why this edit helps"}
  ],
  "ats_keywords": ["..."],
  "missing_information": ["..."]
}
${input}`;
  }

  if (module === "interview_qa") {
    return `${sharedRules}
Task: generate an interview preparation list. Include at least 12 questions covering general, role_related, behavioral_star, and resume_follow_up.
Each question must include an answer approach and a concise English answer.
JSON schema:
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
Note: keep the key name answer_approach_zh for compatibility, but write the value in English.
${input}`;
  }

  return `${sharedRules}
Task: complete job-description match analysis. Scores must be integers from 0 to 100. recommendation must be one of "Strong fit", "Apply with caution", or "Low priority".
JSON schema:
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
  "recommendation": "Apply with caution"
}
${input}`;
}
