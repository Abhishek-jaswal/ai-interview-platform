<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f0c29,50:302b63,100:24243e&height=180&section=header&text=🧠%20AI%20Interview%20Portal&fontSize=44&fontColor=ffffff&fontAlignY=38&desc=Resume%20Review%20%2B%20Mock%20Interviews%20Powered%20by%20AI&descAlignY=58&descColor=c084fc&animation=fadeIn" width="100%" />

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Hasura](https://img.shields.io/badge/Hasura-1EB4D4?style=for-the-badge&logo=hasura&logoColor=white)](https://hasura.io/)

**Upload your resume. Practice interviews. Get hired.**

🔗 **[Live Demo](https://ai-interview-platform-pied.vercel.app/)**

</div>

---

## 🧭 Overview

**AI Interview Portal** is a full-stack platform that helps developers and job seekers prepare smarter for technical interviews. Upload your PDF resume and get instant AI-powered feedback on strengths, gaps, and improvements — then jump straight into a mock interview tailored to your profile, with real-time scoring and detailed suggestions on every answer.

No more guessing what interviewers want. Practice with AI, improve with data.

---

## ✨ Features

| | Feature | Details |
|---|---|---|
| 🔒 | **OAuth Authentication** | Sign in with GitHub or Google — zero friction |
| 📄 | **Resume Upload & Analysis** | Upload PDF → instant AI feedback on content, clarity & gaps |
| 🧠 | **AI Mock Interviews** | Resume-based question generation tailored to your experience |
| ⚡ | **Real-Time Scoring** | Instant feedback and scores on every answer — no waiting |
| 📊 | **Performance Dashboard** | Track your interview scores and improvement over time |

---

## 📸 Preview

<div align="center">

### 🎬 App Demo
![App Demo](./public/screenshots/ai-interview.gif)

### 🔑 Login
![Login Page](./public/screenshots/login-page.png)

### 📄 Resume Upload
![Resume Upload](./public/screenshots/upload-resume.png)

### 🎤 Mock Interview
![Mock Interview](./public/screenshots/mock-interview.png)

### 📊 Dashboard
![Dashboard](./public/screenshots/dashboard.png)

</div>

---

## 🛠️ Tech Stack

```
Frontend     →  Next.js · TypeScript · Tailwind CSS
Backend      →  Node.js · Hasura GraphQL · REST APIs
Database     →  PostgreSQL
AI           →  OpenAI API (GPT)
Auth         →  GitHub OAuth · Google OAuth
Hosting      →  Vercel
```

---

## ⚙️ Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/Abhishek-jaswal/ai-interview-platform.git
cd ai-interview-platform

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Fill in your OpenAI API key, OAuth credentials, and DB connection string

# 4. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Environment Variables

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

OPENAI_API_KEY=your_openai_api_key

DATABASE_URL=your_postgresql_connection_string
HASURA_GRAPHQL_ENDPOINT=your_hasura_endpoint
HASURA_ADMIN_SECRET=your_hasura_secret
```

---

## 🛣️ Roadmap

- [ ] Voice-based mock interview mode
- [ ] Job description-based question targeting
- [ ] Multi-round interview simulation
- [ ] Interview history & analytics
- [ ] Export performance report as PDF

---

## 👨‍💻 Built by

**Abhishek Jaswal** — Full-Stack Developer

[![Portfolio](https://img.shields.io/badge/Portfolio-000?style=flat-square&logo=vercel&logoColor=white)](https://abhishek-jaswal.vercel.app/)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat-square&logo=linkedin&logoColor=white)](https://linkedin.com/in/abhishekjaswall)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=flat-square&logo=github&logoColor=white)](https://github.com/Abhishek-jaswal)

---

<div align="center">

⭐ **Star this repo if it helped you prep for your next interview!**

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f0c29,50:302b63,100:24243e&height=80&section=footer" width="100%" />

</div>
