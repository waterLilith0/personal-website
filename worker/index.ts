interface Env {
  BUCKET: R2Bucket;
  PUBLIC_URL: string;
  ALLOWED_ORIGIN: string;
}

interface ImageEntry {
  key: string;
  uploaded: string;
}

const PREFIXES = ["irl/", "vrc/"];
const IMAGE_EXT = /\.(jpe?g|png|webp|avif|gif)$/i;

const encodeKey = (key: string) =>
  key.split("/").map(encodeURIComponent).join("/");

async function listImages(bucket: R2Bucket): Promise<ImageEntry[]> {
  const items: ImageEntry[] = [];
  for (const prefix of PREFIXES) {
    let cursor: string | undefined;
    do {
      const page = await bucket.list({ prefix, cursor });
      for (const o of page.objects) {
        if (IMAGE_EXT.test(o.key)) {
          items.push({ key: o.key, uploaded: o.uploaded.toISOString() });
        }
      }
      cursor = page.truncated ? page.cursor : undefined;
    } while (cursor);
  }
  return items.sort((a, b) => b.uploaded.localeCompare(a.uploaded));
}

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);
    const cors = { "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN };

    if (url.pathname === "/images") {
      return Response.json(await listImages(env.BUCKET), {
        headers: { ...cors, "Cache-Control": "public, max-age=60" },
      });
    }

    if (url.pathname.startsWith("/thumb/")) {
      const key = decodeURIComponent(url.pathname.slice("/thumb/".length));
      if (!PREFIXES.some((p) => key.startsWith(p)) || !IMAGE_EXT.test(key)) {
        return new Response("Not found", { status: 404 });
      }
      const width = Math.min(Number(url.searchParams.get("w")) || 400, 1600);
      const accept = request.headers.get("Accept") ?? "";
      const format = accept.includes("image/avif")
        ? "avif"
        : accept.includes("image/webp")
          ? "webp"
          : undefined;
      const res = await fetch(`${env.PUBLIC_URL}/${encodeKey(key)}`, {
        cf: { image: { width, fit: "scale-down", format } },
      });
      return new Response(res.body, {
        status: res.status,
        headers: {
          ...cors,
          "Content-Type": res.headers.get("Content-Type") ?? "image/jpeg",
          "Cache-Control": "public, max-age=31536000, immutable",
          Vary: "Accept",
        },
      });
    }

    return new Response("Not found", { status: 404 });
  },
} satisfies ExportedHandler<Env>;
