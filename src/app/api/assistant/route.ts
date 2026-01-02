import { NextResponse } from "next/server";
import { model } from "@/lib/gemini";

export async function POST(req: Request) {
  console.log("🔥 /api/assistant POST HIT 🔥");
  const body = await req.json();

  const query = body?.query ?? "";
  const source = body?.source ?? "unknown";
  const device = body?.device ?? "unknown";

  console.log("SOURCE:", source);
  console.log("DEVICE:", device);
  console.log("USER:", query);

  if (!query) {
    return NextResponse.json({ error: "Empty query" }, { status: 400 });
  }

  const result = await model.generateContent(query);
  const reply = result.response.text();

  console.log("AI:", reply);

  return NextResponse.json({
    reply,
  });
}
