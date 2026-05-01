import { ReactNode, useEffect, useRef, useState } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { HiChevronDoubleLeft, HiChevronDoubleRight, HiMenuAlt1 } from 'react-icons/hi'
import { BiUserCircle } from 'react-icons/bi'
import { RiLogoutBoxRLine } from 'react-icons/ri'
import { MdOutlineKeyboardArrowDown } from 'react-icons/md'
import AppNavbar from './Navbar'

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/bookings': 'Booking Entry',
  '/bookings/create': 'Add Booking',
  '/bookings/quick': 'Quick Booking',
  '/booking-rates': 'Booking Rates',
  '/couriers': 'Couriers',
  '/courier-volumetric-mappings': 'Courier Volumetric Mappings',
  '/courier-zone-rates': 'Courier Zone Rate Management',
  '/volumetric-calculator': 'Volumetric Weight Calculator',
  '/credit': 'Credit Entry',
  '/credit/create': 'Create Credit Entry',
  '/credit/reports': 'Credit Reports',
  '/stocks': 'Stock In',
  '/stocks/add': 'Add Courier',
  '/stocks/out': 'Stock Out',
  '/stocks/courier': 'Add Courier',
  '/stocks/co-loader': 'Add Co-Loader',
  '/stocks/booker': 'Add Booker',
}

function getPageTitle(pathname: string) {
  if (pageTitles[pathname]) {
    return pageTitles[pathname]
  }

  if (pathname.startsWith('/bookings/') && pathname.endsWith('/edit')) {
    return 'Edit Booking'
  }

  if (pathname.startsWith('/bookings/') && pathname.endsWith('/view')) {
    return 'View Booking'
  }

  if (pathname.startsWith('/bookings/') && pathname.endsWith('/status')) {
    return 'Shipment Status'
  }

  if (pathname.startsWith('/credit/') && pathname.endsWith('/edit')) {
    return 'Edit Credit Entry'
  }

  if (pathname.startsWith('/credit/') && pathname.endsWith('/delete')) {
    return 'Delete Credit Entry'
  }

  return 'Frontline Admin'
}

type LayoutProps = {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter()
  const pageTitle = getPageTitle(router.pathname)
  const { user, isLoading: isUserLoading } = useUser()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  const accountMenuRef = useRef<HTMLDivElement>(null)
  const accountLabel = user?.name || user?.nickname || user?.email || 'Account'
  const accountEmail = user?.email || 'Signed in'
  const accountInitial = accountLabel.trim().charAt(0).toUpperCase() || 'A'

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const storedValue = window.localStorage.getItem('frontline:sidebar-collapsed')
    setIsSidebarCollapsed(storedValue === 'true')
  }, [])

  useEffect(() => {
    if (!isAccountMenuOpen) {
      return
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (accountMenuRef.current?.contains(event.target as Node)) {
        return
      }

      setIsAccountMenuOpen(false)
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsAccountMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isAccountMenuOpen])

  useEffect(() => {
    setIsAccountMenuOpen(false)
  }, [router.asPath])

  const toggleSidebarCollapsed = () => {
    setIsSidebarCollapsed((currentValue) => {
      const nextValue = !currentValue

      if (typeof window !== 'undefined') {
        window.localStorage.setItem('frontline:sidebar-collapsed', String(nextValue))
      }

      return nextValue
    })
  }

  const openSidebar = () => {
    if (typeof window === 'undefined') {
      return
    }

    window.dispatchEvent(new CustomEvent('frontline:sidebar-open'))
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <AppNavbar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapsed={toggleSidebarCollapsed}
      />
      <div className={isSidebarCollapsed ? 'lg:pl-14' : 'lg:pl-56'}>
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="flex items-center justify-between gap-4 px-3 py-2 sm:px-4 lg:px-5">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="btn btn-ghost btn-sm lg:hidden"
                onClick={openSidebar}
                aria-label="Open navigation"
              >
                <HiMenuAlt1 className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm hidden lg:inline-flex"
                onClick={toggleSidebarCollapsed}
                aria-label={isSidebarCollapsed ? 'Expand navigation' : 'Collapse navigation'}
              >
                {isSidebarCollapsed ? (
                  <HiChevronDoubleRight className="h-5 w-5" />
                ) : (
                  <HiChevronDoubleLeft className="h-5 w-5" />
                )}
              </button>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Operations Console
                </p>
                <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">{pageTitle}</h1>
              </div>
            </div>
            <div className="flex items-center">
              {isUserLoading ? (
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm">
                  <span className="loading loading-spinner loading-xs text-primary"></span>
                </div>
              ) : user ? (
                <div className="relative" ref={accountMenuRef}>
                  <button
                    type="button"
                    className="flex items-center gap-3 rounded-full border border-slate-200 bg-white py-1.5 pl-1.5 pr-3 text-left shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
                    onClick={() => setIsAccountMenuOpen((currentValue) => !currentValue)}
                    aria-haspopup="menu"
                    aria-expanded={isAccountMenuOpen}
                    aria-label="Open account menu"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                      {user.picture ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={user.picture} alt={accountLabel} className="h-full w-full rounded-full object-cover" />
                      ) : (
                        accountInitial
                      )}
                    </span>
                    <span className="hidden min-w-0 sm:block">
                      <span className="block max-w-[180px] truncate text-sm font-semibold text-slate-900">
                        {accountLabel}
                      </span>
                      <span className="block max-w-[180px] truncate text-xs text-slate-500">
                        {accountEmail}
                      </span>
                    </span>
                    <MdOutlineKeyboardArrowDown
                      className={[
                        'h-5 w-5 text-slate-400 transition-transform duration-200',
                        isAccountMenuOpen ? 'rotate-180' : '',
                      ].join(' ')}
                    />
                  </button>
                  {isAccountMenuOpen ? (
                    <div
                      className="absolute right-0 z-[60] mt-3 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10"
                      role="menu"
                    >
                      <div className="border-b border-slate-100 bg-slate-50 px-4 py-4">
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                            <BiUserCircle className="h-5 w-5" />
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900">{accountLabel}</p>
                            <p className="truncate text-xs text-slate-500">{accountEmail}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                        <Link
                          href="/api/auth/logout"
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                          role="menuitem"
                        >
                          <RiLogoutBoxRLine className="h-4 w-4" />
                          Logout
                        </Link>
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : (
                <Link href="/api/auth/login" className="btn btn-primary btn-sm rounded-full shadow-sm">
                  Login
                </Link>
              )}
            </div>
          </div>
        </header>

        <main className="px-2 py-2 sm:px-3 sm:py-3 lg:px-4">
          <div className="mx-auto w-full max-w-none">{children}</div>
        </main>
      </div>
    </div>
  )
}
