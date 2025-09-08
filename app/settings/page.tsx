"use client";

import { useState, useEffect, useRef } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, Save, Eye, EyeOff, Upload, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getAdminProfile, updateAdminProfile } from "@/lib/adminApi";
import { handleImageUpload } from "@/lib/fileUpload";
import LanguageSettings from "@/components/language-settings";
import { useTranslation } from "@/hooks/useTranslation";

export default function SettingsPage() {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    profile_image: "",
    _id: ""
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,
    emailNotifications: true,
    smsNotifications: false
  });

  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    userRegistration: true,
    emailVerification: true,
    autoBackup: true,
    backupFrequency: "daily"
  });

  // Fetch admin profile on component mount
  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      setLoading(true);
      const response = await getAdminProfile();
      if (response.success) {
        setProfileData({
          first_name: response.data.first_name || "",
          last_name: response.data.last_name || "",
          email: response.data.email || "",
          phone: response.data.phone || "",
          profile_image: response.data.profile_image || "",
          _id: response.data._id || ""
        });
      }
    } catch (error) {
      console.error('Error fetching admin profile:', error);
      toast({
        title: t('common.error'),
        description: t('settings.profile.loadError'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const response = await updateAdminProfile(profileData);
      if (response.success) {
        toast({
          title: t('common.success'),
          description: t('settings.profile.updateSuccess'),
          variant: "default",
        });
        setProfileData(response.data);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: t('common.error'),
        description: t('settings.profile.updateError'),
        variant: "destructive",
      });
    }
  };

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setUploadProgress(0);
      
      const imageUrl = await handleImageUpload(
        file,
        profileData._id,
        (progress) => setUploadProgress(progress)
      );
      
      setProfileData(prev => ({
        ...prev,
        profile_image: imageUrl
      }));
      
      toast({
        title: t('common.success'),
        description: t('settings.profile.imageSuccess'),
        variant: "default",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: t('common.error'),
        description: error instanceof Error ? error.message : t('settings.profile.imageError'),
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handlePasswordChange = () => {
    if (securityData.newPassword !== securityData.confirmPassword) {
      toast({
        title: t('common.error'),
        description: t('settings.security.passwordMismatch'),
        variant: "destructive",
      });
      return;
    }
    if (securityData.newPassword.length < 8) {
      toast({
        title: t('common.error'),
        description: t('settings.security.passwordLength'),
        variant: "destructive",
      });
      return;
    }
    // Here you would typically make an API call to change the password
    toast({
      title: t('common.success'),
      description: t('settings.security.passwordSuccess'),
      variant: "default",
    });
    setSecurityData(prev => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }));
  };

  const handleSystemSettingsUpdate = () => {
    // Here you would typically make an API call to update system settings
    toast({
      title: t('common.success'),
      description: t('settings.system.updateSuccess'),
      variant: "default",
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">{t('settings.title')}</h1>
              <p className="text-gray-600 mt-1">{t('settings.description')}</p>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="profile">{t('settings.profile.tab')}</TabsTrigger>

              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('settings.profile.title')}</CardTitle>
                    <CardDescription>
                      {t('settings.profile.description')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Avatar Section */}
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <Avatar className="h-20 w-20">
                          <AvatarImage src={profileData.profile_image} />
                          <AvatarFallback>
                            {profileData.first_name?.[0]}{profileData.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <Button
                          size="sm"
                          variant="outline"
                          className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                          onClick={handleImageUploadClick}
                          disabled={uploading}
                        >
                          {uploading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Camera className="h-4 w-4" />
                          )}
                        </Button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{t('settings.profile.profilePicture')}</h3>
                        <p className="text-sm text-gray-500">
                          {t('settings.profile.uploadHelp')}
                        </p>
                        {uploading && (
                          <div className="mt-2">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${uploadProgress}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-500">{uploadProgress}%</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">{t('settings.profile.firstName')}</Label>
                        <Input
                          id="firstName"
                          value={profileData.first_name}
                          onChange={(e) => setProfileData(prev => ({
                            ...prev,
                            first_name: e.target.value
                          }))}
                          disabled={loading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">{t('settings.profile.lastName')}</Label>
                        <Input
                          id="lastName"
                          value={profileData.last_name}
                          onChange={(e) => setProfileData(prev => ({
                            ...prev,
                            last_name: e.target.value
                          }))}
                          disabled={loading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">{t('settings.profile.email')}</Label>
                        <Input
                          disabled
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData(prev => ({
                            ...prev,
                            email: e.target.value
                          }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">{t('settings.profile.phone')}</Label>
                        <Input
                          id="phone"
                          value={profileData.phone}
                          onChange={(e) => setProfileData(prev => ({
                            ...prev,
                            phone: e.target.value
                          }))}
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <Button 
                      onClick={handleProfileUpdate} 
                      className="flex items-center gap-2"
                      disabled={loading}
                    >
                      <Save className="h-4 w-4" />
                      {t('common.save')}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security">
                <div className="space-y-6">
                  {/* Change Password */}
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('settings.security.changePassword')}</CardTitle>
                      <CardDescription>
                        {t('settings.security.passwordDescription')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">{t('settings.security.currentPassword')}</Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            type={showPassword ? "text" : "password"}
                            value={securityData.currentPassword}
                            onChange={(e) => setSecurityData(prev => ({
                              ...prev,
                              currentPassword: e.target.value
                            }))}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">{t('settings.security.newPassword')}</Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            value={securityData.newPassword}
                            onChange={(e) => setSecurityData(prev => ({
                              ...prev,
                              newPassword: e.target.value
                            }))}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">{t('settings.security.confirmPassword')}</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={securityData.confirmPassword}
                          onChange={(e) => setSecurityData(prev => ({
                            ...prev,
                            confirmPassword: e.target.value
                          }))}
                        />
                      </div>
                      <Button onClick={handlePasswordChange}>
                        {t('settings.security.changePassword')}
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Security Settings */}
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('settings.security.settingsTitle')}</CardTitle>
                      <CardDescription>
                        {t('settings.security.settingsDescription')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>{t('settings.security.twoFactor')}</Label>
                          <p className="text-sm text-gray-500">
                            {t('settings.security.twoFactorDesc')}
                          </p>
                        </div>
                        <Switch
                          checked={securityData.twoFactorEnabled}
                          onCheckedChange={(checked) => setSecurityData(prev => ({
                            ...prev,
                            twoFactorEnabled: checked
                          }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>{t('settings.security.emailNotifications')}</Label>
                          <p className="text-sm text-gray-500">
                            {t('settings.security.emailNotificationsDesc')}
                          </p>
                        </div>
                        <Switch
                          checked={securityData.emailNotifications}
                          onCheckedChange={(checked) => setSecurityData(prev => ({
                            ...prev,
                            emailNotifications: checked
                          }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>{t('settings.security.smsNotifications')}</Label>
                          <p className="text-sm text-gray-500">
                            {t('settings.security.smsNotificationsDesc')}
                          </p>
                        </div>
                        <Switch
                          checked={securityData.smsNotifications}
                          onCheckedChange={(checked) => setSecurityData(prev => ({
                            ...prev,
                            smsNotifications: checked
                          }))}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* System Tab */}
              <TabsContent value="system">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('settings.system.title')}</CardTitle>
                    <CardDescription>
                      {t('settings.system.description')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>{t('settings.system.maintenanceMode')}</Label>
                        <p className="text-sm text-gray-500">
                          {t('settings.system.maintenanceModeDesc')}
                        </p>
                      </div>
                      <Switch
                        checked={systemSettings.maintenanceMode}
                        onCheckedChange={(checked) => setSystemSettings(prev => ({
                          ...prev,
                          maintenanceMode: checked
                        }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>{t('settings.system.userRegistration')}</Label>
                        <p className="text-sm text-gray-500">
                          {t('settings.system.userRegistrationDesc')}
                        </p>
                      </div>
                      <Switch
                        checked={systemSettings.userRegistration}
                        onCheckedChange={(checked) => setSystemSettings(prev => ({
                          ...prev,
                          userRegistration: checked
                        }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>{t('settings.system.emailVerification')}</Label>
                        <p className="text-sm text-gray-500">
                          {t('settings.system.emailVerificationDesc')}
                        </p>
                      </div>
                      <Switch
                        checked={systemSettings.emailVerification}
                        onCheckedChange={(checked) => setSystemSettings(prev => ({
                          ...prev,
                          emailVerification: checked
                        }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>{t('settings.system.autoBackup')}</Label>
                        <p className="text-sm text-gray-500">
                          {t('settings.system.autoBackupDesc')}
                        </p>
                      </div>
                      <Switch
                        checked={systemSettings.autoBackup}
                        onCheckedChange={(checked) => setSystemSettings(prev => ({
                          ...prev,
                          autoBackup: checked
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="backupFrequency">{t('settings.system.backupFrequency')}</Label>
                      <Select
                        value={systemSettings.backupFrequency}
                        onValueChange={(value) => setSystemSettings(prev => ({
                          ...prev,
                          backupFrequency: value
                        }))}
                      >
                        <SelectTrigger className="w-[200px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">{t('settings.system.hourly')}</SelectItem>
                          <SelectItem value="daily">{t('settings.system.daily')}</SelectItem>
                          <SelectItem value="weekly">{t('settings.system.weekly')}</SelectItem>
                          <SelectItem value="monthly">{t('settings.system.monthly')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleSystemSettingsUpdate} className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      {t('settings.system.saveSettings')}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Language Settings at the bottom */}
            <div className="mt-8">
              <LanguageSettings />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}