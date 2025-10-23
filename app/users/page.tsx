"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Edit, Trash2, Download, Check, X, UserCheck, UserX, Shield, ShieldOff } from "lucide-react";
import { getAllUsers, verifyLawyer, rejectLawyer, exportUsers, toggleUserActive, toggleUserVerified } from "@/lib/adminApi";
import { useToast } from "@/components/ui/use-toast";
import { exportToCSV, exportToJSON, formatDataForExport } from "@/lib/exportUtils";
import { useTranslation } from "@/hooks/useTranslation";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  registeredOn: string;
  avatar: string | null;
  initials: string;
  is_active: number;
  is_verified: number;
}

export default function UsersPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();
  const [roleFilter, setRoleFilter] = useState("all");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers(searchTerm, statusFilter, roleFilter);
      if (response.success) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: t('common:error'),
        description: t('pages:users.fetchError'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, statusFilter, roleFilter]);

  const handleVerifyLawyer = async (userId: string) => {
    try {
      const response = await verifyLawyer(userId);
      if (response.success) {
        toast({
          title: t('common:success'),
          description: t('pages:users.verifySuccess'),
        });
        fetchUsers();
      }
    } catch (error) {
      console.error('Error verifying lawyer:', error);
      toast({
        title: t('common:error'),
        description: t('pages:users.verifyError'),
        variant: "destructive",
      });
    }
  };

  const handleRejectLawyer = async (userId: string) => {
    try {
      const response = await rejectLawyer(userId, t('pages:users.rejectReason'));
      if (response.success) {
        toast({
          title: t('common:success'),
          description: t('pages:users.rejectSuccess'),
        });
        fetchUsers();
      }
    } catch (error) {
      console.error('Error rejecting lawyer:', error);
      toast({
        title: t('common:error'),
        description: t('pages:users.rejectError'),
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (userId: string, currentStatus: number) => {
    try {
      const response = await toggleUserActive(userId, currentStatus === 1 ? 0 : 1);
      if (response.success) {
        toast({
          title: t('common:success'),
          description: currentStatus === 1 ? 'User deactivated successfully' : 'User activated successfully',
        });
        fetchUsers();
      }
    } catch (error) {
      console.error('Error toggling user active status:', error);
      toast({
        title: t('common:error'),
        description: 'Failed to update user status',
        variant: "destructive",
      });
    }
  };

  const handleToggleVerified = async (userId: string, currentStatus: number) => {
    try {
      const response = await toggleUserVerified(userId, currentStatus === 1 ? 0 : 1);
      if (response.success) {
        toast({
          title: t('common:success'),
          description: currentStatus === 1 ? 'User unverified successfully' : 'User verified successfully',
        });
        fetchUsers();
      }
    } catch (error) {
      console.error('Error toggling user verified status:', error);
      toast({
        title: t('common:error'),
        description: 'Failed to update user verification status',
        variant: "destructive",
      });
    }
  };

  const handleExport = (format: 'csv' | 'json') => {
    const filteredUsers = users.filter(user => {
      const matchesSearch = searchTerm === "" || 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || user.status === statusFilter;
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      
      return matchesSearch && matchesStatus && matchesRole;
    });

    if (filteredUsers.length === 0) {
      toast({
        title: t('common:error'),
        description: t('pages:users.noDataExport'),
        variant: "destructive",
      });
      return;
    }

    const exportData = formatDataForExport(filteredUsers, ['avatar']);

    if (format === 'csv') {
      exportToCSV(exportData, 'users');
      toast({
        title: t('common:success'),
        description: t('pages:users.exportCSVSuccess'),
      });
    } else {
      exportToJSON(exportData, 'users');
      toast({
        title: t('common:success'), 
        description: t('pages:users.exportJSONSuccess'),
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "verified":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusTranslation = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return t('pages:users.active');
      case "verified":
        return t('pages:users.verified');
      case "inactive":
        return t('pages:users.inactive');
      case "pending":
        return t('pages:users.pending');
      default:
        return status;
    }
  };

  const getRoleColor = (role: string) => {
    if (!role) return "bg-gray-100 text-gray-800";
    switch (role.toLowerCase()) {
      case "lawyer":
        return "bg-blue-100 text-blue-800";
      case "client":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

const getRoleTranslation = (role?: string) => {
  if (!role) return ""; // or "Unknown"

  switch (role.toLowerCase()) {
    case "lawyer":
      return t("pages:users.lawyer");
    case "client":
      return t("pages:users.client");
    case "admin":
      return t("pages:users.admin");
    default:
      return role;
  }
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
              <h1 className="text-2xl font-semibold text-gray-900">
                {t('pages:users.title')}
              </h1>
            </div>

            {/* Filters and Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
                    <div className="relative flex-1 max-w-md">
                      <Input
                        placeholder={t('pages:users.searchPlaceholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-4"
                      />
                    </div>
                    
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder={t('pages:users.role')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('pages:users.allRoles')}</SelectItem>
                        <SelectItem value="client">{t('pages:users.client')}</SelectItem>
                        <SelectItem value="lawyer">{t('pages:users.lawyer')}</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder={t('pages:users.status')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('pages:users.allStatus')}</SelectItem>
                        <SelectItem value="verified">{t('pages:users.verified')}</SelectItem>
                        <SelectItem value="pending">{t('pages:users.pending')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={() => handleExport('csv')}
                      disabled={loading || users.length === 0}
                    >
                      <Download className="h-4 w-4" />
                      {t('pages:users.exportCSV')}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={() => handleExport('json')}
                      disabled={loading || users.length === 0}
                    >
                      <Download className="h-4 w-4" />
                      {t('pages:users.exportJSON')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('pages:users.name')}
                      </th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('pages:users.email')}
                      </th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('pages:users.role')}
                      </th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('pages:users.registeredOn')}
                      </th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Active
                      </th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Verified
                      </th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('pages:users.actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      // Loading skeleton with react-loading-skeleton
                      Array.from({ length: 5 }).map((_, index) => (
                        <tr key={index}>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <Skeleton circle width={32} height={32} />
                              <Skeleton width={100} height={16} />
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <Skeleton width={120} height={16} />
                          </td>
                          <td className="py-4 px-6">
                            <Skeleton width={60} height={24} />
                          </td>
                          <td className="py-4 px-6">
                            <Skeleton width={80} height={16} />
                          </td>
                          <td className="py-4 px-6">
                            <Skeleton width={60} height={24} />
                          </td>
                          <td className="py-4 px-6">
                            <Skeleton width={60} height={24} />
                          </td>
                          <td className="py-4 px-6">
                            <Skeleton width={60} height={24} />
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex gap-2">
                              <Skeleton circle width={32} height={32} />
                              <Skeleton circle width={32} height={32} />
                              <Skeleton circle width={32} height={32} />
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : users.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 px-6 text-center text-gray-500">
                          {t('pages:users.noUsers')}
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.avatar || undefined} />
                                <AvatarFallback className="bg-gray-900 text-white text-sm">
                                  {user.initials || 'N/A'}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-gray-900">{!!user?.name ? user.name : 'N/A'}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-900">
                            {user.email}
                          </td>
                          <td className="py-4 px-6">
                            <Badge className={getRoleColor(user.role)}>
                              {getRoleTranslation(user.role)}
                            </Badge>
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-500">
                            {new Date(user.registeredOn).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-6">
                            <Badge className={user.is_active === 1 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                              {user.is_active === 1 ? "Active" : "Inactive"}
                            </Badge>
                          </td>
                          <td className="py-4 px-6">
                            <Badge className={user.is_verified === 1 ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}>
                              {user.is_verified === 1 ? "Verified" : "Unverified"}
                            </Badge>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                title={t('pages:users.viewDetails')}
                                onClick={() => router.push(`/users/${user.id}`)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              
                              {/* Toggle Active Status */}
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`h-8 w-8 p-0 ${user.is_active === 1 ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}`}
                                title={user.is_active === 1 ? "Deactivate User" : "Activate User"}
                                onClick={() => handleToggleActive(user.id, user.is_active)}
                              >
                                {user.is_active === 1 ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                              </Button>

                              {/* Toggle Verified Status */}
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`h-8 w-8 p-0 ${user.is_verified === 1 ? 'text-orange-600 hover:text-orange-700' : 'text-blue-600 hover:text-blue-700'}`}
                                title={user.is_verified === 1 ? "Unverify User" : "Verify User"}
                                onClick={() => handleToggleVerified(user.id, user.is_verified)}
                              >
                                {user.is_verified === 1 ? <ShieldOff className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                              </Button>

                              {user.role === 'lawyer' && user.status === 'pending' && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                                    title={t('pages:users.verifyLawyer')}
                                    onClick={() => handleVerifyLawyer(user.id)}
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                    title={t('pages:users.rejectLawyer')}
                                    onClick={() => handleRejectLawyer(user.id)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </>
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
          </div>
        </main>
      </div>
    </div>
  );
}