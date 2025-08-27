"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Mail, Phone, MapPin, Pencil, Check } from "lucide-react"

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Update Profile") // 'Update Profile' or 'Change Password'
  const [notificationEnabled, setNotificationEnabled] = useState(true)

  // Profile data (simulated)
  const [profileData, setProfileData] = useState({
    name: "Anima Agr",
    role: "Lasxxxx",
    email: "xxxxxxxxx@gmail.com",
    phone: "123 XXXXXXXXXXX",
    address: "102-304 Sajik-ro-3-gil 23 Jongno-gu",
    avatar: "/placeholder.svg?height=100&width=100",
  })
  const [loadingProfile, setLoadingProfile] = useState(true)

  // Update Profile form fields
  const [username, setUsername] = useState("Anima Agr")
  const [email, setEmail] = useState("xxxxxxxxx@gmail.com")
  const [phone, setPhone] = useState("123 XXXXXXXXXXX")
  const [address, setAddress] = useState("102-304 Sajik-ro-3-gil 23 Jongno-gu")

  // Password fields
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Platform settings data (simulated)
  const [platformSettings, setPlatformSettings] = useState({
    tokenPrice: "1200",
    supportEmail: "Support@gmail.com",
    aiLogRetention: true,
  })
  const [loadingPlatformSettings, setLoadingPlatformSettings] = useState(true)

  useEffect(() => {
    const fetchSettingsData = async () => {
      setLoadingProfile(true)
      setLoadingPlatformSettings(true)
      try {
        // Simulate API call for profile data
        await new Promise((resolve) => setTimeout(resolve, 500))
        // In a real app, you'd fetch actual user data
        // setProfileData(fetchedProfileData);

        // Simulate API call for platform settings
        await new Promise((resolve) => setTimeout(resolve, 600))
        // In a real app, you'd fetch actual platform settings
        // setPlatformSettings(fetchedPlatformSettings);
      } catch (error) {
        console.error("Failed to fetch settings data:", error)
      } finally {
        setLoadingProfile(false)
        setLoadingPlatformSettings(false)
      }
    }
    fetchSettingsData()
  }, [])

  const handleUpdateProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Update Profile Submitted:", { username, email, phone, address })
    // Add actual profile update logic here
    alert("Profile updated successfully!")
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Change Password Submitted:", { oldPassword, newPassword, confirmPassword })
    // Add actual password change logic here
    alert("Password change simulated!")
    setOldPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  const handlePlatformSettingsSave = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Platform Settings Saved:", platformSettings)
    // Add actual save logic here
    alert("Platform settings saved!")
  }

  return (
    <div className="space-y-6" style={{ fontFamily: "Montserrat, sans-serif" }}>
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and platform settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1 bg-white rounded-lg border border-gray-200 p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Hi Agr,</h2>
          {loadingProfile ? (
            <div className="text-center text-gray-500">Loading profile...</div>
          ) : (
            <div className="flex flex-col items-center text-center">
              <img
                src={profileData.avatar || "/placeholder.svg?height=80&width=80"}
                alt="User Avatar"
                className="h-20 w-20 rounded-full object-cover mb-4"
              />
              <h3 className="text-lg font-medium text-gray-900">{profileData.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{profileData.role}</p>

              <div className="w-full space-y-3 text-left text-sm text-gray-700">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="break-all">{profileData.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span>{profileData.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span>{profileData.address}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <span className="text-sm font-medium text-gray-700">Notification</span>
            <button
              type="button"
              onClick={() => setNotificationEnabled(!notificationEnabled)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                notificationEnabled ? "bg-green-500" : "bg-gray-200"
              }`}
              role="switch"
              aria-checked={notificationEnabled}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  notificationEnabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Right Column: Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Update Profile / Change Password Tabs */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex border-b border-gray-200 mb-6">
              <button
                type="button"
                onClick={() => setActiveTab("Update Profile")}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "Update Profile"
                    ? "border-b-2 border-black text-gray-900"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Update Profile
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("Change Password")}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "Change Password"
                    ? "border-b-2 border-black text-gray-900"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Change Password
              </button>
            </div>

            {activeTab === "Update Profile" ? (
              // Update Profile Form
              <form onSubmit={handleUpdateProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-6 py-2 bg-black text-white rounded-md shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
                >
                  Update
                </button>
              </form>
            ) : (
              // Change Password Form
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Old Password
                  </label>
                  <input
                    type="password"
                    id="oldPassword"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2 bg-black text-white rounded-md shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                >
                  Submit
                </button>
              </form>
            )}
          </div>

          {/* Platform Settings */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Platform Settings</h2>
            {loadingPlatformSettings ? (
              <div className="text-center text-gray-500">Loading platform settings...</div>
            ) : (
              <form onSubmit={handlePlatformSettingsSave} className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <div className="text-sm font-medium text-gray-700">Token Price</div>
                    <div className="text-gray-600 text-sm">{platformSettings.tokenPrice}</div>
                  </div>
                  <button type="button" className="p-1 rounded-md text-gray-600 hover:bg-gray-100">
                    <Pencil className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <div className="text-sm font-medium text-gray-700">Support Email</div>
                    <div className="text-gray-600 text-sm">{platformSettings.supportEmail}</div>
                  </div>
                  <button type="button" className="p-1 rounded-md text-gray-600 hover:bg-gray-100">
                    <Pencil className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <div className="text-sm font-medium text-gray-700">AI Log Retention</div>
                    <div className="text-gray-600 text-sm">Maintenance</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPlatformSettings((prev) => ({ ...prev, aiLogRetention: !prev.aiLogRetention }))}
                    className="p-1 rounded-md text-gray-600 hover:bg-gray-100"
                  >
                    <div
                      className={`w-4 h-4 border border-gray-400 rounded ${platformSettings.aiLogRetention ? "bg-black" : "bg-white"} flex items-center justify-center`}
                    >
                      {platformSettings.aiLogRetention && <Check className="h-3 w-3 text-white" />}
                    </div>
                  </button>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2 bg-black text-white rounded-md shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                >
                  Save
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
