"use client"

import { useEffect, useState } from "react"
import { Search, ChevronDown, Download } from "lucide-react"

interface VerificationHistoryTableProps {
  onBack: () => void
}

export function VerificationHistoryTable({ onBack }: VerificationHistoryTableProps) {
  const [historyData, setHistoryData] = useState([])
  const [loading, setLoading] = useState(true)
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true)
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 700)) // Simulate network delay
        const res = await fetch("/api/verification-history") // 🔁 Replace with your real API route
        const data = await res.json()
        setHistoryData(data)
      } catch (error) {
        console.error("Failed to fetch verification history:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [])

  const filteredHistory = historyData.filter((record) => {
    const matchesSearch =
      record.changedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.comment.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "All" || record.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6" style={{ fontFamily: "Montserrat, sans-serif" }}>
      {/* Page Header */}
      <div>
        <button onClick={onBack} className="text-blue-500 hover:text-blue-700">
          &larr; Back to Lawyer Verification
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Verification Status History</h1>
        <p className="text-gray-600 mt-1">Verification Status History list</p>
      </div>

      {/* Filters and Actions Container */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by name or comment"
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
                  {["All", "Active", "Pending", "Rejected"].map((statusOption) => (
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

      {/* Verification History Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Changed By</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Comment</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date/Time</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-500">
                  Loading history...
                </td>
              </tr>
            ) : filteredHistory.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-500">
                  No verification history found.
                </td>
              </tr>
            ) : (
              filteredHistory.map((record, index) => (
                <tr key={record.id} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        record.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : record.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-900 font-medium">{record.changedBy}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600">{record.comment}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600">{record.dateTime}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
