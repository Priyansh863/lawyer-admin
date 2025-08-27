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
        title: "Error",
        description: "Failed to fetch lawyers",
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
          title: "Success",
          description: "Lawyer verified successfully",
        });
        fetchLawyers(); // Refresh the list
      }
    } catch (error) {
      console.error('Error verifying lawyer:', error);
      toast({
        title: "Error",
        description: "Failed to verify lawyer",
        variant: "destructive",
      });
    }
  };

  const handleRejectLawyer = async (lawyerId: string) => {
    try {
      const response = await rejectLawyer(lawyerId, 'Verification rejected by admin');
      if (response.success) {
        toast({
          title: "Success",
          description: "Lawyer verification rejected",
        });
        fetchLawyers(); // Refresh the list
      }
    } catch (error) {
      console.error('Error rejecting lawyer:', error);
      toast({
        title: "Error",
        description: "Failed to reject lawyer",
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

    // Format data for export by excluding unwanted fields
    const exportData = formatDataForExport(filteredLawyers, ['profileImage', 'selected']);

    if (format === 'csv') {
      exportToCSV(exportData, 'lawyer-verification');
      toast({
        title: "Success",
        description: "Lawyer verification data exported to CSV successfully",
      });
    } else {
      exportToJSON(exportData, 'lawyer-verification');
      toast({
        title: "Success", 
        description: "Lawyer verification data exported to JSON successfully",
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
              <h1 className="text-2xl font-semibold text-gray-900">Lawyer Verification</h1>
              <p className="text-gray-600 mt-1">Review and verify lawyer applications</p>
            </div>

            {/* Filters and Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search lawyers..."
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
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="verified">Verified</SelectItem>
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
                          Verify Selected ({selectedLawyers.length})
                        </Button>
                        <Button 
                          variant="destructive"
                          onClick={() => {
                            selectedLawyers.forEach(lawyer => handleRejectLawyer(lawyer.id));
                          }}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Reject Selected
                        </Button>
                      </>
                    )}
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
                        Lawyer
                      </th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Area of Practice
                      </th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Experience
                      </th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted On
                      </th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      // Loading skeleton
                      Array.from({ length: 5 }).map((_, index) => (
                        <tr key={index} className="animate-pulse">
                          <td className="py-4 px-6">
                            <div className="h-4 w-4 bg-gray-200 rounded"></div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                              <div className="h-4 bg-gray-200 rounded w-24"></div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="h-4 bg-gray-200 rounded w-32"></div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="h-4 bg-gray-200 rounded w-16"></div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="h-6 bg-gray-200 rounded w-16"></div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex gap-2">
                              <div className="h-8 w-8 bg-gray-200 rounded"></div>
                              <div className="h-8 w-8 bg-gray-200 rounded"></div>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : lawyers.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 px-6 text-center text-gray-500">
                          No lawyers found
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
                              {lawyer.status}
                            </Badge>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                title="View Details"
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
                                    title="Verify Lawyer"
                                    onClick={() => handleVerifyLawyer(lawyer.id)}
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                    title="Reject Lawyer"
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
