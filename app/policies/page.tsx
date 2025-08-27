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
        title: 'Error',
        description: 'Failed to fetch policies',
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
    if (!confirm('Are you sure you want to delete this policy?')) return;

    try {
      const response = await axiosInstance.delete(`/policies/${id}`);
      if (response.data.success) {
        toast({
          title: 'Success',
          description: 'Policy deleted successfully',
        });
        fetchPolicies();
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to delete policy',
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

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading policies...</div>
        </div>
      </div>
    );
  }

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
                <h1 className="text-3xl font-bold">Policies</h1>
                <p className="text-muted-foreground">
                  Manage your legal pages like terms & conditions, privacy policy, etc.
                </p>
              </div>
              <Button onClick={() => router.push('/policies/add')} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Legal Page
              </Button>
            </div>

      <Card>
        <CardHeader>
          <CardTitle>Legal Pages</CardTitle>
          <div className="flex items-center gap-4">
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPolicies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No policies found
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
                        {policy.status}
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
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => router.push(`/policies/edit/${policy._id}`)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(policy._id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
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
