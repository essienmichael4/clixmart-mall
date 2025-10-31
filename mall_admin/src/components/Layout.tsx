import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"
import SideNav from "./SideNav"
import { useState } from "react"

const Layout = () => {
  const [isToggled, setIsToggled] = useState(false)
  const toggleNavbar = ()=>{

    setIsToggled(!isToggled)
    console.log(isToggled);
    
  }
  return (
    <>
        <SideNav isToggled={isToggled} />
        <main className={`${isToggled ? 'lg:w-[calc(100%-4rem)] lg:ml-[4rem] md:w-[calc(100%-4rem)] md:ml-[4rem] ml-[4rem]' : 'lg:w-[calc(100%-220px)] lg:ml-[220px] ml-[220px]'} transition-all ease-in-out duration-500`}>
          <Navbar toggleNavbar={toggleNavbar}/>
          <Outlet />
        </main>
    </>
  )
}

export default Layout
