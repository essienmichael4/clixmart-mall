"use client"

import { useLocation, useNavigate } from "react-router-dom"
import { LayoutDashboard, BarChart3, Truck, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Statistics", href: "/statistics", icon: BarChart3 },
  { name: "Delivery", href: "/delivery", icon: Truck },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar({ open }: { open: boolean }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <div
      className={cn(
        "fixed md:relative inset-y-0 left-0 z-40 transition-all duration-300 bg-sidebar border-r border-sidebar-border",
        open ? "w-64" : "w-0 md:w-20",
      )}
    >
      <div className="flex flex-col h-full p-4">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <div
            className={cn(
              "rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-center px-3 py-2 w-full",
              !open && "hidden md:flex",
            )}
          >
            <span className="text-xs leading-tight">CLIXMART MALL DELIVERY</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <button
                key={item.href}
                onClick={() => navigate(item.href)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent",
                  !open && "md:justify-center md:px-0",
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {open && <span>{item.name}</span>}
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
