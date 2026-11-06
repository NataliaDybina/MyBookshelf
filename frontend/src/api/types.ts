export type BookStatus = 'WANT_TO_READ' | 'READING' | 'READ'
export type BookFormat = 'PAPER' | 'EBOOK' | 'AUDIOBOOK'
export type SourceType = 'OWN' | 'LIBRARY' | 'BORROWED'

export interface Source {
  type: SourceType
  from: string | null
  returned: boolean
}

/** Fields the client sends when creating or updating a book. */
export interface BookRequest {
  title: string
  authors: string[]
  coverUrl: string | null
  description: string | null
  genres: string[]
  catalogId: string | null
  status: BookStatus
  currentPage: number | null
  pageCount: number | null
  format: BookFormat | null
  rating: number | null
  review: string | null
  source: Source
  wishReason: string | null
  recommendedBy: string | null
  /** ISO date (yyyy-mm-dd) */
  finishedAt: string | null
}

export interface Book extends BookRequest {
  id: string
  /** ISO timestamp */
  addedAt: string
}

export interface BookFilter {
  q?: string
  genre?: string
  status?: BookStatus
  source?: SourceType
}
