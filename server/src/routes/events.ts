import { Router, type Request, type Response } from 'express'
import { inMemoryStore } from '../store.js'
import { sseManager } from '../sse.js'

export const eventsRouter = Router()

eventsRouter.get('/', (req: Request, res: Response) => {
  const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : 50
  const events = inMemoryStore.getEvents(Number.isNaN(limit) ? 50 : limit)
  res.status(200).json(events)
})

eventsRouter.get('/stream', (_req: Request, res: Response) => {
  sseManager.registerClient(res)
})
