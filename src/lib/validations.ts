import { z } from "zod";
import { MODULES } from "./constants";

const moduleIds = MODULES.map((module) => module.id) as [string, ...string[]];

export const analysisInputSchema = z.object({
  jobTitle: z.string().max(120).optional().default(""),
  companyName: z.string().max(120).optional().default(""),
  jdText: z.string().min(80, "JD 内容至少需要 80 个字符").max(20000),
  resumeText: z.string().min(80, "简历内容至少需要 80 个字符").max(20000),
  selectedModules: z.array(z.enum(moduleIds)).min(1, "请至少选择一个模块")
});

export type AnalysisInput = z.infer<typeof analysisInputSchema>;
