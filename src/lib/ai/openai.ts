import OpenAI from "openai";
import type { AnalysisModule } from "@/lib/constants";
import { buildPrompt } from "./prompts";
import { buildMockResult } from "./mock";

export async function generateModuleResult(module: AnalysisModule, jdText: string, resumeText: string) {
  if (!process.env.OPENAI_API_KEY) {
    return buildMockResult(module, jdText, resumeText);
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: "You return valid JSON only. Never add Markdown fences."
      },
      {
        role: "user",
        content: buildPrompt(module, jdText, resumeText)
      }
    ]
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI returned an empty response.");
  }

  return JSON.parse(content);
}
