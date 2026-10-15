import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import type { Env } from '../index'

export const bookingsRouter = new Hono<{ Bindings: Env }>()

const CreateBookingSchema = z.object({
  package_id: z.string().uuid(),
  customer_name: z.string().min(2),
  customer_phone: z.string().min(8),
  customer_email: z.string().email(),
  customer_country: z.string().default('LK'),
  recipient_name: z.string().min(2),
  recipient_phone: z.string().min(8),
  delivery_address: z.string().min(10),
  event_datetime: z.string().datetime(),
  delivery_slot: z.enum(['morning', 'afternoon', 'evening', 'midnight']),
  special_message: z.string().max(500).optional(),
  add_ons: z.array(z.string()).default([]),
})

// POST /api/bookings — create a new booking draft
bookingsRouter.post(
  '/',
  zValidator('json', CreateBookingSchema),
  async (c) => {
    const body = c.req.valid('json')
    const id = crypto.randomUUID()

    // Check if slot is still available
    const slotCount = await c.env.DB.prepare(
      `SELECT COUNT(*) as count FROM bookings 
       WHERE delivery_slot = ? AND DATE(event_datetime) = DATE(?) 
       AND status NOT IN ('cancelled')`
    ).bind(body.delivery_slot, body.event_datetime).first<{ count: number }>()

    const MAX_PER_SLOT = body.delivery_slot === 'midnight' ? 3 : 5
    if (slotCount && slotCount.count >= MAX_PER_SLOT) {
      return c.json({ error: 'This time slot is fully booked. Please choose a different slot.' }, 409)
    }

    await c.env.DB.prepare(
      `INSERT INTO bookings 
        (id, package_id, customer_name, customer_phone, customer_email, customer_country,
         recipient_name, recipient_phone, delivery_address, event_datetime, delivery_slot, 
         special_message, add_ons, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', CURRENT_TIMESTAMP)`
    ).bind(
      id,
      body.package_id,
      body.customer_name,
      body.customer_phone,
      body.customer_email,
      body.customer_country,
      body.recipient_name,
      body.recipient_phone,
      body.delivery_address,
      body.event_datetime,
      body.delivery_slot,
      body.special_message ?? null,
      JSON.stringify(body.add_ons),
    ).run()

    return c.json({ data: { id, status: 'draft' } }, 201)
  }
)

// GET /api/bookings/:id — fetch booking status (for tracking page)
bookingsRouter.get('/:id', async (c) => {
  const id = c.req.param('id')
  const booking = await c.env.DB.prepare(
    `SELECT b.*, p.title as package_title, p.base_price_lkr 
     FROM bookings b 
     JOIN packages p ON b.package_id = p.id 
     WHERE b.id = ?`
  ).bind(id).first()

  if (!booking) return c.json({ error: 'Booking not found' }, 404)
  return c.json({ data: booking })
})
