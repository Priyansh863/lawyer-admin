"use client"

import { useEffect, useState } from "react"
import { Users, Shield, MessageSquare, CreditCard, MoreHorizontal } from "lucide-react" // Added MoreHorizontal

// Helper component for the pie chart legend
function StatusLegend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
      <span className="text-xs font-medium text-gray-700">{label}</span>
    </div>
  )
}

export function DashboardCards() {
  const [dashboardStats, setDashboardStats] = useState([])
  const [userRolesData, setUserRolesData] = useState(null) // Changed to null initially
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Simulate API call for dashboard stats
        await new Promise((resolve) => setTimeout(resolve, 700)) // Simulate network delay
        const resStats = await fetch("/api/dashboard-stats") // 🔁 Replace with your real API route
        const fetchedStats = await resStats.json()
        setDashboardStats(fetchedStats)

        // Simulate API call for user roles data
        await new Promise((resolve) => setTimeout(resolve, 800)) // Simulate network delay
        // Using the percentages and colors from the user's provided CaseStatus for User Roles
        const simulatedUserRolesData = {
          date: "March 2020",
          slices: [
            { label: "Clients", percentage: 45, color: "#775DA6" },
            { label: "Lawyers", percentage: 45, color: "#FFB1B7" },
            { label: "Others", percentage: 10, color: "#70B6C1" },
          ],
        }
        setUserRolesData(simulatedUserRolesData)

        // Simulate API call for recent activity
        await new Promise((resolve) => setTimeout(resolve, 900)) // Simulate network delay
        const resActivity = await fetch("/api/recent-activity") // 🔁 Replace with your real API route
        const fetchedActivity = await resActivity.json()
        setRecentActivity(fetchedActivity)
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Map icon names to Lucide React components
  const iconMap = {
    Users: Users,
    Shield: Shield,
    MessageSquare: MessageSquare,
    CreditCard: CreditCard,
  }

  // Pie chart rendering logic (moved from CaseStatus)
  const cx = 50
  const cy = 50
  const radius = 50
  const degToRad = (deg: number) => (deg * Math.PI) / 180

  const describeArc = (startAngle: number, endAngle: number) => {
    const start = degToRad(startAngle - 90)
    const end = degToRad(endAngle - 90)
    const xStart = cx + radius * Math.cos(start)
    const yStart = cy + radius * Math.sin(start)
    const xEnd = cx + radius * Math.cos(end)
    const yEnd = cy + radius * Math.sin(end)
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0
    return `
      M ${cx} ${cy}
      L ${xStart} ${yStart}
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${xEnd} ${yEnd}
      Z
    `
  }

  const labelPosition = (startAngle: number, endAngle: number) => {
    const midAngle = (startAngle + endAngle) / 2
    const rad = degToRad(midAngle - 90)
    const labelRadius = radius * 0.65
    return {
      x: cx + labelRadius * Math.cos(rad),
      y: cy + labelRadius * Math.sin(rad),
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full text-center text-gray-500 p-8">Loading dashboard stats...</div>
        ) : (
          dashboardStats.map((item, index) => {
            const Icon = iconMap[item.icon] || null // Get icon component from map
            return (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="text-sm font-medium text-gray-600">{item.title}</div>
                  {Icon && <Icon className="h-4 w-4 text-gray-400" />}
                </div>
                <div className="text-2xl font-bold text-gray-900 mt-1">{item.value}</div>
                {item.change && (
                  <p className="text-xs text-gray-600 mt-1">
                    <span className={`${item.changeType === "positive" ? "text-green-600" : "text-red-600"}`}>
                      {item.change}
                    </span>{" "}
                    from last month
                  </p>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* User Roles and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Roles Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-semibold text-gray-900">User Roles</div>
            <button className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors">
              <MoreHorizontal size={20} />
            </button>
          </div>
          <p className="text-sm text-gray-500 mb-4">{userRolesData?.date}</p>
          {loading ? (
            <div className="text-center text-gray-500 p-4">Loading user roles...</div>
          ) : (
            userRolesData && (
              <div className="flex flex-col items-center">
                <div className="aspect-square max-w-[211px] mx-auto my-6">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {(() => {
                      let cumulativeAngle = 0
                      return userRolesData.slices.map(({ percentage, color }, i) => {
                        const startAngle = cumulativeAngle
                        const endAngle = cumulativeAngle + percentage * 3.6
                        const path = describeArc(startAngle, endAngle)
                        cumulativeAngle = endAngle
                        return <path key={i} d={path} fill={color} stroke="white" strokeWidth={1} />
                      })
                    })()}
                    {/* Labels */}
                    {(() => {
                      let labelAngle = 0
                      return userRolesData.slices.map(({ percentage }, i) => {
                        const startAngle = labelAngle
                        const endAngle = labelAngle + percentage * 3.6
                        const { x, y } = labelPosition(startAngle, endAngle)
                        labelAngle = endAngle
                        return (
                          <text
                            key={i}
                            x={x}
                            y={y}
                            fontSize="8"
                            fill="white"
                            fontWeight="600"
                            textAnchor="middle"
                            alignmentBaseline="middle"
                          >
                            {percentage}%
                          </text>
                        )
                      })
                    })()}
                  </svg>
                </div>
                <div className="flex justify-center gap-8 mt-4">
                  {userRolesData.slices.map(({ color, label }, i) => (
                    <StatusLegend key={i} color={color} label={label} />
                  ))}
                </div>
              </div>
            )
          )}
        </div>

        {/* Recent Activity Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</div>
          <p className="text-sm text-gray-500 mb-4">Last 2 Weeks</p>
          {loading ? (
            <div className="text-center text-gray-500 p-4">Loading activity...</div>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${activity.bgColor}`}
                  >
                    {activity.initials}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{activity.title}</div>
                    <div className="text-xs text-gray-600">{activity.description}</div>
                  </div>
                  <span className="text-xs text-gray-400 ml-auto">{activity.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
