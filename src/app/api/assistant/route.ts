import { NextResponse } from "next/server";
import { callGemini } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "query is required" }, { status: 400 });
    }

    const result = await callGemini(query);

    return NextResponse.json({ result });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
