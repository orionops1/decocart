import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { packagesRouter } from './routes/packages'
import { bookingsRouter } from './routes/bookings'
import { slotsRouter } from './routes/slots'
import { mediaRouter } from './routes/media'

export type Env = {
  DB: D1Database
  MEDIA: R2Bucket
  KV: KVNamespace
  ENVIRONMENT: string
  APP_URL: string
}

const app = new Hono<{ Bindings: Env }>()

// ── Middleware ──────────────────────────────────────────────────────────────
app.use('*', logger())
app.use(
  '/api/*',
  cors({
    origin: (origin, c) => {
      const allowed = [
        'http://localhost:5173',
        'https://decocart.pages.dev',
      ]
      return allowed.includes(origin) ? origin : 'https://decocart.pages.dev'
    },
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
)

// ── Health Check ─────────────────────────────────────────────────────────────
app.get('/', (c) => c.json({ status: 'ok', service: 'DecoCart API', version: '1.0.0' }))

// ── Routes ────────────────────────────────────────────────────────────────────
app.route('/api/packages', packagesRouter)
app.route('/api/bookings', bookingsRouter)
app.route('/api/slots', slotsRouter)
app.route('/api/media', mediaRouter)

// ── 404 Catch-all ────────────────────────────────────────────────────────────
app.notFound((c) => c.json({ error: 'Not found' }, 404))
app.onError((err, c) => {
  console.error(err)
  return c.json({ error: 'Internal server error' }, 500)
})

export default app
