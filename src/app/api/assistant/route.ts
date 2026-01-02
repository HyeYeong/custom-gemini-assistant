import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const query = body?.query;

  if (!query) {
    return NextResponse.json({ error: "Empty query" }, { status: 400 });
  }

  // ① Google에서 실제 검색 결과 가져오기
  const searchResult = await fetchGoogleSearch(query);

  // ② Gemini로 요약 / 말투 정리
  const summary = await summarizeWithGemini(searchResult);

  return NextResponse.json({
    result: summary,
  });
}

async function fetchGoogleSearch(query: string) {
  const res = await fetch(
    `https://serpapi.com/search.json?q=${encodeURIComponent(
      query
    )}&hl=ko&gl=kr&api_key=${process.env.SERP_API_KEY}`
  );

  const data = await res.json();

  return (
    data?.answer_box?.snippet ||
    data?.organic_results?.[0]?.snippet ||
    "검색 결과를 찾지 못했습니다."
  );
}

async function summarizeWithGemini(fact: string) {
  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=" +
      process.env.GEMINI_API_KEY,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `
                  너는 음성 비서야.
                  아래의 사실 정보를 바탕으로
                  한국어로 한 문장으로 요약해줘.

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

  const json = await res.json();
  return json.candidates[0].content.parts[0].text;
}
