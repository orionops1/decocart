import { useState, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { format, addDays } from 'date-fns'
import { 
  Clock, 
  Moon, 
  Sun, 
  Sunrise, 
  Sunset, 
  ArrowRight, 
  Loader2, 
  Check, 
  Plus, 
  Cake, 
  Flower2, 
  UtensilsCrossed, 
  Video, 
  ShieldCheck, 
  ArrowLeft 
} from 'lucide-react'
import toast from 'react-hot-toast'
import { api } from '@/lib/api'
import { formatLKR, formatUSD } from '@/lib/utils'
import { getPackageBySlug } from '@/data/packages'

const SLOT_META = {
  morning:   { label: 'Morning Slot',   time: '8:00 AM – 12:00 PM', icon: Sunrise, desc: 'Ideal for breakfast / daytime celebrations' },
  afternoon: { label: 'Afternoon Slot', time: '12:00 PM – 5:00 PM',  icon: Sun,     desc: 'Great for office or lunch gatherings' },
  evening:   { label: 'Evening Slot',   time: '5:00 PM – 10:00 PM',  icon: Sunset,  desc: 'Classic dinner & sunset surprise party' },
  midnight:  { label: 'Midnight Slot',  time: '11:59 PM – 12:05 AM', icon: Moon,    desc: 'Doorbell rings exactly at 12:00 AM with candles lit 🎉' },
}

const ADD_ONS_LIST = [
  { id: 'extra-balloons', name: '10x Extra Helium Balloons', price_lkr: 2500, price_usd: 8, desc: 'Theme matching metallic latex balloons' },
  { id: 'sparkler-candles', name: 'Musical Sparkler Candles & Ice Fountain', price_lkr: 1800, price_usd: 6, desc: 'Spectacular rotating fireworks candle' },
  { id: 'photo-frame', name: 'Custom Printed Souvenir Photo Frame', price_lkr: 3500, price_usd: 12, desc: 'Wooden frame with memory photo printed on spot' },
  { id: 'teddy-bear', name: 'Deluxe Plush Cuddly Teddy Bear', price_lkr: 4200, price_usd: 14, desc: 'Large 45cm soft huggable bear' },
  { id: 'chocolate-box', name: 'Imported Luxury Ferrero / Swiss Box', price_lkr: 6500, price_usd: 22, desc: 'Artisan assortment in gift wrap' },
  { id: 'guitarist-extra', name: 'Acoustic Guitarist Live Songs (2 songs)', price_lkr: 8000, price_usd: 27, desc: 'Live unplugged birthday serenade at doorstep' },
]

type FormData = {
  customer_name: string
  customer_phone: string
  customer_email: string
  customer_country: string
  recipient_name: string
  recipient_phone: string
  delivery_address: string
  delivery_slot: string
  special_message: string
}

export function BookingPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()

  const [selectedDate, setSelectedDate] = useState(format(addDays(new Date(), 2), 'yyyy-MM-dd'))
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])
  const [currency, setCurrency] = useState<'LKR' | 'USD'>('LKR')

  const [form, setForm] = useState<FormData>({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    customer_country: 'LK',
    recipient_name: '',
    recipient_phone: '',
    delivery_address: '',
    delivery_slot: 'midnight', // default to signature midnight surprise
    special_message: '',
  })

  // Try API first, fallback to bundled data
  const { data: pkgData, isLoading } = useQuery({
    queryKey: ['package', slug],
    queryFn: () => api.packages.get(slug!),
    enabled: !!slug,
  })

  const pkg = pkgData?.data || (slug ? getPackageBySlug(slug) : undefined)

  const { data: slotsData } = useQuery({
    queryKey: ['slots', selectedDate],
    queryFn: () => api.slots.availability(selectedDate),
    enabled: !!selectedDate,
  })

  const slots = slotsData?.data ?? [
    { slot: 'morning', available: 4, capacity: 5, is_available: true },
    { slot: 'afternoon', available: 5, capacity: 5, is_available: true },
    { slot: 'evening', available: 3, capacity: 5, is_available: true },
    { slot: 'midnight', available: 2, capacity: 3, is_available: true },
  ]

  const toggleAddOn = (id: string) => {
    setSelectedAddOns(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const addOnsTotalLkr = useMemo(() => {
    return selectedAddOns.reduce((sum, id) => {
      const item = ADD_ONS_LIST.find(a => a.id === id)
      return sum + (item?.price_lkr || 0)
    }, 0)
  }, [selectedAddOns])

  const addOnsTotalUsd = useMemo(() => {
    return selectedAddOns.reduce((sum, id) => {
      const item = ADD_ONS_LIST.find(a => a.id === id)
      return sum + (item?.price_usd || 0)
    }, 0)
  }, [selectedAddOns])

  const grandTotalLkr = (pkg?.base_price_lkr || 0) + addOnsTotalLkr
  const grandTotalUsd = (pkg?.base_price_usd || 0) + addOnsTotalUsd

  const bookMutation = useMutation({
    mutationFn: api.bookings.create,
    onSuccess: (data) => {
      if (data?.data?.id) {
        toast.success('🎉 Booking confirmed! Opening order status...')
        setTimeout(() => navigate(`/track/${data.data.id}`), 1200)
      } else {
        toast.error(data?.error ?? 'Something went wrong.')
      }
    },
    onError: () => toast.error('Network error. Please try again.'),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!pkg) return
    if (!form.delivery_slot) {
      toast.error('Please choose a delivery time slot.')
      return
    }

    bookMutation.mutate({
      ...form,
      package_id: pkg.id,
      package_slug: pkg.slug,
      package_title: pkg.title,
      selected_add_ons: selectedAddOns,
      event_datetime: `${selectedDate}T${form.delivery_slot === 'midnight' ? '00:00:00' : '10:00:00'}Z`,
      total_amount_lkr: grandTotalLkr,
      total_amount_usd: grandTotalUsd,
    })
  }

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  if (isLoading && !pkg) {
    return <div className="py-32 text-center text-brand-muted">Loading package details...</div>
  }

  if (!pkg) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h2 className="font-display text-3xl font-bold mb-4">Package Not Found</h2>
        <p className="text-brand-muted mb-6">The requested surprise package was not found.</p>
        <Link to="/packages" className="btn-primary">Browse All Packages</Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <Link to="/packages" className="inline-flex items-center gap-2 text-xs font-medium text-brand-muted hover:text-brand-gold transition-colors mb-6">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to all packages
      </Link>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-brand-gold text-xs font-semibold uppercase tracking-wider mb-1">
                Step 2 of 2 · Reservation
              </p>
              <h1 className="font-display text-3xl sm:text-4xl font-bold">
                Book Your <span className="gold-gradient">{pkg.title}</span>
              </h1>
            </div>
            {/* Currency toggle */}
            <div className="inline-flex p-1 bg-brand-surface border border-brand-border rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setCurrency('LKR')}
                className={`px-3 py-1 rounded font-medium ${currency === 'LKR' ? 'bg-brand-gold text-black' : 'text-brand-muted'}`}
              >
                LKR
              </button>
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`px-3 py-1 rounded font-medium ${currency === 'USD' ? 'bg-brand-gold text-black' : 'text-brand-muted'}`}
              >
                USD
              </button>
            </div>
          </div>
        </div>

        {/* Selected Package Highlight Card */}
        <div className="card mb-8 border-brand-gold/40 bg-gradient-to-br from-brand-card via-brand-surface to-brand-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-border">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-xl font-bold text-brand-text">{pkg.title}</h3>
                {pkg.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-gold text-black uppercase">
                    {pkg.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-brand-muted mt-1">{pkg.tagline}</p>
            </div>
            <div className="sm:text-right">
              <span className="text-xs text-brand-muted block">Base Package</span>
              <span className="font-display text-2xl font-bold gold-gradient">
                {currency === 'LKR' ? formatLKR(pkg.base_price_lkr) : formatUSD(pkg.base_price_usd)}
              </span>
            </div>
          </div>

          {/* Quick item inclusions summary */}
          <div className="grid sm:grid-cols-2 gap-3 mt-4 text-xs text-brand-muted">
            <div className="flex items-start gap-2">
              <Cake className="w-4 h-4 text-brand-gold mt-0.5 flex-shrink-0" />
              <span>{pkg.cake}</span>
            </div>
            <div className="flex items-start gap-2">
              <Flower2 className="w-4 h-4 text-brand-accent mt-0.5 flex-shrink-0" />
              <span>{pkg.flowers}</span>
            </div>
            {pkg.food_and_beverages && (
              <div className="flex items-start gap-2">
                <UtensilsCrossed className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <span>{pkg.food_and_beverages}</span>
              </div>
            )}
            <div className="flex items-start gap-2">
              <Video className="w-4 h-4 text-sky-400 mt-0.5 flex-shrink-0" />
              <span>{pkg.entertainment_and_media}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* ── Date & Time Slot ── */}
          <section className="card">
            <h2 className="font-semibold text-base sm:text-lg mb-1 flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-gold" /> 
              When should we deliver the surprise?
            </h2>
            <p className="text-xs text-brand-muted mb-4">
              We operate 24/7 across the Western Province. Select your event date and desired delivery window.
            </p>

            <div className="mb-5">
              <label className="block text-xs font-medium text-brand-muted uppercase tracking-wider mb-2">
                Event Date
              </label>
              <input
                type="date"
                value={selectedDate}
                min={format(addDays(new Date(), 1), 'yyyy-MM-dd')}
                onChange={e => setSelectedDate(e.target.value)}
                className="w-full bg-brand-surface border border-brand-border rounded-xl px-4 py-3 text-brand-text focus:outline-none focus:border-brand-gold transition-colors text-sm"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {slots.map((s: { slot: string; is_available: boolean; available: number }) => {
                const meta = SLOT_META[s.slot as keyof typeof SLOT_META]
                const SlotIcon = meta.icon
                const isSelected = form.delivery_slot === s.slot

                return (
                  <button
                    key={s.slot}
                    type="button"
                    disabled={!s.is_available}
                    onClick={() => setForm(p => ({ ...p, delivery_slot: s.slot }))}
                    className={`relative p-4 rounded-xl border text-left transition-all duration-200 ${
                      isSelected
                        ? 'border-brand-gold bg-brand-gold/10 shadow-sm'
                        : s.is_available
                          ? 'border-brand-border hover:border-brand-gold/40 bg-brand-surface/50'
                          : 'border-brand-border opacity-40 cursor-not-allowed bg-brand-surface/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <SlotIcon className={`w-4 h-4 ${isSelected ? 'text-brand-gold' : 'text-brand-muted'}`} />
                        <span className="font-semibold text-sm text-brand-text">{meta.label}</span>
                      </div>
                      {s.slot === 'midnight' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-gold/20 text-brand-gold border border-brand-gold/30">
                          Signature
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-mono text-brand-gold mb-1">{meta.time}</div>
                    <div className="text-[11px] text-brand-muted leading-tight">{meta.desc}</div>

                    {!s.is_available && (
                      <div className="text-[11px] text-red-400 mt-2 font-medium">Fully booked for this date</div>
                    )}
                    {s.is_available && s.available <= 2 && (
                      <div className="text-[11px] text-brand-gold mt-2 font-medium">⚡ Only {s.available} slots remaining!</div>
                    )}
                  </button>
                )
              })}
            </div>
          </section>

          {/* ── Add-Ons Selection ── */}
          <section className="card">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-semibold text-base sm:text-lg flex items-center gap-2">
                <Plus className="w-4 h-4 text-brand-gold" />
                Customize with Popular Add-ons (Optional)
              </h2>
            </div>
            <p className="text-xs text-brand-muted mb-4">
              Add extra magic to your package. Our production crew will assemble everything together.
            </p>

            <div className="grid sm:grid-cols-2 gap-3">
              {ADD_ONS_LIST.map((addon) => {
                const isChecked = selectedAddOns.includes(addon.id)
                return (
                  <div
                    key={addon.id}
                    onClick={() => toggleAddOn(addon.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                      isChecked 
                        ? 'border-brand-gold bg-brand-gold/10' 
                        : 'border-brand-border bg-brand-surface/40 hover:border-brand-gold/30'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border transition-colors ${
                        isChecked ? 'bg-brand-gold border-brand-gold text-black' : 'border-brand-border bg-brand-surface'
                      }`}>
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div>
                        <div className="font-medium text-xs sm:text-sm text-brand-text">{addon.name}</div>
                        <div className="text-[11px] text-brand-muted mt-0.5">{addon.desc}</div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 text-xs font-semibold text-brand-gold">
                      +{currency === 'LKR' ? formatLKR(addon.price_lkr) : formatUSD(addon.price_usd)}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* ── Recipient Details ── */}
          <section className="card">
            <h2 className="font-semibold text-base sm:text-lg mb-1">
              🎁 Who are we surprising? (Recipient)
            </h2>
            <p className="text-xs text-brand-muted mb-4">
              We never contact the recipient beforehand to ensure the surprise is 100% confidential.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-brand-muted uppercase tracking-wider mb-2">
                  Recipient's Full Name *
                </label>
                <input
                  value={form.recipient_name}
                  onChange={set('recipient_name')}
                  placeholder="e.g. Shane de Silva"
                  required
                  className="w-full bg-brand-surface border border-brand-border rounded-xl px-4 py-3 text-brand-text placeholder:text-brand-border focus:outline-none focus:border-brand-gold transition-colors text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-brand-muted uppercase tracking-wider mb-2">
                  Recipient's Phone (Emergency Only) *
                </label>
                <input
                  value={form.recipient_phone}
                  onChange={set('recipient_phone')}
                  placeholder="e.g. +94 77 123 4567"
                  required
                  className="w-full bg-brand-surface border border-brand-border rounded-xl px-4 py-3 text-brand-text placeholder:text-brand-border focus:outline-none focus:border-brand-gold transition-colors text-sm"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-medium text-brand-muted uppercase tracking-wider mb-2">
                Surprise Location / Delivery Address *
              </label>
              <input
                value={form.delivery_address}
                onChange={set('delivery_address')}
                placeholder="Full address with landmarks, gate color, or apartment unit"
                required
                className="w-full bg-brand-surface border border-brand-border rounded-xl px-4 py-3 text-brand-text placeholder:text-brand-border focus:outline-none focus:border-brand-gold transition-colors text-sm"
              />
            </div>

            <div className="mt-4">
              <label className="block text-xs font-medium text-brand-muted uppercase tracking-wider mb-2">
                Personalized Message for the Greeting Card (Optional)
              </label>
              <textarea
                value={form.special_message}
                onChange={set('special_message')}
                maxLength={500}
                rows={3}
                placeholder="Write your wishes here. We'll handwrite this inside your gift card..."
                className="w-full bg-brand-surface border border-brand-border rounded-xl px-4 py-3 text-brand-text placeholder:text-brand-border focus:outline-none focus:border-brand-gold transition-colors text-sm resize-none"
              />
            </div>
          </section>

          {/* ── Booker Contact Details ── */}
          <section className="card">
            <h2 className="font-semibold text-base sm:text-lg mb-1">
              📱 Your Details (For WhatsApp Updates & Live Reaction Video)
            </h2>
            <p className="text-xs text-brand-muted mb-4">
              We send dispatch updates, rider arrival ETA, and your edited reaction video directly to you here.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-brand-muted uppercase tracking-wider mb-2">Your Name *</label>
                <input
                  value={form.customer_name}
                  onChange={set('customer_name')}
                  placeholder="Your full name"
                  required
                  className="w-full bg-brand-surface border border-brand-border rounded-xl px-4 py-3 text-brand-text placeholder:text-brand-border focus:outline-none focus:border-brand-gold transition-colors text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-brand-muted uppercase tracking-wider mb-2">Your WhatsApp Number *</label>
                <input
                  value={form.customer_phone}
                  onChange={set('customer_phone')}
                  placeholder="e.g. +94 71 428 1322 or +61 412..."
                  required
                  className="w-full bg-brand-surface border border-brand-border rounded-xl px-4 py-3 text-brand-text placeholder:text-brand-border focus:outline-none focus:border-brand-gold transition-colors text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-brand-muted uppercase tracking-wider mb-2">Your Email *</label>
                <input
                  type="email"
                  value={form.customer_email}
                  onChange={set('customer_email')}
                  placeholder="receipt@example.com"
                  required
                  className="w-full bg-brand-surface border border-brand-border rounded-xl px-4 py-3 text-brand-text placeholder:text-brand-border focus:outline-none focus:border-brand-gold transition-colors text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-brand-muted uppercase tracking-wider mb-2">Booking From *</label>
                <select
                  value={form.customer_country}
                  onChange={set('customer_country')}
                  className="w-full bg-brand-surface border border-brand-border rounded-xl px-4 py-3 text-brand-text focus:outline-none focus:border-brand-gold transition-colors text-sm"
                >
                  <option value="LK">🇱🇰 Sri Lanka (Local)</option>
                  <option value="AU">🇦🇺 Australia (Expat)</option>
                  <option value="GB">🇬🇧 United Kingdom (Expat)</option>
                  <option value="AE">🇦🇪 UAE / Dubai (Expat)</option>
                  <option value="US">🇺🇸 United States (Expat)</option>
                  <option value="CA">🇨🇦 Canada (Expat)</option>
                  <option value="IT">🇮🇹 Italy (Expat)</option>
                  <option value="QA">🇶🇦 Qatar (Expat)</option>
                  <option value="OTHER">🌍 Other Global Destination</option>
                </select>
              </div>
            </div>
          </section>

          {/* ── Order Summary & Confirmation ── */}
          <div className="card border-brand-gold/40 bg-brand-card/90">
            <h3 className="font-display text-xl font-bold mb-4 text-brand-text">Reservation Summary</h3>

            <div className="space-y-3 pb-4 border-b border-brand-border text-sm">
              <div className="flex items-center justify-between">
                <span className="text-brand-muted">{pkg.title} (Base)</span>
                <span className="font-semibold">{currency === 'LKR' ? formatLKR(pkg.base_price_lkr) : formatUSD(pkg.base_price_usd)}</span>
              </div>

              {selectedAddOns.map(id => {
                const item = ADD_ONS_LIST.find(a => a.id === id)
                if (!item) return null
                return (
                  <div key={id} className="flex items-center justify-between text-xs text-brand-muted">
                    <span>+ {item.name}</span>
                    <span className="text-brand-gold font-medium">+{currency === 'LKR' ? formatLKR(item.price_lkr) : formatUSD(item.price_usd)}</span>
                  </div>
                )
              })}

              <div className="flex items-center justify-between text-xs text-brand-muted">
                <span>Delivery Slot</span>
                <span className="font-medium text-brand-text uppercase">{form.delivery_slot}</span>
              </div>

              <div className="flex items-center justify-between text-xs text-brand-muted">
                <span>Service & Coordination Charge</span>
                <span className="text-emerald-400 font-medium">Included</span>
              </div>
            </div>

            <div className="flex items-baseline justify-between py-4">
              <span className="font-medium text-brand-text">Estimated Total</span>
              <span className="font-display text-3xl font-bold gold-gradient">
                {currency === 'LKR' ? formatLKR(grandTotalLkr) : formatUSD(grandTotalUsd)}
              </span>
            </div>

            <button
              type="submit"
              disabled={bookMutation.isPending || !form.delivery_slot}
              className="btn-primary w-full justify-center text-base py-4"
            >
              {bookMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Confirming Reservation...
                </>
              ) : (
                <>
                  Confirm Surprise Booking <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-brand-muted">
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Confidential Stealth Delivery Guaranteed
              </span>
              <span>Our operations manager contacts you on WhatsApp within 30 mins</span>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
