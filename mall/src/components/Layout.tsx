import { Outlet } from "react-router-dom"
import Header from "./Header"

const Layout = () => {
  return (
    <>
      <Header />
      <div className="container mx-auto px-4">
        <Outlet />
      </div>
    </>
  )
}

export default Layout
