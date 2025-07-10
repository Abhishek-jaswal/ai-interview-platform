export async function POST(req) {
  const { messages, topic } = await req.json();

  const systemPrompt = `
You are a strict technical interviewer for a ${topic} mock interview.

Rules:
- Ask only one question at a time.
- After each candidate's answer, do 3 things:
  🔍 Feedback (1-2 lines)
  ⭐ Score: x/5 (integer only)
  🧠 Next Question (unless it's the 5th round)

On the 5th round, do this instead:
  🔍 Feedback
  ⭐ Final Score: total/25
  📝 Summary of performance

Respond in this format:
🔍 Feedback: ...
⭐ Score: ...
🧠 Next Question: ... (only if < 5 rounds)
`;

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost:3000',
    },
    body: JSON.stringify({
      model: 'openai/gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
    }),
  });

  const data = await res.json();

  return Response.json({ result: data.choices?.[0]?.message?.content || 'Something went wrong.' });
}
