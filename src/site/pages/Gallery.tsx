import { useEffect, useState } from 'react'
import { IMAGE_EXT, listDir } from '../../shared/media'
import MasonryGallery from '../../shared/MasonryGallery'

interface GalleryImage {
  key: string
  mtime: number
}

async function listImages(prefix = ''): Promise<GalleryImage[]> {
  const entries = await listDir(prefix)
  const files = entries
    .filter((e) => e.type === 'file' && IMAGE_EXT.test(e.name))
    .map((e) => ({ key: prefix + e.name, mtime: Date.parse(e.mtime) }))
  const nested = await Promise.all(
    entries.filter((e) => e.type === 'directory').map((e) => listImages(`${prefix}${e.name}/`)),
  )
  return [...files, ...nested.flat()]
}

function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([])

  useEffect(() => {
    listImages()
      .then((list) => setImages(list.sort((a, b) => b.mtime - a.mtime)))
      .catch(console.error)
  }, [])

  return (
    <>
      <title>Gallery</title>
      <div className="h-full w-full overflow-y-auto p-2">
        <MasonryGallery keys={images.map((i) => i.key)} />
      </div>
    </>
  )
}

export default Gallery
