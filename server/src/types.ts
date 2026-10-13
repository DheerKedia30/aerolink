export type Provenance = 'DEMO DATA' | 'DEMO SIMULATION' | 'BACKEND EVENT'
export type BookingStatus = 'Submitted' | 'Queued' | 'Processing' | 'Replicating' | 'Confirmed' | 'Rejected' | 'Failed'
export type EventSeverity = 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS'

export interface Flight {
  id: string
  airline: string
  airlineCode: string
  flightNumber: string
  origin: string
  originCity: string
  destination: string
  destinationCity: string
  departure: string
  arrival: string
  duration: string
  stops: number
  price: number
  seatsLeft: number
  cabin: string
  date: string
  accent: string
}

export interface Booking {
  reference: string
  flightId: string
  passenger: string
  passengerEmail?: string
  seatId: string
  status: BookingStatus
  timestamp: string
  provenance: Provenance
  requestId: string
}

export interface CreateBookingRequest {
  flightId: string
  passenger: string
  passengerEmail?: string
  seatId: string
}

export interface DistributedEvent {
  id: string
  sequence: number
  timestamp: string
  severity: EventSeverity
  type: string
  requestId: string
  nodeId: string
  logicalClock?: number
  message: string
  provenance: Provenance
  details: string
}

export interface BackendHealth {
  status: 'UP' | 'DEGRADED' | 'DOWN'
  service: string
  version: string
  uptimeSeconds: number
  timestamp: string
  environment: string
  inMemoryStore: {
    flightsCount: number
    bookingsCount: number
    eventsCount: number
    activeSseClients: number
  }
}
