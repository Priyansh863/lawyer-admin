"use client"

import { useEffect, useState } from "react"
import { Search, ChevronDown, Download, Eye, Check, X } from "lucide-react"
import axios from '../lib/axiosInstance';
import API_ROUTES from '../lib/apiRoutes';

interface ContentItem {
  _id: string;
  author: string;
  type: string;
  title: string;
  status: string;
  created_at: string;
  updated_at?: string;
}

export function ContentMonitoringTable() {
  const [contentData, setContentData] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true)
      try {
        const res = await axios.get(API_ROUTES.CONTENT)
        setContentData(res.data)
      } catch (error) {
        console.error('Failed to fetch content data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchContent()
  }, [])

  const filteredContent = contentData.filter((item: ContentItem) => {
    const matchesSearch =
      (item.author && item.author.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = selectedStatus === "All" || item.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6" style={{ fontFamily: "Montserrat, sans-serif" }}>
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Content Monitoring</h1>
        <p className="text-gray-600 mt-1">Content Monitoring list.</p>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by name or title"
              className="pl-10 pr-4 py-2 w-full sm:w-80 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            {/* <div className="relative">
              <button
                type="button"
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                className="flex items-center border border-gray-300 px-3 py-2 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                <span>{selectedStatus}</span>
                <ChevronDown className="h-4 w-4 ml-2" />
              </button>
              {isStatusDropdownOpen && (
                <div className="absolute z-10 mt-2 w-40 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                  {["All", "Published", "Flagged", "Draft"].map((statusOption) => (
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
            </button> */}
          </div>
        </div>
      </div>

      {/* Content Monitoring Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Content ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title / Snippet</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">
                Created At
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-gray-500">
                  Loading content...
                </td>
              </tr>
            ) : filteredContent.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-gray-500">
                  No content found.
                </td>
              </tr>
            ) : (
              filteredContent.map((item: ContentItem, index: number) => (
                <tr key={item._id} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                  <td className="px-4 py-3 font-medium text-gray-900">{item._id}</td>
                  <td className="px-4 py-3">{item.author}</td>
                  <td className="px-4 py-3 text-gray-600">{item.type}</td>
                  <td className="px-4 py-3 text-gray-600">{item.title}</td>
                  <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{new Date(item.created_at).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        item.status === "Published"
                          ? "bg-green-100 text-green-800"
                          : item.status === "Flagged"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-1">
                      <button className="p-2 rounded-md text-gray-600 hover:bg-gray-100" title="View">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 rounded-md text-green-600 hover:bg-green-100" title="Approve">
                        <Check className="h-4 w-4" />
                      </button>
                      <button className="p-2 rounded-md text-red-600 hover:bg-red-100" title="Reject">
                        <X className="h-4 w-4" />
                      </button>
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
