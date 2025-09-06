'use client';

import { useState, useEffect } from 'react';
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
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import axiosInstance from '@/lib/axiosInstance';
import { PoliciesSidebar } from '@/components/policies-sidebar';
import { useTranslation } from '@/hooks/useTranslation';

interface PolicyFormData {
  title: string;
  slug: string;
  content: string;
  meta_description: string;
  status: 'Active' | 'Inactive';
}

export default function EditPolicyPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<PolicyFormData>({
    title: '',
    slug: '',
    content: '',
    meta_description: '',
    status: 'Active',
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
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
        const policy = response.data.data;
        setFormData({
          title: policy.title,
          slug: policy.slug,
          content: policy.content,
          meta_description: policy.meta_description || '',
          status: policy.status,
        });
      }
    } catch (error: any) {
      toast({
        title: t('pages:policies.edit.fetchErrorTitle'),
        description: t('pages:policies.edit.fetchErrorDesc'),
        variant: 'destructive',
      });
      router.push('/policies');
    } finally {
      setInitialLoading(false);
    }
  };

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
        title: t('pages:policies.edit.validationErrorTitle'),
        description: t('pages:policies.edit.validationErrorDesc'),
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.put(`/policies/${params.id}`, formData);
      if (response.data.success) {
        toast({
          title: t('pages:policies.edit.successTitle'),
          description: t('pages:policies.edit.successDesc'),
        });
        router.push('/policies');
      }
    } catch (error: any) {
      toast({
        title: t('pages:policies.edit.updateErrorTitle'),
        description: error.response?.data?.error || t('pages:policies.edit.updateErrorDesc'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <PoliciesSidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-lg">{t('pages:policies.edit.loading')}</div>
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
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                {t('pages:policies.edit.backButton')}
              </Button>
              <div>
                <h1 className="text-3xl font-bold">{t('pages:policies.edit.title')}</h1>
                <p className="text-muted-foreground">
                  {t('pages:policies.edit.description')}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('pages:policies.edit.pageContent')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <Label htmlFor="title">{t('pages:policies.edit.titleLabel')} *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => handleTitleChange(e.target.value)}
                          placeholder={t('pages:policies.edit.titlePlaceholder')}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="slug">{t('pages:policies.edit.slugLabel')} *</Label>
                        <Input
                          id="slug"
                          value={formData.slug}
                          onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                          placeholder={t('pages:policies.edit.slugPlaceholder')}
                          required
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                          {t('pages:policies.edit.slugHelp', { slug: formData.slug })}
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="content">{t('pages:policies.edit.contentLabel')} *</Label>
                        <Textarea
                          id="content"
                          value={formData.content}
                          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                          placeholder={t('pages:policies.edit.contentPlaceholder')}
                          rows={15}
                          required
                          className="font-mono text-sm"
                        />
                        <p className="text-sm text-muted-foreground mt-2">
                          {t('pages:policies.edit.contentHelp')}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('pages:policies.edit.pageSettings')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="status">{t('pages:policies.edit.statusLabel')}</Label>
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
                            <SelectItem value="Active">
                              {t('pages:policies.statusActive')}
                            </SelectItem>
                            <SelectItem value="Inactive">
                              {t('pages:policies.statusInactive')}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="meta_description">
                          {t('pages:policies.edit.metaDescriptionLabel')}
                        </Label>
                        <Textarea
                          id="meta_description"
                          value={formData.meta_description}
                          onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                          placeholder={t('pages:policies.edit.metaDescriptionPlaceholder')}
                          rows={3}
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                          {t('pages:policies.edit.metaDescriptionHelp')}
                        </p>
                      </div>

                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center gap-2"
                      >
                        <Save className="h-4 w-4" />
                        {loading ? t('pages:policies.edit.updatingButton') : t('pages:policies.edit.updateButton')}
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