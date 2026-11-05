import { ASSETS_STRING } from '@/shared/media'

const ASSETS_HEADER = new RegExp(`^${ASSETS_STRING}\\s*$`, 'im')

function splitAssets(text: string) {
  const match = ASSETS_HEADER.exec(text)
  if (!match) return { description: text, assets: [] }
  return {
    description: text.slice(0, match.index).trim(),
    assets: text
      .slice(match.index + match[0].length)
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean),
  }
}

export function parseDescription(text: string) {
  const [firstLine, ...rest] = text.split(/\r?\n/)
  const date = /^Date:\s*(\d{4}-\d{2}-\d{2})\s*$/i.exec(firstLine)?.[1]
  const timestamp = date ? Date.parse(`${date}T00:00:00.000Z`) : NaN
  const validDate =
    !Number.isNaN(timestamp) && new Date(timestamp).toISOString().slice(0, 10) === date

  return {
    date: validDate ? timestamp : null,
    ...splitAssets(validDate ? rest.join('\n').trim() : text),
  }
}
