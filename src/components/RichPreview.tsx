'use client'

import React, { useEffect, useState } from 'react'
import { useFormFields, useConfig } from '@payloadcms/ui'

/**
 * Rich SEO Preview
 * Muestra dos vistas:
 *  1) Google SERP (solo texto, como hace el plugin por defecto)
 *  2) Social Card (WhatsApp / Facebook / LinkedIn) con imagen, título y descripción
 *
 * Se registra como un campo tipo "ui" dentro del grupo `meta` que crea el plugin de SEO.
 * Lee los valores hermanos (meta.title, meta.description, meta.image) en tiempo real
 * usando useFormFields, así que se actualiza mientras el editor escribe.
 */

type MediaDoc = {
  id: string | number
  url?: string
  filename?: string
  alt?: string
}

export const RichPreview: React.FC = () => {
  const { config } = useConfig()
  const serverURL = config?.serverURL || ''

  // Valores hermanos dentro del grupo meta.*
  const title = useFormFields(([fields]) => fields?.['meta.title']?.value as string) || ''
  const description =
    useFormFields(([fields]) => fields?.['meta.description']?.value as string) || ''
  const imageValue = useFormFields(([fields]) => fields?.['meta.image']?.value)

  const [imageDoc, setImageDoc] = useState<MediaDoc | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!imageValue) {
      setImageDoc(null)
      return
    }

    if (typeof imageValue === 'object') {
      setImageDoc(imageValue as MediaDoc)
      return
    }

    const loadMedia = async () => {
      setLoading(true)

      try {
        const response = await fetch(`${serverURL}/api/media/${imageValue}`, {
          credentials: 'include',
        })

        if (!response.ok) return

        setImageDoc(await response.json())
      } finally {
        setLoading(false)
      }
    }

    loadMedia()
  }, [imageValue, serverURL])

  const imageURL = imageDoc?.url
    ? imageDoc.url.startsWith('http')
      ? imageDoc.url
      : `${serverURL}${imageDoc.url}`
    : null

  const displayTitle = title || 'Título de la página'
  const displayDescription =
    description || 'La descripción meta aparecerá aquí a medida que la escribas.'

  return (
    <div className="max-w-xl space-y-8 bg-red-600">
      {/* Social Preview */}
      <section className="space-y-2 border border-slate-700 bg-red-800">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Vista previa en WhatsApp / Facebook / LinkedIn
        </p>

        <div className="overflow-hidden rounded-xl border shadow-sm">
          <div className="h-32 w-32 bg-red-500">
            {loading ? (
              <div className="flex items-center justify-center text-sm text-zinc-500">
                Cargando imagen...
              </div>
            ) : imageURL ? (
              <img
                src={imageURL}
                alt={imageDoc?.alt ?? ''}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex bg-ref-500 items-center justify-center text-sm text-slate-100">
                Sin imagen seleccionada
              </div>
            )}
          </div>

          <div className="border-t border-zinc-200 p-4">
            <p className="text-[11px] uppercase tracking-wide text-zinc-500">
              {new URL(serverURL || 'https://tusitio.com').hostname.toUpperCase()}
            </p>

            <h3 className="mt-1 text-base font-semibold text-zinc-900">{displayTitle}</h3>

            <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-zinc-600">
              {displayDescription}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
