import { Router, type Request, type Response } from 'express'
import { inMemoryStore } from '../store.js'

export const bookingsRouter = Router()

bookingsRouter.get('/', (_req: Request, res: Response) => {
  const bookings = inMemoryStore.getBookings()
  res.status(200).json(bookings)
})

bookingsRouter.post('/', (req: Request, res: Response) => {
  const { flightId, passenger, passengerEmail, seatId } = req.body || {}

  if (!flightId || typeof flightId !== 'string' || !flightId.trim()) {
    res.status(400).json({ error: 'Valid flightId is required' })
    return
  }

  if (!passenger || typeof passenger !== 'string' || !passenger.trim()) {
    res.status(400).json({ error: 'Valid passenger name is required' })
    return
  }

  if (!seatId || typeof seatId !== 'string' || !seatId.trim()) {
    res.status(400).json({ error: 'Valid seatId is required (e.g. 12A)' })
    return
  }

  const cleanSeat = seatId.trim().toUpperCase()
  if (!/^\d{1,2}[A-F]$/.test(cleanSeat)) {
    res.status(400).json({ error: `Invalid seat format: "${seatId}". Expected format like "12A".` })
    return
  }

  try {
    const result = inMemoryStore.createBooking({
      flightId: flightId.trim(),
      passenger: passenger.trim(),
      passengerEmail: typeof passengerEmail === 'string' ? passengerEmail.trim() : undefined,
      seatId: cleanSeat,
    })

    res.status(201).json(result)
  } catch (err: any) {
    const status = err.statusCode || 500
    res.status(status).json({
      error: err.message || 'Failed to process booking',
      event: err.event,
    })
  }
})
