import AppNavbar from './Navbar'
// import Footer from './footer'

export default function Layout({ children }: any) {
  return (
    <>
      <AppNavbar />
      <main>{children}</main>
      {/* <Footer /> */}
    </>
  )
}