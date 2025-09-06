"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, Check, X, Download, Search } from "lucide-react";
import { getPendingLawyers, verifyLawyer, rejectLawyer } from "@/lib/adminApi";
import { useToast } from "@/components/ui/use-toast";
import { exportToCSV, exportToJSON, formatDataForExport } from "@/lib/exportUtils";
import { useTranslation } from "@/hooks/useTranslation";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface Lawyer {
  id: string;
  lawyerId: string;
  name: string;
  email: string;
  phone: string;
  profileImage: string | null;
  areaOfPractice: string;
  experience: string;
  submittedOn: string;
  status: string;
  isActive: number;
  isProfileCompleted: number;
  initials: string;
  selected?: boolean;
}

export default function LawyerVerificationPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();
  const [selectAll, setSelectAll] = useState(false);

  const fetchLawyers = async () => {
    try {
      setLoading(true);
      const response = await getPendingLawyers(searchTerm, statusFilter);
      if (response.success) {
        setLawyers(response.data.map((lawyer: Lawyer) => ({ ...lawyer, selected: false })));
      }
    } catch (error) {
      console.error('Error fetching lawyers:', error);
      toast({
        title: t('common:error'),
        description: t('pages:lawyerVerification.fetchError'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLawyers();
  }, [searchTerm, statusFilter]);

  const handleVerifyLawyer = async (lawyerId: string) => {
    try {
      const response = await verifyLawyer(lawyerId);
      if (response.success) {
        toast({
          title: t('common:success'),
          description: t('pages:lawyerVerification.verifySuccess'),
        });
        fetchLawyers();
      }
    } catch (error) {
      console.error('Error verifying lawyer:', error);
      toast({
        title: t('common:error'),
        description: t('pages:lawyerVerification.verifyError'),
        variant: "destructive",
      });
    }
  };

  const handleRejectLawyer = async (lawyerId: string) => {
    try {
      const response = await rejectLawyer(lawyerId, t('pages:lawyerVerification.rejectReason'));
      if (response.success) {
        toast({
          title: t('common:success'),
          description: t('pages:lawyerVerification.rejectSuccess'),
        });
        fetchLawyers();
      }
    } catch (error) {
      console.error('Error rejecting lawyer:', error);
      toast({
        title: t('common:error'),
        description: t('pages:lawyerVerification.rejectError'),
        variant: "destructive",
      });
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    setLawyers(lawyers.map(lawyer => ({ ...lawyer, selected: checked })));
  };

  const handleSelectLawyer = (lawyerId: string, checked: boolean) => {
    setLawyers(lawyers.map(lawyer => 
      lawyer.id === lawyerId ? { ...lawyer, selected: checked } : lawyer
    ));
  };

  const handleExport = (format: 'csv' | 'json') => {
    const filteredLawyers = lawyers.filter(lawyer => {
      const matchesSearch = searchTerm === "" || 
        lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lawyer.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || lawyer.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    if (filteredLawyers.length === 0) {
      toast({
        title: t('common:error'),
        description: t('pages:lawyerVerification.noDataExport'),
        variant: "destructive",
      });
      return;
    }

    const exportData = formatDataForExport(filteredLawyers, ['profileImage', 'selected']);

    if (format === 'csv') {
      exportToCSV(exportData, 'lawyer-verification');
      toast({
        title: t('common:success'),
        description: t('pages:lawyerVerification.exportCSVSuccess'),
      });
    } else {
      exportToJSON(exportData, 'lawyer-verification');
      toast({
        title: t('common:success'), 
        description: t('pages:lawyerVerification.exportJSONSuccess'),
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "verified":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusTranslation = (status: string) => {
    switch (status.toLowerCase()) {
      case "verified":
        return t('pages:lawyerVerification.verified');
      case "pending":
        return t('pages:lawyerVerification.pending');
      case "rejected":
        return t('pages:lawyerVerification.rejected');
      default:
        return status;
    }
  };

  const selectedLawyers = lawyers.filter(lawyer => lawyer.selected);

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
                {t('pages:lawyerVerification.title')}
              </h1>
              <p className="text-gray-600 mt-1">
                {t('pages:lawyerVerification.subtitle')}
              </p>
            </div>

            {/* Filters and Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder={t('pages:lawyerVerification.searchPlaceholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder={t('pages:lawyerVerification.status')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('pages:lawyerVerification.allStatus')}</SelectItem>
                        <SelectItem value="pending">{t('pages:lawyerVerification.pending')}</SelectItem>
                        <SelectItem value="verified">{t('pages:lawyerVerification.verified')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex gap-2">
                    {selectedLawyers.length > 0 && (
                      <>
                        <Button 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => {
                            selectedLawyers.forEach(lawyer => handleVerifyLawyer(lawyer.id));
                          }}
                        >
                          <Check className="h-4 w-4 mr-2" />
                          {t('pages:lawyerVerification.verifySelected')} ({selectedLawyers.length})
                        </Button>
                        <Button 
                          variant="destructive"
                          onClick={() => {
                            selectedLawyers.forEach(lawyer => handleRejectLawyer(lawyer.id));
                          }}
                        >
                          <X className="h-4 w-4 mr-2" />
                          {t('pages:lawyerVerification.rejectSelected')}
                        </Button>
                      </>
                    )}
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="flex items-center gap-2"
                        onClick={() => handleExport('csv')}
                        disabled={loading || lawyers.length === 0}
                      >
                        <Download className="h-4 w-4" />
                        {t('pages:lawyerVerification.exportCSV')}
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex items-center gap-2"
                        onClick={() => handleExport('json')}
                        disabled={loading || lawyers.length === 0}
                      >
                        <Download className="h-4 w-4" />
                        {t('pages:lawyerVerification.exportJSON')}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Lawyers Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <Checkbox
                          checked={selectAll}
                          onCheckedChange={handleSelectAll}
                        />
                      </th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('pages:lawyerVerification.lawyer')}
                      </th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('pages:lawyerVerification.email')}
                      </th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('pages:lawyerVerification.areaOfPractice')}
                      </th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('pages:lawyerVerification.experience')}
                      </th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('pages:lawyerVerification.submittedOn')}
                      </th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('pages:lawyerVerification.status')}
                      </th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('pages:lawyerVerification.actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      // Loading skeleton with react-loading-skeleton
                      Array.from({ length: 5 }).map((_, index) => (
                        <tr key={index}>
                          <td className="py-4 px-6">
                            <Skeleton circle width={16} height={16} />
                          </td>
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
                            <Skeleton width={80} height={16} />
                          </td>
                          <td className="py-4 px-6">
                            <Skeleton width={60} height={16} />
                          </td>
                          <td className="py-4 px-6">
                            <Skeleton width={80} height={16} />
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
                    ) : lawyers.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 px-6 text-center text-gray-500">
                          {t('pages:lawyerVerification.noLawyers')}
                        </td>
                      </tr>
                    ) : (
                      lawyers.map((lawyer) => (
                        <tr key={lawyer.id} className="hover:bg-gray-50">
                          <td className="py-4 px-6">
                            <Checkbox
                              checked={lawyer.selected || false}
                              onCheckedChange={(checked) => handleSelectLawyer(lawyer.id, checked as boolean)}
                            />
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={lawyer.profileImage || undefined} />
                                <AvatarFallback className="bg-gray-900 text-white text-sm">
                                  {lawyer.initials}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-gray-900">{lawyer.name}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-900">
                            {lawyer.email}
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-900">
                            {lawyer.areaOfPractice}
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-900">
                            {lawyer.experience}
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-500">
                            {new Date(lawyer.submittedOn).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-6">
                            <Badge className={getStatusColor(lawyer.status)}>
                              {getStatusTranslation(lawyer.status)}
                            </Badge>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                title={t('pages:lawyerVerification.viewDetails')}
                                onClick={() => router.push(`/users/${lawyer.id}`)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {lawyer.status === 'pending' && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                                    title={t('pages:lawyerVerification.verifyLawyer')}
                                    onClick={() => handleVerifyLawyer(lawyer.id)}
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                    title={t('pages:lawyerVerification.rejectLawyer')}
                                    onClick={() => handleRejectLawyer(lawyer.id)}
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