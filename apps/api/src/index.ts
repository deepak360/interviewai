import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.routes'
import bankRoutes from './routes/bank.routes'
import interviewRoutes from './routes/interview.routes'
import { errorHandler } from './middleware/errorHandler'

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
app.use(express.json())
app.use(cookieParser())

app.get('/health', (req, res) => {
  res.json({ data: { status: 'ok' }, error: null })
})

app.use('/api/auth', authRoutes)
app.use('/api/banks', bankRoutes)
app.use('/api/interviews', interviewRoutes)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`)
})

export default app
