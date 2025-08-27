"use client"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Shield, FileText, DollarSign } from "lucide-react"
import { getDashboardStats } from "@/lib/adminApi"

interface DashboardStatsData {
  totalUsers: number;
  regularUsers: number;
  verifiedLawyers: number;
  contentToday: number;
  tokensTransacted: number;
}

export function DashboardStats() {
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
      title: "Regular User",
      value: stats?.regularUsers || 0,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Verified Lawyers",
      value: stats?.verifiedLawyers || 0,
      icon: Shield,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Blogs/Articles Today",
      value: stats?.contentToday || 0,
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Tokens Transacted",
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
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
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
