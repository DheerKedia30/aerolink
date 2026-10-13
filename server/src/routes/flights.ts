import { Router, type Request, type Response } from 'express'
import { inMemoryStore } from '../store.js'

export const flightsRouter = Router()

flightsRouter.get('/', (_req: Request, res: Response) => {
  const flights = inMemoryStore.getFlights()
  res.status(200).json(flights)
})

flightsRouter.get('/:id', (req: Request, res: Response) => {
  const flight = inMemoryStore.getFlight(req.params.id)
  if (!flight) {
    res.status(404).json({ error: `Flight ${req.params.id} not found` })
    return
  }
  res.status(200).json(flight)
})
