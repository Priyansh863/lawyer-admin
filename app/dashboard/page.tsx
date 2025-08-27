"use client"
import { useSession } from "next-auth/react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { DashboardStats } from "@/components/dashboard-stats"
import { UserRolesChart } from "@/components/user-roles-chart"
import { RecentActivity } from "@/components/recent-activity"
import { Search, Settings, Bell } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ToastTest } from "@/components/toast-test"

export default function DashboardPage() {
  const { data: session } = useSession() as any

  const getUserDisplayName = () => {
    if (session?.user?.first_name && session?.user?.last_name) {
      return `${session?.user?.first_name} ${session?.user?.last_name}`
    }
    if (session?.user?.first_name) {
      return session?.user?.first_name
    }
    return session?.email?.split('@')[0] || 'Admin User'
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">{getUserDisplayName()}</span>
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gray-900 text-white text-sm">
                    {session?.user?.email?.slice(0, 2).toUpperCase() || "JX"}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            </div>

            {/* Stats Cards */}
            <DashboardStats />


            {/* Charts and Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <UserRolesChart />
              <RecentActivity />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
