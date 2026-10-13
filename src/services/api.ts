import { flights as seedFlights, distributedEvents as seedEvents, requests as seedRequests } from '../data'
import type { BackendHealth, Booking, CreateBookingRequest, DistributedEvent, Flight } from '../types'

// Use VITE_API_BASE_URL if explicitly defined; otherwise default to '/api'
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL !== undefined && import.meta.env.VITE_API_BASE_URL !== '')
  ? import.meta.env.VITE_API_BASE_URL
  : '/api'

export interface AerolinkApi {
  readonly isLiveBackend: boolean
  getHealth(): Promise<BackendHealth | null>
  listFlights(): Promise<Flight[]>
  listRequests(): Promise<typeof seedRequests>
  listEvents(): Promise<DistributedEvent[]>
  listBookings(): Promise<Booking[]>
  createBooking(booking: CreateBookingRequest | Booking): Promise<Booking>
  subscribeEvents?(onEvent: (event: DistributedEvent) => void): () => void
}

export class MockService implements AerolinkApi {
  readonly isLiveBackend = false
  private bookings: Booking[] = []

  async getHealth(): Promise<BackendHealth | null> {
    return null
  }

  async listFlights(): Promise<Flight[]> {
    return seedFlights
  }

  async listRequests(): Promise<typeof seedRequests> {
    return seedRequests
  }

  async listEvents(): Promise<DistributedEvent[]> {
    return seedEvents
  }

  async listBookings(): Promise<Booking[]> {
    return this.bookings
  }

  async createBooking(booking: CreateBookingRequest | Booking): Promise<Booking> {
    if ('reference' in booking && (booking as Booking).reference) {
      this.bookings.unshift(booking as Booking)
      return booking as Booking
    }
    const req = booking as CreateBookingRequest
    const reference = `AL-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
    const now = new Date()
    const newBooking: Booking = {
      reference,
      flightId: req.flightId,
      passenger: req.passenger,
      passengerEmail: req.passengerEmail,
      seatId: req.seatId,
      status: 'Confirmed',
      timestamp: `${now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} · ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      provenance: 'DEMO SIMULATION',
      requestId: `req_${reference}`,
    }
    this.bookings.unshift(newBooking)
    return newBooking
  }
}

export class HttpApiClient implements AerolinkApi {
  readonly isLiveBackend = true
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl.replace(/\/+$/, '')
  }

  async getHealth(): Promise<BackendHealth | null> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 2500)
      const res = await fetch(`${this.baseUrl}/health`, { signal: controller.signal })
      clearTimeout(timeoutId)
      if (!res.ok) return null
      return await res.json()
    } catch {
      return null
    }
  }

  async listFlights(): Promise<Flight[]> {
    const res = await fetch(`${this.baseUrl}/flights`)
    if (!res.ok) throw new Error(`Failed to fetch flights: ${res.statusText}`)
    return await res.json()
  }

  async listRequests(): Promise<typeof seedRequests> {
    return seedRequests
  }

  async listEvents(): Promise<DistributedEvent[]> {
    const res = await fetch(`${this.baseUrl}/events`)
    if (!res.ok) throw new Error(`Failed to fetch events: ${res.statusText}`)
    return await res.json()
  }

  async listBookings(): Promise<Booking[]> {
    const res = await fetch(`${this.baseUrl}/bookings`)
    if (!res.ok) throw new Error(`Failed to fetch bookings: ${res.statusText}`)
    return await res.json()
  }

  async createBooking(booking: CreateBookingRequest | Booking): Promise<Booking> {
    const payload: CreateBookingRequest = {
      flightId: booking.flightId,
      passenger: booking.passenger,
      passengerEmail: booking.passengerEmail,
      seatId: booking.seatId,
    }

    const res = await fetch(`${this.baseUrl}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      let message = `Booking failed with status ${res.status}`
      try {
        const body = await res.json()
        if (body.error) message = body.error
      } catch {
        // ignore parse error
      }
      throw new Error(message)
    }

    const data = await res.json()
    return data.booking
  }

  subscribeEvents(onEvent: (event: DistributedEvent) => void): () => void {
    const streamUrl = `${this.baseUrl}/events/stream`
    let eventSource: EventSource | null = null

    try {
      eventSource = new EventSource(streamUrl)

      eventSource.addEventListener('distributed_event', (e: MessageEvent) => {
        try {
          const parsed = JSON.parse(e.data) as DistributedEvent
          onEvent(parsed)
        } catch (err) {
          console.error('[SSE parse error]', err)
        }
      })

      eventSource.onerror = (err) => {
        console.warn('[SSE connection status]', err)
      }
    } catch (err) {
      console.error('[SSE initialization error]', err)
    }

    return () => {
      if (eventSource) {
        eventSource.close()
      }
    }
  }
}

export const mockService = new MockService()
export const httpApiClient = new HttpApiClient()
export const api: AerolinkApi = httpApiClient
