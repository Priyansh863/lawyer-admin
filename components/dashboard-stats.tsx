"use client"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Shield, FileText, DollarSign } from "lucide-react"
import { getDashboardStats } from "@/lib/adminApi"
import { useTranslation } from "@/hooks/useTranslation"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

interface DashboardStatsData {
  totalUsers: number;
  regularUsers: number;
  verifiedLawyers: number;
  contentToday: number;
  tokensTransacted: number;
}

export function DashboardStats() {
  const { t } = useTranslation()
  const [stats, setStats] = useState<DashboardStatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getDashboardStats();
        if (response.success) {
          setStats(response.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsConfig = [
    {
      title: t('pages:dashboardStats.regularUsers'),
      value: stats?.regularUsers || 0,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: t('pages:dashboardStats.verifiedLawyers'),
      value: stats?.verifiedLawyers || 0,
      icon: Shield,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: t('pages:dashboardStats.contentToday'),
      value: stats?.contentToday || 0,
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: t('pages:dashboardStats.tokensTransacted'),
      value: `$${stats?.tokensTransacted?.toLocaleString() || 0}`,
      icon: DollarSign,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((index) => (
          <Card key={index} className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Skeleton width={80} height={32} className="mb-2" />
                  <Skeleton width={120} height={20} />
                </div>
                <div>
                  <Skeleton circle width={48} height={48} />
                </div>
              </div>
              <div className="mt-4">
                <Skeleton height={4} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsConfig.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600 mt-1">{stat.title}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              <div className="mt-4 h-1 bg-gray-200 rounded-full">
                <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}