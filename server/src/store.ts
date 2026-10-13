import type { Booking, CreateBookingRequest, DistributedEvent, Flight } from './types.js'
import { sseManager } from './sse.js'

export const SEED_FLIGHTS: Flight[] = [
  { id: 'AI-201', airline: 'Air India', airlineCode: 'AI', flightNumber: 'AI 201', origin: 'BOM', originCity: 'Mumbai', destination: 'DEL', destinationCity: 'Delhi', departure: '06:15', arrival: '08:20', duration: '2h 05m', stops: 0, price: 6480, seatsLeft: 12, cabin: 'Economy', date: '21 Oct 2026', accent: '#e14c4c' },
  { id: '6E-514', airline: 'IndiGo', airlineCode: '6E', flightNumber: '6E 514', origin: 'BOM', originCity: 'Mumbai', destination: 'BLR', destinationCity: 'Bengaluru', departure: '08:45', arrival: '10:35', duration: '1h 50m', stops: 0, price: 5230, seatsLeft: 7, cabin: 'Economy', date: '21 Oct 2026', accent: '#5b45d9' },
  { id: 'UK-955', airline: 'Vistara', airlineCode: 'UK', flightNumber: 'UK 955', origin: 'DEL', originCity: 'Delhi', destination: 'BLR', destinationCity: 'Bengaluru', departure: '10:20', arrival: '13:05', duration: '2h 45m', stops: 0, price: 7120, seatsLeft: 4, cabin: 'Economy', date: '21 Oct 2026', accent: '#6c2e9b' },
  { id: 'AI-687', airline: 'Air India', airlineCode: 'AI', flightNumber: 'AI 687', origin: 'BOM', originCity: 'Mumbai', destination: 'DEL', destinationCity: 'Delhi', departure: '17:40', arrival: '19:50', duration: '2h 10m', stops: 0, price: 5890, seatsLeft: 18, cabin: 'Economy', date: '21 Oct 2026', accent: '#e14c4c' },
  { id: 'SG-142', airline: 'SpiceJet', airlineCode: 'SG', flightNumber: 'SG 142', origin: 'BOM', originCity: 'Mumbai', destination: 'DEL', destinationCity: 'Delhi', departure: '19:10', arrival: '21:25', duration: '2h 15m', stops: 0, price: 4720, seatsLeft: 2, cabin: 'Economy', date: '21 Oct 2026', accent: '#d53f35' },
]

class InMemoryStore {
  private flights: Map<string, Flight> = new Map()
  private bookings: Booking[] = []
  private events: DistributedEvent[] = []
  private sequenceCounter = 0

  constructor() {
    this.reset()
  }

  public reset(): void {
    this.flights.clear()
    for (const flight of SEED_FLIGHTS) {
      this.flights.set(flight.id, { ...flight })
    }
    this.bookings = []
    this.events = []
    this.sequenceCounter = 0

    // Record initial server startup event
    this.addEvent({
      severity: 'INFO',
      type: 'server.started',
      requestId: 'sys_init',
      nodeId: 'aerolink-core',
      message: 'AEROLINK backend core initialized in Phase 1 in-memory mode.',
      provenance: 'BACKEND EVENT',
      details: 'In-memory store initialized with seed flights. Phase 1 active.',
    })
  }

  public getFlights(): Flight[] {
    return Array.from(this.flights.values())
  }

  public getFlight(id: string): Flight | undefined {
    return this.flights.get(id)
  }

  public getBookings(): Booking[] {
    return [...this.bookings]
  }

  public getEvents(limit = 100): DistributedEvent[] {
    return this.events.slice(-limit).reverse()
  }

  public addEvent(eventData: Omit<DistributedEvent, 'id' | 'sequence' | 'timestamp'>): DistributedEvent {
    this.sequenceCounter += 1
    const now = new Date()
    const timestamp = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0')
    const id = `evt-${Date.now()}-${this.sequenceCounter}`

    const event: DistributedEvent = {
      ...eventData,
      id,
      sequence: this.sequenceCounter,
      timestamp,
    }

    this.events.push(event)
    sseManager.broadcastEvent(event)
    return event
  }

  public createBooking(req: CreateBookingRequest): { booking: Booking; event: DistributedEvent } {
    const flight = this.flights.get(req.flightId)
    if (!flight) {
      throw new Error(`Flight ${req.flightId} not found`)
    }

    // Check if seat is already booked on this flight
    const existing = this.bookings.find(
      (b) => b.flightId === req.flightId && b.seatId.toUpperCase() === req.seatId.toUpperCase() && b.status === 'Confirmed'
    )
    if (existing) {
      const conflictEvent = this.addEvent({
        severity: 'ERROR',
        type: 'booking.rejected',
        requestId: `req_conflict_${Date.now()}`,
        nodeId: 'aerolink-core',
        message: `Seat ${req.seatId} on ${req.flightId} is already booked by ${existing.passenger}.`,
        provenance: 'BACKEND EVENT',
        details: `Conflict detected on backend: seat ${req.seatId} was reserved under reference ${existing.reference}.`,
      })
      const err = new Error(`Seat ${req.seatId} is already booked on flight ${req.flightId}`)
      ;(err as any).statusCode = 409
      ;(err as any).event = conflictEvent
      throw err
    }

    const reference = `AL-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
    const requestId = `req_${reference}`
    const now = new Date()
    const dateFormatted = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const timestamp = `${dateFormatted} · ${timeFormatted}`

    const booking: Booking = {
      reference,
      flightId: req.flightId,
      passenger: req.passenger.trim(),
      passengerEmail: req.passengerEmail?.trim(),
      seatId: req.seatId.toUpperCase(),
      status: 'Confirmed',
      timestamp,
      provenance: 'BACKEND EVENT',
      requestId,
    }

    // Decrement flight seatsLeft if > 0
    if (flight.seatsLeft > 0) {
      flight.seatsLeft -= 1
    }

    this.bookings.unshift(booking)

    const event = this.addEvent({
      severity: 'SUCCESS',
      type: 'booking.confirmed',
      requestId,
      nodeId: 'aerolink-core',
      message: `Booking ${reference} confirmed for seat ${booking.seatId} on ${flight.flightNumber}.`,
      provenance: 'BACKEND EVENT',
      details: `Backend registered passenger ${booking.passenger} for seat ${booking.seatId} (${flight.originCity} → ${flight.destinationCity}).`,
    })

    return { booking, event }
  }

  public getStats() {
    return {
      flightsCount: this.flights.size,
      bookingsCount: this.bookings.length,
      eventsCount: this.events.length,
      activeSseClients: sseManager.getActiveCount(),
    }
  }
}

export const inMemoryStore = new InMemoryStore()
