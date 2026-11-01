import { useEffect, useState } from 'react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from 'cn'
import { IMAGE_EXT, VRCHAT_ROOT, fileUrl, listDir } from '../../shared/media'
import MasonryGallery from '../../shared/MasonryGallery'

// TODO: ask for permission to use sona pictures as comparison to textures I made

const DESCRIPTION_FILE = 'description.txt'

// Every folder under vrchat/ in the media store is a project. Its title is the
// folder name, its description the optional description.txt inside it. Images in
// it are shown in a gallery, every other file is a download link.
const toTitle = (folder: string) => folder.replace(/[-_]+/g, ' ')

// The capture group makes split() keep the URLs, so they land on odd indexes.
// Trailing punctuation is left out of the link.
const URL_PATTERN = /(https?:\/\/[^\s<>"]*[^\s<>".,;:!?)\]])/

function LinkedText({ text }: { text: string }) {
  return text.split(URL_PATTERN).map((part, i) =>
    i % 2 === 1 ? (
      <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="underline">
        {part}
      </a>
    ) : (
      part
    ),
  )
}

async function readText(key: string): Promise<string> {
  const res = await fetch(fileUrl(key))
  return res.ok ? (await res.text()).trim() : ''
}

function Project({ folder }: { folder: string }) {
  const [images, setImages] = useState<string[]>([])
  const [assets, setAssets] = useState<string[]>([])
  const [description, setDescription] = useState('')

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
        if (files.includes(prefix + DESCRIPTION_FILE)) {
          return readText(prefix + DESCRIPTION_FILE).then(setDescription)
        }
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
      <p className="whitespace-pre-line">
        <LinkedText text={description} />
      </p>
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
  const [folders, setFolders] = useState<string[]>([])

  useEffect(() => {
    listDir(VRCHAT_ROOT)
      .then((entries) =>
        setFolders(
          entries
            .filter((e) => e.type === 'directory')
            .map((e) => e.name)
            .sort(),
        ),
      )
      .catch(console.error)
  }, [])

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
          {folders.map((folder) => (
            <Project key={folder} folder={folder} />
          ))}
        </div>
      </div>
    </>
  )
}

export default VRChatShowcase
