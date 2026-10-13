import type { BookingNode, BookingRequest, DistributedEvent, Flight, LeaderElectionState, QueueNode, SimulationScenario, StorageReplica, SystemHealth } from './types'

export const flights: Flight[] = [
  { id: 'AI-201', airline: 'Air India', airlineCode: 'AI', flightNumber: 'AI 201', origin: 'BOM', originCity: 'Mumbai', destination: 'DEL', destinationCity: 'Delhi', departure: '06:15', arrival: '08:20', duration: '2h 05m', stops: 0, price: 6480, seatsLeft: 12, cabin: 'Economy', date: '21 Oct 2026', accent: '#e14c4c' },
  { id: '6E-514', airline: 'IndiGo', airlineCode: '6E', flightNumber: '6E 514', origin: 'BOM', originCity: 'Mumbai', destination: 'BLR', destinationCity: 'Bengaluru', departure: '08:45', arrival: '10:35', duration: '1h 50m', stops: 0, price: 5230, seatsLeft: 7, cabin: 'Economy', date: '21 Oct 2026', accent: '#5b45d9' },
  { id: 'UK-955', airline: 'Vistara', airlineCode: 'UK', flightNumber: 'UK 955', origin: 'DEL', originCity: 'Delhi', destination: 'BLR', destinationCity: 'Bengaluru', departure: '10:20', arrival: '13:05', duration: '2h 45m', stops: 0, price: 7120, seatsLeft: 4, cabin: 'Economy', date: '21 Oct 2026', accent: '#6c2e9b' },
  { id: 'AI-687', airline: 'Air India', airlineCode: 'AI', flightNumber: 'AI 687', origin: 'BOM', originCity: 'Mumbai', destination: 'DEL', destinationCity: 'Delhi', departure: '17:40', arrival: '19:50', duration: '2h 10m', stops: 0, price: 5890, seatsLeft: 18, cabin: 'Economy', date: '21 Oct 2026', accent: '#e14c4c' },
  { id: 'SG-142', airline: 'SpiceJet', airlineCode: 'SG', flightNumber: 'SG 142', origin: 'BOM', originCity: 'Mumbai', destination: 'DEL', destinationCity: 'Delhi', departure: '19:10', arrival: '21:25', duration: '2h 15m', stops: 0, price: 4720, seatsLeft: 2, cabin: 'Economy', date: '21 Oct 2026', accent: '#d53f35' },
]

