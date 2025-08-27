"use client"

import { useEffect, useState } from "react"
import { Search, ChevronDown, Download, Eye, UserCheck, Trash2 } from "lucide-react"
import axios from '../lib/axiosInstance';
import API_ROUTES from '../lib/apiRoutes';

export function UsersTable() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  // Manage query params as state
  const [queryParams, setQueryParams] = useState({
    offset: 0,
    limit: 10,
    accountType: 'client',
  });

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      try {
        const { offset, limit, accountType } = queryParams;
        const res = await axios.get(API_ROUTES.CLIENTS_LIST(offset, limit, accountType));
        const apiUsers = res.data.data || [];
        const mappedUsers = apiUsers.map((user: any) => ({
          id: user._id || user.id,
          name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
          avatar: user.profile_image,
          email: user.email,
          role: user.account_type,
          registeredOn: user.created_at ? new Date(user.created_at).toLocaleDateString() : '',
          status: user.is_active ? 'Active' : 'Inactive',
        }));
        setUsers(mappedUsers);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [queryParams])

  const filteredUsers = users.filter((user: any) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "All" || user.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6" style={{ fontFamily: "Montserrat, sans-serif" }}>
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        {/* <p className="text-gray-600 mt-1">Users list</p> */}
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
                  {["All", "Active", "Inactive"].map((statusOption) => (
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

            {/* <button
              type="button"
              className="flex items-center border border-gray-300 px-3 py-2 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Export</span>
            </button> */}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">
                Registered On
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  Loading users...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user: any, index: number) => (
                <tr key={user.id} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <span className="font-medium text-gray-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600">{user.email}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600">{user.role}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600 hidden sm:table-cell">
                    {user.registeredOn}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        user.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {user.status}
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
