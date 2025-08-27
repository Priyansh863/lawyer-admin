'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import axiosInstance from '@/lib/axiosInstance';
import dynamic from 'next/dynamic';
import { PoliciesSidebar } from '@/components/policies-sidebar';

// Dynamic import for markdown editor to avoid SSR issues

interface PolicyFormData {
  title: string;
  slug: string;
  content: string;
  meta_description: string;
  status: 'Active' | 'Inactive';
}

export default function AddPolicyPage() {
  const [formData, setFormData] = useState<PolicyFormData>({
    title: '',
    slug: '',
    content: '',
    meta_description: '',
    status: 'Active',
  });
  const [loading, setLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.slug || !formData.content) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post('/policies', formData);
      if (response.data.success) {
        toast({
          title: 'Success',
          description: 'Policy created successfully',
        });
        router.push('/policies');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to create policy',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex h-screen bg-gray-50">
      <PoliciesSidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="container mx-auto p-6">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Add Legal Page</h1>
                <p className="text-muted-foreground">
                  Create a new legal page like terms & conditions, privacy policy, etc.
                </p>
              </div>
            </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Page Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g., Privacy Policy"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="slug">URL Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="e.g., privacy-policy"
                    required
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    This will be the URL: /{formData.slug}
                  </p>
                </div>

                <div>
                  <Label htmlFor="content">Content *</Label>
                  <div className="mt-2" data-color-mode="light">
                  
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Use Markdown syntax for formatting. Preview will be rendered as HTML.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Page Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: 'Active' | 'Inactive') =>
                      setFormData(prev => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Textarea
                    id="meta_description"
                    value={formData.meta_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                    placeholder="Brief description for SEO..."
                    rows={3}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Optional: Used for search engine optimization
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {loading ? 'Creating...' : 'Create Policy'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
          </div>
        </div>
      </div>
    </div>
  );
}
