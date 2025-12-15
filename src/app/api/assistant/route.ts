import { NextResponse } from "next/server";
import { model } from "@/lib/gemini";

export async function POST(req: Request) {
  const body = await req.json();

  // IFTTT / Google Home에서 보낸 문장
  const userText = body?.query || body?.text || "아무 입력 없음";

  const result = await model.generateContent(userText);
  const reply = result.response.text();

  console.log("USER:", userText);
  console.log("AI:", reply);

  return NextResponse.json({
    reply,
  });
}
