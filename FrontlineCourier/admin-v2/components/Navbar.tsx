/* eslint-disable @next/next/no-html-link-for-pages */
import { useUser } from "@auth0/nextjs-auth0";
import { useEffect } from "react"

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
            <li> <a className="md:p-4 py-2 block hover:bg-secondary" href="/bookings">Booking</a> </li>
            <li> <a className="md:p-4 py-2 block hover:bg-secondary" href="/reports">Reports</a> </li>
            {/* <li>
              <a className="md:p-4 py-2 block hover:bg-secondary" href="/bookings"
              >Reporting</a
              >
            </li> */}
            <li className="hidden md:block">
              <a
                className="md:p-4 py-2 block text-white"
                href="#"
              > Welcome, {user.nickname || user.name || user.email} </a
              >
            </li>
            <li>
              <a
                className="md:p-4 py-2 block hover:bg-error text-white font-bold"
                href="/api/auth/logout"
              >  Logout </a
              >
            </li>
            </>
          }
          {
            !user &&
            <li>
              <a
                className="md:p-4 py-2 block hover:bg-secondary text-white font-bold"
                href="/api/auth/login"
              > Login</a
              >
            </li>
          }
        </ul>
      </div>
    </nav>
  )
}
