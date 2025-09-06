'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  ScrollText,
  Plus,
  Search,
  FileText,
  Eye,
  Edit,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';
import { useTranslation } from '@/hooks/useTranslation';

interface Policy {
  _id: string;
  title: string;
  slug: string;
  status: 'Active' | 'Inactive';
  last_updated: string;
}

interface PoliciesSidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function PoliciesSidebar({ collapsed = false, onToggle }: PoliciesSidebarProps) {
  const { t } = useTranslation();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const response = await axiosInstance.get('/policies');
      if (response.data.success) {
        setPolicies(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch policies:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPolicies = policies.filter(policy =>
    policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    policy.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isActive = (path: string) => pathname === path;
  const isPolicyActive = (id: string) => pathname.includes(id);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusTranslation = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return t('pages:policiesSidebar.active');
      case 'inactive':
        return t('pages:policiesSidebar.inactive');
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className={cn(
      "flex flex-col h-full bg-white border-r border-gray-200 transition-all duration-300",
      collapsed ? "w-16" : "w-80"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <ScrollText className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              {t('pages:policiesSidebar.title')}
            </h2>
          </div>
        )}
        {onToggle && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="h-8 w-8 p-0"
            title={collapsed ? t('pages:policiesSidebar.expand') : t('pages:policiesSidebar.collapse')}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      {/* Back Button - Only show when not on main policies page */}
      {!collapsed && !pathname.includes('/policies') && (
        <div className="p-4 border-b border-gray-200">
          <Button
            variant="ghost"
            className="w-full flex items-center gap-2"
            onClick={() => router.push('/policies')}
          >
            <ArrowLeft className="h-4 w-4" />
            {t('common:back')}
          </Button>
        </div>
      )}

      {!collapsed && (
        <>
          {/* Quick Actions */}
          <div className="p-4 border-b border-gray-200">
            <Button
              onClick={() => router.push('/policies/add')}
              className="w-full flex items-center gap-2 mb-3"
              variant={isActive('/policies/add') ? 'default' : 'outline'}
            >
              <Plus className="h-4 w-4" />
              {t('pages:policiesSidebar.addLegalPage')}
            </Button>
            
            <Button
              onClick={() => router.push('/policies')}
              variant={isActive('/policies') && !pathname.includes('/add') && !pathname.includes('/edit') ? 'secondary' : 'ghost'}
              className="w-full flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              {t('pages:policiesSidebar.allPolicies')}
            </Button>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={t('pages:policiesSidebar.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Policies List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-3">
                {t('pages:policiesSidebar.recentPolicies')}
              </h3>
              {loading ? (
                <div className="text-sm text-gray-500">
                  {t('pages:policiesSidebar.loading')}
                </div>
              ) : filteredPolicies.length === 0 ? (
                <div className="text-sm text-gray-500">
                  {searchTerm ? t('pages:policiesSidebar.noPoliciesFound') : t('pages:policiesSidebar.noPolicies')}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredPolicies.slice(0, 10).map((policy) => (
                    <div
                      key={policy._id}
                      className={cn(
                        "p-3 rounded-lg border cursor-pointer transition-colors",
                        isPolicyActive(policy._id)
                          ? "bg-blue-50 border-blue-200"
                          : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                      )}
                      onClick={() => router.push(`/policies/${policy._id}`)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {policy.title}
                        </h4>
                        <Badge
                          variant={policy.status === 'Active' ? 'default' : 'secondary'}
                          className={cn(
                            "text-xs",
                            getStatusColor(policy.status)
                          )}
                        >
                          {getStatusTranslation(policy.status)}
                        </Badge>
                      </div>
                      
                      <p className="text-xs text-gray-500 mb-2">
                        /{policy.slug}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">
                          {formatDate(policy.last_updated)}
                        </span>
                        
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/policies/${policy._id}`);
                            }}
                            title={t('pages:policiesSidebar.view')}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/policies/edit/${policy._id}`);
                            }}
                            title={t('pages:policiesSidebar.edit')}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}