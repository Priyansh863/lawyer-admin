"use client";

import { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, Calendar, Users, Search, Download } from "lucide-react";
import { getTransactions } from "@/lib/adminApi";
import { useToast } from "@/components/ui/use-toast";
import { exportToCSV, exportToJSON, formatDataForExport } from "@/lib/exportUtils";

interface Transaction {
  _id: string;
  txn_id: string;
  user: string;
  role: string;
  type: string;
  amount: number;
  date: string;
  status: string;
  payment_method: string;
}

interface TransactionStats {
  totalTokensPurchased: number;
  tokensUsedToday: number;
  activeSubscriptions: number;
}

export default function TransactionsPage() {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<TransactionStats>({
    totalTokensPurchased: 0,
    tokensUsedToday: 0,
    activeSubscriptions: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await getTransactions({
        search: searchTerm,
        status: statusFilter === "all" ? "" : statusFilter,
        type: typeFilter === "all" ? "" : typeFilter,
        sortBy: 'date',
        sortOrder: 'desc'
      });

      if (response.success) {
        setTransactions(response.data.transactions);
        setStats(response.data.statistics);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [searchTerm, statusFilter, typeFilter]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "lawyer":
        return "bg-blue-100 text-blue-800";
      case "client":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleExport = (format: 'csv' | 'json') => {
    if (!transactions.length) {
      toast({
        title: "No Data",
        description: "No transactions available to export",
        variant: "destructive",
      });
      return;
    }

    const exportData = formatDataForExport(transactions, ['_id']);
    const filename = `transactions_${new Date().toISOString().split('T')[0]}`;

    if (format === 'csv') {
      exportToCSV(exportData, filename);
    } else {
      exportToJSON(exportData, filename);
    }

    toast({
      title: "Export Successful",
      description: `Transactions exported as ${format.toUpperCase()}`,
      variant: "default",
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">Transactions</h1>
              <p className="text-gray-600 mt-1">Transactions list</p>
            </div>

        

            {/* Filters and Actions */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Success">Success</SelectItem>
                        <SelectItem value="Failed">Failed</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Purchase">Purchase</SelectItem>
                        <SelectItem value="Subscription">Subscription</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={() => handleExport('csv')}
                    >
                      <Download className="h-4 w-4" />
                      Export CSV
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={() => handleExport('json')}
                    >
                      <Download className="h-4 w-4" />
                      Export JSON
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transactions Table */}
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        TXN ID
                      </th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        USER
                      </th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ROLE
                      </th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        TYPE
                      </th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        AMOUNT (TOKENS)
                      </th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        DATE
                      </th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        STATUS
                      </th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        PAYMENT METHOD
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      // Loading skeleton
                      Array.from({ length: 5 }).map((_, index) => (
                        <tr key={index} className="animate-pulse">
                          <td className="py-4 px-6">
                            <div className="h-4 bg-gray-200 rounded w-16"></div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="h-6 bg-gray-200 rounded w-16"></div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="h-4 bg-gray-200 rounded w-12"></div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="h-4 bg-gray-200 rounded w-28"></div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="h-6 bg-gray-200 rounded w-16"></div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                          </td>
                        </tr>
                      ))
                    ) : transactions.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 px-6 text-center text-gray-500">
                          No transactions found
                        </td>
                      </tr>
                    ) : (
                      transactions.map((transaction) => (
                        <tr key={transaction._id} className="hover:bg-gray-50">
                          <td className="py-4 px-6 text-sm text-gray-900">
                            {transaction.txn_id}
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-900">
                            {transaction.user}
                          </td>
                          <td className="py-4 px-6">
                            <Badge className={getRoleColor(transaction.role)}>
                              {transaction.role}
                            </Badge>
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-900">
                            {transaction.type}
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-900">
                            {transaction.amount}
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-500">
                            {new Date(transaction.date).toLocaleDateString()} {new Date(transaction.date).toLocaleTimeString()}
                          </td>
                          <td className="py-4 px-6">
                            <Badge className={getStatusColor(transaction.status)}>
                              {transaction.status}
                            </Badge>
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-900">
                            {transaction.payment_method}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
