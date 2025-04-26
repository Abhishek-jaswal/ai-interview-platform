export async function POST(request) {
    try {
      const { resumeText } = await request.json();
  
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000', // or your domain
        },
        body: JSON.stringify({
          model: 'openai/gpt-3.5-turbo', // ✅ change model here if needed
          messages: [
            {
              role: 'system',
              content: 'You are an expert resume coach. Analyze resumes and suggest improvements.',
            },
            {
              role: 'user',
              content: `Here is a resume:\n\n${resumeText}`,
            },
          ],
        }),
      });
  
      const data = await res.json();
  
      if (!data || !data.choices || !data.choices[0]) {
        return Response.json({ result: `Error: Unexpected response.\n\nRaw:\n${JSON.stringify(data)}` });
      }
  
      return Response.json({ result: data.choices[0].message.content });
  
    } catch (error) {
      console.error('❌ OpenRouter API Error:', error);
      return Response.json({ result: 'Error: Failed to process resume analysis.' });
    }
  }
  