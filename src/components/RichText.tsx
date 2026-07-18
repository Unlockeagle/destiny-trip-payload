// src/components/RichText.tsx
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import type { DefaultNodeTypes, SerializedBlockNode } from '@payloadcms/richtext-lexical'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import {
  JSXConvertersFunction,
  LinkJSXConverter,
  RichText as ConvertRichText,
} from '@payloadcms/richtext-lexical/react'

import { CodeBlock, CodeBlockProps } from '@/blocks/Code/Component'
import { BannerBlock } from '@/blocks/Banner/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { cn } from '@/utilities/ui'

import type {
  BannerBlock as BannerBlockProps,
  CallToActionBlock as CTABlockProps,
  MediaBlock as MediaBlockProps,
} from '@/payload-types'

type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<BannerBlockProps>
  | SerializedBlockNode<CTABlockProps>
  | SerializedBlockNode<CodeBlockProps>
  | SerializedBlockNode<MediaBlockProps>

const internalDocToHref = ({ linkNode }: { linkNode: any }) => {
  const { value, relationTo } = linkNode.fields.doc!
  if (typeof value !== 'object') throw new Error('Expected value to be populated (revisa el depth)')
  return relationTo === 'destinations' ? `/destinos/${value.slug}` : `/${value.slug}`
}

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
  upload: ({ node }) => {
    const media = node.value as any
    if (!media?.url) return null
    return (
      <figure className="my-6">
        <img src={media.url} alt={media.alt ?? ''} className="rounded-lg" />
        {media.caption && (
          <figcaption className="text-sm text-gray-500 mt-1">{media.caption}</figcaption>
        )}
      </figure>
    )
  },
  blocks: {
    banner: ({ node }) => <BannerBlock className="col-start-2 mb-4" {...node.fields} />,
    mediaBlock: ({ node }) => (
      <MediaBlock
        className="col-start-1 col-span-3"
        imgClassName="m-0"
        {...node.fields}
        enableGutter={false}
        disableInnerContainer
      />
    ),
    code: ({ node }) => <CodeBlock className="col-start-2" {...node.fields} />,
    cta: ({ node }) => <CallToActionBlock {...node.fields} />,
  },
})

type Props = {
  data: SerializedEditorState
  enableGutter?: boolean
  enableProse?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export default function RichText(props: Props) {
  const { className, enableProse = true, enableGutter = true, ...rest } = props
  return (
    <ConvertRichText
      converters={jsxConverters}
      className={cn(
        'payload-richtext',
        {
          container: enableGutter,
          'max-w-none': !enableGutter,
          'mx-auto prose md:prose-md dark:prose-invert': enableProse,
        },
        className,
      )}
      {...rest}
    />
  )
}
