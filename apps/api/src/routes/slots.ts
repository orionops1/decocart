import { Hono } from 'hono'
import type { Env } from '../index'

export const slotsRouter = new Hono<{ Bindings: Env }>()

// GET /api/slots?date=2026-11-15 — available slots for a given date
slotsRouter.get('/', async (c) => {
  const date = c.req.query('date')
  if (!date) return c.json({ error: 'date query param is required (YYYY-MM-DD)' }, 400)

  const SLOT_CAPS: Record<string, number> = {
    morning: 5,
    afternoon: 5,
    evening: 5,
    midnight: 3,
  }

  const counts = await c.env.DB.prepare(
    `SELECT delivery_slot, COUNT(*) as count 
     FROM bookings 
     WHERE DATE(event_datetime) = ? AND status NOT IN ('cancelled') 
     GROUP BY delivery_slot`
  ).bind(date).all<{ delivery_slot: string; count: number }>()

  const booked: Record<string, number> = {}
  for (const row of counts.results) {
    booked[row.delivery_slot] = row.count
  }

  const slots = Object.entries(SLOT_CAPS).map(([slot, cap]) => ({
    slot,
    available: cap - (booked[slot] ?? 0),
    capacity: cap,
    is_available: (cap - (booked[slot] ?? 0)) > 0,
  }))

  return c.json({ date, data: slots })
})
