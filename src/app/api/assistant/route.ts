import { NextResponse } from "next/server";

export async function POST() {
  console.log("assistant endpoint hit");

  return NextResponse.json({
    ok: true,
    message: "assistant endpoint is alive",
  });
}
