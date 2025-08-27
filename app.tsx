"use client"

import { useState } from "react"
import { Header } from "./components/header"
import { Sidebar } from "./components/sidebar"
import { DashboardCards } from "./components/dashboard-cards"
import { UsersTable } from "./components/users-table"
import { LawyerVerificationTable } from "./components/lawyer-verification-table"
import { VerificationHistoryTable } from "./components/verification-history-table"
import { TransactionsPage } from "./components/transactions-page"
import { ContentMonitoringTable } from "./components/content-monitoring-table"
import { AiLogsTable } from "./components/ai-logs-table"
import { ApiKeyManagementTable } from "./components/api-key-management-table"
import { AddApiKeyForm } from "./components/add-api-key-form"
import { FeedbackTable } from "./components/feedback-table"
import { SettingsPage } from "./components/settings-page"
import { PoliciesPage } from "./components/policies-page"
import { AddLegalPageForm } from "./components/add-legal-page-form"
import { AddAnnouncementsForm } from "./components/add-announcements-form"
import { AddBannersForm } from "./components/add-banners-form"
// Removed AiReporterPage import as it's now a separate route

export default function App() {
  const [activeItem, setActiveItem] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showVerificationHistory, setShowVerificationHistory] = useState(false)
  const [showAddApiKeyForm, setShowAddApiKeyForm] = useState(false)
  const [showAddLegalPageForm, setShowAddLegalPageForm] = useState(false)
  const [showAddAnnouncementsForm, setShowAddAnnouncementsForm] = useState(false)
  const [showAddBannersForm, setShowAddBannersForm] = useState(false)
  // Removed showAiReportPage state

  const handleMenuClick = () => {
    setSidebarOpen(true)
  }

  const handleSidebarClose = () => {
    setSidebarOpen(false)
  }

  const handleItemClick = (itemId: string) => {
    setActiveItem(itemId)
    setShowVerificationHistory(false)
    setShowAddApiKeyForm(false)
    setShowAddLegalPageForm(false)
    setShowAddAnnouncementsForm(false)
    setShowAddBannersForm(false)
    // No need to reset showAiReportPage here as it's a separate route
  }

  const handleVerificationHistoryClick = () => {
    setShowVerificationHistory(true)
  }

  const handleBackToLawyerVerification = () => {
    setShowVerificationHistory(false)
  }

  const handleAddApiKeyClick = () => {
    setShowAddApiKeyForm(true)
  }

  const handleBackToApiKeyManagement = () => {
    setShowAddApiKeyForm(false)
  }

  const handleAddLegalPageClick = () => {
    setShowAddLegalPageForm(true)
  }

  const handleAddAnnouncementsClick = () => {
    setShowAddAnnouncementsForm(true)
  }

  const handleAddBannersClick = () => {
    setShowAddBannersForm(true)
  }

  const handleBackToPolicies = () => {
    setShowAddLegalPageForm(false)
    setShowAddAnnouncementsForm(false)
    setShowAddBannersForm(false)
  }

  // Removed handleAiReportClick as it's now handled by direct navigation

  const renderContent = () => {
    // Removed conditional rendering for AiReporterPage
    if (activeItem === "lawyer-verification" && showVerificationHistory) {
      return <VerificationHistoryTable onBack={handleBackToLawyerVerification} />
    }

    if (activeItem === "api-key-management" && showAddApiKeyForm) {
      return <AddApiKeyForm onBack={handleBackToApiKeyManagement} />
    }

    if (activeItem === "policies" && showAddLegalPageForm) {
      return <AddLegalPageForm onBack={handleBackToPolicies} />
    }

    if (activeItem === "policies" && showAddAnnouncementsForm) {
      return <AddAnnouncementsForm onBack={handleBackToPolicies} />
    }

    if (activeItem === "policies" && showAddBannersForm) {
      return <AddBannersForm onBack={handleBackToPolicies} />
    }

    switch (activeItem) {
      case "dashboard":
        return <DashboardCards />
      case "users":
        return <UsersTable />
      case "lawyers":
        return <LawyerVerificationTable onVerificationHistoryClick={handleVerificationHistoryClick} />
      case "lawyer-verification":
        return <LawyerVerificationTable onVerificationHistoryClick={handleVerificationHistoryClick} />
      case "transactions":
        return <TransactionsPage />
      case "content-monitoring":
        return <ContentMonitoringTable />
      case "ai-logs":
        return <AiLogsTable />
      case "api-key-management":
        return <ApiKeyManagementTable onAddApiKeyClick={handleAddApiKeyClick} />
      case "feedback":
        return <FeedbackTable />
      case "settings":
        return <SettingsPage />
      case "policies":
        return (
          <PoliciesPage
            onAddLegalPageClick={handleAddLegalPageClick}
            onAddAnnouncementsClick={handleAddAnnouncementsClick}
            onAddBannersClick={handleAddBannersClick}
          />
        )
      default:
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 capitalize">{activeItem.replace("-", " ")}</h1>
              <p className="text-gray-600 mt-1">This page is under construction.</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <p className="text-gray-500">Content for {activeItem.replace("-", " ")} will be added soon.</p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        activeItem={activeItem}
        isOpen={sidebarOpen}
        onClose={handleSidebarClose}
        onItemClick={handleItemClick}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Header */}
        <Header onMenuClick={handleMenuClick} />

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">{renderContent()}</main>
      </div>
    </div>
  )
}
