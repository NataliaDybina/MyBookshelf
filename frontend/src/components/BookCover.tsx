import { useState } from 'react'

interface Props {
  url: string | null
  title: string
  className?: string
}

/** Cover image with a placeholder when there is no URL or the image cannot be loaded. */
export default function BookCover({ url, title, className = '' }: Props) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null)

  if (!url || failedUrl === url) {
    return (
      <div
        className={`flex items-center justify-center bg-border/60 p-2 text-center text-xs text-muted ${className}`}
        aria-label={`No cover for ${title}`}
      >
        {title}
      </div>
    )
  }
  return (
    <img
      src={url}
      alt={`Cover of ${title}`}
      className={`object-cover ${className}`}
      onError={() => setFailedUrl(url)}
    />
  )
}
