import { http, HttpResponse } from 'msw/http'
import type { ListingEntry } from '@/shared/media'

const timestamp = '2026-01-01T00:00:00Z'

const file = (name: string, mtime = timestamp): ListingEntry => ({
  name,
  type: 'file',
  mtime,
})

const directory = (name: string): ListingEntry => ({
  name,
  type: 'directory',
  mtime: timestamp,
})

const listings: Partial<Record<string, ListingEntry[]>> = {
  '': [directory('vrchat'), directory('photos')],
  'photos/': [file('new.jpg', '2026-02-01T00:00:00Z'), directory('older')],
  'photos/older/': [file('old.jpg')],
  'vrchat/': [directory('new-avatar'), directory('old-avatar')],
  'vrchat/new-avatar/': [file('description.txt'), file('preview.jpg'), file('download.txt')],
  'vrchat/old-avatar/': [file('description.txt'), file('preview.jpg')],
}

const texts: Partial<Record<string, string>> = {
  'vrchat/new-avatar/description.txt': [
    'Date: 2026-02-01',
    'A mock project. More information: https://example.com/avatar.',
    '',
    'Assets:',
    'Outfit: https://example.com/outfit',
    'Hair: https://example.com/hair',
  ].join('\n'),
  'vrchat/old-avatar/description.txt': 'Date: 2025-01-01\nAn older project.',
  'vrchat/new-avatar/download.txt': 'This is a mock downloadable file.',
}

// Reuse images already in public/ for both thumbnails and full-size images.
const images: Partial<Record<string, string>> = {
  'photos/new.jpg': '/bg.jpg',
  'photos/older/old.jpg': '/about.jpg',
  'vrchat/new-avatar/preview.jpg': '/bg.jpg',
  'vrchat/old-avatar/preview.jpg': '/about.jpg',
}

const filesPrefix = '/media/files/'
const thumbPrefix = '/media/thumb/insecure/thumb/plain/local:///'

export const handlers = [
  http.get('/media/*', ({ request }) => {
    const pathname = new URL(request.url).pathname
    const isFile = pathname.startsWith(filesPrefix)
    const isThumb = pathname.startsWith(thumbPrefix)

    if (isFile || isThumb) {
      const prefix = isFile ? filesPrefix : thumbPrefix
      const key = decodeURIComponent(pathname.slice(prefix.length))

      if (isFile) {
        const entries = listings[key]
        if (entries !== undefined) return HttpResponse.json(entries)

        const text = texts[key]
        if (text !== undefined) return HttpResponse.text(text)
      }

      const image = images[key]
      if (image !== undefined) return fetch(new URL(image, request.url))
    }

    console.error('No mock exists for:', pathname)
    return HttpResponse.text('Not found', { status: 404 })
  }),
]
