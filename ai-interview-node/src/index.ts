import express from 'express'
import cors from 'cors'
import { config } from './config/env'
import examRoutes from './routes/exam.routes'
import paymentRoutes from './routes/payment.routes'

const app = express()

app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }))
app.use(express.json())

app.get('/', (_req, res) => {
  res.json({ status: 'ok', message: 'AI Interview module chal raha hai' })
})

app.use('/api/exam', examRoutes)
app.use('/api/payment', paymentRoutes)

// Catch-all error handler — koi bhi uncaught error yahan aakar clean JSON dega
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err)
  res.status(500).json({ error: 'Kuch galat ho gaya server par.' })
})

app.listen(config.port, () => {
  console.log(`AI Interview server http://localhost:${config.port} par chal raha hai`)
})
