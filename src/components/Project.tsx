import { IMAGE_EXT, listDir, VRCHAT_ROOT, fileUrl, DESCRIPTION_FILE } from '@/shared/media'
import { useEffect, useState } from 'react'
import LinkedText from './LinkedText'
import { cn } from 'cn'
import { buttonVariants } from './ui/button'
import MasonryGallery from '@/shared/MasonryGallery'
import AssetCollapsible from './AssetCollapsible'

// Every folder under vrchat/ in the media store is a project. Its title is the
// folder name, its description the optional description.txt inside it. Images in
// it are shown in a gallery, every other file is a download link.
const toTitle = (folder: string) => folder.replace(/[-_]+/g, ' ')

export default function Project({
  folder,
  description,
  assetLinks,
}: {
  folder: string
  description: string
  assetLinks: string[]
}) {
  const [images, setImages] = useState([''])
  const [assets, setAssets] = useState([''])

  useEffect(() => {
    const prefix = `${VRCHAT_ROOT}${folder}/`
    listDir(prefix)
      .then((entries) => {
        const files = entries
          .filter((e) => e.type === 'file')
          .map((e) => prefix + e.name)
          .sort()
        setImages(files.filter((k) => IMAGE_EXT.test(k)))
        setAssets(files.filter((k) => !IMAGE_EXT.test(k) && !k.endsWith(DESCRIPTION_FILE)))
      })
      .catch(console.error)
  }, [folder])

  return (
    <section className="w-full max-w-5xl">
      <div className="flex items-start justify-between gap-4">
        <h2>{toTitle(folder)}</h2>
        <a
          href="https://ko-fi.com/F2F41FAAQB"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants(), 'shrink-0 bg-[#72a4f2] text-white hover:bg-[#72a4f2]/85')}
        >
          Tip me
        </a>
      </div>
      {description && (
        <p className="whitespace-pre-line">
          <LinkedText text={description} />
        </p>
      )}
      {assetLinks.length > 0 && <AssetCollapsible text={assetLinks.join('\n')} />}
      <div className="mt-2">
        <MasonryGallery keys={images} extraColumns={2} />
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
