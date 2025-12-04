// import useAuth from '@/hooks/useAuth'
import logo from '../assets/logo.png'
import {
  LayoutDashboard,
  Package,
  Settings,
  Ship,
  Wallet
} from 'lucide-react'
import { Link, NavLink, useParams } from 'react-router-dom'

interface SideNavProps {
  isToggled: boolean
}

const SideNav = ({ isToggled }: SideNavProps) => {
  // const {auth} = useAuth()
  const { store } = useParams()

  return (
    <nav
      className={`fixed ${
        isToggled === true ? 'lg:w-[4rem] md:w-[220px]' : 'lg:w-[220px]'
      } w-[4rem] top-0 bottom-0 z-50 py-3 backdrop-blur-lg border-r border-neutral-100/80 overflow-hidden transition-all ease-in-out duration-500`}
    >
      <div className="px-4 mx-auto relative text-sm">
        <div className="flex flex-col items-start">
          {/* LOGO */}
          <Link to="/" className="flex items-center flex-shrink-0 mb-8">
            <img src={logo} alt="logo" className="h-10 w-10 mr-4" />
            <span className="text-xl tracking-tight text-nowrap">CLIXMART</span>
          </Link>

          {/* DASHBOARD */}
          <NavLink
            to={`/dashboard/${store}`}
            className="pl-1 py-2 flex items-center flex-shrink-0 mb-4 text-muted-foreground"
          >
            <LayoutDashboard className="h-6 w-6 mr-6" />
            <span>Dashboard</span>
          </NavLink>

          {/* PRODUCTS */}
          <NavLink
            to={`/products/${store}`}
            className="pl-1 py-2 flex items-center flex-shrink-0 mb-4 text-muted-foreground"
          >
            <Package className="h-6 w-6 mr-6" />
            <span>Products</span>
          </NavLink>

          {/* ORDERS */}
          <NavLink
            to={`/orders/${store}`}
            className="pl-1 py-2 flex items-center flex-shrink-0 mb-4 text-muted-foreground"
          >
            <Ship className="h-6 w-6 mr-6" />
            <span>Orders</span>
          </NavLink>

          {/* FINANCE — NEW */}
          <NavLink
            to={`/finance/${store}`}
            className="pl-1 py-2 flex items-center flex-shrink-0 mb-4 text-muted-foreground"
          >
            <Wallet className="h-6 w-6 mr-6" />
            <span>Finance</span>
          </NavLink>

          {/* SETTINGS */}
          <NavLink
            to={`/settings/${store}`}
            className="pl-1 py-2 flex items-center flex-shrink-0 mb-4 text-muted-foreground"
          >
            <Settings className="h-6 w-6 mr-6" />
            <span>Settings</span>
          </NavLink>
        </div>
      </div>
    </nav>
  )
}

export default SideNav
