/* eslint-disable @next/next/no-html-link-for-pages */
import { useUser } from "@auth0/nextjs-auth0";
import { useEffect } from "react"
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
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;


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
        <a href="#"> Frontline Admin v3.0</a>
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
              <li> <a className="md:p-4 py-2 block hover:bg-secondary" href="/bookings/quick">Quick Booking</a> </li>
              <li> <a className="md:p-4 py-2 block hover:bg-secondary" href="/bookings">Booking</a> </li>
              <li> <a className="md:p-4 py-2 block hover:bg-secondary" href="/stocks">Stock Entry</a> </li>
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
                  <div tabIndex={0} className="m-1 btn btn-secondary"><BiUserCircle className="inline h-6 w-6 animate-pulse" /></div>
                  <ul tabIndex={0} className="p-2 shadow menu dropdown-content bg-white text-primary rounded-box w-52">
                    <li>
                      <a>Logged as {user.nickname || user.name || user.email}</a>
                    </li>
                    <li>
                      <a> <RiSettings5Line/> &nbsp; Settings</a>
                    </li>
                    <li>
                      <a href="/api/auth/logout"> <RiLogoutBoxRLine/> &nbsp; Logout</a>
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
    </nav>
  )
}
