import { z } from "zod";
import { MODULES } from "./constants";

const moduleIds = MODULES.map((module) => module.id) as [string, ...string[]];

export const analysisInputSchema = z.object({
  jobTitle: z.string().max(120).optional().default(""),
  companyName: z.string().max(120).optional().default(""),
  jdText: z.string().min(80, "The job description must be at least 80 characters.").max(20000),
  resumeText: z.string().min(80, "The resume content must be at least 80 characters.").max(20000),
  selectedModules: z.array(z.enum(moduleIds)).min(1, "Select at least one module.")
});

export type AnalysisInput = z.infer<typeof analysisInputSchema>;
