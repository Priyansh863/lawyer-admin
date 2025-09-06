"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getRecentActivity } from "@/lib/adminApi"
import { useTranslation } from "@/hooks/useTranslation"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

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
  const { t } = useTranslation()
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
            title: t('pages:recentActivity.lawyerVerified'),
            message: t('pages:recentActivity.lawyerVerifiedDesc'),
            type: "verification",
            user: { name: "Dr. S. Roy", accountType: "lawyer", initials: "SR" },
            timeAgo: t('pages:recentActivity.hoursAgo', { hours: 2 })
          },
          {
            id: "2", 
            title: t('pages:recentActivity.blogApproved'),
            message: t('pages:recentActivity.blogApprovedDesc'),
            type: "blog_approval",
            user: { name: "Lawyer A. Khan", accountType: "lawyer", initials: "AK" },
            timeAgo: t('pages:recentActivity.hoursAgo', { hours: 3 })
          },
          {
            id: "3",
            title: t('pages:recentActivity.newClientRegistered'), 
            message: t('pages:recentActivity.newClientRegisteredDesc'),
            type: "registration",
            user: { name: "M. Sharma", accountType: "client", initials: "MS" },
            timeAgo: t('pages:recentActivity.hoursAgo', { hours: 5 })
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentActivity();
  }, [t]);

  const getActivityTitle = (activity: ActivityItem) => {
    switch (activity.type.toLowerCase()) {
      case 'verification':
      case 'lawyer_verification':
        return t('pages:recentActivity.lawyerVerified');
      case 'blog_approval':
      case 'content_approval':
        return t('pages:recentActivity.blogApproved');
      case 'registration':
      case 'user_registration':
        return t('pages:recentActivity.newClientRegistered');
      case 'meeting':
      case 'chat':
        return t('pages:recentActivity.meetingScheduled');
      default:
        return activity.title;
    }
  };

  if (loading) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            {t('pages:recentActivity.title')}
          </CardTitle>
          <p className="text-sm text-gray-500">
            {t('pages:recentActivity.subtitle')}
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Skeleton circle width={40} height={40} />
                  <div>
                    <Skeleton width={120} height={16} className="mb-1" />
                    <Skeleton width={80} height={14} />
                  </div>
                </div>
                <Skeleton width={60} height={14} />
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
        <CardTitle className="text-lg font-semibold text-gray-900">
          {t('pages:recentActivity.title')}
        </CardTitle>
        <p className="text-sm text-gray-500">
          {t('pages:recentActivity.subtitle')}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const colors = getActivityColor(activity.type);
            const translatedTitle = getActivityTitle(activity);
            
            return (
              <div key={activity.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className={`h-10 w-10 ${colors.bgColor}`}>
                    <AvatarFallback className={`${colors.textColor} font-medium`}>
                      {activity.user?.initials || activity.type.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{translatedTitle}</p>
                    <p className="text-sm text-gray-500">{activity.user?.name || t('pages:recentActivity.system')}</p>
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