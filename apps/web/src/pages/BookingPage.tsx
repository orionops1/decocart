import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { format, addDays } from 'date-fns'
import { Clock, Moon, Sun, Sunrise, Sunset, ArrowRight, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { api } from '@/lib/api'
import { formatLKR } from '@/lib/utils'

const SLOT_META = {
  morning:   { label: 'Morning',   time: '8:00 AM – 12:00 PM', icon: Sunrise },
  afternoon: { label: 'Afternoon', time: '12:00 PM – 5:00 PM',  icon: Sun },
  evening:   { label: 'Evening',   time: '5:00 PM – 10:00 PM',  icon: Sunset },
  midnight:  { label: 'Midnight',  time: 'Exactly 12:00 AM 🎉',  icon: Moon },
}

type FormData = {
  customer_name: string
  customer_phone: string
  customer_email: string
  customer_country: string
  recipient_name: string
  recipient_phone: string
  delivery_address: string
  event_datetime: string
  delivery_slot: string
  special_message: string
}

export function BookingPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()

  const [selectedDate, setSelectedDate] = useState(format(addDays(new Date(), 2), 'yyyy-MM-dd'))
  const [form, setForm] = useState<FormData>({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    customer_country: 'LK',
    recipient_name: '',
    recipient_phone: '',
    delivery_address: '',
    event_datetime: '',
    delivery_slot: '',
    special_message: '',
  })

  const { data: pkgData } = useQuery({
    queryKey: ['package', slug],
    queryFn: () => api.packages.get(slug!),
    enabled: !!slug,
  })

  const { data: slotsData } = useQuery({
    queryKey: ['slots', selectedDate],
    queryFn: () => api.slots.availability(selectedDate),
    enabled: !!selectedDate,
  })

  const pkg = pkgData?.data
  const slots = slotsData?.data ?? []

  const bookMutation = useMutation({
    mutationFn: api.bookings.create,
    onSuccess: (data) => {
      if (data?.data?.id) {
        toast.success('🎉 Booking confirmed! Redirecting to your tracking page...')
        setTimeout(() => navigate(`/track/${data.data.id}`), 1500)
      } else {
        toast.error(data?.error ?? 'Something went wrong.')
      }
    },
    onError: () => toast.error('Network error. Please try again.'),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!pkg || !form.delivery_slot) {
      toast.error('Please select a delivery slot.')
      return
    }
    bookMutation.mutate({
      ...form,
      package_id: pkg.id,
      event_datetime: `${selectedDate}T${form.delivery_slot === 'midnight' ? '00:00:00' : '09:00:00'}Z`,
    })
  }

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  if (!pkg) return <div className="py-32 text-center text-brand-muted">Loading package...</div>

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="mb-10">
          <p className="text-brand-gold text-sm font-medium mb-2">Booking · {pkg.title}</p>
          <h1 className="font-display text-4xl font-bold">Complete Your <span className="gold-gradient">Booking</span></h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* ── Date & Slot ── */}
          <section className="card">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2"><Clock className="w-4 h-4 text-brand-gold" /> When should we arrive?</h2>
            <div className="mb-4">
              <label className="block text-sm text-brand-muted mb-2">Select Date</label>
              <input
                type="date"
                value={selectedDate}
                min={format(addDays(new Date(), 1), 'yyyy-MM-dd')}
                onChange={e => setSelectedDate(e.target.value)}
                className="w-full bg-brand-surface border border-brand-border rounded-xl px-4 py-3 text-brand-text focus:outline-none focus:border-brand-gold transition-colors"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {slots.map((s: { slot: string; is_available: boolean; available: number }) => {
                const meta = SLOT_META[s.slot as keyof typeof SLOT_META]
                const SlotIcon = meta.icon
                return (
                  <button
                    key={s.slot}
                    type="button"
                    disabled={!s.is_available}
                    onClick={() => setForm(p => ({ ...p, delivery_slot: s.slot }))}
                    className={`relative p-4 rounded-xl border text-left transition-all duration-200 ${
                      form.delivery_slot === s.slot
                        ? 'border-brand-gold bg-brand-gold/10'
                        : s.is_available
                          ? 'border-brand-border hover:border-brand-gold/50'
                          : 'border-brand-border opacity-40 cursor-not-allowed'
                    }`}
                  >
                    <SlotIcon className={`w-5 h-5 mb-2 ${form.delivery_slot === s.slot ? 'text-brand-gold' : 'text-brand-muted'}`} />
                    <div className="font-medium text-sm">{meta.label}</div>
                    <div className="text-brand-muted text-xs">{meta.time}</div>
                    {!s.is_available && <div className="text-xs text-red-400 mt-1">Fully booked</div>}
                    {s.is_available && s.available <= 2 && (
                      <div className="text-xs text-brand-gold mt-1">Only {s.available} left!</div>
                    )}
                  </button>
                )
              })}
            </div>
          </section>

          {/* ── Recipient ── */}
          <section className="card">
            <h2 className="font-semibold text-lg mb-4">🎁 Recipient Details</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { label: 'Recipient Name', field: 'recipient_name' as const, placeholder: "Who's the lucky person?" },
                { label: 'Recipient Phone', field: 'recipient_phone' as const, placeholder: '+94 77 123 4567' },
              ].map(({ label, field, placeholder }) => (
                <div key={field}>
                  <label className="block text-sm text-brand-muted mb-2">{label}</label>
                  <input value={form[field]} onChange={set(field)} placeholder={placeholder} required
                    className="w-full bg-brand-surface border border-brand-border rounded-xl px-4 py-3 text-brand-text placeholder:text-brand-border focus:outline-none focus:border-brand-gold transition-colors" />
                </div>
              ))}
            </div>
            <div className="mt-4">
              <label className="block text-sm text-brand-muted mb-2">Delivery Address</label>
              <input value={form.delivery_address} onChange={set('delivery_address')} placeholder="Full address with landmarks" required
                className="w-full bg-brand-surface border border-brand-border rounded-xl px-4 py-3 text-brand-text placeholder:text-brand-border focus:outline-none focus:border-brand-gold transition-colors" />
            </div>
            <div className="mt-4">
              <label className="block text-sm text-brand-muted mb-2">Special Message (optional)</label>
              <textarea value={form.special_message} onChange={set('special_message')} maxLength={500} rows={3}
                placeholder="We'll add it to the card..."
                className="w-full bg-brand-surface border border-brand-border rounded-xl px-4 py-3 text-brand-text placeholder:text-brand-border focus:outline-none focus:border-brand-gold transition-colors resize-none" />
            </div>
          </section>

          {/* ── Booker ── */}
          <section className="card">
            <h2 className="font-semibold text-lg mb-4">📱 Your Details</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { label: 'Your Name', field: 'customer_name' as const, placeholder: 'Your full name' },
                { label: 'Your Phone / WhatsApp', field: 'customer_phone' as const, placeholder: '+94 77 000 0000' },
                { label: 'Your Email', field: 'customer_email' as const, placeholder: 'you@example.com' },
              ].map(({ label, field, placeholder }) => (
                <div key={field}>
                  <label className="block text-sm text-brand-muted mb-2">{label}</label>
                  <input value={form[field]} onChange={set(field)} placeholder={placeholder} required
                    className="w-full bg-brand-surface border border-brand-border rounded-xl px-4 py-3 text-brand-text placeholder:text-brand-border focus:outline-none focus:border-brand-gold transition-colors" />
                </div>
              ))}
              <div>
                <label className="block text-sm text-brand-muted mb-2">Booking From</label>
                <select value={form.customer_country} onChange={set('customer_country')}
                  className="w-full bg-brand-surface border border-brand-border rounded-xl px-4 py-3 text-brand-text focus:outline-none focus:border-brand-gold transition-colors">
                  <option value="LK">🇱🇰 Sri Lanka (LKR)</option>
                  <option value="AU">🇦🇺 Australia (USD)</option>
                  <option value="GB">🇬🇧 United Kingdom (USD)</option>
                  <option value="AE">🇦🇪 UAE (USD)</option>
                  <option value="US">🇺🇸 USA (USD)</option>
                  <option value="CA">🇨🇦 Canada (USD)</option>
                </select>
              </div>
            </div>
          </section>

          {/* ── Summary & Submit ── */}
          <div className="card border-brand-gold/30">
            <div className="flex items-center justify-between mb-4">
              <span className="text-brand-muted">Package</span>
              <span className="font-semibold">{pkg.title}</span>
            </div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-brand-muted">Total</span>
              <span className="font-display text-2xl font-bold gold-gradient">{formatLKR(pkg.base_price_lkr)}</span>
            </div>
            <button type="submit" disabled={bookMutation.isPending || !form.delivery_slot} className="btn-primary w-full justify-center text-base py-4">
              {bookMutation.isPending ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : <>Confirm Booking <ArrowRight className="w-5 h-5" /></>}
            </button>
            <p className="text-center text-xs text-brand-muted mt-3">Our team will WhatsApp you within 30 minutes to confirm.</p>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
