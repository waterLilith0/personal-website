// Proxied to the internal gallery stack by nginx.conf
export const MEDIA_URL = '/media'
export const IMAGE_EXT = /\.(jpe?g|png|webp|avif|gif)$/i
// Shown on the VRChat Showcase page only, not in the main gallery.
export const VRCHAT_ROOT = 'vrchat/'

export interface ListingEntry {
  name: string
  type: 'file' | 'directory'
  mtime: string
}

const encodeKey = (key: string) => key.split('/').map(encodeURIComponent).join('/')

export const fileUrl = (key: string) => `${MEDIA_URL}/files/${encodeKey(key)}`
export const thumbUrl = (key: string) =>
  `${MEDIA_URL}/thumb/insecure/thumb/plain/local:///${encodeKey(key)}`

export async function listDir(prefix = ''): Promise<ListingEntry[]> {
  const res = await fetch(fileUrl(prefix))
  return (await res.json()) as ListingEntry[]
}
