import os
import json
import re
from anthropic import Anthropic
from fastapi import HTTPException
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("ANTHROPIC_API_KEY")

SYSTEM_PROMPT = """Tum ek expert resume reviewer ho, jo HR aur ATS (Applicant Tracking System) dono \
perspective se resume check karte ho. Tumhe resume ka raw text diya jayega.

Tumhe SIRF valid JSON return karna hai, koi extra text, markdown fencing, ya preamble nahi. \
JSON is exact shape me ho:

{
  "overall_score": <0 se 100 ke beech ek number>,
  "summary": "<2-3 line ka overall summary Hindi-English mix (Hinglish) me, friendly tone>",
  "strengths": ["<point 1>", "<point 2>", ...],
  "issues": [
    {
      "category": "<Grammar | Formatting | Content | ATS Keywords | Structure | Contact Info>",
      "severity": "<high | medium | low>",
      "original": "<resume se exact problematic line/phrase, agar applicable ho, warna empty string>",
      "problem": "<kya galat hai, ek line me>",
      "suggestion": "<kaise theek karein, specific actionable suggestion>"
    }
  ],
  "missing_sections": ["<jaise Skills, Summary, Certifications agar missing hai>"],
  "ats_keywords_suggestion": ["<kuch relevant keywords jo add karne chahiye agar role clear ho>"]
}

Guidelines:
- Har issue specific aur actionable ho, generic advice mat do.
- Grammar/spelling mistakes ko exact quote karo "original" field me.
- Agar resume already achha hai to kam issues do, fake problems mat banao.
- overall_score honest ho: 85+ = bahut achha, 60-84 = decent but improve, <60 = major rework chahiye.
- Sirf JSON return karo, kuch aur nahi."""


def analyze_resume(resume_text: str) -> dict:
    if not API_KEY:
        raise HTTPException(
            status_code=500,
            detail="Server par ANTHROPIC_API_KEY set nahi hai. .env file me apni API key daalein.",
        )

    client = Anthropic(api_key=API_KEY)

    try:
        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=4000,
            system=SYSTEM_PROMPT,
            messages=[
                {
                    "role": "user",
                    "content": f"Ye resume ka text hai, ise analyze karo:\n\n{resume_text[:15000]}",
                }
            ],
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"AI service se error aaya: {str(e)}")

    raw_text = "".join(block.text for block in response.content if block.type == "text")

    # Kabhi kabhi model markdown fence me wrap kar deta hai, use safely strip karte hain
    cleaned = re.sub(r"^```(?:json)?|```$", "", raw_text.strip(), flags=re.MULTILINE).strip()

    try:
        parsed = json.loads(cleaned)
    except json.JSONDecodeError:
        raise HTTPException(status_code=502, detail="AI response ko parse nahi kar paaye. Dobara try karein.")

    return parsed
