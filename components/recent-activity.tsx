"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getRecentActivity } from "@/lib/adminApi"

interface ActivityItem {
  id: string;
  title: string;
  message: string;
  type: string;
  user: {
    name: string;
    accountType: string;
    initials: string;
  } | null;
  timeAgo: string;
}

const getActivityColor = (type: string) => {
  switch (type.toLowerCase()) {
    case 'lawyer_verification':
    case 'verification':
      return { bgColor: "bg-red-100", textColor: "text-red-600" };
    case 'blog_approval':
    case 'content_approval':
      return { bgColor: "bg-yellow-100", textColor: "text-yellow-600" };
    case 'user_registration':
    case 'registration':
      return { bgColor: "bg-green-100", textColor: "text-green-600" };
    case 'meeting':
    case 'chat':
      return { bgColor: "bg-blue-100", textColor: "text-blue-600" };
    default:
      return { bgColor: "bg-gray-100", textColor: "text-gray-600" };
  }
};

export function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        const response = await getRecentActivity();
        if (response.success) {
          setActivities(response.data);
        }
      } catch (error) {
        console.error('Error fetching recent activity:', error);
        // Set fallback data
        setActivities([
          {
            id: "1",
            title: "Lawyer verified",
            message: "Dr. S. Roy has been verified",
            type: "verification",
            user: { name: "Dr. S. Roy", accountType: "lawyer", initials: "SR" },
            timeAgo: "2 hours ago"
          },
          {
            id: "2", 
            title: "Blog Approved",
            message: "Blog post approved",
            type: "blog_approval",
            user: { name: "Lawyer A. Khan", accountType: "lawyer", initials: "AK" },
            timeAgo: "3 hours ago"
          },
          {
            id: "3",
            title: "New Client Registered", 
            message: "New client registration",
            type: "registration",
            user: { name: "M. Sharma", accountType: "client", initials: "MS" },
            timeAgo: "5 hours ago"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentActivity();
  }, []);

  if (loading) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Recent Activity</CardTitle>
          <p className="text-sm text-gray-500">Last 2 Weeks</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((index) => (
              <div key={index} className="flex items-center justify-between animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-12"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Recent Activity</CardTitle>
        <p className="text-sm text-gray-500">Last 2 Weeks</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const colors = getActivityColor(activity.type);
            return (
              <div key={activity.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className={`h-10 w-10 ${colors.bgColor}`}>
                    <AvatarFallback className={`${colors.textColor} font-medium`}>
                      {activity.user?.initials || activity.type.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-500">{activity.user?.name || 'System'}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-400">{activity.timeAgo}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  )
}
