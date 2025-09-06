"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Mail, Phone, Calendar, Shield, Activity, Bell, CheckCircle, XCircle, Clock } from "lucide-react";
import { getUserDetails, verifyLawyer, rejectLawyer } from "@/lib/adminApi";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/useTranslation";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface UserDetails {
  id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    profileImage: string | null;
    accountType: string;
    isActive: number;
    isVerified: number;
    isProfileCompleted: number;
  };
  accountDetails: {
    registeredOn: string;
    lastUpdated: string;
    fcmToken: string;
  };
  activityStats: {
    totalCases?: number;
    activeCases?: number;
    totalMeetings?: number;
    completedMeetings?: number;
  };
  recentNotifications: Array<{
    id: string;
    title: string;
    message: string;
    type: string;
    priority: string;
    isRead: boolean;
    createdAt: string;
    createdBy: {
      name: string;
      accountType: string;
    } | null;
  }>;
}

export default function UserDetailsPage() {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;
  
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const response = await getUserDetails(userId);
      if (response.success) {
        setUserDetails(response.data);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast.error(t('pages:userDetails.fetchError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  const handleVerifyLawyer = async () => {
    try {
      const response = await verifyLawyer(userId);
      if (response.success) {
        toast.success(t('pages:userDetails.verifySuccess'));
        fetchUserDetails();
      }
    } catch (error) {
      console.error('Error verifying lawyer:', error);
      toast.error(t('pages:userDetails.verifyError'));
    }
  };

  const handleRejectLawyer = async () => {
    try {
      const response = await rejectLawyer(userId, t('pages:userDetails.rejectReason'));
      if (response.success) {
        toast.success(t('pages:userDetails.rejectSuccess'));
        fetchUserDetails();
      }
    } catch (error) {
      console.error('Error rejecting lawyer:', error);
      toast.error(t('pages:userDetails.rejectError'));
    }
  };

  const getStatusColor = (status: number) => {
    return status === 1 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const getStatusText = (status: number) => {
    return status === 1 ? t('pages:userDetails.active') : t('pages:userDetails.inactive');
  };

  const getVerificationStatus = (isVerified: number, accountType: string) => {
    if (accountType !== 'lawyer') return { text: t('pages:userDetails.notApplicable'), color: 'bg-gray-100 text-gray-800' };
    return isVerified === 1 
      ? { text: t('pages:userDetails.verified'), color: 'bg-green-100 text-green-800' }
      : { text: t('pages:userDetails.pending'), color: 'bg-yellow-100 text-yellow-800' };
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getAccountTypeTranslation = (accountType: string) => {
    switch (accountType.toLowerCase()) {
      case 'lawyer':
        return t('pages:userDetails.lawyer');
      case 'client':
        return t('pages:userDetails.client');
      case 'admin':
        return t('pages:userDetails.admin');
      default:
        return accountType;
    }
  };

  const getAccountTypeColor = (accountType: string) => {
    switch (accountType.toLowerCase()) {
      case 'lawyer':
        return 'bg-blue-100 text-blue-800';
      case 'client':
        return 'bg-green-100 text-green-800';
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="mb-6 flex items-center gap-4">
                <Skeleton width={100} height={40} />
                <div>
                  <Skeleton width={200} height={28} />
                  <Skeleton width={120} height={20} className="mt-1" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <Skeleton width={180} height={24} />
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start gap-6">
                        <Skeleton circle width={80} height={80} />
                        <div className="flex-1 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Skeleton width={120} height={20} />
                            <Skeleton width={120} height={20} />
                            <Skeleton width={120} height={20} />
                            <Skeleton width={120} height={20} />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <Skeleton width={180} height={24} />
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Skeleton height={80} />
                        <Skeleton height={80} />
                        <Skeleton height={80} />
                        <Skeleton height={80} />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <Skeleton width={180} height={24} />
                      <Skeleton width={200} height={16} />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, index) => (
                          <div key={index} className="flex items-start gap-3 p-3">
                            <Skeleton circle width={16} height={16} className="mt-2" />
                            <div className="flex-1">
                              <Skeleton width={120} height={18} className="mb-2" />
                              <Skeleton width={200} height={14} className="mb-2" />
                              <Skeleton width={150} height={12} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <Skeleton width={120} height={24} />
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Skeleton width={100} height={20} />
                      <Skeleton width={100} height={20} />
                      <Skeleton width={100} height={20} />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <Skeleton width={120} height={24} />
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Skeleton width={100} height={20} />
                      <Skeleton width={100} height={20} />
                      <Skeleton width={100} height={20} />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!userDetails) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="text-center py-12">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  {t('pages:userDetails.userNotFound')}
                </h2>
                <p className="text-gray-600 mb-4">
                  {t('pages:userDetails.userNotFoundDesc')}
                </p>
                <Button onClick={() => router.back()}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t('common:back')}
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const { personalInfo, accountDetails, activityStats, recentNotifications } = userDetails;
  const verificationStatus = getVerificationStatus(personalInfo.isVerified, personalInfo.accountType);

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.back()}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {t('common:back')}
                </Button>
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">
                    {personalInfo.firstName} {personalInfo.lastName}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {t('pages:userDetails.title')}
                  </p>
                </div>
              </div>
              
              {personalInfo.accountType === 'lawyer' && personalInfo.isVerified === 0 && (
                <div className="flex gap-2">
                  <Button
                    onClick={handleVerifyLawyer}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {t('pages:userDetails.verifyLawyer')}
                  </Button>
                  <Button
                    onClick={handleRejectLawyer}
                    variant="destructive"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    {t('pages:userDetails.reject')}
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Personal Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      {t('pages:userDetails.personalInfo')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-6">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={personalInfo.profileImage || undefined} />
                        <AvatarFallback className="bg-gray-900 text-white text-lg">
                          {personalInfo.firstName?.[0]}{personalInfo.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-500">
                              {t('pages:userDetails.fullName')}
                            </label>
                            <p className="text-gray-900">{personalInfo.firstName} {personalInfo.lastName}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">
                              {t('pages:userDetails.accountType')}
                            </label>
                            <div className="flex items-center gap-2">
                              <Badge className={getAccountTypeColor(personalInfo.accountType)}>
                                {getAccountTypeTranslation(personalInfo.accountType)}
                              </Badge>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">
                              {t('pages:userDetails.email')}
                            </label>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-gray-400" />
                              <p className="text-gray-900">{personalInfo.email}</p>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">
                              {t('pages:userDetails.phone')}
                            </label>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-gray-400" />
                              <p className="text-gray-900">{personalInfo.phone || t('pages:userDetails.notProvided')}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Activity Statistics */}
                {Object.keys(activityStats).length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        {t('pages:userDetails.activityStats')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {activityStats.totalCases !== undefined && (
                          <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">{activityStats.totalCases}</div>
                            <div className="text-sm text-blue-600">{t('pages:userDetails.totalCases')}</div>
                          </div>
                        )}
                        {activityStats.activeCases !== undefined && (
                          <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">{activityStats.activeCases}</div>
                            <div className="text-sm text-green-600">{t('pages:userDetails.activeCases')}</div>
                          </div>
                        )}
                        {activityStats.totalMeetings !== undefined && (
                          <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">{activityStats.totalMeetings}</div>
                            <div className="text-sm text-purple-600">{t('pages:userDetails.totalMeetings')}</div>
                          </div>
                        )}
                        {activityStats.completedMeetings !== undefined && (
                          <div className="text-center p-4 bg-orange-50 rounded-lg">
                            <div className="text-2xl font-bold text-orange-600">{activityStats.completedMeetings}</div>
                            <div className="text-sm text-orange-600">{t('pages:userDetails.completedMeetings')}</div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Recent Notifications */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      {t('pages:userDetails.recentNotifications')}
                    </CardTitle>
                    <CardDescription>{t('pages:userDetails.recentNotificationsDesc')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {recentNotifications.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">
                        {t('pages:userDetails.noNotifications')}
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {recentNotifications.map((notification) => (
                          <div key={notification.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className={`h-2 w-2 rounded-full mt-2 ${notification.isRead ? 'bg-gray-300' : 'bg-blue-500'}`}></div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-gray-900">{notification.title}</h4>
                                <Badge variant="outline" className={getPriorityColor(notification.priority)}>
                                  {notification.priority}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span>{new Date(notification.createdAt).toLocaleDateString()}</span>
                                {notification.createdBy && (
                                  <span>{t('pages:userDetails.by')} {notification.createdBy.name}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Account Status */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t('pages:userDetails.accountStatus')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{t('pages:userDetails.status')}</span>
                      <Badge className={getStatusColor(personalInfo.isActive)}>
                        {getStatusText(personalInfo.isActive)}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{t('pages:userDetails.verification')}</span>
                      <Badge className={verificationStatus.color}>
                        {verificationStatus.text}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{t('pages:userDetails.profileComplete')}</span>
                      <Badge className={getStatusColor(personalInfo.isProfileCompleted)}>
                        {personalInfo.isProfileCompleted === 1 ? t('pages:userDetails.complete') : t('pages:userDetails.incomplete')}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Account Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t('pages:userDetails.accountDetails')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        {t('pages:userDetails.registeredOn')}
                      </label>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <p className="text-sm text-gray-900">
                          {new Date(accountDetails.registeredOn).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        {t('pages:userDetails.lastUpdated')}
                      </label>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <p className="text-sm text-gray-900">
                          {new Date(accountDetails.lastUpdated).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        {t('pages:userDetails.pushNotifications')}
                      </label>
                      <p className="text-sm text-gray-900 mt-1">{accountDetails.fcmToken}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}