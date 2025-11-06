"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useMediaQuery } from "react-responsive"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { cn } from "@/lib/utils"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const isDesktop = useMediaQuery({ query: "(min-width: 768px)" })
  const [sidebarOpen, setSidebarOpen] = useState(isDesktop)

  useEffect(() => {
    setSidebarOpen(isDesktop)
  }, [isDesktop])

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Overlay for mobile */}
      {!isDesktop && sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header 
          onMenuButtonClick={() => setSidebarOpen((prev) => !prev)}
          showMenuButton={!isDesktop}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}