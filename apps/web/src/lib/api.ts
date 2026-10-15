const API_BASE = import.meta.env.VITE_API_URL ?? '/api'

export const api = {
  packages: {
    list: () => fetch(`${API_BASE}/packages`).then(r => r.json()),
    get: (slug: string) => fetch(`${API_BASE}/packages/${slug}`).then(r => r.json()),
  },
  slots: {
    availability: (date: string) => fetch(`${API_BASE}/slots?date=${date}`).then(r => r.json()),
  },
  bookings: {
    create: (data: unknown) =>
      fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(r => r.json()),
    get: (id: string) => fetch(`${API_BASE}/bookings/${id}`).then(r => r.json()),
  },
}
