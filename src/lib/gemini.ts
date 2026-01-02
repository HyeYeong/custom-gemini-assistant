const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing");
}

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent";

export async function callGemini(prompt: string): Promise<string> {
  const res = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gemini API error: ${text}`);
  }

  const data = await res.json();

  return (
    data?.candidates?.[0]?.content?.parts?.[0]?.text ??
    "응답을 생성하지 못했어요."
  );
}
