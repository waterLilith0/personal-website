import { useEffect, useState } from 'react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from 'cn'
import { IMAGE_EXT, fileUrl, listDir } from '../../shared/media'
import MasonryGallery from '../../shared/MasonryGallery'

// TODO: ask for permission to use sona pictures as comparison to textures I made

const ROOT = 'vrchat/'

// `folder` is the directory name under vrchat/ in the media store.
// Images in it are shown in a gallery, every other file is a download link.
const PROJECTS = [
  {
    folder: 'example-project',
    title: 'Example Project',
    description:
      'Placeholder project: replace this text and put images and asset files into vrchat/example-project/ in the media store.',
  },
]

function Project({ folder, title, description }: (typeof PROJECTS)[number]) {
  const [images, setImages] = useState<string[]>([])
  const [assets, setAssets] = useState<string[]>([])

  useEffect(() => {
    const prefix = `${ROOT}${folder}/`
    listDir(prefix)
      .then((entries) => {
        const files = entries
          .filter((e) => e.type === 'file')
          .map((e) => prefix + e.name)
          .sort()
        setImages(files.filter((k) => IMAGE_EXT.test(k)))
        setAssets(files.filter((k) => !IMAGE_EXT.test(k)))
      })
      .catch(console.error)
  }, [folder])

  return (
    <section className="w-full max-w-5xl">
      <div className="flex items-start justify-between gap-4">
        <h2>{title}</h2>
        <a
          href="https://ko-fi.com/F2F41FAAQB"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants(), 'shrink-0 bg-[#72a4f2] text-white hover:bg-[#72a4f2]/85')}
        >
          Tip me
        </a>
      </div>
      <p>{description}</p>
      <div className="mt-2">
        <MasonryGallery keys={images} maxColumns={3} />
      </div>
      {assets.length > 0 && (
        <ul className="mt-2 list-disc pl-6">
          {assets.map((key) => (
            <li key={key}>
              <a href={fileUrl(key)} download>
                {key.split('/').pop()}
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function VRChatShowcase() {
  return (
    <>
      <title>VRC Portfolio and Showcase</title>
      <div className="h-full w-full overflow-y-auto p-4">
        <div className="flex flex-col items-center gap-8">
          <h1>VRChat Showcase</h1>
          <p>
            This is a showcase of my work in VRChat Avatar development, including textures I have
            made.
          </p>
          {PROJECTS.map((p) => (
            <Project key={p.folder} {...p} />
          ))}
        </div>
      </div>
    </>
  )
}

export default VRChatShowcase