export const popularDestinations = [
  { city: 'Dubai', code: 'DXB', meta: 'A city of bright horizons', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80' },
  { city: 'Singapore', code: 'SIN', meta: 'Garden city, new energy', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=900&q=80' },
  { city: 'Bengaluru', code: 'BLR', meta: 'Ideas take flight here', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=900&q=80' },
]

export const queueNodes: QueueNode[] = [
  { id: 'queue-01', status: 'healthy', queueDepth: 18, received: 2842, processed: 2806, heartbeat: '12 sec ago', isLeader: true, priority: 30 },
  { id: 'queue-02', status: 'healthy', queueDepth: 11, received: 2786, processed: 2761, heartbeat: '18 sec ago', isLeader: false, priority: 20 },
  { id: 'queue-03', status: 'degraded', queueDepth: 6, received: 2630, processed: 2604, heartbeat: '42 sec ago', isLeader: false, priority: 10 },
]

export const bookingNodes: BookingNode[] = [
  { id: 'book-01', shard: 'SHARD-BOM-01', status: 'healthy', role: 'primary', flightGroup: 'BOM → DEL', processed: 1920, replication: 'Synchronized', syncedAt: '11 sec ago' },
  { id: 'book-02', shard: 'SHARD-BOM-01', status: 'healthy', role: 'backup', flightGroup: 'BOM → DEL', processed: 1919, replication: 'Synchronized', syncedAt: '11 sec ago' },
  { id: 'book-03', shard: 'SHARD-SOUTH-02', status: 'healthy', role: 'primary', flightGroup: 'BOM → BLR', processed: 1648, replication: 'Synchronized', syncedAt: '16 sec ago' },
  { id: 'book-04', shard: 'SHARD-SOUTH-02', status: 'recovering', role: 'backup', flightGroup: 'BOM → BLR', processed: 1630, replication: 'Recovering', syncedAt: '3 min ago' },
]

export const storageReplicas: StorageReplica[] = [
  { id: 'replica-a', status: 'healthy', version: 'v1842', latestWrite: 'booking/AL-8K4F · 12 sec ago', acknowledged: true, sync: 'Synchronized' },
  { id: 'replica-b', status: 'healthy', version: 'v1842', latestWrite: 'booking/AL-8K4F · 13 sec ago', acknowledged: true, sync: 'Synchronized' },
  { id: 'replica-c', status: 'degraded', version: 'v1841', latestWrite: 'booking/AL-8JZQ · 2 min ago', acknowledged: false, sync: 'Awaiting write' },
]

export const systemHealth: SystemHealth = { status: 'Operational', updatedAt: 'just now', requestsProcessed: 8214, successfulBookings: 6948, rejectedRequests: 83, queueDepth: 35, latency: '184 ms p95' }

export const requests: BookingRequest[] = [
  { id: 'req_8K4F2', flightId: 'AI-201', seatId: '12A', status: 'Confirmed', queueNode: 'queue-01', bookingNode: 'book-01', logicalClock: 1842, result: 'Seat confirmed after quorum acknowledgement.' },
  { id: 'req_8K4D8', flightId: '6E-514', seatId: '8C', status: 'Replicating', queueNode: 'queue-02', bookingNode: 'book-03', logicalClock: 1837, result: 'Waiting for primary-backup synchronization.' },
  { id: 'req_8K49P', flightId: 'UK-955', seatId: '3F', status: 'Rejected', queueNode: 'queue-03', bookingNode: 'book-03', logicalClock: 1818, result: 'Seat no longer available at booking coordinator.' },
]

export const distributedEvents: DistributedEvent[] = [
  { id: 'evt-01', timestamp: '09:48:06.284', severity: 'SUCCESS', type: 'booking.confirmed', requestId: 'req_8K4F2', nodeId: 'book-01', logicalClock: 1842, message: 'Booking AL-8K4F confirmed for seat 12A.', provenance: 'DEMO DATA', details: 'Primary accepted seat 12A and received acknowledgements from replica-a and replica-b.' },
  { id: 'evt-02', timestamp: '09:47:51.112', severity: 'INFO', type: 'replication.ack', requestId: 'req_8K4F2', nodeId: 'replica-b', logicalClock: 1841, message: 'Replica B acknowledged version v1842.', provenance: 'DEMO DATA', details: 'Acknowledgement included shard SHARD-BOM-01 and version v1842.' },
  { id: 'evt-03', timestamp: '09:47:48.916', severity: 'WARN', type: 'heartbeat.late', requestId: '—', nodeId: 'queue-03', logicalClock: 1839, message: 'Heartbeat arrived 28 seconds late.', provenance: 'DEMO DATA', details: 'Node remains available but is marked degraded in the demo view.' },
  { id: 'evt-04', timestamp: '09:47:33.201', severity: 'INFO', type: 'queue.admitted', requestId: 'req_8K4D8', nodeId: 'queue-02', logicalClock: 1837, message: 'Request admitted and forwarded to queue leader.', provenance: 'DEMO DATA', details: 'Round Robin selected queue-02 among available queue nodes.' },
  { id: 'evt-05', timestamp: '09:46:59.505', severity: 'ERROR', type: 'booking.rejected', requestId: 'req_8K49P', nodeId: 'book-03', logicalClock: 1818, message: 'Seat 3F was already unavailable.', provenance: 'DEMO DATA', details: 'No confirmation was returned to the client.' },
]

export const electionState: LeaderElectionState = {
  layer: 'Queue layer', algorithm: 'Bully', currentLeader: 'queue-01', electionId: 'election_0082', heartbeat: '12 sec ago',
  history: [
    { time: '09:47:20', event: 'Heartbeat acknowledged', node: 'queue-01', tone: 'SUCCESS' },
    { time: '09:42:06', event: 'Election completed', node: 'queue-01', tone: 'INFO' },
    { time: '09:41:58', event: 'Leader failure detected', node: 'queue-03', tone: 'WARN' },
    { time: '09:41:55', event: 'Election request broadcast', node: 'queue-02', tone: 'INFO' },
  ],
}

export const scenarios: SimulationScenario[] = [
  { id: 'queue-failure', name: 'Queue node failure', eyebrow: 'Admission layer', description: 'Remove one queue node from Round Robin routing and observe surviving capacity.', focus: 'Round Robin skips unavailable nodes.', outcome: 'Traffic continues through queue-01 and queue-02; queue-03 can rejoin after recovery.', evidence: ['queue-03 marked unavailable', 'next route selected queue-01', 'request remains admitted'] },
  { id: 'leader-failure', name: 'Queue leader failure', eyebrow: 'Election', description: 'Simulate a queue leader heartbeat loss and show the election handoff.', focus: 'The backend owns election results; this is a local visualization.', outcome: 'queue-02 becomes the demo leader after detection.', evidence: ['heartbeat timeout', 'election messages broadcast', 'new leader announced'] },
  { id: 'primary-failure', name: 'Booking primary failure', eyebrow: 'Booking layer', description: 'Show a booking primary becoming unavailable while the backup recovers the shard.', focus: 'Primary-backup relationship', outcome: 'book-02 is marked recovering; confirmation waits for the configured handoff.', evidence: ['primary unavailable', 'backup promoted in demo timeline', 'shard marked recovering'] },
  { id: 'backup-recovery', name: 'Backup recovery & sync', eyebrow: 'Replication', description: 'Replay a backup synchronization after a missed acknowledgement.', focus: 'Primary → backup → acknowledgement', outcome: 'book-04 catches up to the primary version v1842.', evidence: ['sync begins at v1841', 'delta sent to backup', 'version v1842 acknowledged'] },
  { id: 'replica-down', name: 'Storage replica unavailable', eyebrow: 'Quorum', description: 'Take one storage replica out of the write path and evaluate a 2-of-3 quorum.', focus: 'Majority quorum example', outcome: 'Confirmation remains permitted with two acknowledgements in this demo policy.', evidence: ['replica-c unavailable', 'replica-a acknowledged', 'replica-b acknowledged'] },
  { id: 'same-seat', name: 'Simultaneous same-seat attempts', eyebrow: 'Concurrency', description: 'Submit three requests for the same flight and seat to make the safety goal visible.', focus: 'At most one confirmed result', outcome: 'One request is confirmed; two are rejected because the seat is no longer available.', evidence: ['3 requests submitted', '1 confirmation returned', '2 requests rejected'] },
  { id: 'burst', name: 'Sudden booking-request burst', eyebrow: 'Load', description: 'Visualize a burst of inbound requests and the queue absorbing pressure.', focus: 'Queue depth and admission', outcome: 'Queue depth rises, then drains across healthy nodes.', evidence: ['+120 requests admitted', 'leader forwards batches', 'queue depth returns to baseline'] },
]

export const traceSteps = [
  ['01', 'Client submits request', 'Client', 'Request req_8K4F2 received from the passenger interface.'],
  ['02', 'Load balancer selects queue node', 'Load Balancer', 'Round Robin selects queue-01 from available nodes.'],
  ['03', 'Queue node admits request', 'queue-01', 'Request is admitted and attached to the current leader stream.'],
  ['04', 'Leader forwards to booking layer', 'queue-01 → book-01', 'Queue leader forwards the admitted request to SHARD-BOM-01.'],
  ['05', 'Coordinator checks seat availability', 'book-01', 'Seat 12A is available at the current shard state.'],
  ['06', 'Decision is replicated', 'book-01 → book-02', 'Primary sends the booking update to its backup.'],
  ['07', 'Storage quorum acknowledged', 'replica-a + replica-b', 'Two of three replicas acknowledge version v1842.'],
  ['08', 'Response returned to client', 'Client', 'Demo confirmation returned with reference AL-8K4F.'],
]
