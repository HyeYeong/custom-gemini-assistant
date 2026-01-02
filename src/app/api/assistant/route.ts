import { NextResponse } from "next/server";
import { createGeminiModel } from "@/lib/gemini";

export async function POST(req: Request) {
  console.log("🔥 POST HIT");

  const body = await req.json();
  const query = body?.query || body?.TextField || "";

  if (!query) {
    return NextResponse.json({ error: "Empty query" }, { status: 400 });
  }

  try {
    const model = createGeminiModel();
    const result = await model.generateContent(query);
    const reply = result.response.text();

    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error("❌ RUNTIME ERROR:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
