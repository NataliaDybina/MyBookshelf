import type { BookFormat, BookStatus, SourceType } from './api/types'

export const statusLabels: Record<BookStatus, string> = {
  WANT_TO_READ: 'Want to read',
  READING: 'Reading',
  READ: 'Read',
}

export const formatLabels: Record<BookFormat, string> = {
  PAPER: 'Paper book',
  EBOOK: 'E-book',
  AUDIOBOOK: 'Audiobook',
}

export const sourceLabels: Record<SourceType, string> = {
  OWN: 'Own copy',
  LIBRARY: 'Library',
  BORROWED: 'Borrowed',
}

/** Label for the "from" field of a source. */
export const sourceFromLabels: Record<SourceType, string> = {
  OWN: '',
  LIBRARY: 'Library name',
  BORROWED: 'Borrowed from',
}

export function formatDate(iso: string | null): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
