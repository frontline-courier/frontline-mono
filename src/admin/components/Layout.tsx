import { ReactNode, useEffect, useState } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { HiChevronDoubleLeft, HiChevronDoubleRight, HiMenuAlt1 } from 'react-icons/hi'
import { BiUserCircle } from 'react-icons/bi'
import { RiLogoutBoxRLine } from 'react-icons/ri'
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
  const accountLabel = user?.name || user?.nickname || user?.email || 'Account'

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const storedValue = window.localStorage.getItem('frontline:sidebar-collapsed')
    setIsSidebarCollapsed(storedValue === 'true')
  }, [])

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
      <div className={isSidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'}>
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
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
                <div className="dropdown dropdown-end">
                  <div
                    tabIndex={0}
                    className="flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:border-slate-300 hover:text-slate-900"
                  >
                    <BiUserCircle className="h-5 w-5" />
                    <span className="max-w-[180px] truncate">{accountLabel}</span>
                  </div>
                  <ul tabIndex={0} className="menu dropdown-content z-[60] mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                    <li className="pointer-events-none rounded-xl px-3 py-2 text-xs text-slate-500">
                      {accountLabel}
                    </li>
                    <li>
                      <Link href="/api/auth/logout" className="flex items-center gap-2 text-red-600">
                        <RiLogoutBoxRLine className="h-4 w-4" />
                        Logout
                      </Link>
                    </li>
                  </ul>
                </div>
              ) : (
                <Link href="/api/auth/login" className="btn btn-primary btn-sm rounded-full shadow-sm">
                  Login
                </Link>
              )}
            </div>
          </div>
        </header>

        <main className="px-3 py-3 sm:px-4 sm:py-4">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
