import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowRight, 
  Check, 
  Cake, 
  Flower2, 
  UtensilsCrossed, 
  Video, 
  Sparkles, 
  Users, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  ShieldCheck, 
  HelpCircle 
} from 'lucide-react'
import { api } from '@/lib/api'
import { formatLKR, formatUSD } from '@/lib/utils'
import type { DecoCartPackage } from '@/data/packages'

export function PackagesPage() {
  const [currency, setCurrency] = useState<'LKR' | 'USD'>('LKR')
  const [expandedBreakdown, setExpandedBreakdown] = useState<Record<string, boolean>>({})

  const { data, isLoading } = useQuery({
    queryKey: ['packages'],
    queryFn: api.packages.list,
  })

  const packages: DecoCartPackage[] = data?.data ?? []

  const toggleBreakdown = (slug: string) => {
    setExpandedBreakdown(prev => ({ ...prev, [slug]: !prev[slug] }))
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-24">
        <div className="grid md:grid-cols-2 gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-96 rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 text-brand-gold text-xs font-semibold uppercase tracking-wider bg-brand-gold/10 border border-brand-gold/20 rounded-full px-4 py-1 mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          Official DecoCart Packages
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
          Unforgettable Surprises, <span className="gold-gradient">Flawlessly Delivered</span>
        </h1>
        <p className="text-brand-muted text-base sm:text-lg leading-relaxed">
          From intimate midnight cake surprises to full-scale celebrations with live dancers & 1-day videography. 
          Choose your package below with transparent itemized details.
        </p>

        {/* Currency Switcher */}
        <div className="mt-6 inline-flex p-1 bg-brand-surface border border-brand-border rounded-xl">
          <button
            onClick={() => setCurrency('LKR')}
            className={`px-4 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${
              currency === 'LKR' 
                ? 'bg-brand-gold text-black font-semibold shadow-sm' 
                : 'text-brand-muted hover:text-brand-text'
            }`}
          >
            🇱🇰 LKR (Sri Lanka)
          </button>
          <button
            onClick={() => setCurrency('USD')}
            className={`px-4 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${
              currency === 'USD' 
                ? 'bg-brand-gold text-black font-semibold shadow-sm' 
                : 'text-brand-muted hover:text-brand-text'
            }`}
          >
            🌍 USD (Expat & Overseas)
          </button>
        </div>
      </div>

      {/* Package Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {packages.map((pkg, i) => {
          const isPopular = pkg.slug === 'gold'
          const isVIP = pkg.slug === 'platinum'
          const isExpanded = !!expandedBreakdown[pkg.slug]

          return (
            <motion.div
              key={pkg.id || pkg.slug}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`card relative flex flex-col justify-between transition-all duration-300 ${
                isPopular 
                  ? 'border-brand-gold/60 shadow-[0_0_35px_rgba(212,175,55,0.12)]' 
                  : isVIP 
                    ? 'border-brand-accent/50 shadow-[0_0_35px_rgba(224,90,156,0.1)]' 
                    : 'hover:border-brand-gold/40'
              }`}
            >
              {/* Badge */}
              {pkg.badge && (
                <div className="absolute -top-3 left-6">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                    isPopular 
                      ? 'bg-brand-gold text-black shadow-md' 
                      : isVIP 
                        ? 'bg-brand-accent text-white shadow-md' 
                        : 'bg-brand-surface border border-brand-border text-brand-gold'
                  }`}>
                    {pkg.badge}
                  </span>
                </div>
              )}

              <div>
                {/* Title & Tagline */}
                <div className="mt-2 mb-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-brand-text">
                      {pkg.title}
                    </h2>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-muted bg-brand-surface border border-brand-border px-2.5 py-1 rounded-md">
                      <Users className="w-3.5 h-3.5 text-brand-gold" />
                      {pkg.guests}
                    </span>
                  </div>
                  <p className="text-brand-muted text-sm mt-1.5 leading-relaxed">
                    {pkg.tagline}
                  </p>
                </div>

                {/* Price block */}
                <div className="p-4 bg-brand-surface/70 border border-brand-border rounded-xl mb-6">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-xs text-brand-muted uppercase tracking-wider block mb-0.5">Total Package Price</span>
                      <div className="font-display text-3xl sm:text-4xl font-bold gold-gradient">
                        {currency === 'LKR' ? formatLKR(pkg.base_price_lkr) : formatUSD(pkg.base_price_usd)}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-brand-muted block">
                        {currency === 'LKR' ? `≈ ${formatUSD(pkg.base_price_usd)} USD` : `≈ ${formatLKR(pkg.base_price_lkr)}`}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 mt-1">
                        <ShieldCheck className="w-3 h-3" /> All taxes & service charge included
                      </span>
                    </div>
                  </div>
                </div>

                {/* Core Specifications Box */}
                <div className="space-y-3 mb-6 bg-brand-bg/50 p-4 rounded-xl border border-brand-border/70 text-xs sm:text-sm">
                  <div className="flex items-start gap-2.5">
                    <Cake className="w-4 h-4 text-brand-gold mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-brand-text">Cake: </span>
                      <span className="text-brand-muted">{pkg.cake}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Flower2 className="w-4 h-4 text-brand-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-brand-text">Flowers & Gift: </span>
                      <span className="text-brand-muted">{pkg.flowers}</span>
                    </div>
                  </div>

                  {pkg.food_and_beverages && (
                    <div className="flex items-start gap-2.5">
                      <UtensilsCrossed className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-semibold text-brand-text">Catering: </span>
                        <span className="text-brand-muted">{pkg.food_and_beverages}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-2.5">
                    <Video className="w-4 h-4 text-sky-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-brand-text">Media & Entertainment: </span>
                      <span className="text-brand-muted">{pkg.entertainment_and_media}</span>
                    </div>
                  </div>
                </div>

                {/* Features List */}
                <div className="mb-6">
                  <h4 className="text-xs font-semibold text-brand-gold uppercase tracking-wider mb-3">
                    What's Included in this package:
                  </h4>
                  <ul className="space-y-2">
                    {pkg.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-brand-muted">
                        <Check className="w-4 h-4 text-brand-gold mt-0.5 flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Itemized Breakdown Toggle */}
                {pkg.itemized_breakdown && pkg.itemized_breakdown.length > 0 && (
                  <div className="mb-6">
                    <button
                      type="button"
                      onClick={() => toggleBreakdown(pkg.slug)}
                      className="w-full py-2 px-3 bg-brand-surface hover:bg-brand-border/40 border border-brand-border rounded-lg text-xs font-medium text-brand-muted hover:text-brand-text flex items-center justify-between transition-colors"
                    >
                      <span className="flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5 text-brand-gold" />
                        {isExpanded ? 'Hide Itemized Cost Breakdown' : 'View Itemized Cost Breakdown'}
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden mt-2 p-3 bg-brand-surface/90 border border-brand-border rounded-xl text-xs space-y-2"
                        >
                          <div className="text-[11px] text-brand-muted font-mono mb-2 pb-1 border-b border-brand-border flex justify-between">
                            <span>COMPONENT / SERVICE</span>
                            <span>ITEM COST (LKR)</span>
                          </div>
                          {pkg.itemized_breakdown.map((item, itemIdx) => (
                            <div key={itemIdx} className="flex items-start justify-between gap-2 border-b border-brand-border/40 pb-1.5 last:border-0 last:pb-0">
                              <div>
                                <div className="font-semibold text-brand-text">{item.name}</div>
                                <div className="text-[11px] text-brand-muted">{item.detail}</div>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <div className="font-semibold text-brand-gold">{formatLKR(item.updated_2026_lkr)}</div>
                                <div className="text-[10px] text-brand-muted line-through">2019: {formatLKR(item.original_2019_lkr)}</div>
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Bottom Action */}
              <div className="pt-4 border-t border-brand-border mt-auto">
                <Link
                  to={`/book/${pkg.slug}`}
                  className={`w-full py-3.5 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                    isPopular 
                      ? 'btn-primary' 
                      : isVIP 
                        ? 'bg-gradient-to-r from-brand-accent to-pink-600 hover:brightness-110 text-white shadow-lg active:scale-95' 
                        : 'btn-outline'
                  }`}
                >
                  Book {pkg.title} <ArrowRight className="w-4 h-4" />
                </Link>
                <div className="flex items-center justify-center gap-3 mt-3 text-[11px] text-brand-muted">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-brand-gold" /> Midnight 12:00 AM Slot Available
                  </span>
                  <span>•</span>
                  <span>Free Cancellation up to 7 days</span>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Value Proposition Callouts */}
      <div className="mt-16 grid sm:grid-cols-3 gap-6 text-center border-t border-brand-border pt-12">
        <div className="card">
          <Clock className="w-6 h-6 text-brand-gold mx-auto mb-2" />
          <h3 className="font-semibold text-sm mb-1">12:00 AM Sharp Arrival</h3>
          <p className="text-xs text-brand-muted">Our stealth crew coordinates silently to arrive and surprise your loved one at the very first stroke of midnight.</p>
        </div>
        <div className="card">
          <Video className="w-6 h-6 text-brand-accent mx-auto mb-2" />
          <h3 className="font-semibold text-sm mb-1">Same-Day Reaction Video</h3>
          <p className="text-xs text-brand-muted">Get a professionally cut 4K reaction video reel within 12 hours to treasure the genuine emotional moment forever.</p>
        </div>
        <div className="card">
          <ShieldCheck className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
          <h3 className="font-semibold text-sm mb-1">Western Province Coverage</h3>
          <p className="text-xs text-brand-muted">Colombo 1–15, Dehiwala, Mt. Lavinia, Kotte, Moratuwa, Negombo, Gampaha & Kalutara suburbs included.</p>
        </div>
      </div>
    </div>
  )
}
