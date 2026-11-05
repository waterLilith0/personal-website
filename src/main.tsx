import '@/../index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { initTelemetry } from '@/shared/telemetry/faro.ts'
import { createAppRouter } from '@/app/router'
import { env } from '@/shared/config/env'

async function startApp() {
  if (env.mocksEnabled) {
    const { worker } = await import('./mocks/browser')
    await worker.start()
  }

  initTelemetry()
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <RouterProvider router={createAppRouter()} />
    </StrictMode>,
  )
}

void startApp().catch((error: unknown) => {
  console.error('Application startup failed:', error)
})
