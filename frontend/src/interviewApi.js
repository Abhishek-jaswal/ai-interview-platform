// Ye Python (api.js) se ALAG file hai — AI Interview ke liye Node backend
// (port 5000) ko call karti hai. Token wahi use hota hai jo Python login se
// mila tha (localStorage me 'token' key), kyunki dono backend same
// JWT_SECRET share karte hain.

const BASE_URL = 'http://localhost:5000'

function getToken() {
  return localStorage.getItem('token')
}

async function handleResponse(res) {
  if (!res.ok) {
    let detail = 'Kuch galat ho gaya. Dobara try karein.'
    let code
    try {
      const data = await res.json()
      detail = data.error || detail
      code = data.code
    } catch (e) {
      // ignore parse failure
    }
    const err = new Error(detail)
    err.code = code
    err.status = res.status
    throw err
  }
  return res.json()
}

export async function getCategories() {
  const res = await fetch(`${BASE_URL}/api/exam/categories`)
  return handleResponse(res)
}

export async function getCredits() {
  const res = await fetch(`${BASE_URL}/api/exam/credits`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  })
  return handleResponse(res)
}

export async function startExam(categoryId, examId) {
  const res = await fetch(`${BASE_URL}/api/exam/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ categoryId, examId }),
  })
  return handleResponse(res)
}

export async function submitExam(sessionId, answers) {
  const res = await fetch(`${BASE_URL}/api/exam/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ sessionId, answers }),
  })
  return handleResponse(res)
}

export async function createPaymentOrder() {
  const res = await fetch(`${BASE_URL}/api/payment/create-order`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` },
  })
  return handleResponse(res)
}

export async function verifyPayment(payload) {
  const res = await fetch(`${BASE_URL}/api/payment/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(payload),
  })
  return handleResponse(res)
}
