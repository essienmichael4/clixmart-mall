"use client"

import { useState, useRef, useEffect } from "react"
import { Menu, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <header className="border-b border-border bg-card">
      <div className="flex items-center justify-between px-8 py-4">
        {/* Left: Menu button */}
        <Button variant="ghost" size="icon" onClick={onMenuClick} className="md:hidden">
          <Menu className="w-5 h-5" />
        </Button>

        {/* Center: Title (can be dynamic based on page) */}
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>

        {/* Right: User profile dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-full bg-sidebar-accent hover:bg-sidebar-primary/20 p-2 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-bold text-sm">
              JD
            </div>
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-medium text-foreground">John Doe</p>
                <p className="text-xs text-muted-foreground">john@example.com</p>
              </div>
              <button className="w-full flex items-center gap-2 px-4 py-3 text-foreground hover:bg-sidebar-accent transition-colors text-sm">
                <User className="w-4 h-4" />
                Profile
              </button>
              <button
                onClick={() => {
                  setDropdownOpen(false)
                  // Handle logout here
                }}
                className="w-full flex items-center gap-2 px-4 py-3 text-destructive hover:bg-destructive/10 transition-colors text-sm border-t border-border"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
