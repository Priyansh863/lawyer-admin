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
import { useTranslation } from "@/hooks/useTranslation";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

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
  const { t } = useTranslation();
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
      toast({
        title: t('common:error'),
        description: t('pages:transactions.fetchError'),
        variant: "destructive",
      });
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
        title: t('common:error'),
        description: t('pages:transactions.noDataExport'),
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
      title: t('pages:common.success'),
      description: t(`pages:transactions.export${format.toUpperCase()}Success`),
      variant: "default",
    });
  };

  // Stats cards with loading skeletons
  const StatCard = ({ title, value, icon: Icon, loading: isLoading }: { title: string; value: number; icon: any; loading: boolean }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            {isLoading ? (
              <Skeleton width={80} height={24} className="mt-2" />
            ) : (
              <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
            )}
          </div>
          <div className="p-3 rounded-full bg-blue-100">
            <Icon className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">
                {t('pages:transactions.title')}
              </h1>
              <p className="text-gray-600 mt-1">
                {t('pages:transactions.subtitle')}
              </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <StatCard
                title={t('pages:transactions.totalTokens')}
                value={stats.totalTokensPurchased}
                icon={CreditCard}
                loading={loading}
              />
              <StatCard
                title={t('pages:transactions.tokensToday')}
                value={stats.tokensUsedToday}
                icon={Calendar}
                loading={loading}
              />
              <StatCard
                title={t('pages:transactions.activeSubs')}
                value={stats.activeSubscriptions}
                icon={Users}
                loading={loading}
              />
            </div>

            {/* Filters and Actions */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder={t('pages:transactions.searchPlaceholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder={t('pages:transactions.status')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('pages:transactions.allStatus')}</SelectItem>
                        <SelectItem value="Success">{t('pages:transactions.success')}</SelectItem>
                        <SelectItem value="Failed">{t('pages:transactions.failed')}</SelectItem>
                        <SelectItem value="Pending">{t('pages:transactions.pending')}</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder={t('pages:transactions.type')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('pages:transactions.allTypes')}</SelectItem>
                        <SelectItem value="Purchase">{t('pages:transactions.purchase')}</SelectItem>
                        <SelectItem value="Subscription">{t('pages:transactions.subscription')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={() => handleExport('csv')}
                      disabled={loading || transactions.length === 0}
                    >
                      <Download className="h-4 w-4" />
                      {t('pages:transactions.exportCSV')}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={() => handleExport('json')}
                      disabled={loading || transactions.length === 0}
                    >
                      <Download className="h-4 w-4" />
                      {t('pages:transactions.exportJSON')}
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
                        {t('pages:transactions.txnId')}
                      </th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('pages:transactions.user')}
                      </th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('pages:transactions.role')}
                      </th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('pages:transactions.type')}
                      </th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('pages:transactions.amount')}
                      </th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('pages:transactions.date')}
                      </th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('pages:transactions.status')}
                      </th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('pages:transactions.paymentMethod')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      // Loading skeleton for table rows
                      Array.from({ length: 5 }).map((_, index) => (
                        <tr key={index}>
                          <td className="py-4 px-6"><Skeleton width={80} /></td>
                          <td className="py-4 px-6"><Skeleton width={100} /></td>
                          <td className="py-4 px-6"><Skeleton width={60} height={24} /></td>
                          <td className="py-4 px-6"><Skeleton width={80} /></td>
                          <td className="py-4 px-6"><Skeleton width={60} /></td>
                          <td className="py-4 px-6"><Skeleton width={120} /></td>
                          <td className="py-4 px-6"><Skeleton width={70} height={24} /></td>
                          <td className="py-4 px-6"><Skeleton width={90} /></td>
                        </tr>
                      ))
                    ) : transactions.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 px-6 text-center text-gray-500">
                          {t('pages:transactions.noTransactions')}
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
    {t(`pages:transactions.${transaction.role.toLowerCase()}`)}
  </Badge>
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-900">
  {t(`pages:transactions.${transaction.type.toLowerCase()}`)}
</td>
                          <td className="py-4 px-6 text-sm text-gray-900">
                            {transaction.amount.toLocaleString()}
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-500">
                            {new Date(transaction.date).toLocaleDateString()} {new Date(transaction.date).toLocaleTimeString()}
                          </td>
                          <td className="py-4 px-6">
                            <Badge className={getStatusColor(transaction.status)}>
    {t(`pages:transactions.${transaction.status.toLowerCase()}`)}
  </Badge>
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-900">
  {t(`pages:transactions.${transaction.payment_method.toLowerCase()}`)}
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