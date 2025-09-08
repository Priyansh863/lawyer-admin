"use client"

import { usePathname } from "next/navigation"
import { RoleBasedAdminSidebar } from "@/components/role-based-admin-sidebar"
import { AdminHeader } from "@/components/admin-header"
import { AiReporterContent } from "@/components/ai-reporter/ai-reporter-content"
import { AiReporterSettingsPage } from "@/components/ai-reporter/ai-reporter-settings-page"

export default function AiReporterApp() {
  const pathname = usePathname()

  const renderMainContent = () => {
    if (pathname === "/ai-reporter/settings") {
      return <AiReporterSettingsPage />
    }
    // Default to AiReporterContent for /ai-reporter or any other path
    return <AiReporterContent />
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Role-based Sidebar */}
      <RoleBasedAdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Admin Header */}
        <AdminHeader />

        {/* AI Reporter Page Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">{renderMainContent()}</main>
      </div>
    </div>
  )
}
