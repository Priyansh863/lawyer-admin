"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Search, ChevronDown, Download, Eye, Check, X, History } from "lucide-react"
import axios from '../lib/axiosInstance';
import API_ROUTES from '../lib/apiRoutes';

interface LawyerVerificationTableProps {
  onVerificationHistoryClick: () => void
}

type Lawyer = {
  id: string;
  lawyerId: string;
  name: string;
  email: string;
  areaOfPractice: string;
  submittedOn: string;
  status: "Active" | "Pending" | "Rejected";
  isChecked: boolean;
};

export function LawyerVerificationTable({ onVerificationHistoryClick }: LawyerVerificationTableProps) {
  const [lawyersData, setLawyersData] = useState<Lawyer[]>([])
  const [loading, setLoading] = useState(true)
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [queryParams, setQueryParams] = useState({
    offset: 0,
    limit: 10,
    accountType: 'lawyer',
  });

  useEffect(() => {
    const fetchLawyers = async () => {
      setLoading(true)
      try {
        const { offset, limit, accountType } = queryParams;
        const res = await axios.get(API_ROUTES.CLIENTS_LIST(offset, limit, accountType));
        const apiLawyers = res.data.data || [];
        const mappedLawyers: Lawyer[] = apiLawyers.map((lawyer: any) => ({
          id: lawyer._id || lawyer.id,
          lawyerId: lawyer.lawyer_id || lawyer.lawyerId || lawyer.id,
          name: `${lawyer.first_name || ''} ${lawyer.last_name || ''}`.trim(),
          email: lawyer.email,
          areaOfPractice: lawyer.area_of_practice || lawyer.areaOfPractice || '',
          submittedOn: lawyer.created_at ? new Date(lawyer.created_at).toLocaleDateString() : '',
          status: lawyer.status || (lawyer.is_active ? 'Active' : 'Pending'),
          isChecked: false,
        }));
        setLawyersData(mappedLawyers);
      } catch (error) {
        console.error("Failed to fetch lawyers:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchLawyers()
  }, [queryParams])

  const handleCheckboxChange = (id: string) => {
    setLawyersData((prevData) =>
      prevData.map((lawyer) => (lawyer.id === id ? { ...lawyer, isChecked: !lawyer.isChecked } : lawyer)),
    )
  }

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    setLawyersData((prevData) => prevData.map((lawyer) => ({ ...lawyer, isChecked: checked })))
  }

  const filteredLawyers = lawyersData.filter((lawyer) => {
    const matchesSearch = lawyer.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "All" || lawyer.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const allChecked = filteredLawyers.length > 0 && filteredLawyers.every((lawyer) => lawyer.isChecked)
  const indeterminate = filteredLawyers.some((lawyer) => lawyer.isChecked) && !allChecked

  return (
    <div className="space-y-6" style={{ fontFamily: "Montserrat, sans-serif" }}>
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Lawyer Verification</h1>
        <p className="text-gray-600 mt-1">Lawyer Verification list</p>
      </div>

      {/* Filters and Actions Container */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Search input for filtering lawyers by name */}
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

          {/* Action buttons and status dropdown */}
          <div className="flex items-center space-x-3 w-full sm:w-auto flex-wrap gap-2">
            {/* Status dropdown for filtering lawyers by status */}
            {/* <div className="relative">
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
            </div> */}

            {/* Export button for downloading lawyer data */}
            {/* <button
              type="button"
              className="flex items-center border border-gray-300 px-3 py-2 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Export</span>
            </button> */}

            {/* Verification History button to view past verifications */}
            {/* <button
              type="button"
              className="flex items-center border border-gray-300 px-3 py-2 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
              onClick={onVerificationHistoryClick}
            >
              <History className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Verification History</span>
            </button> */}

            {/* Bulk Verification button for verifying multiple lawyers at once */}
            {/* <button
              type="button"
              className="bg-black text-white hover:bg-gray-800 flex items-center space-x-2 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            >
              <Check className="h-4 w-4" />
              <span>Bulk Verification</span>
            </button> */}
          </div>
        </div>
      </div>

      {/* Lawyers Verification Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left w-12">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-black rounded border-gray-300 focus:ring-black"
                  checked={allChecked}
                  onChange={handleSelectAll}
                  ref={(input) => {
                    if (input) input.indeterminate = indeterminate
                  }}
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lawyer ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Area of Practice</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">
                Submitted On
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="p-6 text-center text-gray-500">
                  Loading lawyers...
                </td>
              </tr>
            ) : filteredLawyers.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-6 text-center text-gray-500">
                  No lawyers found.
                </td>
              </tr>
            ) : (
              filteredLawyers.map((lawyer, index) => (
                <tr key={lawyer.id} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-black rounded border-gray-300 focus:ring-black"
                      checked={lawyer.isChecked}
                      onChange={() => handleCheckboxChange(lawyer.id)}
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">{lawyer.lawyerId}</td>
                  <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">{lawyer.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600">{lawyer.email}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600">{lawyer.areaOfPractice}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600 hidden sm:table-cell">
                    {lawyer.submittedOn}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        lawyer.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : lawyer.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {lawyer.status}
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
                        className="p-2 rounded-md text-green-600 hover:bg-green-50 hover:text-green-700 focus:outline-none focus:ring-2 focus:ring-green-200"
                        title="Approve"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="p-2 rounded-md text-red-600 hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-200"
                        title="Reject"
                      >
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
