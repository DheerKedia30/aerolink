import { Router, type Request, type Response } from 'express'
import { inMemoryStore } from '../store.js'
import type { BackendHealth } from '../types.js'

export const healthRouter = Router()

const startTime = Date.now()

healthRouter.get('/', (_req: Request, res: Response) => {
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000)
  const stats = inMemoryStore.getStats()

  const health: BackendHealth = {
    status: 'UP',
    service: 'aerolink-core',
    version: '0.1.0',
    uptimeSeconds,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    inMemoryStore: stats,
  }

  res.status(200).json(health)
})
