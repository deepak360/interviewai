import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
app.use(express.json())
app.use(cookieParser())

app.get('/health', (req, res) => {
  res.json({ data: { status: 'ok' }, error: null })
})

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`)
})

export default app
