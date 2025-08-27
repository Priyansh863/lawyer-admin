"use client"
import { useSession } from "next-auth/react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { DashboardStats } from "@/components/dashboard-stats"
import { UserRolesChart } from "@/components/user-roles-chart"
import { RecentActivity } from "@/components/recent-activity"

import { AdminHeader } from "@/components/admin-header";


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
      <AdminHeader />

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
