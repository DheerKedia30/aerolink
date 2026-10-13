import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { healthRouter } from './routes/health.js'
import { flightsRouter } from './routes/flights.js'
import { bookingsRouter } from './routes/bookings.js'
import { eventsRouter } from './routes/events.js'
import { sseManager } from './sse.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

app.use(express.json())

// Mount API routes
app.use('/api/health', healthRouter)
app.use('/api/flights', flightsRouter)
app.use('/api/bookings', bookingsRouter)
app.use('/api/events', eventsRouter)

// Root fallback / metadata endpoint
app.get('/', (_req, res) => {
  res.json({
    service: 'aerolink-core',
    version: '0.1.0',
    description: 'AEROLINK Distributed Airline Booking System API (Phase 1 In-Memory)',
    endpoints: [
      'GET /api/health',
      'GET /api/flights',
      'GET /api/bookings',
      'POST /api/bookings',
      'GET /api/events',
      'GET /api/events/stream',
    ],
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` })
})

// Error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[AEROLINK Server Error]', err)
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' })
})

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`[AEROLINK] Backend listening on http://localhost:${PORT}`)
  console.log(`[AEROLINK] Health check available at http://localhost:${PORT}/api/health`)
})

function shutdown() {
  console.log('\n[AEROLINK] Graceful shutdown initiated...')
  sseManager.destroy()
  server.close(() => {
    console.log('[AEROLINK] Server stopped cleanly.')
    process.exit(0)
  })
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

export default app
