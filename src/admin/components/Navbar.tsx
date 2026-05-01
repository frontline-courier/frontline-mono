/* eslint-disable @next/next/no-html-link-for-pages */
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import {
  HiCalculator,
  HiChartBar,
  HiClipboardCheck,
  HiClipboardList,
  HiCollection,
  HiCreditCard,
  HiCube,
  HiHome,
  HiMap,
  HiOfficeBuilding,
  HiOutlineX,
  HiTruck,
  HiUsers,
} from 'react-icons/hi'

type NavItem = {
  href: string
  label: string
  icon: JSX.Element
}

type NavGroup = {
  label: string
  icon: JSX.Element
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    label: 'Overview',
    icon: <HiHome className="h-4 w-4" />,
    items: [{ href: '/', label: 'Dashboard', icon: <HiHome className="h-4 w-4" /> }],
  },
  {
    label: 'Bookings',
    icon: <HiClipboardList className="h-4 w-4" />,
    items: [
      { href: '/bookings', label: 'Booking Entry', icon: <HiClipboardList className="h-4 w-4" /> },
      { href: '/booking-rates', label: 'Booking Rates', icon: <HiClipboardCheck className="h-4 w-4" /> },
      { href: '/volumetric-calculator', label: 'Volumetric Calculator', icon: <HiCalculator className="h-4 w-4" /> },
    ],
  },
  {
    label: 'Courier',
    icon: <HiTruck className="h-4 w-4" />,
    items: [
      { href: '/couriers', label: 'Manage Couriers', icon: <HiTruck className="h-4 w-4" /> },
      { href: '/courier-volumetric-mappings', label: 'Volumetric Mappings', icon: <HiCollection className="h-4 w-4" /> },
      { href: '/courier-zone-rates', label: 'Zone Rates', icon: <HiMap className="h-4 w-4" /> },
    ],
  },
  {
    label: 'Credit',
    icon: <HiCreditCard className="h-4 w-4" />,
    items: [
      { href: '/credit', label: 'Credit Entry', icon: <HiCreditCard className="h-4 w-4" /> },
      { href: '/credit/reports', label: 'Reports', icon: <HiChartBar className="h-4 w-4" /> },
    ],
  },
  {
    label: 'Stocks',
    icon: <HiCube className="h-4 w-4" />,
    items: [
      { href: '/stocks', label: 'Stock In', icon: <HiCube className="h-4 w-4" /> },
      { href: '/stocks/out', label: 'Stock Out', icon: <HiCollection className="h-4 w-4" /> },
      { href: '/stocks/courier', label: 'Couriers', icon: <HiTruck className="h-4 w-4" /> },
      { href: '/stocks/co-loader', label: 'Co-loaders', icon: <HiOfficeBuilding className="h-4 w-4" /> },
      { href: '/stocks/booker', label: 'Bookers', icon: <HiUsers className="h-4 w-4" /> },
    ],
  },
]

function isActiveRoute(pathname: string, href: string) {
  if (href === '/') {
    return pathname === '/'
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

type SidebarContentProps = {
  pathname: string
  isCollapsed: boolean
}

function SidebarContent({ pathname, isCollapsed }: SidebarContentProps) {
  return (
    <div className="flex h-full flex-col bg-slate-950 text-slate-100">
      <div className="border-b border-slate-800 px-3 py-4">
        <Link href="/" className={isCollapsed ? 'flex items-center justify-center' : 'flex items-center gap-3'}>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/20 text-primary">
              <Image src="/favicon.ico" alt="Frontline logo" width={24} height={24} />
            </div>
            {!isCollapsed && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                  Frontline
                </p>
                <h2 className="text-base font-semibold text-white">Admin Console</h2>
              </div>
            )}
          </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-2.5 py-4">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-5 last:mb-0">
            {!isCollapsed ? (
              <div className="mb-2 flex items-center gap-2 px-2.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                {group.icon}
                <span>{group.label}</span>
              </div>
            ) : (
              <div className="mb-2 flex justify-center text-slate-500">{group.icon}</div>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const active = isActiveRoute(pathname, item.href)

                return (
                  <Link
                    href={item.href}
                    key={item.href}
                    title={isCollapsed ? item.label : undefined}
                    className={[
                      'flex items-center rounded-xl text-sm font-medium transition-colors',
                      isCollapsed ? 'justify-center px-2 py-2.5' : 'justify-between px-2.5 py-2.5',
                      active
                        ? 'bg-primary text-primary-content shadow-lg shadow-primary/20'
                        : 'text-slate-300 hover:bg-slate-900 hover:text-white',
                    ].join(' ')}
                  >
                    <span className={isCollapsed ? '' : 'flex items-center gap-3'}>
                      {item.icon}
                      {!isCollapsed && <span>{item.label}</span>}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

type AppNavbarProps = {
  isCollapsed: boolean
  onToggleCollapsed: () => void
}

export default function AppNavbar({ isCollapsed, onToggleCollapsed }: AppNavbarProps) {
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    const openSidebar = () => setIsSidebarOpen(true)

    window.addEventListener('frontline:sidebar-open', openSidebar)

    return () => {
      window.removeEventListener('frontline:sidebar-open', openSidebar)
    }
  }, [])

  useEffect(() => {
    setIsSidebarOpen(false)
  }, [router.pathname])

  return (
    <>
      <aside
        className={[
          'fixed inset-y-0 left-0 z-40 hidden border-r border-slate-800 transition-[width] duration-200 lg:block',
          isCollapsed ? 'w-14' : 'w-56',
        ].join(' ')}
      >
        <SidebarContent
          pathname={router.pathname}
          isCollapsed={isCollapsed}
        />
      </aside>

      <div
        className={[
          'fixed inset-0 z-50 bg-slate-950/60 transition-opacity lg:hidden',
          isSidebarOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
        onClick={() => setIsSidebarOpen(false)}
        aria-hidden={!isSidebarOpen}
      />

      <aside
        className={[
          'fixed inset-y-0 left-0 z-50 w-64 max-w-[82vw] transform border-r border-slate-800 transition-transform duration-200 lg:hidden',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        <button
          type="button"
          className="btn btn-circle btn-sm absolute right-3 top-3 z-10 border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close navigation"
        >
          <HiOutlineX className="h-4 w-4" />
        </button>
        <SidebarContent
          pathname={router.pathname}
          isCollapsed={false}
        />
      </aside>

    </>
  )
}
