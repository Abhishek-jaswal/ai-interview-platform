# ResumeMark — AI Resume Checker

PDF resume upload karein, AI (Claude) se grammar/formatting/content/ATS keyword check karayein, aur corrections dekhein. Login system aur har user ki check-history save hoti hai.

## Tech Stack
- **Backend:** Python (FastAPI, SQLite, JWT auth, Anthropic API)
- **Frontend:** React (Vite, React Router)

## Project Structure
```
resume-checker/
├── backend/
│   ├── app/
│   │   ├── main.py          # API routes
│   │   ├── models.py        # Database models
│   │   ├── schemas.py       # Request/response schemas
│   │   ├── auth.py          # JWT + password hashing
│   │   ├── pdf_utils.py     # PDF text extraction
│   │   ├── ai_service.py    # Claude API call
│   │   └── database.py
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── pages/            # Login, Register, Dashboard, History
    │   ├── components/       # Navbar, ResultView
    │   ├── api.js
    │   └── AuthContext.jsx
    └── package.json
```

## Setup — Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate      # Windows par: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
```

`.env` file kholkar apni Anthropic API key daalein:
```
ANTHROPIC_API_KEY=sk-ant-...
JWT_SECRET=koi_bhi_lambi_random_string
```

API key yahan se milegi: https://console.anthropic.com/settings/keys

Server chalayein:
```bash
uvicorn app.main:app --reload --port 8000
```

Backend `http://localhost:8000` par chalega. API docs `http://localhost:8000/docs` par dekh sakte hain (Swagger UI).

## Setup — Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend `http://localhost:5173` par khulega.

## Kaise use karein
1. Pehle `/register` par account banayein.
2. Login karke apna resume PDF (text-based, scanned image nahi) upload karein.
3. "Check karein" dabayein — AI 10-20 seconds me score, strengths, corrections, missing sections aur ATS keyword suggestions dega.
4. Har check "History" tab me save ho jayega, jahan se aap dobara dekh ya delete kar sakte hain.

## Important Notes
- Sirf text-based PDF kaam karega (photo/scan wale PDF me text extract nahi hoga — aisa PDF upload karne par error milega).
- Production me deploy karne se pehle `JWT_SECRET` zaroor badal dein, aur database ko SQLite se PostgreSQL me migrate karna better rahega agar scale badhana ho.
- File size limit 10MB rakhi gayi hai.

## Deployment ke liye aage kya
- Backend: Render, Railway, ya Fly.io par deploy kar sakte hain.
- Frontend: Vercel ya Netlify par deploy karein, aur `frontend/src/api.js` me `BASE_URL` ko apne deployed backend URL se replace karein.
- CORS settings `backend/app/main.py` me apne production frontend domain ke hisaab se update karein.
