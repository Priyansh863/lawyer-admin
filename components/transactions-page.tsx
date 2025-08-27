"use client"

import { useEffect, useState } from "react"
import axios from '../lib/axiosInstance';
import API_ROUTES from '../lib/apiRoutes';
import { Search, ChevronDown, Download } from "lucide-react"

// Define types for payment and summary
interface Payment {
  id: string
  txnId: string
  user: {
    name: string
    avatar?: string
  }
  role: string
  type: string
  amount: number
  date: string
  status: "Success" | "Pending" | "Failed"
  paymentMethod: string
}

interface SummaryItem {
  title: string
  value: number | string
  icon?: React.ElementType
}

export function TransactionsPage() {
  const [transactions, setTransactions] = useState<Payment[]>([])
  const [summary, setSummary] = useState<SummaryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: paymentsRaw } = await axios.get(API_ROUTES.PAYMENTS);
        // Map backend fields to frontend expected fields
        const payments: Payment[] = paymentsRaw.map((item: any) => ({
          id: item._id || item.id,
          txnId: item.txn_id || item.txnId,
          user: { name: item.user || "Unknown" },
          role: item.role,
          type: item.type,
          amount: item.amount,
          date: item.date,
          status: item.status,
          paymentMethod: item.payment_method || item.paymentMethod,
        }));

        setTransactions(payments);

        // Compute summary from mapped payments
        const total = payments.length;
        const success = payments.filter((p) => p.status === "Success").length;
        const pending = payments.filter((p) => p.status === "Pending").length;
        const failed = payments.filter((p) => p.status === "Failed").length;
        setSummary([
          { title: "Total Transactions", value: total },
          { title: "Success", value: success },
          { title: "Pending", value: pending },
          { title: "Failed", value: failed },
        ]);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredTransactions = transactions.filter((transaction) => {
    const userName = transaction.user && transaction.user.name ? transaction.user.name : "";
    const matchesSearch =
      userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transaction.txnId ? transaction.txnId.toLowerCase().includes(searchTerm.toLowerCase()) : false);
    const matchesStatus = selectedStatus === "All" || transaction.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6" style={{ fontFamily: "Montserrat, sans-serif" }}>
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <p className="text-gray-600 mt-1">Transactions list</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center text-gray-500 p-8">Loading summary...</div>
        ) : (
          summary.map((item, index) => {
            const Icon = item.icon
            return (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="text-sm font-medium text-gray-600">{item.title}</div>
                  {Icon && <Icon className="h-4 w-4 text-gray-400" />}
                </div>
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
              placeholder="Search by name or Txn ID"
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
                  {["All", "Success", "Pending", "Failed"].map((statusOption) => (
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

      {/* Transactions Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Txn ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount (Tokens)</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Method</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="p-6 text-center text-gray-500">
                  Loading transactions...
                </td>
              </tr>
            ) : filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-6 text-center text-gray-500">
                  No transactions found.
                </td>
              </tr>
            ) : (
              filteredTransactions.map((transaction, index) => (
                <tr key={transaction.id} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                  <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">{transaction.txnId}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <img
                        src={transaction.user.avatar || "/placeholder.svg"}
                        alt={transaction.user.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <span className="font-medium text-gray-900">{transaction.user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600">{transaction.role}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600">{transaction.type}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600">{transaction.amount}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600">{transaction.date}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        transaction.status === "Success"
                          ? "bg-green-100 text-green-800"
                          : transaction.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600">{transaction.paymentMethod}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
