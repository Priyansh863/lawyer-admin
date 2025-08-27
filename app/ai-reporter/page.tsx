"use client"

import { usePathname } from "next/navigation" // Import usePathname
import { AiReporterSidebar } from "@/components/ai-reporter/ai-reporter-sidebar"
import { AiReporterHeader } from "@/components/ai-reporter/ai-reporter-header"
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
      {/* AI Reporter Specific Sidebar */}
      <AiReporterSidebar />

      {/* Main Content Area for AI Reporter */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* AI Reporter Specific Header */}
        <AiReporterHeader />

        {/* AI Reporter Page Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">{renderMainContent()}</main>
      </div>
    </div>
  )
}
