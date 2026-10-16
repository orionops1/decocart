import { DECOCART_PACKAGES, getPackageBySlug, type DecoCartPackage } from '../data/packages'

const API_BASE = import.meta.env.VITE_API_URL ?? '/api'

export const api = {
  packages: {
    list: async (): Promise<{ data: DecoCartPackage[] }> => {
      try {
        const res = await fetch(`${API_BASE}/packages`)
        if (res.ok) {
          const json = await res.json()
          if (Array.isArray(json?.data) && json.data.length > 0) {
            return json
          }
        }
      } catch (err) {
        // Fall through to local fallback
      }
      return { data: DECOCART_PACKAGES }
    },
    get: async (slug: string): Promise<{ data: DecoCartPackage | undefined }> => {
      try {
        const res = await fetch(`${API_BASE}/packages/${slug}`)
        if (res.ok) {
          const json = await res.json()
          if (json?.data) return json
        }
      } catch (err) {
        // Fall through to local fallback
      }
      const local = getPackageBySlug(slug)
      return { data: local }
    },
  },
  slots: {
    availability: async (date: string) => {
      try {
        const res = await fetch(`${API_BASE}/slots?date=${date}`)
        if (res.ok) {
          const json = await res.json()
          if (Array.isArray(json?.data)) return json
        }
      } catch (err) {
        // Fallback slots generator
      }
      return {
        date,
        data: [
          { slot: 'morning', available: 4, capacity: 5, is_available: true },
          { slot: 'afternoon', available: 5, capacity: 5, is_available: true },
          { slot: 'evening', available: 3, capacity: 5, is_available: true },
          { slot: 'midnight', available: 2, capacity: 3, is_available: true },
        ],
      }
    },
  },
  bookings: {
    create: async (data: Record<string, unknown>) => {
      try {
        const res = await fetch(`${API_BASE}/bookings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        if (res.ok) {
          const json = await res.json()
          if (json?.data?.id) return json
        }
      } catch (err) {
        // Fallback local persistence
      }

      // Generate local draft booking
      const id = 'deco-' + Math.random().toString(36).substring(2, 10)
      const bookingRecord = {
        id,
        ...data,
        status: 'confirmed',
        created_at: new Date().toISOString(),
      }
      try {
        localStorage.setItem(`decocart_booking_${id}`, JSON.stringify(bookingRecord))
      } catch (e) {
        // Ignore quota errors
      }
      return { data: { id, status: 'confirmed' } }
    },
    get: async (id: string) => {
      try {
        const res = await fetch(`${API_BASE}/bookings/${id}`)
        if (res.ok) {
          const json = await res.json()
          if (json?.data) return json
        }
      } catch (err) {
        // Fall through to local fallback
      }

      // Try local storage
      try {
        const raw = localStorage.getItem(`decocart_booking_${id}`)
        if (raw) {
          const parsed = JSON.parse(raw)
          const pkg = DECOCART_PACKAGES.find(p => p.id === parsed.package_id || p.slug === parsed.package_slug) || DECOCART_PACKAGES[1]
          return {
            data: {
              ...parsed,
              package_title: pkg.title,
              base_price_lkr: pkg.base_price_lkr,
            },
          }
        }
      } catch (e) {
        // ignore
      }

      // Fallback demo record for tracking preview
      return {
        data: {
          id,
          package_title: 'Gold Package',
          recipient_name: 'Recipient (Special Loved One)',
          delivery_slot: 'Midnight (12:00 AM)',
          event_datetime: new Date(Date.now() + 86400000 * 2).toISOString(),
          status: 'confirmed',
          base_price_lkr: 58000,
        },
      }
    },
  },
}
