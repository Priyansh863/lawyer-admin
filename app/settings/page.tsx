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

export default function SettingsPage() {
  const { toast } = useToast();
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
        title: "Error",
        description: "Failed to load profile data",
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
          title: "Success",
          description: "Profile updated successfully!",
          variant: "default",
        });
        setProfileData(response.data);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
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
        title: "Success",
        description: "Profile picture uploaded successfully!",
        variant: "default",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to upload image',
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
        title: "Error",
        description: "New passwords don't match!",
        variant: "destructive",
      });
      return;
    }
    if (securityData.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long!",
        variant: "destructive",
      });
      return;
    }
    // Here you would typically make an API call to change the password
    toast({
      title: "Success",
      description: "Password changed successfully!",
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
      title: "Success",
      description: "System settings updated successfully!",
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
              <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
              <p className="text-gray-600 mt-1">Manage your account and system preferences</p>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
             

              {/* Profile Tab */}
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Update your personal information and profile details
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
                        <h3 className="font-medium text-gray-900">Profile Picture</h3>
                        <p className="text-sm text-gray-500">
                          Upload a new profile picture. Recommended size: 200x200px
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
                        <Label htmlFor="firstName">First Name</Label>
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
                        <Label htmlFor="lastName">Last Name</Label>
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
                        <Label htmlFor="email">Email</Label>
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
                        <Label htmlFor="phone">Phone</Label>
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
                      Save Changes
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
                      <CardTitle>Change Password</CardTitle>
                      <CardDescription>
                        Update your password to keep your account secure
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
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
                        <Label htmlFor="newPassword">New Password</Label>
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
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
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
                        Change Password
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Security Settings */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Security Settings</CardTitle>
                      <CardDescription>
                        Configure your security preferences
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Two-Factor Authentication</Label>
                          <p className="text-sm text-gray-500">
                            Add an extra layer of security to your account
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
                          <Label>Email Notifications</Label>
                          <p className="text-sm text-gray-500">
                            Receive security alerts via email
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
                          <Label>SMS Notifications</Label>
                          <p className="text-sm text-gray-500">
                            Receive security alerts via SMS
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
                    <CardTitle>System Settings</CardTitle>
                    <CardDescription>
                      Configure system-wide settings and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Maintenance Mode</Label>
                        <p className="text-sm text-gray-500">
                          Enable maintenance mode to restrict user access
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
                        <Label>User Registration</Label>
                        <p className="text-sm text-gray-500">
                          Allow new users to register accounts
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
                        <Label>Email Verification</Label>
                        <p className="text-sm text-gray-500">
                          Require email verification for new accounts
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
                        <Label>Auto Backup</Label>
                        <p className="text-sm text-gray-500">
                          Automatically backup system data
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
                      <Label htmlFor="backupFrequency">Backup Frequency</Label>
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
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleSystemSettingsUpdate} className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Save System Settings
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
