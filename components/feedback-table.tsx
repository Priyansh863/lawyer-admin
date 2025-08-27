"use client"

import { useEffect, useState } from "react"
import { Search, ChevronDown, Download, Eye } from "lucide-react"

export function FeedbackTable() {
  const [feedbackData, setFeedbackData] = useState([])
  const [loading, setLoading] = useState(true)
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchFeedback = async () => {
      setLoading(true)
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 700)) // Simulate network delay
        const res = await fetch("/api/feedback") // 🔁 Replace with your real API route
        const data = await res.json()
        setFeedbackData(data)
      } catch (error) {
        console.error("Failed to fetch feedback data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchFeedback()
  }, [])

  const filteredFeedback = feedbackData.filter((item) => {
    const matchesSearch =
      item.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "All" || item.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6" style={{ fontFamily: "Montserrat, sans-serif" }}>
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Feedback</h1>
        <p className="text-gray-600 mt-1">Feedback list</p>
      </div>

      {/* Filters and Actions Container */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by name"
              className="pl-10 pr-4 py-2 w-full sm:w-80 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                className="flex items-center border border-gray-300 px-3 py-2 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
                aria-haspopup="true"
                aria-expanded={isStatusDropdownOpen}
              >
                <span>{selectedStatus}</span>
                <ChevronDown className="h-4 w-4 ml-2" />
              </button>
              {isStatusDropdownOpen && (
                <div className="absolute z-10 mt-2 w-40 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {["All", "New", "Reviewed"].map((statusOption) => (
                    <button
                      key={statusOption}
                      onClick={() => {
                        setSelectedStatus(statusOption)
                        setIsStatusDropdownOpen(false)
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {statusOption}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              className="flex items-center border border-gray-300 px-3 py-2 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Feedback Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">
                Submitted At
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="p-6 text-center text-gray-500">
                  Loading feedback...
                </td>
              </tr>
            ) : filteredFeedback.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-6 text-center text-gray-500">
                  No feedback found.
                </td>
              </tr>
            ) : (
              filteredFeedback.map((item, index) => (
                <tr key={item.id} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                  <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">{item.id}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.user.avatar || "/placeholder.svg?height=32&width=32"}
                        alt={item.user.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      <span className="font-medium text-gray-900">{item.user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600">{item.role}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600">{item.type}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600">{item.message}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600 hidden sm:table-cell">{item.submittedAt}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        item.status === "New"
                          ? "bg-green-100 text-green-800"
                          : item.status === "Reviewed"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button
                      type="button"
                      className="p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-200"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
