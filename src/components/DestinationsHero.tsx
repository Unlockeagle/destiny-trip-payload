// components/DestinationHero.tsx
import Image from 'next/image'
import type { Destination, Media } from '@/payload-types'

export function DestinationHero({ destination }: { destination: Destination }) {
  const mainImage = destination.mainImage as Media | null

  return (
    <section className="relative h-[60vh] w-full flex items-end">
      {mainImage?.url && (
        <Image
          src={mainImage.sizes?.medium?.url || ''}
          alt={mainImage.alt ?? destination.title}
          fill
          priority
          className="object-cover -z-10"
        />
      )}
      <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent -z-10" />
      <div className="relative z-10 p-8 text-white">
        <span className="text-sm uppercase tracking-wide">{destination.country}</span>
        <h1 className="text-4xl font-bold">{destination.title}</h1>
        {destination.description && <p className="mt-2 max-w-xl">{destination.description}</p>}
        {destination.priceFrom && (
          <p className="mt-3 text-lg">
            Desde <strong>${destination.priceFrom}</strong>
          </p>
        )}
      </div>
    </section>
  )
}
