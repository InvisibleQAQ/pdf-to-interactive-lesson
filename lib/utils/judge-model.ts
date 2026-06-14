import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import { createTogetherAI } from "@ai-sdk/togetherai";

interface JudgeModelOptions {
  judgeModel: string;
  togetherApiKey?: string;
  anthropicApiKey?: string;
  openaiApiKey?: string;
  openaiBaseUrl?: string;
}

export function getJudgeModel({
  judgeModel,
  togetherApiKey,
  anthropicApiKey,
  openaiApiKey,
  openaiBaseUrl,
}: JudgeModelOptions) {
  if (judgeModel.startsWith("anthropic/")) {
    const modelId = judgeModel.replace("anthropic/", "");
    if (anthropicApiKey) {
      return createAnthropic({ apiKey: anthropicApiKey })(modelId);
    }
    throw new Error(
      "anthropic/ judge requires ANTHROPIC_API_KEY"
    );
  }

  if (judgeModel.startsWith("openai/")) {
    const modelId = judgeModel.replace("openai/", "");
    const key = openaiApiKey ?? process.env.OPENAI_API_KEY;
    const base = openaiBaseUrl ?? process.env.OPENAI_BASE_URL;
    if (!key) {
      throw new Error("openai/ judge requires OPENAI_API_KEY");
    }
    return createOpenAI({
      apiKey: key,
      baseURL: base,
    })(modelId);
  }

  if (!togetherApiKey) {
    throw new Error("Together judge requires TOGETHER_API_KEY");
  }

  return createTogetherAI({ apiKey: togetherApiKey })(judgeModel);
}
