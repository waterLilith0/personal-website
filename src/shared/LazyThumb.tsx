import { useState } from 'react'

// Without a size before it loads, every image has zero height, so all of them
// sit inside the viewport and loading="lazy" fetches the whole gallery at once.
// The placeholder ratio is dropped once the real image is there.
function LazyThumb({ src }: { src: string }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <img
      src={src}
      alt=""
      loading="lazy"
      decoding="async"
      onLoad={() => setLoaded(true)}
      className={`w-full rounded-md ${loaded ? 'h-auto' : 'bg-muted aspect-3/4'}`}
    />
  )
}

export default LazyThumb
