"use client"

import { useEffect, useState } from "react"
import { Search, ChevronDown, Download, Eye, Pencil, Check, FileText, Calendar, Clock } from "lucide-react"

export function AiReporterPage() {
  const [metricsData, setMetricsData] = useState([])
  const [reportsData, setReportsData] = useState([])
  const [loading, setLoading] = useState(true)
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 700))

        // Dummy data for metrics
        const simulatedMetrics = [
          {
            title: "Articles Written",
            value: "482",
            icon: FileText,
          },
          {
            title: "Last Active",
            value: "May 29, 2025",
            icon: Calendar,
          },
          {
            title: "Generation Mode",
            value: "Daily (9 AM)",
            icon: Clock,
          },
        ]
        setMetricsData(simulatedMetrics)

        // Dummy data for reports table
        const simulatedReports = [
          {
            id: "A128",
            title: "Understanding Bail in Criminal Law",
            tags: "Criminal, Bail",
            created: "12/10/2022",
            status: "Published",
          },
          {
            id: "A129",
            title: "The Role of Expert Witnesses",
            tags: "Litigation, Evidence",
            created: "11/25/2022",
            status: "Draft",
          },
          {
            id: "A130",
            title: "Intellectual Property Rights",
            tags: "IP, Copyright",
            created: "10/15/2022",
            status: "Published",
          },
          {
            id: "A131",
            title: "Contract Law Basics",
            tags: "Contracts, Business",
            created: "09/01/2022",
            status: "Draft",
          },
        ]
        setReportsData(simulatedReports)
      } catch (error) {
        console.error("Failed to fetch AI Report data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredReports = reportsData.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.tags.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "All" || report.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6" style={{ fontFamily: "Montserrat, sans-serif" }}>
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Legal Reporter</h1>
        <p className="text-gray-600 mt-1">Automated summarization</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center text-gray-500 p-8">Loading metrics...</div>
        ) : (
          metricsData.map((item, index) => {
            const Icon = item.icon
            return (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                  {Icon && <Icon className="h-5 w-5 text-gray-400" />}
                </div>
                <div className="text-sm font-medium text-gray-600">{item.title}</div>
                <div className="text-2xl font-bold text-gray-900 mt-1">{item.value}</div>
              </div>
            )
          })
        )}
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
                  {["All", "Published", "Draft"].map((statusOption) => (
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

      {/* AI Reports Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tags</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  Loading AI reports...
                </td>
              </tr>
            ) : filteredReports.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  No AI reports found.
                </td>
              </tr>
            ) : (
              filteredReports.map((report, index) => (
                <tr key={report.id} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                  <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">{report.id}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600">{report.title}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600">{report.tags}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600">{report.created}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        report.status === "Published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      <button
                        type="button"
                        className="p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-200"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-200"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      {report.status === "Draft" && (
                        <button
                          type="button"
                          className="p-2 rounded-md text-green-600 hover:bg-green-50 hover:text-green-700 focus:outline-none focus:ring-2 focus:ring-green-200"
                          title="Mark as Published"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                    </div>
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
