"use client"

import { User, Settings, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils" // Assuming cn utility is available

interface AiReporterSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function AiReporterSidebar({ isOpen, onClose }: AiReporterSidebarProps) {
  const pathname = usePathname()

  const menuItems = [
    { id: "profile", label: "Profile", icon: User, href: "/ai-reporter" }, // Main AI Reporter page
    { id: "settings", label: "Settings", icon: Settings, href: "/ai-reporter/settings" },
  ]

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0",
          "flex flex-col h-full",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
        style={{ backgroundColor: "#F5F5F5" }}
      >
        {/* Logo/Brand */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <span className="text-lg font-semibold text-gray-900">AI Reporter</span>
          </div>

          {/* Close button for mobile */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 flex-1 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className={cn(
                      "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors",
                      isActive
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:bg-white hover:text-gray-900",
                    )}
                    onClick={onClose} // Close sidebar on mobile after selection
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </>
  )
}
