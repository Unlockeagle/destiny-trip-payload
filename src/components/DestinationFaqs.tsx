// components/DestinationFaqs.tsx
import type { Destination } from '@/payload-types'

export function DestinationFaqs({ destination }: { destination: Destination }) {
  const faqs = destination.faqs ?? []
  if (!faqs.length) return null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }

  return (
    <section className="mt-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h2 className="text-2xl font-semibold mb-4">Preguntas frecuentes</h2>
      <div className="divide-y">
        {faqs.map((f, i) => (
          <details key={i} className="py-3">
            <summary className="font-medium cursor-pointer">{f.question}</summary>
            <p className="mt-2 text-gray-600">{f.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
