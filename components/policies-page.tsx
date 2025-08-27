"use client"

import { useEffect, useState } from "react"
import { Search, ChevronDown, Download, Plus, Pencil, Trash2 } from "lucide-react"
import axios from '../lib/axiosInstance';
import API_ROUTES from '../lib/apiRoutes';

interface PoliciesPageProps {
  onAddLegalPageClick?: () => void
  onAddAnnouncementsClick?: () => void
  onAddBannersClick?: () => void
}

export function PoliciesPage({ onAddLegalPageClick, onAddAnnouncementsClick, onAddBannersClick }: PoliciesPageProps) {
  const [activeTab, setActiveTab] = useState("Legal Page")
  const [policiesData, setPoliciesData] = useState([])
  const [loading, setLoading] = useState(true)
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")

  const tabs = ["Legal Page", "Announcements", "Banners"]

  useEffect(() => {
    const fetchPolicies = async () => {
      setLoading(true)
      try {
        let url = '';
        if (activeTab === 'Legal Page') {
          url = API_ROUTES.POLICIES;
        } else if (activeTab === 'Announcements') {
          url = '/api/v1/announcements'; // Update if you have a real endpoint or add to API_ROUTES
        } else if (activeTab === 'Banners') {
          url = '/api/v1/banners'; // Update if you have a real endpoint or add to API_ROUTES
        }
        if (!url) return;
        const res = await axios.get(url);
        setPoliciesData(res.data);
      } catch (error) {
        console.error('Failed to fetch policies:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPolicies();
  }, [activeTab]);

  const getButtonText = () => {
    switch (activeTab) {
      case "Legal Page":
        return "Add Legal Page"
      case "Announcements":
        return "Add Announcements"
      case "Banners":
        return "Add Banners"
      default:
        return "Add Item"
    }
  }

  const handleAddButtonClick = () => {
    if (activeTab === "Legal Page" && onAddLegalPageClick) {
      onAddLegalPageClick()
    } else if (activeTab === "Announcements" && onAddAnnouncementsClick) {
      onAddAnnouncementsClick()
    } else if (activeTab === "Banners" && onAddBannersClick) {
      onAddBannersClick()
    } else {
      console.log(`Add ${activeTab} clicked`)
    }
  }

  const getSearchPlaceholder = () => {
    switch (activeTab) {
      case "Legal Page":
        return "Search by name"
      case "Announcements":
        return "Search by name"
      case "Banners":
        return "Search by name"
      default:
        return "Search by name"
    }
  }

  const filteredPolicies = policiesData.filter((policy) => {
    let matchesSearch = false

    if (activeTab === "Legal Page") {
      matchesSearch =
        policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        policy.url.toLowerCase().includes(searchTerm.toLowerCase())
    } else if (activeTab === "Banners") {
      matchesSearch =
        (policy.image && policy.image.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (policy.link && policy.link.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (policy.position && policy.position.toLowerCase().includes(searchTerm.toLowerCase()))
    } else {
      matchesSearch =
        policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (policy.audience && policy.audience.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (policy.type && policy.type.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    const matchesStatus = selectedStatus === "All" || policy.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const renderTableHeaders = () => {
    if (activeTab === "Legal Page") {
      return (
        <>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">URL</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Updated</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
        </>
      )
    } else if (activeTab === "Banners") {
      return (
        <>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Link</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
        </>
      )
    } else {
      return (
        <>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Audience</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Updated</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
        </>
      )
    }
  }

  const renderTableRow = (policy, index) => {
    if (activeTab === "Legal Page") {
      return (
        <tr key={policy.id} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
          <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">{policy.id}</td>
          <td className="px-4 py-3 whitespace-nowrap text-gray-600">{policy.title}</td>
          <td className="px-4 py-3 whitespace-nowrap text-gray-600">{policy.url}</td>
          <td className="px-4 py-3 whitespace-nowrap text-gray-600">{policy.lastUpdated}</td>
          <td className="px-4 py-3 whitespace-nowrap">
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                policy.status === "Active"
                  ? "bg-green-100 text-green-800"
                  : policy.status === "Draft"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-600"
              }`}
            >
              {policy.status}
            </span>
          </td>
          <td className="px-4 py-3 whitespace-nowrap">
            <div className="flex items-center space-x-1">
              <button
                type="button"
                className="p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-200"
                title="Edit"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="p-2 rounded-md text-red-600 hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-200"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </td>
        </tr>
      )
    } else if (activeTab === "Banners") {
      return (
        <tr key={policy.id} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
          <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">{policy.id}</td>
          <td className="px-4 py-3 whitespace-nowrap text-gray-600">{policy.image}</td>
          <td className="px-4 py-3 whitespace-nowrap text-gray-600">{policy.link}</td>
          <td className="px-4 py-3 whitespace-nowrap text-gray-600">{policy.position}</td>
          <td className="px-4 py-3 whitespace-nowrap">
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                policy.status === "Active"
                  ? "bg-green-100 text-green-800"
                  : policy.status === "Draft"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-600"
              }`}
            >
              {policy.status}
            </span>
          </td>
          <td className="px-4 py-3 whitespace-nowrap">
            <div className="flex items-center space-x-1">
              <button
                type="button"
                className="p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-200"
                title="Edit"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="p-2 rounded-md text-red-600 hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-200"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </td>
        </tr>
      )
    } else {
      return (
        <tr key={policy.id} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
          <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">{policy.id}</td>
          <td className="px-4 py-3 whitespace-nowrap text-gray-600">{policy.title}</td>
          <td className="px-4 py-3 whitespace-nowrap text-gray-600">{policy.audience}</td>
          <td className="px-4 py-3 whitespace-nowrap text-gray-600">{policy.type}</td>
          <td className="px-4 py-3 whitespace-nowrap text-gray-600">{policy.lastUpdated}</td>
          <td className="px-4 py-3 whitespace-nowrap">
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                policy.status === "Published"
                  ? "bg-green-100 text-green-800"
                  : policy.status === "Draft"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-600"
              }`}
            >
              {policy.status}
            </span>
          </td>
          <td className="px-4 py-3 whitespace-nowrap">
            <div className="flex items-center space-x-1">
              <button
                type="button"
                className="p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-200"
                title="Edit"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="p-2 rounded-md text-red-600 hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-200"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </td>
        </tr>
      )
    }
  }

  const getColumnCount = () => {
    if (activeTab === "Legal Page") return 6
    if (activeTab === "Banners") return 6
    return 7 // Announcements
  }

  return (
    <div className="space-y-6" style={{ fontFamily: "Montserrat, sans-serif" }}>
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Policies</h1>
        <p className="text-gray-600 mt-1">Policies list</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? "border-black text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Filters and Actions Container */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder={getSearchPlaceholder()}
              className="pl-10 pr-4 py-2 w-full sm:w-80 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto flex-wrap gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                className="flex items-center border border-gray-300 px-3 py-2 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
                aria-haspopup="true"
                aria-expanded={isStatusDropdownOpen}
              >
                <span>Status</span>
                <ChevronDown className="h-4 w-4 ml-2" />
              </button>
              {isStatusDropdownOpen && (
                <div className="absolute z-10 mt-2 w-40 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {["All", "Active", "Published", "Inactive", "Draft"].map((statusOption) => (
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

            <button
              type="button"
              onClick={handleAddButtonClick}
              className="bg-black text-white hover:bg-gray-800 flex items-center space-x-2 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            >
              <Plus className="h-4 w-4" />
              <span>{getButtonText()}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Policies Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>{renderTableHeaders()}</tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={getColumnCount()} className="p-6 text-center text-gray-500">
                  Loading {activeTab.toLowerCase()}...
                </td>
              </tr>
            ) : filteredPolicies.length === 0 ? (
              <tr>
                <td colSpan={getColumnCount()} className="p-6 text-center text-gray-500">
                  No {activeTab.toLowerCase()} found.
                </td>
              </tr>
            ) : (
              filteredPolicies.map((policy, index) => renderTableRow(policy, index))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
