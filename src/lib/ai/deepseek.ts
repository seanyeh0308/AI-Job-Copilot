import type { AnalysisModule } from "@/lib/constants";
import { buildPrompt } from "./prompts";
import { buildMockResult } from "./mock";

const DEFAULT_DEEPSEEK_BASE_URL = "https://api.deepseek.com";
const DEFAULT_DEEPSEEK_MODEL = "deepseek-v4-flash";

type DeepSeekChatCompletion = {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
  error?: {
    message?: string;
  };
};

export async function generateModuleResult(module: AnalysisModule, jdText: string, resumeText: string) {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    return buildMockResult(module, jdText, resumeText);
  }

  const baseUrl = normalizeBaseUrl(process.env.DEEPSEEK_BASE_URL || DEFAULT_DEEPSEEK_BASE_URL);
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: process.env.DEEPSEEK_MODEL || DEFAULT_DEEPSEEK_MODEL,
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
    })
  });

  const responseText = await response.text();
  const completion = parseDeepSeekResponse(responseText);

  if (!response.ok) {
    const message = completion.error?.message || responseText || response.statusText;
    throw new Error(`DeepSeek request failed (${response.status}): ${truncateMessage(message)}`);
  }

  const content = completion.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("DeepSeek returned an empty response.");
  }

  try {
    return JSON.parse(content);
  } catch {
    throw new Error("DeepSeek returned malformed JSON content.");
  }
}

function normalizeBaseUrl(baseUrl: string) {
  return baseUrl.replace(/\/+$/, "");
}

function parseDeepSeekResponse(responseText: string): DeepSeekChatCompletion {
  try {
    return responseText ? (JSON.parse(responseText) as DeepSeekChatCompletion) : {};
  } catch {
    throw new Error("DeepSeek returned invalid JSON.");
  }
}

function truncateMessage(message: string) {
  return message.length > 300 ? `${message.slice(0, 300)}...` : message;
}
