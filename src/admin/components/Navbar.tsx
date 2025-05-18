/* eslint-disable @next/next/no-html-link-for-pages */
import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect } from 'react'
import { BiUserCircle } from 'react-icons/bi';
import { RiLogoutBoxRLine, RiSettings5Line } from 'react-icons/ri'

// reference: https://codepen.io/hulyak/pen/yLbwXvB
export default function AppNavbar() {

  useEffect(() => {
    const button = document?.querySelector('#menu-button');
    const menu = document?.querySelector('#menu');

    button?.addEventListener('click', () => {
      menu?.classList.toggle('hidden');
    });
  })

  const { user, error, isLoading } = useUser();
  if (isLoading) return (
    <div className="flex justify-center items-center h-16 bg-primary">
      <span className="loading loading-spinner loading-lg text-white"></span>
    </div>
  );
  if (error) return (
    <div className="alert alert-error">
      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      <span>{error.message}</span>
    </div>
  );


  return (
    <nav
      className="
          flex flex-wrap
          items-center
          justify-between
          w-full
          py-4
          md:py-0
          px-4
          text-2xl font-bold text-gray-200
          bg-primary"
    >
      <div>
        <a href="/"> Frontline Admin v3.0</a>
      </div>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        id="menu-button"
        className="h-6 w-6 cursor-pointer md:hidden block"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>

      <div className="hidden w-full md:flex md:items-center md:w-auto" id="menu">
        <ul
          className="
              pt-4
              text-base text-white
              md:flex
              md:justify-between 
              md:pt-0">
          {user &&
            <>
              {/* <li> <a className="md:p-4 py-2 block hover:bg-secondary" href="/dashboard">Dashboard</a> </li> */}
              {/* <li> <a className="md:p-4 py-2 block hover:bg-secondary" href="/bookings/quick">Quick Booking</a> </li> */}
              <li> <a className="md:p-4 py-2 block hover:bg-secondary" href="/bookings">Booking Entry</a> </li>
              <li> <a className="md:p-4 py-2 block hover:bg-secondary" href="/booking-rates">Booking Rates</a> </li>

              <li>
                <div className="dropdown cursor-pointer">
                  <div tabIndex={0} className="md:p-4 py-2 block hover:bg-secondary flex items-center">
                    Courier
                    <svg className="fill-current h-4 w-4 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /> </svg>
                  </div>
                  <ul tabIndex={0} className="p-2 shadow menu dropdown-content bg-white text-primary rounded-box w-52 z-[1]">
                    <li><a className="md:p-4 py-2 block" href="/couriers">List</a></li>
                    <li><a className="md:p-4 py-2 block" href="/courier-volumetric-mappings">Volumetric Mappings</a></li>
                    <li><a className="md:p-4 py-2 block" href="/courier-zone-rates">Zone Rates</a></li>
                  </ul>
                </div>
              </li>

              <li> <a className="md:p-4 py-2 block hover:bg-secondary" href="/volumetric-calculator">Volumetric Calculator</a> </li>

              <li>
                <div className="dropdown cursor-pointer">
                  <div tabIndex={0} className="md:p-4 py-2 block hover:bg-secondary flex items-center">
                    Credit
                    <svg className="fill-current h-4 w-4 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /> </svg>
                  </div>
                  <ul tabIndex={0} className="p-2 shadow menu dropdown-content bg-white text-primary rounded-box w-52 z-[1]">
                    <li> <a className="md:p-4 py-2 block" href="/credit">Entry</a> </li>
                    <li> <a className="md:p-4 py-2 block" href="/credit/reports">Reports</a> </li>
                  </ul>
                </div>
              </li>
              <li>
                <div className="dropdown cursor-pointer">
                  <div tabIndex={0} className="md:p-4 py-2 block hover:bg-secondary flex items-center">
                    Stock
                    <svg className="fill-current h-4 w-4 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /> </svg>
                  </div>
                  <ul tabIndex={0} className="p-2 shadow menu dropdown-content bg-white text-primary rounded-box w-52 z-[1]">
                    <li> <a className="md:p-4 py-2 block" href="/stocks">Stock In</a> </li>
                    <li> <a className="md:p-4 py-2 block" href="/stocks/out">Stock Out</a> </li>
                  </ul>
                </div>
              </li>
              {/* <li>
              <a className="md:p-4 py-2 block hover:bg-secondary" href="/bookings"
              >Reporting</a
              >
            </li> */}
              {/* <li className="hidden md:block">
              <a
                className="md:p-4 py-2 block text-white"
                href="#"
              > Welcome, {user.nickname || user.name || user.email} </a
              >
            </li> */}
              <li>
                <div className="dropdown dropdown-end">
                  <div tabIndex={0} className="m-1 btn btn-secondary flex items-center gap-2">
                    <BiUserCircle className="h-6 w-6" />
                    <span className="hidden md:inline text-xs">Account</span>
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /> </svg>
                  </div>
                  <ul tabIndex={0} className="p-2 shadow menu dropdown-content bg-white text-primary rounded-box w-64 z-[1]">
                    <li className="border-b border-gray-200 pb-2">
                      <a className="flex flex-col">
                        <span className="text-xs text-gray-500">Logged in as:</span>
                        <span className="font-semibold">{user.nickname || user.name || user.email}</span>
                      </a>
                    </li>
                    <li>
                      <a className="flex items-center gap-2 mt-2">
                        <RiSettings5Line className="text-gray-600" /> Settings
                      </a>
                    </li>
                    <li>
                      <a href="/api/auth/logout" className="flex items-center gap-2 text-red-500">
                        <RiLogoutBoxRLine /> Logout
                      </a>
                    </li>
                  </ul>
                </div>
              </li>
            </>
          }
          {
            !user &&
            <li>
              <a
                className="md:p-4 py-2 block hover:bg-secondary text-white font-bold"
                href="/api/auth/login"> Login</a>
            </li>
          }
        </ul>
      </div>
    </nav >
  )
}
