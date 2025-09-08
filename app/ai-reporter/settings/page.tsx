"use client"

import { useState } from "react"
import { AiReporterSettingsPage } from "@/components/ai-reporter/ai-reporter-settings-page"
import { AiReporterSidebar } from "@/components/ai-reporter/ai-reporter-sidebar"
import { AiReporterHeader } from "@/components/ai-reporter/ai-reporter-header"
import { AdminHeader } from "@/components/admin-header"
import { RoleBasedAdminSidebar } from "@/components/role-based-admin-sidebar"

export default function AiReporterSettingsRoute() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleMenuClick = () => {
    setSidebarOpen(true)
  }

  const handleSidebarClose = () => {
    setSidebarOpen(false)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* AI Reporter Specific Sidebar */}
      <RoleBasedAdminSidebar />

      {/* Main Content Area for AI Reporter */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* AI Reporter Specific Header */}
        <AdminHeader />

        {/* AI Reporter Page Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <AiReporterSettingsPage />
        </main>
      </div>
    </div>
  )
}
