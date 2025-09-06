"use client";

import { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Check, X, Download, Search } from "lucide-react";
import { getContentMonitoring, updateContentStatus } from "@/lib/adminApi";
import { useToast } from "@/components/ui/use-toast";
import { exportToCSV, exportToJSON, formatDataForExport } from "@/lib/exportUtils";
import { useTranslation } from "@/hooks/useTranslation";

interface ContentItem {
  author: any;
  _id: string;
  title: string;
  author_name: string;
  type: string;
  snippet: string;
  createdAt: string;
  status: string;
}

export default function ContentMonitoringPage() {
  const { t } = useTranslation();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await getContentMonitoring({
        search: searchTerm,
        status: statusFilter === "all" ? "" : statusFilter,
        type: typeFilter === "all" ? "" : typeFilter,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });

      if (response.success) {
        setContent(response.data.content);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      toast({
        title: t('common:error'),
        description: t('pages:contentMonitoring.fetchError'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [searchTerm, statusFilter, typeFilter]);

  const handleStatusUpdate = async (contentId: string, newStatus: string, type: string) => {
    try {
      setUpdatingItems(prev => new Set(prev).add(contentId));
      
      const response = await updateContentStatus(contentId, newStatus, type);
      if (response.success) {
        toast({
          title: t('common:success'),
          description: t('pages:contentMonitoring.statusUpdated'),
        });
        
        // Update local state immediately for better UX
        setContent(prevContent => 
          prevContent.map(item => 
            item._id === contentId 
              ? { ...item, status: newStatus }
              : item
          )
        );
      }
    } catch (error) {
      console.error('Error updating content status:', error);
      toast({
        title: t('common:error'),
        description: t('pages:contentMonitoring.updateError'),
        variant: "destructive",
      });
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(contentId);
        return newSet;
      });
    }
  };

  const toggleStatus = (item: ContentItem) => {
    const newStatus = item.status === 'published' ? 'flagged' : 'published';
    handleStatusUpdate(item._id, newStatus, item.type);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "published":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "flagged":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "draft":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "blog":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "ai post":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const handleExport = (format: 'csv' | 'json') => {
    const filteredContent = content.filter(item => {
      const matchesSearch = searchTerm === "" || 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.author_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      const matchesType = typeFilter === "all" || item.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });

    const exportData = formatDataForExport(filteredContent, ['author']);

    if (format === 'csv') {
      exportToCSV(exportData, 'content-monitoring');
      toast({
        title: t('common:success'),
        description: t('pages:contentMonitoring.exportCSVSuccess'),
      });
    } else {
      exportToJSON(exportData, 'content-monitoring');
      toast({
        title: t('common:success'),
        description: t('pages:contentMonitoring.exportJSONSuccess'),
      });
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
                {t('pages:contentMonitoring.title')}
              </h1>
              <p className="text-gray-600 mt-1">
                {t('pages:contentMonitoring.subtitle')}
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
                        placeholder={t('pages:contentMonitoring.searchPlaceholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder={t('pages:contentMonitoring.status')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('pages:contentMonitoring.allStatus')}</SelectItem>
                        <SelectItem value="published">{t('pages:contentMonitoring.published')}</SelectItem>
                        <SelectItem value="draft">{t('pages:contentMonitoring.draft')}</SelectItem>
                        <SelectItem value="flagged">{t('pages:contentMonitoring.flagged')}</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder={t('pages:contentMonitoring.type')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('pages:contentMonitoring.allTypes')}</SelectItem>
                        <SelectItem value="blog">{t('pages:contentMonitoring.blog')}</SelectItem>
                        <SelectItem value="ai-post">{t('pages:contentMonitoring.aiPost')}</SelectItem>
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
                      {t('pages:contentMonitoring.exportCSV')}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={() => handleExport('json')}
                    >
                      <Download className="h-4 w-4" />
                      {t('pages:contentMonitoring.exportJSON')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('pages:contentMonitoring.contentId')}
                      </th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('pages:contentMonitoring.author')}
                      </th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('pages:contentMonitoring.type')}
                      </th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('pages:contentMonitoring.titleSnippet')}
                      </th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('pages:contentMonitoring.createdAt')}
                      </th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('pages:contentMonitoring.status')}
                      </th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('pages:contentMonitoring.actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
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
                            <div className="h-4 bg-gray-200 rounded w-48"></div>
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
                              <div className="h-8 w-8 bg-gray-200 rounded"></div>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : content.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 px-6 text-center text-gray-500">
                          {t('pages:contentMonitoring.noContent')}
                        </td>
                      </tr>
                    ) : (
                      content.map((item) => {
                        const isUpdating = updatingItems.has(item._id);
                        return (
                          <tr key={item._id} className="hover:bg-gray-50">
                            <td className="py-4 px-6 text-sm text-gray-900">
                              {item._id.slice(-8)}
                            </td>
                            <td className="py-4 px-6 text-sm text-gray-900">
                              {item.author?.email || t('pages:contentMonitoring.unknown')}
                            </td>
                            <td className="py-4 px-6">
                              <Badge 
                                className={`cursor-pointer ${getTypeColor(item.type)}`}
                                onClick={() => setTypeFilter(item.type === typeFilter ? "all" : item.type)}
                              >
                                {item.type}
                              </Badge>
                            </td>
                            <td className="py-4 px-6">
                              <div>
                                <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                  {item.title}
                                </p>
                                <p className="text-xs text-gray-500 truncate max-w-xs">
                                  {item.snippet}
                                </p>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-sm text-gray-500">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-4 px-6">
                              <Badge 
                                className={`cursor-pointer ${getStatusColor(item.status)}`}
                                onClick={() => toggleStatus(item)}
                              >
                                {item.status}
                              </Badge>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  title={t('pages:contentMonitoring.viewDetails')}
                                  disabled={isUpdating}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className={`h-8 w-8 p-0 ${
                                    item.status === 'published' 
                                      ? 'text-green-600 hover:text-green-700 bg-green-50' 
                                      : 'text-gray-400 hover:text-gray-500'
                                  }`}
                                  title={t('pages:contentMonitoring.approve')}
                                  onClick={() => handleStatusUpdate(item._id, 'published', item.type)}
                                  disabled={isUpdating || item.status === 'published'}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className={`h-8 w-8 p-0 ${
                                    item.status === 'flagged' 
                                      ? 'text-red-600 hover:text-red-700 bg-red-50' 
                                      : 'text-gray-400 hover:text-gray-500'
                                  }`}
                                  title={t('pages:contentMonitoring.flag')}
                                  onClick={() => handleStatusUpdate(item._id, 'flagged', item.type)}
                                  disabled={isUpdating || item.status === 'flagged'}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
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