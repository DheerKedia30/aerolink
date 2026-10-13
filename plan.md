# AEROLINK Implementation & Design Plan

## Scope

Build a responsive React + TypeScript + Vite single-page frontend for the AEROLINK Distributed Airline Booking System demonstration. The product has two coherent workspaces sharing one shell and one deterministic demo state:

- **Passenger**: premium airline booking journey from search to seat selection, confirmation, and bookings.
- **Operations**: visual explanation of the distributed request path, queue/booking/storage nodes, elections, replication, event history, and isolated simulations.

The frontend will never present local demo behavior as live backend truth. Every simulated metric, event, node state, acknowledgement, election, and booking outcome is explicitly labeled as demo data or simulation. A typed service boundary keeps the mock source replaceable by a real backend later.

## Implementation approach

- Use a small, maintainable React/Vite app with TypeScript, React Router, and CSS variables rather than over-engineering a full backend.
- Use shared React context/state for the mock data model so seat changes, completed demo bookings, My Bookings, request traces, event logs, and operations screens stay consistent.
- Keep mock data and service contracts in `src/services/` and `src/types/`; expose an API-base-url configuration point through `VITE_API_BASE_URL` without assuming a backend endpoint.
- Build reusable shell, navigation, status badge, metric tile, card, table, topology node, timeline, modal, form, and empty/loading/error-state components.
- Use deterministic mock data and controlled demo transitions rather than timers that imply production telemetry. Simulations update local state only and clearly show a `DEMO SIMULATION` banner.
- Keep the UI functional: route navigation, passenger search, filter/sort controls, route swapping, flight selection, seat selection, confirmation, booking search/status filtering, node selection, request selection, tabs, copy details, scenario selection, run/reset, and state changes all have visible outcomes.

## Design direction

### Design movement
**Quiet luxury travel-tech**: a premium editorial airline experience fused with the calm clarity of a modern infrastructure control room.

### Core principles
1. **Trust through clarity** — visible status, honest demo labels, concise microcopy, and meaningful hierarchy.
2. **Editorial restraint** — large confident typography, spacious layouts, thin borders, and purposeful color.
3. **Operational legibility** — technical identifiers use monospace, events are chronological, and topology relationships are explicit.
4. **Progressive complexity** — passenger pages stay simple; technical detail appears only in the operations workspace.

### Color philosophy
Use off-white and midnight navy as the product’s steady foundation. Electric blue is the ownable interaction color for navigation, selected seats, focus, and request flow. Green means verified healthy/successful demo state, amber means pending/degraded, and red is reserved for actual simulated failure. Borders and muted slate keep dense technical surfaces calm.

### Layout paradigm
Use a **split workspace**: a slim, persistent brand/role rail at desktop, a generous page canvas with an editorial header, and structured content bands rather than a grid of equal admin cards. Passenger pages use wide hero/search compositions and progressive panels. Operations pages use a dark canvas with a topology strip above focused detail panels and tables.

### Signature elements
- AEROLINK wordmark with an angled “A” flight-path mark and a small blue route line motif.
- Fine route-line connectors and numbered flow stages linking distributed components.
- “Signal cards”: a narrow status rail, timestamp, and provenance label (`DEMO DATA`, `SIMULATED`, or `BACKEND EVENT` when available).

### Interaction and animation
Interactions should feel deliberate and calm: 150–220ms ease-out transitions for cards, nav, and selected states; subtle hover lift only for actionable cards; no looping decorative motion. Request-flow and simulation steps may animate only while a clearly labeled local demo is running. Use focus rings, keyboard-friendly buttons/selects, and text labels in addition to status color.

### Typography
Use Inter from a CSS import with system fallbacks. Headings are bold and editorial; body uses 14–16px with relaxed line height; UI labels are compact uppercase with letter spacing; numbers use tabular numerals; technical IDs/logs use a monospace stack.

### Brand essence
A calm, credible booking system for passengers and the people explaining how it survives a rush. Personality: **reassuring, precise, quietly ambitious**.

### Brand voice
Headlines are confident and human: “Your next journey, without the uncertainty.” CTAs are direct: “Search flights”, “Review booking”, “Run simulation”. Technical copy says what the system knows and where it comes from: “Demo activity — no live backend connected.”

### Wordmark & logo
Create a CSS/SVG mark combining a forward-leaning A with two offset route strokes, suggesting an aircraft path and distributed handoff. Pair with the AEROLINK wordmark in a strong sans-serif, never an unstyled text-only default logo.

### Signature brand color
**Electric Blue `#3563E9`** — the “link” color that ties passenger actions to the distributed route across the product.

## Product structure

```text
src/
  app/
    App.tsx                 # Router, shared providers, global shell routing
    routes.ts               # Route metadata for navigation and route manifest
  components/
    layout/                 # AppShell, Sidebar, Topbar, WorkspaceSwitcher
    ui/                     # Button, Card, Badge, Modal, Tabs, FormField, States
    booking/                # SearchPanel, FlightCard, SeatMap, BookingTimeline
    operations/              # MetricTile, Topology, NodeCard, TraceTimeline, DataTable
  data/
    demoData.ts             # deterministic flights, nodes, events, scenarios
  pages/
    passenger/              # Home, Search, SeatSelection, Confirmation, Bookings
    operations/             # Overview, RequestFlow, Queue, BookingNodes,
                             # Replication, Election, FailureLab, EventLogs
  services/
    api.ts                  # typed API boundary and configurable base URL
    mockService.ts          # local implementation behind the same interface
  state/
    DemoStateContext.tsx    # shared booking, seat, simulation, and trace state
  types/
    index.ts                # Flight, Seat, Booking, node/event/simulation schemas
  styles/
    globals.css             # tokens, typography, responsive foundations
public/
  manus-routes.json         # complete page-route manifest
README.md                   # setup, mock/API boundary, demo sequence, assumptions
app.config.ts               # project logo metadata
```

## Screen delivery order

1. Establish tokens, app shell, role switcher, routing, reusable components, and shared demo state.
2. Implement the passenger flow: Home → Search Flights → Seat Selection → Confirmation → My Bookings.
3. Implement Operations Overview and the request-flow/topology model.
4. Add Queue Nodes, Booking Nodes, Replication & Storage, and Leader Election screens.
5. Add Failure Simulation Lab and Event Logs with deterministic local transitions.
6. Add route manifest, README/API contract notes, responsive refinements, diagnostics, build, and preview verification.

## Backend boundary and assumptions

- No backend is assumed to exist; all values shown initially are deterministic demo data.
- `VITE_API_BASE_URL` is optional. If present, a future adapter can implement the typed `ApiClient`; otherwise the app uses `MockService`.
- Proposed future read endpoints are documented as a contract proposal only, not called by the demo: `GET /flights`, `GET /system/health`, `GET /requests/:id`, `GET /nodes`, `GET /events`, and `POST /bookings` / simulation endpoints subject to backend confirmation.
- The frontend will not implement or claim Round Robin, Bully/Ring election, quorum, replication, or concurrency guarantees; it only visualizes backend events or locally labeled demo transitions.

## Serving and validation workflow

- Register TypeScript diagnostics with the managed Webdev runtime before the first source-code batch.
- Install pinned dependencies, run the Vite dev server on the configured preview port, and verify `/manus-routes.json` returns the route manifest.
- Run TypeScript/build checks, inspect code paths, and use the managed preview for a focused visual pass over passenger Home, Seat Selection, Operations Overview, and Failure Lab.
- Save the completed project to the managed canonical branch/checkpoint after validation.
