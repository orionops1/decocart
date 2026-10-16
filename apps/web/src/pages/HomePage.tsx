import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Clock, MapPin, Star, Sparkles, Heart, Camera, Check, Cake, Flower2, UtensilsCrossed, Video } from 'lucide-react'
import { DECOCART_PACKAGES } from '@/data/packages'
import { formatLKR, formatUSD } from '@/lib/utils'

const FEATURES = [
  { icon: Clock, title: '12:00 AM Midnight Delivery', desc: 'We ring the doorbell at exactly 11:59 PM – 12:00 AM with candles lit so the magic hits at the first second.' },
  { icon: MapPin, title: 'All of Western Province', desc: 'Colombo, Dehiwala, Kotte, Moratuwa, Gampaha, Negombo, Kalutara — full coverage with stealth arrival.' },
  { icon: Camera, title: '1-Day Videography & Reaction Cam', desc: 'Professional 4K reaction video and celebration footage edited and delivered within 12 hours.' },
  { icon: Heart, title: 'Global Expat Friendly', desc: 'Book from Melbourne, London, Dubai, Toronto or Italy and surprise your loved ones back home in Sri Lanka.' },
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
            <span className="inline-flex items-center gap-2 text-brand-gold text-xs sm:text-sm font-medium bg-brand-gold/10 border border-brand-gold/20 rounded-full px-4 py-1.5 mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Sri Lanka's #1 Surprise Party & Gift Delivery Service
            </span>

            <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6">
              Make Someone
              <br />
              <span className="gold-gradient">Feel Truly Special.</span>
            </h1>

            <p className="text-brand-muted text-base sm:text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
              Handcrafted cakes, fresh floral bouquets, midnight balloon styling, catering & flash mob dance crews — 
              planned with 100% secrecy and executed to perfection.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/packages" className="btn-primary text-base py-4 px-8">
                Explore Packages <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/book/gold" className="btn-outline text-base py-4 px-8">
                Book Most Popular (Gold)
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
              <div className="text-brand-muted text-xs sm:text-sm mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Featured Packages Preview ── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold text-brand-gold uppercase tracking-wider">Curated Surprise Experiences</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mt-1 mb-3">Our Signature Packages</h2>
            <p className="text-brand-muted max-w-xl mx-auto text-sm sm:text-base">
              Every package is all-inclusive with custom cakes, fresh flowers, balloon styling, and stealth arrival.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {DECOCART_PACKAGES.map((pkg, i) => {
              const isPopular = pkg.slug === 'gold'
              return (
                <motion.div
                  key={pkg.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className={`card relative flex flex-col justify-between hover:border-brand-gold/40 transition-all ${
                    isPopular ? 'border-brand-gold/60 shadow-[0_0_25px_rgba(212,175,55,0.1)]' : ''
                  }`}
                >
                  {pkg.badge && (
                    <span className="absolute -top-3 left-4 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-brand-gold text-black uppercase">
                      {pkg.badge}
                    </span>
                  )}
                  <div>
                    <h3 className="font-display text-xl font-bold mt-1">{pkg.title}</h3>
                    <p className="text-xs text-brand-muted mt-1 min-h-[32px]">{pkg.tagline}</p>
                    
                    <div className="my-4 pb-4 border-b border-brand-border">
                      <div className="font-display text-2xl font-bold gold-gradient">{formatLKR(pkg.base_price_lkr)}</div>
                      <div className="text-[11px] text-brand-muted">≈ {formatUSD(pkg.base_price_usd)} for expats</div>
                    </div>

                    <ul className="space-y-2 text-xs text-brand-muted mb-6">
                      <li className="flex items-start gap-2">
                        <Cake className="w-3.5 h-3.5 text-brand-gold mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{pkg.cake}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Flower2 className="w-3.5 h-3.5 text-brand-accent mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{pkg.flowers}</span>
                      </li>
                      {pkg.food_and_beverages && (
                        <li className="flex items-start gap-2">
                          <UtensilsCrossed className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-1">{pkg.food_and_beverages}</span>
                        </li>
                      )}
                      <li className="flex items-start gap-2">
                        <Video className="w-3.5 h-3.5 text-sky-400 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{pkg.entertainment_and_media}</span>
                      </li>
                    </ul>
                  </div>

                  <Link
                    to={`/book/${pkg.slug}`}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-center transition-all flex items-center justify-center gap-1.5 ${
                      isPopular ? 'btn-primary' : 'btn-outline'
                    }`}
                  >
                    Select {pkg.title} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </motion.div>
              )
            })}
          </div>

          <div className="text-center mt-10">
            <Link to="/packages" className="text-brand-gold hover:text-brand-gold-light text-sm font-semibold inline-flex items-center gap-2">
              Compare all package specifications & itemized cost breakdowns <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why DecoCart ── */}
      <section className="py-24 px-4 bg-brand-surface/40 border-y border-brand-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold mb-4">Why Sri Lanka Chooses DecoCart</h2>
            <p className="text-brand-muted max-w-lg mx-auto">We handle the secrecy, supply chain, creative decorations, and exact minute delivery.</p>
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
            Ready to plan the <span className="gold-gradient">ultimate surprise?</span>
          </h2>
          <p className="text-brand-muted mb-8 text-sm sm:text-base">
            Book now in under 2 minutes. Our team coordinates directly on WhatsApp to keep everything confidential.
          </p>
          <Link to="/packages" className="btn-primary text-base py-4 px-10">
            View All Packages <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
