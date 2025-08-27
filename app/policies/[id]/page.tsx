'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import axiosInstance from '@/lib/axiosInstance';
import ReactMarkdown from 'react-markdown';
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

export default function ViewPolicyPage() {
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();

  useEffect(() => {
    if (params.id) {
      fetchPolicy(params.id as string);
    }
  }, [params.id]);

  const fetchPolicy = async (id: string) => {
    try {
      const response = await axiosInstance.get(`/policies/${id}`);
      if (response.data.success) {
        setPolicy(response.data.data);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to fetch policy details',
        variant: 'destructive',
      });
      router.push('/policies');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!policy || !confirm('Are you sure you want to delete this policy?')) return;

    try {
      const response = await axiosInstance.delete(`/policies/${policy._id}`);
      if (response.data.success) {
        toast({
          title: 'Success',
          description: 'Policy deleted successfully',
        });
        router.push('/policies');
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <PoliciesSidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-lg">Loading policy...</div>
        </div>
      </div>
    );
  }

  if (!policy) {
    return (
      <div className="flex h-screen bg-gray-50">
        <PoliciesSidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-lg">Policy not found</div>
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
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={() => router.back()}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <div>
                  <h1 className="text-3xl font-bold">{policy.title}</h1>
                  <p className="text-muted-foreground">
                    URL: /{policy.slug}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => router.push(`/policies/edit/${policy._id}`)}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <ReactMarkdown>{policy.content}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Policy Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="mt-1">
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
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">URL Slug</label>
                <div className="mt-1">
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                    /{policy.slug}
                  </code>
                </div>
              </div>

              {policy.meta_description && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Meta Description</label>
                  <p className="mt-1 text-sm">{policy.meta_description}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-muted-foreground">Created</label>
                <p className="mt-1 text-sm">{formatDate(policy.created_at)}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                <p className="mt-1 text-sm">{formatDate(policy.last_updated)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
          </div>
        </div>
      </div>
    </div>
  );
}
