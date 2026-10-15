import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { CheckCircle, Clock, Package, Truck, Star, Copy } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { api } from '@/lib/api'
import { formatLKR } from '@/lib/utils'

const STATUS_STEPS = [
  { key: 'confirmed',        label: 'Booking Confirmed',    icon: CheckCircle },
  { key: 'preparing',        label: 'Preparing Your Surprise', icon: Package },
  { key: 'out_for_delivery', label: 'On the Way!',          icon: Truck },
  { key: 'delivered',        label: 'Delivered 🎉',          icon: Star },
]

const STATUS_INDEX: Record<string, number> = {
  draft: -1, confirmed: 0, preparing: 1, out_for_delivery: 2, delivered: 3, completed: 3,
}

export function TrackingPage() {
  const { id } = useParams<{ id: string }>()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => api.bookings.get(id!),
    enabled: !!id,
    refetchInterval: 30_000, // auto-refresh every 30s
  })

  const booking = data?.data

  const copyId = () => {
    navigator.clipboard.writeText(id ?? '')
    toast.success('Booking ID copied!')
  }

  if (isLoading) return <div className="py-32 text-center text-brand-muted">Loading your booking...</div>
  if (isError || !booking) return (
    <div className="py-32 text-center">
      <p className="text-brand-muted mb-2">Booking not found.</p>
      <p className="text-xs text-brand-border">ID: {id}</p>
    </div>
  )

  const currentStep = STATUS_INDEX[booking.status] ?? 0

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold mb-3">
            <span className="gold-gradient">Track Your Surprise</span>
          </h1>
          <button onClick={copyId} className="inline-flex items-center gap-2 text-brand-muted text-sm hover:text-brand-gold transition-colors">
            <Copy className="w-3.5 h-3.5" />
            #{id?.slice(0, 8).toUpperCase()}
          </button>
        </div>

        {/* Progress Tracker */}
        <div className="card mb-8">
          <div className="relative">
            {/* Progress line */}
            <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-brand-border" />
            <div
              className="absolute left-6 top-8 w-0.5 bg-brand-gold transition-all duration-700"
              style={{ height: `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%` }}
            />

            <div className="space-y-8">
              {STATUS_STEPS.map((step, i) => {
                const done = i <= currentStep
                const active = i === currentStep
                const StepIcon = step.icon
                return (
                  <div key={step.key} className="flex items-center gap-4 relative">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 z-10 transition-all duration-500 ${
                      done ? 'bg-brand-gold border-brand-gold' : 'bg-brand-surface border-brand-border'
                    } ${active ? 'animate-pulse-soft' : ''}`}>
                      <StepIcon className={`w-5 h-5 ${done ? 'text-black' : 'text-brand-muted'}`} />
                    </div>
                    <div>
                      <p className={`font-medium ${done ? 'text-brand-text' : 'text-brand-muted'}`}>{step.label}</p>
                      {active && <p className="text-xs text-brand-gold mt-0.5">Current Status</p>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="card space-y-4">
          <h2 className="font-semibold text-lg">Booking Details</h2>
          {[
            { label: 'Package', value: booking.package_title },
            { label: 'Recipient', value: booking.recipient_name },
            { label: 'Delivery Slot', value: booking.delivery_slot?.charAt(0).toUpperCase() + booking.delivery_slot?.slice(1) },
            { label: 'Event Date', value: booking.event_datetime ? format(new Date(booking.event_datetime), 'PPP') : '—' },
            { label: 'Total', value: formatLKR(booking.base_price_lkr) },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between border-b border-brand-border pb-4 last:border-0 last:pb-0">
              <span className="text-brand-muted text-sm">{label}</span>
              <span className="font-medium text-sm">{value}</span>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-brand-muted mt-6 flex items-center justify-center gap-1">
          <Clock className="w-3.5 h-3.5" /> Page auto-refreshes every 30 seconds
        </p>
      </motion.div>
    </div>
  )
}
