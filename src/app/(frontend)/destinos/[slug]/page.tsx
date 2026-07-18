// app/(frontend)/destinos/[slug]/page.tsx
import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { DestinationHero } from '@/components/DestinationsHero'
import { DestinationFaqs } from '@/components/DestinationFaqs'
import RichText from '@/components/RichText'

export default async function DestinationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'destinations',
    where: { slug: { equals: slug } },
    depth: 2, // resuelve mainImage, gallery, y docs internos en los links del richText
    limit: 1,
  })
  const destination = docs[0]
  if (!destination) return notFound()

  return (
    <article>
      <DestinationHero destination={destination} />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <RichText data={destination['long-description']} />
        <DestinationFaqs destination={destination} />
      </div>
    </article>
  )
}
