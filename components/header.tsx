"use client"

import { useState, useEffect } from "react"
import { Search, Settings, Bell, ChevronDown, Menu, LogOut, User } from "lucide-react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

interface HeaderProps {
  onMenuClick: () => void
  // Removed onAiReportClick as it's now handled by Link
}

export function Header({ onMenuClick }: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    if (session?.user) {
      setUserData(session.user)
    }
  }, [session])

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false })
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of the admin panel.",
        variant: "default",
      })
      router.push('/login')
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was an error logging you out. Please try again.",
        variant: "destructive",
      })
    }
    setIsDropdownOpen(false)
  }

  const getUserDisplayName = () => {
    if (userData?.first_name && userData?.last_name) {
      return `${userData.first_name} ${userData.last_name}`
    }
    return userData?.email?.split('@')[0] || 'Admin User'
  }

  const getUserRole = () => {
    return userData?.account_type === 'admin' ? 'Super Admin' : 'Admin'
  }

  const getUserImage = () => {
    return userData?.profile_image || '/placeholder.svg?height=32&width=32'
  }

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

          <button
            type="button"
            className="hidden sm:flex p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5 text-gray-600" />
          </button>

          <button
            type="button"
            className="relative p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
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
                <div className="text-sm font-medium text-gray-900">{getUserDisplayName()}</div>
                <div className="text-xs text-gray-500">{getUserRole()}</div>
              </div>
              <img
                src={getUserImage()}
                alt="User Avatar"
                className="h-8 w-8 rounded-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg?height=32&width=32'
                }}
              />
              <ChevronDown className="h-4 w-4 text-gray-400 hidden sm:block" />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{getUserDisplayName()}</div>
                        <div className="text-xs text-gray-500">{userData?.email}</div>
                      </div>
                    </div>
                  </div>
                  <Link
                    href="/settings"
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                  <Link
                    href="/ai-reporter"
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <Bell className="h-4 w-4" />
                    <span>AI Report</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t border-gray-100"
                    role="menuitem"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
