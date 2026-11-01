import { LightGallery, LightGalleryItem } from "@lightgallery/react";
import Thumbnail from "@lightgallery/react/plugins/thumbnail";
import Zoom from "@lightgallery/react/plugins/zoom";
import { useEffect, useState } from "react";
import { IMAGE_EXT, fileUrl, listDir, thumbUrl } from "../../shared/media";

interface GalleryImage {
  key: string;
  mtime: number;
}

async function listImages(prefix = ""): Promise<GalleryImage[]> {
  const entries = await listDir(prefix);
  const nested = await Promise.all(
    entries.map((e) =>
      e.type === "directory"
        ? listImages(`${prefix}${e.name}/`)
        : IMAGE_EXT.test(e.name)
          ? [{ key: prefix + e.name, mtime: Date.parse(e.mtime) }]
          : [],
    ),
  );
  return nested.flat();
}

function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);

  useEffect(() => {
    listImages()
      .then((list) => setImages(list.sort((a, b) => b.mtime - a.mtime)))
      .catch(console.error);
  }, []);

  return (
    <>
      <title>Gallery</title>
      <div className="h-full w-full overflow-y-auto p-2">
        <LightGallery plugins={[Thumbnail, Zoom]} zoom={{ scale: 1.5 }}>
          <div className="columns-2 gap-2 sm:columns-3 lg:columns-4">
            {images.map(({ key }) => {
              const src = fileUrl(key);
              const thumb = thumbUrl(key);
              return (
                <LightGalleryItem
                  key={key}
                  item={{ src, thumb }}
                  href={src}
                  className="mb-2 block break-inside-avoid"
                >
                  <img
                    src={thumb}
                    alt=""
                    loading="lazy"
                    className="h-auto w-full rounded-md"
                  />
                </LightGalleryItem>
              );
            })}
          </div>
        </LightGallery>
      </div>
    </>
  );
}

export default Gallery;
