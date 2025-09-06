'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import axiosInstance from '@/lib/axiosInstance';
import { PoliciesSidebar } from '@/components/policies-sidebar';
import { useTranslation } from '@/hooks/useTranslation';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface Policy {
  _id: string;
  title: string;
  slug: string;
  content: string;
  meta_description?: string;
  status: 'Active' | 'Inactive';
  last_updated: string;
  created_at: string;
  updated_at: string;
}

export default function PoliciesPage() {
  const { t } = useTranslation();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [filteredPolicies, setFilteredPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchPolicies();
  }, []);

  useEffect(() => {
    filterPolicies();
  }, [policies, searchTerm, statusFilter]);

  const fetchPolicies = async () => {
    try {
      const response = await axiosInstance.get('/policies');
      if (response.data.success) {
        setPolicies(response.data.data);
      }
    } catch (error: any) {
      toast({
        title: t('pages:policies.fetchErrorTitle'),
        description: t('pages:policies.fetchErrorDesc'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filterPolicies = () => {
    let filtered = policies;

    if (searchTerm) {
      filtered = filtered.filter(
        (policy) =>
          policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          policy.slug.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'All') {
      filtered = filtered.filter((policy) => policy.status === statusFilter);
    }

    setFilteredPolicies(filtered);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('pages:policies.deleteConfirm'))) return;

    try {
      const response = await axiosInstance.delete(`/policies/${id}`);
      if (response.data.success) {
        toast({
          title: t('pages:policies.deleteSuccessTitle'),
          description: t('pages:policies.deleteSuccessDesc'),
        });
        fetchPolicies();
      }
    } catch (error: any) {
      toast({
        title: t('pages:policies.deleteErrorTitle'),
        description: t('pages:policies.deleteErrorDesc'),
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Skeleton loading component
  const SkeletonRow = () => (
    <TableRow>
      <TableCell><Skeleton width={30} /></TableCell>
      <TableCell><Skeleton width={150} /></TableCell>
      <TableCell><Skeleton width={100} /></TableCell>
      <TableCell><Skeleton width={120} /></TableCell>
      <TableCell><Skeleton width={80} /></TableCell>
      <TableCell><Skeleton width={40} height={32} /></TableCell>
    </TableRow>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <PoliciesSidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="container mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold">
                  {loading ? <Skeleton width={120} /> : t('pages:policies.title')}
                </h1>
                <p className="text-muted-foreground">
                  {loading ? <Skeleton width={300} /> : t('pages:policies.description')}
                </p>
              </div>
              {!loading && (
                <Button onClick={() => router.push('/policies/create')}>
                  <Plus className="mr-2 h-4 w-4" />
                  {t('pages:policies.createButton')}
                </Button>
              )}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>
                  {loading ? <Skeleton width={150} /> : t('pages:policies.legalPages')}
                </CardTitle>
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder={t('pages:policies.searchPlaceholder')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                      disabled={loading}
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as 'All' | 'Active' | 'Inactive')}
                    className="border rounded-md px-3 py-2"
                    disabled={loading}
                  >
                    <option value="All">{t('pages:policies.filterAll')}</option>
                    <option value="Active">{t('pages:policies.filterActive')}</option>
                    <option value="Inactive">{t('pages:policies.filterInactive')}</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('pages:policies.table.id')}</TableHead>
                      <TableHead>{t('pages:policies.table.title')}</TableHead>
                      <TableHead>{t('pages:policies.table.url')}</TableHead>
                      <TableHead>{t('pages:policies.table.lastUpdated')}</TableHead>
                      <TableHead>{t('pages:policies.table.status')}</TableHead>
                      <TableHead>{t('pages:policies.table.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      // Show skeleton loading when data is loading
                      <>
                        {Array.from({ length: 5 }).map((_, index) => (
                          <SkeletonRow key={index} />
                        ))}
                      </>
                    ) : filteredPolicies.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          {t('pages:policies.noPolicies')}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPolicies.map((policy, index) => (
                        <TableRow key={policy._id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell className="font-medium">{policy.title}</TableCell>
                          <TableCell>
                            <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                              /{policy.slug}
                            </code>
                          </TableCell>
                          <TableCell>{formatDate(policy.last_updated)}</TableCell>
                          <TableCell>
                            <Badge
                              variant={policy.status === 'Active' ? 'default' : 'secondary'}
                              className={
                                policy.status === 'Active'
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                              }
                            >
                              {policy.status === 'Active' 
                                ? t('pages:policies.statusActive') 
                                : t('pages:policies.statusInactive')
                              }
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => router.push(`/policies/${policy._id}`)}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  {t('pages:policies.actionView')}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => router.push(`/policies/edit/${policy._id}`)}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  {t('pages:policies.actionEdit')}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDelete(policy._id)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  {t('pages:policies.actionDelete')}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}