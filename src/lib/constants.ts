export const MODULES = [
  {
    id: "resume_optimization",
    title: "JD Analysis and Resume Optimization",
    description: "Extract role requirements, identify gaps, surface keywords, and suggest stronger resume phrasing."
  },
  {
    id: "interview_qa",
    title: "Interview Q&A Generator",
    description: "Generate general, role-specific, behavioral, and resume follow-up questions with answer guidance."
  },
  {
    id: "match_analysis",
    title: "JD Match Analysis",
    description: "Score the resume against the role, highlight risks, and recommend whether to prioritize the application."
  }
] as const;

export const FREE_USAGE_LIMIT = 3;

export type AnalysisModule = (typeof MODULES)[number]["id"];

export const MODULE_LABELS: Record<AnalysisModule, string> = {
  resume_optimization: "Resume Optimization",
  interview_qa: "Interview Q&A",
  match_analysis: "Match Analysis"
};
