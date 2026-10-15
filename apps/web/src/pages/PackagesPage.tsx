import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import { api } from '@/lib/api'
import { formatLKR, formatUSD } from '@/lib/utils'

type Package = {
  id: string
  slug: string
  title: string
  tagline: string
  base_price_lkr: number
  base_price_usd: number
  features: string // JSON string
}

export function PackagesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['packages'],
    queryFn: api.packages.list,
  })

  const packages: Package[] = data?.data ?? []

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-24">
        <div className="grid md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-64 rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-14">
        <h1 className="font-display text-5xl font-bold mb-4">Choose Your <span className="gold-gradient">Package</span></h1>
        <p className="text-brand-muted text-lg max-w-lg mx-auto">
          From a sweet midnight micro-surprise to a full flash-mob production — we've got every moment covered.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {packages.map((pkg, i) => {
          const features: string[] = JSON.parse(pkg.features)
          const isPopular = pkg.slug === 'classic-glow'
          return (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`card relative flex flex-col hover:border-brand-gold/40 transition-all duration-300 ${isPopular ? 'border-brand-gold/50 shadow-[0_0_30px_rgba(212,175,55,0.1)]' : ''}`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-6">
                  <span className="bg-brand-gold text-black text-xs font-bold px-3 py-1 rounded-full">Most Popular</span>
                </div>
              )}

              <div className="mb-4">
                <h2 className="font-display text-2xl font-bold text-brand-text">{pkg.title}</h2>
                <p className="text-brand-muted text-sm mt-1">{pkg.tagline}</p>
              </div>

              <div className="mb-6">
                <div className="font-display text-3xl font-bold gold-gradient">{formatLKR(pkg.base_price_lkr)}</div>
                <div className="text-brand-muted text-sm">≈ {formatUSD(pkg.base_price_usd)} for overseas orders</div>
              </div>

              <ul className="space-y-2 mb-8 flex-1">
                {features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2 text-sm text-brand-muted">
                    <Check className="w-4 h-4 text-brand-gold mt-0.5 flex-shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <Link to={`/book/${pkg.slug}`} className={`w-full text-center py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${isPopular ? 'btn-primary' : 'btn-outline'}`}>
                Book This Package <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
