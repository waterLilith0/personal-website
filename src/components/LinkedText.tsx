import { URL_PATTERN } from '@/shared/media'

export default function LinkedText({ text }: { text: string }) {
  return text.split(URL_PATTERN).map((part, i) => {
    if (URL_PATTERN.test(part)) {
      return (
        <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="underline">
          {part}
        </a>
      )
    }
    return part
  })
}
