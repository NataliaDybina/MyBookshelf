import type { Book, BookFilter, BookRequest } from './types'

/** Error returned by the API as RFC 9457 ProblemDetail. */
export class ApiError extends Error {
  readonly status: number
  readonly fieldErrors: Record<string, string>

  constructor(status: number, message: string, fieldErrors: Record<string, string> = {}) {
    super(message)
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(path, {
      ...init,
      headers: init?.body ? { 'Content-Type': 'application/json' } : undefined,
    })
  } catch {
    throw new ApiError(0, 'The server cannot be reached. Please check that the backend is running.')
  }

  if (!response.ok) {
    let message = 'Something went wrong. Please try again.'
    let fieldErrors: Record<string, string> = {}
    try {
      const problem = await response.json()
      message = problem.detail ?? problem.title ?? message
      fieldErrors = problem.errors ?? {}
    } catch {
      // Response without a ProblemDetail body: keep the generic message.
    }
    throw new ApiError(response.status, message, fieldErrors)
  }

  if (response.status === 204) {
    return undefined as T
  }
  return response.json() as Promise<T>
}

export function listBooks(filter: BookFilter): Promise<Book[]> {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(filter)) {
    if (value) params.set(key, value)
  }
  const query = params.toString()
  return request<Book[]>(`/api/books${query ? `?${query}` : ''}`)
}

export function listGenres(): Promise<string[]> {
  return request<string[]>('/api/books/genres')
}

export function getBook(id: string): Promise<Book> {
  return request<Book>(`/api/books/${encodeURIComponent(id)}`)
}

export function createBook(book: BookRequest): Promise<Book> {
  return request<Book>('/api/books', { method: 'POST', body: JSON.stringify(book) })
}

export function updateBook(id: string, book: BookRequest): Promise<Book> {
  return request<Book>(`/api/books/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(book) })
}

export function deleteBook(id: string): Promise<void> {
  return request<void>(`/api/books/${encodeURIComponent(id)}`, { method: 'DELETE' })
}
