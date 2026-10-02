import { APP_NAME } from '@/shared/config'

export interface SeoProps {
  title: string
  description?: string
  noIndex?: boolean
}

/** React 19 hoists `<title>` and `<meta>` into `<head>` — no helmet library needed. */
export function Seo({ title, description, noIndex = false }: SeoProps) {
  return (
    <>
      <title>{`${title} · ${APP_NAME}`}</title>
      {description ? <meta name="description" content={description} /> : null}
      {description ? <meta property="og:description" content={description} /> : null}
      <meta property="og:title" content={title} />
      {noIndex ? <meta name="robots" content="noindex" /> : null}
    </>
  )
}
