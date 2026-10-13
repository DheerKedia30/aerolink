export type Provenance = 'DEMO DATA' | 'DEMO SIMULATION' | 'BACKEND EVENT'
export type BookingStatus = 'Submitted' | 'Queued' | 'Processing' | 'Replicating' | 'Confirmed' | 'Rejected' | 'Failed'
export type SeatStatus = 'available' | 'selected' | 'booked' | 'unavailable'
export type NodeStatus = 'healthy' | 'degraded' | 'unavailable' | 'recovering'
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

export interface Seat {
  id: string
  row: number
  column: string
  status: SeatStatus
  price: number
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


export interface BookingRequest {
  id: string
  flightId: string
  seatId: string
  status: BookingStatus
  queueNode: string
  bookingNode: string
  logicalClock: number
  result: string
}

export interface QueueNode {
  id: string
  status: NodeStatus
  queueDepth: number
  received: number
  processed: number
  heartbeat: string
  isLeader: boolean
  priority: number
}

export interface BookingNode {
  id: string
  shard: string
  status: NodeStatus
  role: 'primary' | 'backup'
  flightGroup: string
  processed: number
  replication: 'Synchronized' | 'Replication pending' | 'Replication failed' | 'Recovering' | 'Unavailable'
  syncedAt: string
}

export interface StorageReplica {
  id: string
  status: NodeStatus
  version: string
  latestWrite: string
  acknowledged: boolean
  sync: 'Synchronized' | 'Awaiting write' | 'Unavailable'
}

export interface DistributedEvent {
  id: string
  sequence?: number
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

export interface SystemHealth {
  status: 'Operational' | 'Degraded' | 'Unavailable'
  updatedAt: string
  requestsProcessed: number
  successfulBookings: number
  rejectedRequests: number
  queueDepth: number
  latency: string
}


export interface LeaderElectionState {
  layer: 'Queue layer' | 'Booking layer'
  algorithm: 'Bully' | 'Ring'
  currentLeader: string
  electionId: string
  heartbeat: string
  history: { time: string; event: string; node: string; tone: EventSeverity }[]
}

export interface SimulationScenario {
  id: string
  name: string
  eyebrow: string
  description: string
  focus: string
  outcome: string
  evidence: string[]
}

export interface SimulationResult {
  scenarioId: string
  running: boolean
  complete: boolean
  steps: string[]
  finalState: string
  tone: EventSeverity
}
