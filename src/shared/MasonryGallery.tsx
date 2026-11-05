import { LightGallery } from '@lightgallery/react'
import Thumbnail from '@lightgallery/react/plugins/thumbnail'
import Zoom from '@lightgallery/react/plugins/zoom'
import { useState, useSyncExternalStore } from 'react'
import LazyThumb from './LazyThumb'
import { fileUrl, thumbUrl } from './media'

// 2 columns, 3 from sm and 4 from lg (Tailwind breakpoints).
const QUERIES = ['(min-width: 640px)', '(min-width: 1024px)']

function subscribe(onChange: () => void) {
  const lists = QUERIES.map((q) => matchMedia(q))
  lists.forEach((l) => l.addEventListener('change', onChange))
  return () => lists.forEach((l) => l.removeEventListener('change', onChange))
}

const getColumnCount = () => 2 + QUERIES.filter((q) => matchMedia(q).matches).length

// Each image is assigned to a column by its index and stays there. CSS `columns`
// re-balances items between columns whenever an image finishes loading, which
// makes everything but the first column jump around while scrolling.
function MasonryGallery({ keys, extraColumns = 0 }: { keys: string[]; extraColumns?: number }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const count = useSyncExternalStore(subscribe, getColumnCount) + extraColumns

  const columns: number[][] = Array.from({ length: count }, () => [])
  keys.forEach((_, i) => columns[i % count].push(i))

  return (
    <>
      <div className="flex gap-2">
        {columns.map((indexes, c) => (
          <div key={c} className="flex min-w-0 flex-1 flex-col gap-2">
            {indexes.map((i) => (
              <a
                key={keys[i]}
                href={fileUrl(keys[i])}
                onClick={(e) => {
                  e.preventDefault()
                  setOpenIndex(i)
                }}
                className="block"
              >
                <LazyThumb src={thumbUrl(keys[i])} />
              </a>
            ))}
          </div>
        ))}
      </div>
      <LightGallery
        plugins={[Thumbnail, Zoom]}
        zoom={{ scale: 1.5 }}
        slides={keys.map((key) => ({ src: fileUrl(key), thumb: thumbUrl(key) }))}
        open={openIndex !== null}
        index={openIndex ?? 0}
        onIndexChange={setOpenIndex}
        onClose={() => setOpenIndex(null)}
      />
    </>
  )
}

export default MasonryGallery
