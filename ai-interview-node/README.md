# AI Interview Module — Node.js Backend

Ye sirf **AI Interview** feature ka backend hai. Login, signup, aur resume analyzer **Python (FastAPI, port 8000)** me hi rahenge — unhe touch nahi kiya gaya.

## Kaise kaam karta hai

- User Python se login karta hai, JWT milta hai
- Wahi JWT token yahan Node APIs (port 5000) me bhi bhejna hai — same `JWT_SECRET` dono taraf hone se ye kaam karta hai
- **Kuch bhi save nahi hota** except attempts count:
  - Exam questions AI se turant generate hote hain (kabhi disk par nahi jaate)
  - User ke answers/score sirf server memory me hote hain exam ke duration tak
  - Submit hone ke turant baad session memory se discard ho jaata hai
  - Database me sirf ek cheez hai: **kitne attempts bache hain** (credit system ke liye)

## Setup

```bash
npm install
npx prisma generate
npx prisma db push      # database file bana dega (interview.db)

cp .env.example .env
```

`.env` file me:
1. `JWT_SECRET` — **bilkul wahi value** daalo jo Python backend ke `.env` me `JWT_SECRET` hai (copy-paste karo, alag hui to sab 401 dega)
2. `GEMINI_API_KEY` — aistudio.google.com/apikey se free milegi (Python wali bhi reuse kar sakte ho)
3. `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` — dashboard.razorpay.com/app/keys se test/sandbox keys milengi (free signup, real paise nahi chahiye testing ke liye)

## Chalao

```bash
npm run dev
```

Server `http://localhost:5000` par chalega. Ab teen cheezein saath chalengi:
- Python backend → port 8000
- Node backend → port 5000
- React frontend → port 5173

## API Endpoints

| Method | Route | Auth | Kaam |
|---|---|---|---|
| GET | `/api/exam/categories` | ❌ | Sabhi categories + exams ki list |
| GET | `/api/exam/credits` | ✅ | Kitne attempts bache hain |
| POST | `/api/exam/start` | ✅ | Exam start karo, questions milenge (1 attempt consume hoga) |
| POST | `/api/exam/submit` | ✅ | Answers submit karo, score + AI feedback milega |
| POST | `/api/payment/create-order` | ✅ | Razorpay order banao (₹20 = 3 attempts) |
| POST | `/api/payment/verify` | ✅ | Payment verify karke attempts add karo |

Sabhi `✅` routes me header chahiye:
```
Authorization: Bearer <wahi_token_jo_python_login_se_mila>
```

## Naya category/exam add karna ho

`src/config/categories.ts` file me entry add kar do — koi database migration nahi chahiye.

## Production me scale karna ho

Abhi exam sessions server ki memory (RAM) me store hote hain — single server instance ke liye perfect hai. Agar aage load balancer ke peeche multiple Node instances chalane hon, to `src/services/session.service.ts` ko Redis-backed banana hoga (jaisa original plan me "optional" mention tha), taaki har instance same session dekh sake.
