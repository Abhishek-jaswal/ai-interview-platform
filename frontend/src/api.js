const BASE_URL = 'http://localhost:8000'

function getToken() {
  return localStorage.getItem('token')
}

async function handleResponse(res) {
  if (!res.ok) {
    let detail = 'Kuch galat ho gaya. Dobara try karein.'
    try {
      const data = await res.json()
      detail = data.detail || detail
    } catch (e) {}
    throw new Error(detail)
  }
  if (res.status === 204) return null
  return res.json()
}

export async function registerUser(name, email, password) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  })
  return handleResponse(res)
}

export async function loginUser(email, password) {
  const form = new URLSearchParams()
  form.append('username', email)
  form.append('password', password)
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form,
  })
  return handleResponse(res)
}

export async function getMe() {
  const res = await fetch(`${BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  })
  return handleResponse(res)
}

export async function checkResume(file) {
  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch(`${BASE_URL}/resume/check`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData,
  })
  return handleResponse(res)
}

export async function getHistory() {
  const res = await fetch(`${BASE_URL}/resume/history`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  })
  return handleResponse(res)
}

export async function getCheckDetail(id) {
  const res = await fetch(`${BASE_URL}/resume/history/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  })
  return handleResponse(res)
}

export async function deleteCheck(id) {
  const res = await fetch(`${BASE_URL}/resume/history/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${getToken()}` },
  })
  return handleResponse(res)
}
