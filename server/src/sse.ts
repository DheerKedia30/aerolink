import type { Response } from 'express'
import type { DistributedEvent } from './types.js'

interface SseClient {
  id: string
  res: Response
  connectedAt: Date
}

class SseManager {
  private clients: Map<string, SseClient> = new Map()
  private heartbeatInterval: NodeJS.Timeout | null = null

  constructor() {
    // Send a lightweight comment ping every 20 seconds to keep HTTP connections alive
    this.heartbeatInterval = setInterval(() => {
      this.sendKeepAlive()
    }, 20000)
    this.heartbeatInterval.unref?.()
  }

  public registerClient(res: Response): string {
    const clientId = `client_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
      'Access-Control-Allow-Origin': '*',
    })

    if (typeof res.flushHeaders === 'function') {
      res.flushHeaders()
    }

    const client: SseClient = {
      id: clientId,
      res,
      connectedAt: new Date(),
    }

    this.clients.set(clientId, client)

    // Initial connection acknowledgement event
    const initPayload = {
      type: 'system.connected',
      clientId,
      message: 'AEROLINK SSE connection established.',
      timestamp: new Date().toISOString(),
      activeClients: this.clients.size,
    }

    res.write(`event: connected\ndata: ${JSON.stringify(initPayload)}\n\n`)

    res.on('close', () => {
      this.clients.delete(clientId)
    })

    return clientId
  }

  public broadcastEvent(event: DistributedEvent): void {
    const payload = `id: ${event.sequence}\nevent: distributed_event\ndata: ${JSON.stringify(event)}\n\n`

    for (const [id, client] of this.clients.entries()) {
      try {
        client.res.write(payload)
      } catch (err) {
        this.clients.delete(id)
      }
    }
  }

  private sendKeepAlive(): void {
    const comment = `: ping ${Date.now()}\n\n`
    for (const [id, client] of this.clients.entries()) {
      try {
        client.res.write(comment)
      } catch (err) {
        this.clients.delete(id)
      }
    }
  }

  public getActiveCount(): number {
    return this.clients.size
  }

  public destroy(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
    for (const client of this.clients.values()) {
      try {
        client.res.end()
      } catch {
        // ignore
      }
    }
    this.clients.clear()
  }
}

export const sseManager = new SseManager()
