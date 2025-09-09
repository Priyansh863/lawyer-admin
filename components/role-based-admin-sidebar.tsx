"use client"
import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  LayoutDashboard,
  Users,
  Shield,
  CreditCard,
  FileText,
  Database,
  Key,
  MessageSquare,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ScrollText,
  FileSearch,
  Cog
} from "lucide-react"
import { useTranslation } from "@/hooks/useTranslation"

const adminSidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    translationKey: "dashboard"
  },
  {
    title: "Users",
    href: "/users",
    icon: Users,
    translationKey: "users"
  },
  {
    title: "Lawyer Verification",
    href: "/lawyer-verification",
    icon: Shield,
    translationKey: "lawyerVerification"
  },
  {
    title: "Transactions",
    href: "/transactions",
    icon: CreditCard,
    translationKey: "transactions"
  },
  {
    title: "Content Monitoring",
    href: "/content-monitoring",
    icon: FileText,
    translationKey: "contentMonitoring"
  },
  {
    title: "Policies",
    href: "/policies",
    icon: ScrollText,
    translationKey: "policies"
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    translationKey: "settings"
  },
]

const aiReporterSidebarItems = [
  {
    title: "AI Reporter Dashboard",
    href: "/ai-reporter",
    icon: FileSearch,
    translationKey: "aiReporterDashboard"
  },
  {
    title: "AI Reporter Settings",
    href: "/ai-reporter/settings",
    icon: Cog,
    translationKey: "aiReporterSettings"
  },
]

export function RoleBasedAdminSidebar() {
  const { t } = useTranslation()
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [sidebarItems, setSidebarItems] = useState(adminSidebarItems)

  useEffect(() => {
    if (session?.user) {
      setUserData(session.user)
      
      // Set sidebar items based on user role
      const userRole = (session.user as any)?.account_type
      if (userRole === 'ai_reporter') {
        setSidebarItems(aiReporterSidebarItems)
      } else {
        setSidebarItems(adminSidebarItems)
      }
    }
  }, [session])

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" })
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  }

  const getUserDisplayName = () => {
    if (userData?.first_name && userData?.last_name) {
      return `${userData.first_name} ${userData.last_name}`
    }
    if (userData?.first_name) {
      return userData.first_name
    }
    return userData?.email?.split('@')[0] || t('pages:sidebar.adminUser')
  }

  const getUserRole = () => {
    const userRole = userData?.account_type
    if (userRole === 'ai_reporter') {
      return t('pages:sidebar.aiReporter')
    }
    if (userRole === 'admin') {
      return t('pages:sidebar.superAdmin')
    }
    return t('pages:sidebar.admin')
  }

  const getUserInitials = () => {
    if (userData?.first_name && userData?.last_name) {
      return `${userData.first_name[0]}${userData.last_name[0]}`.toUpperCase()
    }
    if (userData?.first_name) {
      return userData.first_name.slice(0, 2).toUpperCase()
    }
    return userData?.email?.slice(0, 2).toUpperCase() || 'AU'
  }

  const getUserImage = () => {
    return userData?.profile_image || null
  }

  return (
    <div className={cn(
      "flex flex-col h-screen bg-white border-r border-gray-200 transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8 bg-gray-900">
              {getUserImage() ? (
                <AvatarImage src={getUserImage()} alt={t('pages:sidebar.userAvatarAlt')} />
              ) : null}
              <AvatarFallback className="text-white text-sm font-medium">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900">{getUserDisplayName()}</span>
              <span className="text-xs text-gray-500">{getUserRole()}</span>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 p-0"
          title={collapsed ? t('pages:sidebar.expandSidebar') : t('pages:sidebar.collapseSidebar')}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          const translatedTitle = t(`pages:sidebar.${item.translationKey}`) || item.title
          
          return (
            <Button
              key={item.href}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start text-left font-normal",
                collapsed ? "px-2" : "px-3",
                isActive && "bg-gray-100 text-gray-900"
              )}
              onClick={() => router.push(item.href)}
              title={!collapsed ? undefined : translatedTitle}
            >
              <Icon className={cn("h-4 w-4", collapsed ? "mr-0" : "mr-3")} />
              {!collapsed && <span>{translatedTitle}</span>}
            </Button>
          )
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-left font-normal text-red-600 hover:text-red-700 hover:bg-red-50",
            collapsed ? "px-2" : "px-3"
          )}
          onClick={handleLogout}
          title={collapsed ? t('pages:sidebar.logout') : undefined}
        >
          <LogOut className={cn("h-4 w-4", collapsed ? "mr-0" : "mr-3")} />
          {!collapsed && <span>{t('pages:sidebar.logout')}</span>}
        </Button>
      </div>
    </div>
  )
}