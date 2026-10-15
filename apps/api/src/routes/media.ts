import { Hono } from 'hono'
import type { Env } from '../index'

export const mediaRouter = new Hono<{ Bindings: Env }>()

// POST /api/media/upload-url — generate a presigned R2 upload URL for a booking's reaction video / card artwork
mediaRouter.post('/upload-url', async (c) => {
  const body = await c.req.json<{ booking_id: string; file_type: string; content_type: string }>()

  if (!body.booking_id || !body.file_type || !body.content_type) {
    return c.json({ error: 'booking_id, file_type, and content_type are required' }, 400)
  }

  const validTypes = ['reaction_video', 'setup_photo', 'card_artwork']
  if (!validTypes.includes(body.file_type)) {
    return c.json({ error: `file_type must be one of: ${validTypes.join(', ')}` }, 400)
  }

  const key = `bookings/${body.booking_id}/${body.file_type}/${crypto.randomUUID()}`
  const url = await c.env.MEDIA.createMultipartUpload(key)

  return c.json({ data: { key, upload_id: url.uploadId } })
})

// GET /api/media/:booking_id — list all media assets for a booking
mediaRouter.get('/:booking_id', async (c) => {
  const booking_id = c.req.param('booking_id')
  const assets = await c.env.DB.prepare(
    `SELECT * FROM media_assets WHERE booking_id = ? ORDER BY created_at DESC`
  ).bind(booking_id).all()

  return c.json({ data: assets.results })
})
