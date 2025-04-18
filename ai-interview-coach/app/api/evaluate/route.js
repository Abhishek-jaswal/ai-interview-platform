import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { prompt } = body;

    const response = await fetch("https://api.deepinfra.com/v1/openai/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.DEEPINFRA_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/Meta-Llama-3-8B-Instruct",
        messages: [
          {
            role: "system",
            content: `You are an interview coach. Always respond in JSON format like this:
            {
              "score": "8/10",
              "feedback": "Your detailed feedback here"
            }.
            Always wrap the score in double quotes like "8/10".`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      }),
    });

    const result = await response.json();
    const aiMessage = result?.choices?.[0]?.message?.content;

    console.log("🔥 Raw AI Message:", aiMessage);

    let parsed;
    try {
      // Extract JSON from string using regex
      const match = aiMessage.match(/\{[\s\S]*\}/);
      const fixedJSON = match[0].replace(/(\d+\/\d+)/g, '"$1"'); // Fix score format
      parsed = JSON.parse(fixedJSON);
    } catch (jsonErr) {
      console.error("❌ JSON Parsing Error:", jsonErr.message);
      parsed = { evaluation: aiMessage }; // fallback
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Evaluation error:", error);
    return NextResponse.json(
      { error: "Failed to evaluate response. Please try again." },
      { status: 500 }
    );
  }
}
