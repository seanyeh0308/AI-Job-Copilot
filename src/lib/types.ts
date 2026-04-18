import type { AnalysisModule } from "./constants";

export type AnalysisStatus = "draft" | "processing" | "completed" | "failed";

export type ResumeOptimizationResult = {
  jd_requirements: {
    responsibilities: string[];
    hard_skills: string[];
    soft_skills: string[];
    keywords: string[];
    nice_to_have: string[];
  };
  gap_analysis: string[];
  suggestions: {
    summary: string[];
    experience: string[];
    skills: string[];
    education: string[];
  };
  rewrites: Array<{
    before: string;
    after: string;
    reason: string;
  }>;
  ats_keywords: string[];
  missing_information: string[];
};

export type InterviewQAResult = {
  questions: Array<{
    category: "general" | "role_related" | "behavioral_star" | "resume_follow_up";
    question: string;
    answer_approach_zh: string;
    concise_answer_en: string;
  }>;
};

export type MatchAnalysisResult = {
  overall_score: number;
  dimension_scores: {
    experience: number;
    skills: number;
    industry_relevance: number;
    language: number;
    nice_to_have: number;
  };
  strengths: string[];
  weaknesses: string[];
  priority_actions: string[];
  risks: string[];
  recommendation: "建议投递" | "谨慎投递" | "不建议优先投递";
};

export type AnalysisResultPayload = Partial<{
  resume_optimization: ResumeOptimizationResult;
  interview_qa: InterviewQAResult;
  match_analysis: MatchAnalysisResult;
}>;

export type AnalysisRecord = {
  id: string;
  user_id: string;
  job_title: string | null;
  company_name: string | null;
  jd_text: string;
  resume_text: string;
  selected_modules: AnalysisModule[];
  status: AnalysisStatus;
  created_at: string;
  updated_at: string;
  analysis_results?: Array<{
    id: string;
    module: AnalysisModule;
    result_json: AnalysisResultPayload[AnalysisModule];
    created_at: string;
  }>;
};
