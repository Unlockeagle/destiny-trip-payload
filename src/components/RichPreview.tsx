'use client'

import React, { useEffect, useState, type CSSProperties } from 'react'
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
 *
 * Estilos 100% inline (sin Tailwind) para no depender del pipeline de CSS del admin.
 * Los colores usan las CSS vars nativas de Payload, así que respetan el tema claro/oscuro
 * del panel automáticamente.
 */

type MediaDoc = {
  id: string | number
  url?: string
  filename?: string
  alt?: string
}

const styles: Record<string, CSSProperties> = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    maxWidth: '560px',
  },
  sectionLabel: {
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--theme-elevation-500)',
    marginBottom: '8px',
  },
  serpCard: {
    borderRadius: '8px',
    border: '1px solid var(--theme-elevation-150)',
    backgroundColor: 'var(--theme-elevation-0)',
    padding: '16px',
  },
  serpUrl: {
    fontSize: '13px',
    color: 'var(--theme-elevation-500)',
    margin: 0,
  },
  serpTitle: {
    fontSize: '18px',
    color: '#1a0dab',
    margin: '4px 0 0',
    fontWeight: 400,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  serpDescription: {
    fontSize: '14px',
    color: 'var(--theme-elevation-700)',
    margin: '4px 0 0',
    lineHeight: 1.5,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  socialCard: {
    borderRadius: '12px',
    border: '1px solid var(--theme-elevation-150)',
    overflow: 'hidden',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    paddingBottom: '52.36%', // ~1.91:1, estándar de OG image (1200x630)
    backgroundColor: 'var(--theme-elevation-100)',
  },
  imageInner: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  placeholderText: {
    fontSize: '13px',
    color: 'var(--theme-elevation-400)',
  },
  socialBody: {
    borderTop: '1px solid var(--theme-elevation-150)',
    backgroundColor: 'var(--theme-elevation-0)',
    padding: '16px',
  },
  socialHostname: {
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
    color: 'var(--theme-elevation-500)',
    margin: 0,
  },
  socialTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--theme-elevation-800)',
    margin: '4px 0 0',
  },
  socialDescription: {
    fontSize: '14px',
    lineHeight: 1.5,
    color: 'var(--theme-elevation-600)',
    margin: '4px 0 0',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
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
    let cancelled = false

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

        const data = await response.json()
        if (!cancelled) setImageDoc(data)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadMedia()

    return () => {
      cancelled = true
    }
  }, [imageValue, serverURL])

  const imageURL = imageDoc?.url
    ? imageDoc.url.startsWith('http')
      ? imageDoc.url
      : `${serverURL}${imageDoc.url}`
    : null

  const displayTitle = title || 'Título de la página'
  const displayDescription =
    description || 'La descripción meta aparecerá aquí a medida que la escribas.'

  const hostname = (() => {
    try {
      return new URL(serverURL || 'https://tusitio.com').hostname
    } catch {
      return 'tusitio.com'
    }
  })()

  return (
    <div style={styles.wrapper}>
      {/* Google SERP Preview */}
      <section>
        <p style={styles.sectionLabel}>Vista previa en Google</p>

        <div style={styles.serpCard}>
          <p style={styles.serpUrl}>{hostname} › ...</p>
          <h3 style={styles.serpTitle}>{displayTitle}</h3>
          <p style={styles.serpDescription}>{displayDescription}</p>
        </div>
      </section>

      {/* Social Card Preview */}
      <section>
        <p style={styles.sectionLabel}>Vista previa en WhatsApp / Facebook / LinkedIn</p>

        <div style={styles.socialCard}>
          <div style={styles.imageWrapper}>
            <div style={styles.imageInner}>
              {loading ? (
                <span style={styles.placeholderText}>Cargando imagen...</span>
              ) : imageURL ? (
                <img src={imageURL} alt={imageDoc?.alt ?? ''} style={styles.image} />
              ) : (
                <span style={styles.placeholderText}>Sin imagen seleccionada</span>
              )}
            </div>
          </div>

          <div style={styles.socialBody}>
            <p style={styles.socialHostname}>{hostname.toUpperCase()}</p>
            <h3 style={styles.socialTitle}>{displayTitle}</h3>
            <p style={styles.socialDescription}>{displayDescription}</p>
          </div>
        </div>
      </section>
    </div>
  )
}
