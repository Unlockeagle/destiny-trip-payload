import { getPayload } from 'payload'
import config from '@payload-config'
import type { DestinationsBlock as DestinationsBlockType } from '@/payload-types'
import Link from 'next/link'
import { DestinationCard } from '@/components/ui/destinationCard'

type Props = DestinationsBlockType

export const DestinationsBlockComponent = async ({
  title,
  subtitle,
  showCardBadge,
  cardBadgeLabel,
  limit,
  type,
  destinations: manualDestinations,
  ctaLabel,
  ctaLink,
}: Props) => {
  const payload = await getPayload({ config })

  let destinations

  if (manualDestinations && manualDestinations.length > 0) {
    destinations = manualDestinations.filter(
      (d): d is Extract<typeof d, { id: string }> => typeof d === 'object' && d !== null,
    )
  } else {
    const result = await payload.find({
      collection: 'destinations',
      where: {
        featured: { equals: true },
        ...(type && type !== 'all' ? { type: { equals: type } } : {}),
      },
      limit: limit ?? 3,
      depth: 1,
      sort: '-publishedAt',
    })

    destinations = result.docs
  }

  if (destinations.length === 0) return null

  return (
    <section className="destinations-block py-12 px-4 md:px-8">
      {(title || subtitle) && (
        <div className="destinations-block__header max-w-2xl mb-8">
          {title && <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>}
          {subtitle && <p className="text-slate-600 dark:text-slate-400 mt-2">{subtitle}</p>}
        </div>
      )}

      <div className="destinations-block__grid flex gap-4 overflow-x-auto snap-x pb-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible">
        {destinations.map((destination) => (
          <DestinationCard
            key={destination.id}
            destination={destination}
            badgeLabel={showCardBadge ? (cardBadgeLabel ?? undefined) : undefined}
          />
        ))}
      </div>

      {ctaLabel && ctaLink && (
        <div className="destinations-block__cta mt-8 flex justify-center">
          <Link
            href={ctaLink}
            className="group bg-pink-600 text-zinc-50 text-center rounded-md px-6 py-3"
          >
            {ctaLabel}{' '}
            <span className="group-hover:ml-4 transition-all ease-in-out duration-300">→</span>
          </Link>
        </div>
      )}
    </section>
  )
}
