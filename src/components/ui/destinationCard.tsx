import { Destination } from '@/payload-types'
import Link from 'next/link'

type Props = {
  destination: Destination
  badgeLabel?: string
}

export const DestinationCard = ({ destination, badgeLabel }: Props) => {
  const displayPrice = destination.priceFrom

  return (
    <article className="destination-card group rounded-lg overflow-hidden shadow-slate-600/30 shadow-sm flex-none basis-80 snap-center">
      {/* destination ---->>> imagen */}
      {destination.mainImage && typeof destination.mainImage === 'object' && (
        <div className="destination-card__images h-56 relative overflow-hidden">
          <img
            className="w-full h-full object-cover group-hover:scale-105 transition-transform ease-in-out duration-300"
            src={destination.mainImage.sizes?.small?.url ?? ''}
            alt={destination.mainImage.alt ?? ''}
          />
          {/* destination --->>> badge */}
          {badgeLabel ? (
            <span className="absolute bg-amber-300 text-slate-950 rounded-2xl px-2 py-1 text-xs top-2 left-2">
              {badgeLabel}
            </span>
          ) : (
            destination.type && (
              <span className="absolute bg-amber-300 text-slate-950 rounded-2xl px-2 py-1 text-xs top-2 left-2">
                {destination.type === 'national' ? 'Nacional' : 'Internacional'}
              </span>
            )
          )}
        </div>
      )}

      {/* destination --->>> content */}
      <div className="destination-card__content p-4 w-full flex flex-col justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold">
            {destination.title}
            {destination.country ? ` · ${destination.country}` : ''}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
            {destination.description}
          </p>

          {/* destination --->>> price */}
          {displayPrice != null && (
            <div className="destination-card__price max-h-12 text-sm">
              <p>
                Desde <strong>$ {displayPrice}</strong>
              </p>
            </div>
          )}
        </div>

        {/* destination --->>> CTA */}
        <Link
          href={`destinos/${destination.type}/${destination.slug}`}
          className="mt-4 group bg-pink-600 text-zinc-50 text-center rounded-md px-4 py-2"
        >
          Ver destino{' '}
          <span className="group-hover:ml-4 transition-all ease-in-out duration-300">→</span>
        </Link>
      </div>
    </article>
  )
}
