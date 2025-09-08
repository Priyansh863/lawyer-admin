"use client"

import { useState } from "react"
import { Search, ChevronDown, Menu } from "lucide-react"
import Image from "next/image" // Using Next.js Image component
import Link from "next/link"
interface AiReporterHeaderProps {
  onMenuClick: () => void
}

export function AiReporterHeader({ onMenuClick }: AiReporterHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            onClick={onMenuClick}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-md hidden sm:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search for anything..."
              className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* Mobile Search Button */}
          <button
            type="button"
            className="sm:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-label="Search"
          >
            <Search className="h-5 w-5 text-gray-600" />
          </button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 lg:space-x-3 p-2 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
              aria-haspopup="true"
              aria-expanded={isDropdownOpen}
            >
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-gray-900">Anima Agr</div>
                <div className="text-xs text-gray-500">korea XXX</div>
                
              </div>
              <Image
                src="/placeholder.svg?height=32&width=32"
                alt="User Avatar"
                className="h-8 w-8 rounded-full object-cover"
                width={32}
                height={32}
              />
              <ChevronDown className="h-4 w-4 text-gray-400 hidden sm:block" />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button">
                  <Link
                    href="/ai-reporter/settings" // Changed to AI Reporter settings page
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Profile Settings
                  </Link>
                  <Link
                    href="/" // Link to the main super admin panel
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Admin Panel
                  </Link>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                    Sign out
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
