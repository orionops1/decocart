import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Clock, MapPin, Star, Sparkles, Heart, Camera } from 'lucide-react'

const FEATURES = [
  { icon: Clock, title: '12:00 AM Midnight Delivery', desc: 'We ring the doorbell at exactly midnight — so the magic hits at the first second.' },
  { icon: MapPin, title: 'All of Western Province', desc: 'Colombo, Gampaha, Kalutara — we cover every corner, no extra charge.' },
  { icon: Camera, title: 'Reaction Cam Included', desc: 'Every delivery includes a 4K reaction recording delivered to you within 2 hours.' },
  { icon: Heart, title: 'Expat Friendly', desc: 'Book from Melbourne, London, or Dubai and surprise your loved ones back home.' },
]

const STATS = [
  { value: '500+', label: 'Surprises Delivered' },
  { value: '98%', label: 'Happy Customers' },
  { value: '4.9★', label: 'Average Rating' },
  { value: '24h', label: 'Express Booking' },
]

export function HomePage() {
  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-4">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-gold/5 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-brand-accent/5 blur-3xl" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 text-brand-gold text-sm font-medium bg-brand-gold/10 border border-brand-gold/20 rounded-full px-4 py-1.5 mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Sri Lanka's #1 Surprise Delivery Service
            </span>

            <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6">
              Make Someone
              <br />
              <span className="gold-gradient">Feel Special.</span>
            </h1>

            <p className="text-brand-muted text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
              Birthday decorations, midnight cake deliveries, flash mobs & flower arrangements —
              we handle everything so you don't miss the moment.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/packages" className="btn-primary text-base py-4 px-8">
                Book a Surprise <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/packages" className="btn-outline text-base py-4 px-8">
                View Packages
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="border-y border-brand-border bg-brand-surface py-10">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="font-display text-3xl font-bold gold-gradient">{stat.value}</div>
              <div className="text-brand-muted text-sm mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Why DecoCart ── */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold mb-4">Why Choose DecoCart?</h2>
            <p className="text-brand-muted max-w-lg mx-auto">We handle the logistics, creativity, and timing — you just show up for the reaction.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="card flex gap-4 group hover:border-brand-gold/30 transition-colors"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-brand-gold/10 flex items-center justify-center group-hover:bg-brand-gold/20 transition-colors">
                  <f.icon className="w-5 h-5 text-brand-gold" />
                </div>
                <div>
                  <h3 className="font-semibold text-brand-text mb-1">{f.title}</h3>
                  <p className="text-brand-muted text-sm leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4 bg-brand-surface border-t border-brand-border">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-4xl font-bold mb-4">
            Ready to make <span className="gold-gradient">someone's day?</span>
          </h2>
          <p className="text-brand-muted mb-8">From abroad or locally — book in 5 minutes, we do the rest.</p>
          <Link to="/packages" className="btn-primary text-base py-4 px-10">
            See All Packages <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
