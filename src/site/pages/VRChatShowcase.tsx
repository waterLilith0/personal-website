import { useEffect, useState } from 'react'
import { DESCRIPTION_FILE, VRCHAT_ROOT, fileUrl, listDir } from '@/shared/media'
import Project from '@/components/Project'
import { parseDescription } from '@/hooks/parse-file'

export async function readText(key: string): Promise<string> {
  const res = await fetch(fileUrl(key))
  return res.ok ? (await res.text()).trim() : ''
}

function VRChatShowcase() {
  const [projects, setProjects] = useState<
    { folder: string; description: string; assets: string[] }[]
  >([])

  useEffect(() => {
    listDir(VRCHAT_ROOT)
      .then(async (entries) => {
        const projects = await Promise.all(
          entries
            .filter((entry) => entry.type === 'directory')
            .map(async (entry) => {
              const text = await readText(`${VRCHAT_ROOT}${entry.name}/${DESCRIPTION_FILE}`).catch(
                (error) => {
                  console.error(error)
                  return ''
                },
              )
              return { folder: entry.name, ...parseDescription(text) }
            }),
        )

        setProjects(
          projects.sort((a, b) => {
            const dateDifference =
              (b.date ?? Number.NEGATIVE_INFINITY) - (a.date ?? Number.NEGATIVE_INFINITY)
            return dateDifference || a.folder.localeCompare(b.folder)
          }),
        )
      })
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
          {projects.map(({ folder, description, assets }) => (
            <Project key={folder} folder={folder} description={description} assetLinks={assets} />
          ))}
        </div>
      </div>
    </>
  )
}

export default VRChatShowcase
