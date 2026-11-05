import { Outlet, useLocation } from 'react-router'
import { useState } from 'react'
import Navbar from './Navbar'
import Footer from '@/shared/Footer'
import { cn } from 'cn'

import { useApplyTheme } from '@/shared/theme/useResolvedTheme'

function Layout() {
  useApplyTheme()

  const location = useLocation()
  const isIframePage = location.pathname === '/yt-embed'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  return (
    <div className="flex flex-col h-screen">
      <Navbar open={mobileMenuOpen} onToggle={() => setMobileMenuOpen((v) => !v)} />
      <main className="flex flex-col bg-secondary items-center grow">
        <div
          className={cn(
            'flex flex-col items-center bg-primary lg:w-[80%] w-full',
            isIframePage ? 'overflow-hidden' : 'overflow-hidden',
          )}
        >
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Layout
