# AEROLINK

**Every journey. Reliably connected.**

AEROLINK is a premium airline-booking frontend paired with a distributed-systems demonstration console for the college project **Distributed Airline Booking System: A Queue-Admission Architecture for Handling Sudden Booking Rushes**.

## What is included

The app contains two consistent workspaces:

- **Passenger**: Home, flight search, seat selection, honest demo confirmation, My Bookings, system status, and a demo profile.
- **Operations**: Overview topology, request flow explorer, Queue Nodes/Round Robin, Booking Nodes and shards, Replication & Storage quorum, Leader Election, Failure Simulation Lab, and Event Logs.

Every seeded metric, heartbeat, acknowledgement, election, booking, and failure transition is explicitly marked as `DEMO DATA` or `DEMO SIMULATION`. The frontend does not claim that a real distributed backend executed any simulated behavior.

## Running Locally (Phase 1: Frontend + Live API)

### 1. Start the Backend Server (Terminal 1)
```bash
# From repository root:
npm run server:start
# Or during development with auto-reload:
npm run server:dev

# Alternatively, directly inside server/:
cd server
npm install
npm run dev
```
The Node.js/Express backend listens on `http://localhost:3001`.

### 2. Start the Frontend (Terminal 2)
```bash
npm install
npm run dev
```
The Vite frontend listens on `http://localhost:3000` (or `3002` if 3000 is occupied). It automatically proxies `/api` requests to `http://localhost:3001`.

### 3. Production Build & Validation
```bash
# Frontend typecheck & bundle
npm run build

# Backend typecheck & build
npm run server:typecheck
npm run server:build
```

## Phase 1 Implemented API Contracts

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/health` | `GET` | Returns process uptime, environment, in-memory counters, and active SSE client count. |
| `/api/flights` | `GET` | Returns live flight inventory and seats remaining. |
| `/api/bookings` | `GET` | Returns all confirmed bookings held in memory by the backend. |
| `/api/bookings` | `POST` | Validates booking payload, checks for seat conflicts, creates reservation, and broadcasts an SSE event. |
| `/api/events` | `GET` | Returns recent backend events with sequence IDs and timestamps. |
| `/api/events/stream` | `GET` | Live Server-Sent Events (SSE) telemetry connection. Emits real-time `booking.confirmed` and `system` events. |


## Project structure

- `src/App.tsx` — shared shell, routes, passenger pages, operations pages, and interactions.
- `src/styles.css` — responsive design system, passenger light theme, and operations navy canvas.
- `src/data.ts` — deterministic demo flights, nodes, events, traces, and scenarios.
- `src/types.ts` — domain contracts shared by the UI and future adapter.
- `src/services/api.ts` — mock service and future API integration seam.
- `public/manus-routes.json` — complete page route manifest.
- `plan.md` and `TODO.md` — approved design/implementation plan and acceptance outcomes.

## Assumptions

- No backend or flight API was supplied, so the initial experience is a clearly labeled demo mode.
- Local booking completion updates shared frontend state only; it is not an airline reservation.
- Failure controls and simulation scenarios are isolated from any backend operations.
- The visualized 2-of-3 quorum is an example policy and must be replaced with the backend’s actual consistency policy when connected.
- Bully/Ring election screens explain concepts and display demo transitions; the frontend does not implement leader-election protocols.
