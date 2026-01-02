import { NextResponse } from "next/server";
import { callGemini } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const query = body?.query || body?.TextField || "";

    if (!query) {
      return NextResponse.json({ error: "Empty query" }, { status: 400 });
    }

    const prompt = `
      너는 개인 음성 비서야.
      아래 질문에 대해 한국어로,
      3문장 이내로 요약해서 대답해.

      질문: ${query}
    `;

    const reply = await callGemini(prompt);

    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error("❌ ASSISTANT ERROR:", err);
    return NextResponse.json(
      { error: String(err.message ?? err) },
      { status: 500 }
    );
  }
}
