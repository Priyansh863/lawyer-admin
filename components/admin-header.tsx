"use client"
import { signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogOut, User, Settings } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function AdminHeader() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    console.log("Session data in AdminHeader:", session)
    if (session?.user) {
      setUserData(session.user)
    }
  }, [session])

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false })
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of the admin panel.",
        variant: "default",
      })
      router.push("/login")
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was an error logging you out. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getUserDisplayName = () => {
    if (userData?.first_name && userData?.last_name) {
      return `${userData.first_name} ${userData.last_name}`
    }
    if (userData?.first_name) {
      return userData.first_name
    }
    return userData?.email?.split('@')[0] || 'Admin User'
  }

  const getUserRole = () => {
    return userData?.account_type === 'admin' ? 'Super Admin' : 'Admin'
  }

  const getUserImage = () => {
    return userData?.profile_image || null
  }

  const getUserInitials = () => {
    if (userData?.first_name && userData?.last_name) {
      return `${userData.first_name[0]}${userData.last_name[0]}`.toUpperCase()
    }
    if (userData?.first_name) {
      return userData.first_name.slice(0, 2).toUpperCase()
    }
    return userData?.email?.slice(0, 2).toUpperCase() || 'AU'
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">Admin Panel</h1>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 hidden sm:block">
              Welcome, {getUserDisplayName()}
            </span>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6">
                    {getUserImage() ? (
                      <AvatarImage src={getUserImage()} alt="User Avatar" />
                    ) : null}
                    <AvatarFallback className="text-xs">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block">Account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      {getUserImage() ? (
                        <AvatarImage src={getUserImage()} alt="User Avatar" />
                      ) : null}
                      <AvatarFallback className="text-xs">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{getUserDisplayName()}</span>
                      <span className="text-xs text-gray-500">{getUserRole()}</span>
                    </div>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/settings')}>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
