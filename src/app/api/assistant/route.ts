import { NextResponse } from "next/server";

async function fetchGoogleSearch(query: string) {
  const res = await fetch(
    `https://serpapi.com/search.json?q=${encodeURIComponent(
      query
    )}&hl=ko&gl=kr&api_key=${process.env.SERP_API_KEY}`
  );

  if (!res.ok) {
    throw new Error("Search API failed");
  }

  const data = await res.json();

  return (
    data?.answer_box?.snippet ||
    data?.organic_results?.[0]?.snippet ||
    "검색 결과를 찾지 못했습니다."
  );
}

async function summarizeWithGemini(fact: string) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `
                  너는 사용자의 개인 음성 비서다.
                  아래 [사실]만을 바탕으로,
                  추측하지 말고, 한국어로 한 문장 또는 두 문장으로
                  말하듯 자연스럽게 요약해라.

                  [사실]
                  ${fact}
                `,
              },
            ],
          },
        ],
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error("Gemini API failed: " + err);
  }

  const json = await res.json();
  return json.candidates?.[0]?.content?.parts?.[0]?.text ?? "요약 실패";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const query = body?.query;

    if (!query) {
      return NextResponse.json({ error: "Empty query" }, { status: 400 });
    }

    // ① 실제 검색
    const fact = await fetchGoogleSearch(query);

    // ② Gemini 요약
    const summary = await summarizeWithGemini(fact);

    return NextResponse.json({
      result: summary,
      fact, // 디버그용 (나중에 제거 가능)
    });
  } catch (err: any) {
    console.error("❌ API ERROR:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
