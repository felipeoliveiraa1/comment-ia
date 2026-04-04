import { NextResponse } from "next/server";
import { getOpenAIClient } from "@/lib/openai";
import { buildUserPrompt, getSystemPrompt } from "@/lib/prompts";
import type {
  GenerateRequest,
  GenerateResponse,
  GenerateErrorResponse,
} from "@/types/caption";

const OPENAI_MODEL = "gpt-4o-mini";
const MAX_TOKENS = 500;

export async function POST(
  request: Request
): Promise<NextResponse<GenerateResponse | GenerateErrorResponse>> {
  try {
    const body = (await request.json()) as GenerateRequest;
    const description = body.description?.trim();
    if (!description || description.length < 5) {
      return NextResponse.json(
        { error: "Descreva o produto com pelo menos algumas palavras." },
        { status: 400 }
      );
    }
    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        { role: "system", content: getSystemPrompt() },
        { role: "user", content: buildUserPrompt(description) },
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
