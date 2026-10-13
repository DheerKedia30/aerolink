# AEROLINK Delivery TODO

## Design system, shell, and route structure
- Establish a shared AEROLINK shell with consistent branding, typography, spacing, borders, status colors, focus states, responsive behavior, and a role/workspace switcher between Passenger and Operations.
- Implement functional navigation for Home, Search Flights, My Bookings, System Status, Account/Demo Profile, Overview, Request Flow, Queue Nodes, Booking Nodes, Replication & Storage, Leader Election, Failure Simulation, and Event Logs.
- Provide loading, empty, error, success, unavailable, and DEMO SIMULATION states where relevant; no critical button may be inert.

## Passenger booking experience
- Provide a premium airline landing page with editable origin/destination/date/return/passenger/cabin controls, swap-origin/destination interaction, demo route cards, trust messaging without unsupported claims, and a restrained footer.
- Provide flight search results with editable search summary, filters for departure time/price/duration/airline, sorting by price/duration/departure, believable internally consistent flight cards, fare selection, seat availability indicators, and a working Continue action.
- Provide interactive seat selection with labeled cabin rows/columns and Available, Selected, Booked, and Unavailable states; only seats marked available in current frontend state can be selected; selected seat and price summary update immediately; passenger details and review panel are usable.
- Provide demo booking completion that updates the selected seat to booked in shared mock state and adds a booking record; clearly distinguish locally selected, simulated, and backend-confirmed states; never show success for failed/unconfirmed transactions.
- Provide confirmation with booking reference, flight/passenger/seat details, timestamp, honest status, and a simplified request timeline; provide My Bookings search, status filters, details, and empty/loading/error states.

## Distributed operations console
- Provide Operations Overview with sample/simulated labels, system health summary, queue/booking/storage status, current leaders/coordinators, request counts, queue depth/latency, last-updated time, and an interactive Clients → Load Balancer → Queue Nodes → Booking Nodes → Storage Replicas topology.
- Clicking a topology node must reveal its ID, role, status, processed count, shard/replica information, and recent events; show leader/primary/backup relationships distinctly without claiming live production behavior.
- Provide Request Flow Explorer with request selection, chronological distributed steps, request/flight/seat/node/logical-clock fields, filters where supported, and distinctions between backend events, simulated demo events, and not-yet-occurred events.
- Provide Queue Nodes with node availability, queue depth, received/processed counts, current leader, health, heartbeat, history, and a visually clear Round Robin sequence; queue failure/recovery controls operate only in clearly labeled demo mode and skip unavailable nodes in local routing.
- Provide Booking Nodes grouped by flight shard with primary/backup roles, health, assigned flight group, processed bookings, replication state, synchronization time, recent events, and a primary-to-backup relationship timeline.
- Provide Replication & Storage with three replicas, availability/version/latest acknowledged write/synchronization, an intuitive 2-of-3 quorum visualization, and a write progression showing initiation, acknowledgements, quorum evaluation, and honest permitted/rejected result.
- Provide Leader Election with queue-layer and booking-layer switcher, configured nodes/priorities, current leader, heartbeats, election history, and distinct Bully/Ring-style demo timelines; never imply the frontend implements the protocol.

## Failure simulation and event logs
- Provide isolated Failure Simulation Lab with DEMO SIMULATION label, scenarios for queue node failure, queue leader failure, booking primary failure, backup recovery/synchronization, storage replica unavailability, simultaneous same-seat attempts, and sudden request bursts.
- Each scenario must have an explanation, initial state, working Run/Execute control, visible deterministic step events, final state, concise outcome summary, evidence, Reset Scenario, and Run Again; concurrent same-seat test must never hide an invalid result.
- Provide searchable Event Logs with timestamp, severity, type, request ID, node ID, logical clock/sequence, message, filters, expandable details, Copy Event Details, and readable large-list layout.

## Shared state, API boundary, and documentation
- Keep deterministic mock data behind a typed service/API boundary with interfaces for Flight, Seat, Booking, BookingRequest, QueueNode, BookingNode, StorageReplica, SystemHealth, DistributedEvent, LeaderElectionState, SimulationScenario, and SimulationResult.
- Use an environment-configurable API base URL; do not hardcode an assumed backend endpoint or invent backend behavior/endpoints.
- Keep completed demo bookings, seats, My Bookings, request traces, node/simulation state, and event logs synchronized across passenger and operations views.
- Provide README setup/run instructions, demo credentials if needed, architecture notes, API contract proposal/assumptions, and a recommended presentation demonstration sequence.

## Validation and delivery
- Provide the complete page route manifest at `/manus-routes.json` and keep it synchronized with source routes.
- Register TypeScript diagnostics, run the app on the managed preview port, verify the route manifest, run build/type checks, and inspect representative passenger and operations screens.
- Save the finished project to the managed canonical branch/checkpoint only after the implemented outcomes are evidenced.
