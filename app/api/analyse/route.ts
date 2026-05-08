import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { logs } = await request.json();

    if (!logs || !logs.trim()) {
      return NextResponse.json({ error: "Logs are required" }, { status: 400 });
    }

    const systemPrompt = `You are a log analysis expert. Analyse the provided logs and return ONLY a JSON object with exactly these keys:
- rootCause (string: a concise, prominent explanation of the root cause)
- failureSequence (array of strings: describing each step that led to the failure)
- suggestedFix (string: a distinct, technical recommendation to resolve the issue)

Be technical and concise. No extra text outside the JSON.`;

    const response = await fetch("https://text.pollinations.ai/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Analyse these logs:\n\n${logs}` },
        ],
        jsonMode: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`AI API error: ${response.statusText}`);
    }

    const aiResponse = await response.text();
    
    try {
      const jsonResponse = JSON.parse(aiResponse);
      return NextResponse.json(jsonResponse);
    } catch (parseError) {
      const cleanJson = aiResponse.replace(/```json/g, "").replace(/```/g, "").trim();
      return NextResponse.json(JSON.parse(cleanJson));
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to connect to the AI service. Please try again." },
      { status: 500 }
    );
  }
}
