"use client"
import {
  LayoutDashboard,
  Users,
  Shield,
  CreditCard,
  Monitor,
  Bot,
  FileText,
  Key,
  MessageSquare,
  Settings,
  X,
  FileSearch,
  Cog,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface SidebarProps {
  activeItem?: string
  isOpen: boolean
  onClose: () => void
  onItemClick: (itemId: string) => void
}

const adminMenuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "users", label: "Clients", icon: Users },
  { id: "lawyers", label: "Lawyers", icon: Shield },
  { id: "transactions", label: "Transactions", icon: CreditCard },
  { id: "content-monitoring", label: "Content Monitoring", icon: Monitor },
  { id: "policies", label: "Policies", icon: FileText },
  { id: "settings", label: "Settings", icon: Settings },
]

const aiReporterMenuItems = [
  { id: "ai-reporter", label: "AI Reporter Dashboard", icon: FileSearch },
  { id: "ai-reporter-settings", label: "AI Reporter Settings", icon: Cog },
]

export function RoleBasedSidebar({ activeItem = "dashboard", isOpen, onClose, onItemClick }: SidebarProps) {
  const [userRole, setUserRole] = useState<string>("")
  const [menuItems, setMenuItems] = useState(adminMenuItems)
  const [sidebarTitle, setSidebarTitle] = useState("Super Admin")

  useEffect(() => {
    // Get user role from localStorage
    const userStr = localStorage.getItem("user")
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        const role = user?.account_type || ""
        setUserRole(role)
        
        if (role === "ai_reporter") {
          setMenuItems(aiReporterMenuItems)
          setSidebarTitle("AI Reporter")
        } else {
          setMenuItems(adminMenuItems)
          setSidebarTitle("Super Admin")
        }
      } catch (error) {
        console.error("Error parsing user data:", error)
        setMenuItems(adminMenuItems)
        setSidebarTitle("Super Admin")
      }
    }
  }, [])

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
            <span className="text-lg font-semibold text-gray-900">{sidebarTitle}</span>
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
              const isActive = activeItem === item.id

              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onItemClick(item.id)
                      onClose() // Close sidebar on mobile after selection
                    }}
                    className={cn(
                      "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors",
                      isActive
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:bg-white hover:text-gray-900",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </>
  )
}
