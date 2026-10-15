import { Hono } from 'hono'
import type { Env } from '../index'

export const packagesRouter = new Hono<{ Bindings: Env }>()

packagesRouter.get('/', async (c) => {
  const packages = await c.env.DB.prepare(
    `SELECT * FROM packages WHERE is_active = 1 ORDER BY sort_order ASC`
  ).all()
  return c.json({ data: packages.results })
})

packagesRouter.get('/:slug', async (c) => {
  const slug = c.req.param('slug')
  const pkg = await c.env.DB.prepare(
    `SELECT * FROM packages WHERE slug = ? AND is_active = 1`
  ).bind(slug).first()

  if (!pkg) return c.json({ error: 'Package not found' }, 404)
  return c.json({ data: pkg })
})
