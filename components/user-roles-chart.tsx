"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserRolesDistribution } from "@/lib/adminApi"

interface RoleData {
  role: string;
  count: number;
  percentage: number;
}

const roleColors = {
  lawyer: { color: "#8B5CF6", bg: "bg-purple-500" },
  client: { color: "#EC4899", bg: "bg-pink-500" },
  admin: { color: "#14B8A6", bg: "bg-teal-500" },
  user: { color: "#6B7280", bg: "bg-gray-500" }
};

export function UserRolesChart() {
  const [roleData, setRoleData] = useState<RoleData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoleDistribution = async () => {
      try {
        const response = await getUserRolesDistribution();
        if (response.success) {
          setRoleData(response.data);
        }
      } catch (error) {
        console.error('Error fetching role distribution:', error);
        // Set fallback data
        setRoleData([
          { role: "lawyer", count: 45, percentage: 45 },
          { role: "client", count: 35, percentage: 35 },
          { role: "admin", count: 10, percentage: 10 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRoleDistribution();
  }, []);

  const calculateStrokeDasharray = (percentage: number) => {
    const circumference = 2 * Math.PI * 80; // r=80
    const strokeLength = (percentage / 100) * circumference;
    return `${strokeLength} ${circumference}`;
  };

  const calculateStrokeDashoffset = (startPercentage: number) => {
    const circumference = 2 * Math.PI * 80;
    return -(startPercentage / 100) * circumference;
  };

  if (loading) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">User Roles</CardTitle>
          <p className="text-sm text-gray-500">Distribution</p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <div className="w-48 h-48 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
          <div className="mt-4 space-y-2">
            {[1, 2, 3].map((index) => (
              <div key={index} className="flex items-center justify-between animate-pulse">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const primaryRole = roleData.length > 0 ? roleData[0] : null;
  let cumulativePercentage = 0;

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">User Roles</CardTitle>
        <p className="text-sm text-gray-500">Distribution</p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center">
          <div className="relative w-48 h-48">
            <svg className="w-full h-full" viewBox="0 0 200 200">
              {roleData.map((role, index) => {
                const color = roleColors[role.role as keyof typeof roleColors]?.color || "#6B7280";
                const strokeDasharray = calculateStrokeDasharray(role.percentage);
                const strokeDashoffset = calculateStrokeDashoffset(cumulativePercentage);
                
                const segment = (
                  <circle
                    key={role.role}
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke={color}
                    strokeWidth="40"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    transform="rotate(-90 100 100)"
                  />
                );
                
                cumulativePercentage += role.percentage;
                return segment;
              })}
              
              {/* Center text */}
              {primaryRole && (
                <>
                  <text x="100" y="95" textAnchor="middle" className="text-xs fill-gray-600">
                    {primaryRole?.percentage}%
                  </text>
                  <text x="100" y="110" textAnchor="middle" className="text-xs fill-gray-600">
                    {primaryRole?.role?.charAt(0).toUpperCase() + primaryRole?.role?.slice(1)}s
                  </text>
                </>
              )}
            </svg>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          {roleData.map((role) => {
            const colorConfig = roleColors[role.role as keyof typeof roleColors] || roleColors.user;
            return (
              <div key={role.role} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 ${colorConfig.bg} rounded-full`}></div>
                  <span className="text-sm text-gray-600">
                    {role?.role?.charAt(0).toUpperCase() + role?.role?.slice(1)}s ({role?.percentage}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  )
}
