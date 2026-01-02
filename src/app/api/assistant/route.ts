import { NextResponse } from "next/server";
import { callGemini } from "@/lib/gemini";

export async function POST(req: Request) {
  console.log("🔥 /api/assistant POST HIT");

  try {
    const body = await req.json();

    const query = body?.query || body?.TextField || "";

    if (!query) {
      return NextResponse.json({ error: "Empty query" }, { status: 400 });
    }

    const prompt = `
      너는 개인 음성 비서야.
      아래 질문에 대해 한국어로 짧고 자연스럽게 대답해.

      질문: ${query}

      조건:
      - 3문장 이내
      - 음성으로 읽기 자연스럽게
    `;

    const reply = await callGemini(prompt);

    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error("❌ ASSISTANT ERROR:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
