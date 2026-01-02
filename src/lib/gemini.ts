const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export async function callGemini(prompt: string) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  const res = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
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

  const data = await res.json();

  if (!res.ok) {
    throw new Error(`Gemini API error: ${JSON.stringify(data, null, 2)}`);
  }

  return (
    data?.candidates?.[0]?.content?.parts?.[0]?.text ??
    "응답을 생성하지 못했습니다."
  );
}
