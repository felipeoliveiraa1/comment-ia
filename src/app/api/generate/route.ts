import { NextResponse } from "next/server";
import { getOpenAIClient } from "@/lib/openai";
import { buildUserPrompt, getSystemPrompt } from "@/lib/prompts";
import type {
  GenerateRequest,
  GenerateResponse,
  GenerateErrorResponse,
  ProductInput,
} from "@/types/caption";
import { PRODUCT_CONDITIONS, PRODUCT_CATEGORIES, CAPTION_TONES } from "@/types/caption";

const OPENAI_MODEL = "gpt-4o-mini";
const MAX_TOKENS = 500;

function validateProductInput(product: unknown): product is ProductInput {
  if (!product || typeof product !== "object") return false;
  const p = product as Record<string, unknown>;
  const hasRequiredStrings =
    typeof p.name === "string" &&
    p.name.trim().length > 0 &&
    typeof p.description === "string" &&
    p.description.trim().length > 0;
  const hasValidPrice = typeof p.price === "number" && p.price > 0;
  const hasValidCondition =
    typeof p.condition === "string" &&
    (PRODUCT_CONDITIONS as readonly string[]).includes(p.condition);
  const hasValidCategory =
    typeof p.category === "string" &&
    (PRODUCT_CATEGORIES as readonly string[]).includes(p.category);
  const hasValidTone =
    typeof p.tone === "string" &&
    (CAPTION_TONES as readonly string[]).includes(p.tone);
  return (
    hasRequiredStrings &&
    hasValidPrice &&
    hasValidCondition &&
    hasValidCategory &&
    hasValidTone
  );
}

export async function POST(
  request: Request
): Promise<NextResponse<GenerateResponse | GenerateErrorResponse>> {
  try {
    const body = (await request.json()) as GenerateRequest;
    if (!validateProductInput(body.product)) {
      return NextResponse.json(
        { error: "Dados do produto inválidos. Verifique todos os campos." },
        { status: 400 }
      );
    }
    const systemPrompt = getSystemPrompt();
    const userPrompt = buildUserPrompt(body.product);
    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: MAX_TOKENS,
      temperature: 0.8,
    });
    const caption = completion.choices[0]?.message?.content?.trim();
    if (!caption) {
      return NextResponse.json(
        { error: "Não foi possível gerar a legenda. Tente novamente." },
        { status: 500 }
      );
    }
    return NextResponse.json({ caption });
  } catch (err) {
    console.error("Error generating caption:", err);
    const message =
      err instanceof Error ? err.message : "Erro interno do servidor.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
