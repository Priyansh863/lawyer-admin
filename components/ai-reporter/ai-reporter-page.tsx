"use client"

import { useEffect, useState } from "react"
import { Search, ChevronDown, Download, Eye, Pencil, Check, FileText, Calendar, Clock } from "lucide-react"
import { useTranslation } from "@/hooks/useTranslation"

export function AiReporterPage() {
  const { t } = useTranslation()
  const [metricsData, setMetricsData] = useState<any[]>([])
  const [reportsData, setReportsData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false)

  // Status options for the dropdown
  const statusOptions = ["All", "Published", "Draft"]

  // Fetch data from API or use dummy data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Dummy data for metrics
        const simulatedMetrics = [
          {
            title: t("pages:report.articlesWritten"),
            value: "482",
            icon: FileText,
          },
          {
            title: t("pages:report.lastActive"),
            value: t("pages:report.may29"),
            icon: Calendar,
          },
          {
            title: t("pages:report.generationMode"),
            value: t("pages:report.daily9am"),
            icon: Clock,
          },
        ]
        setMetricsData(simulatedMetrics)

        // Dummy data for reports
        const simulatedReports = [
          {
            id: "A128",
            title: t("pages:report.understandingBail"),
            tags: t("pages:report.criminalBail"),
            created: t("pages:report.dec10"),
            status: t("pages:report.published"),
          },
          {
            id: "A129",
            title: t("pages:report.expertWitnesses"),
            tags: t("pages:report.litigationEvidence"),
            created: t("pages:report.nov25"),
            status: t("pages:report.draft"),
          },
          {
            id: "A130",
            title: t("pages:report.intellectualProperty"),
            tags: t("pages:report.ipCopyright"),
            created: t("pages:report.oct15"),
            status: t("pages:report.published"),
          },
          {
            id: "A131",
            title: t("pages:report.contractLaw"),
            tags: t("pages:report.contractsBusiness"),
            created: t("pages:report.sep1"),
            status: t("pages:report.draft"),
          },
        ]
        setReportsData(simulatedReports)
      } catch (error) {
        console.error(t("pages:report.fetchError"), error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [t])

  const filteredReports = reportsData.filter((report) => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.tags.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "All" || report.status === t(`pages:report.${selectedStatus.toLowerCase()}`)
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6" style={{ fontFamily: "Montserrat, sans-serif" }}>
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t("pages:report.aiLegalReporter")}</h1>
        <p className="text-gray-600 mt-1">{t("pages:report.automatedSummarization")}</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center text-gray-500 p-8">{t("pages:report.loadingMetrics")}</div>
        ) : (
          metricsData.map((item, index) => {
            const Icon = item.icon
            return (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-50">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">{item.title}</p>
                    <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Table Header with Filters */}
        <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder={t("pages:report.searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative">
              <button
                type="button"
                className="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              >
                <span>{selectedStatus === "All" ? t("pages:report.all") : t(`pages:report.${selectedStatus.toLowerCase()}`)}</span>
                <ChevronDown className="-mr-1 ml-2 h-5 w-5" />
              </button>
              
              {isStatusDropdownOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    {statusOptions.map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setSelectedStatus(status)
                          setIsStatusDropdownOpen(false)
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        role="menuitem"
                      >
                        {status === "All" ? t("pages:report.all") : t(`pages:report.${status.toLowerCase()}`)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <button
              type="button"
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Download className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
              {t("pages:report.export")}
            </button>
          </div>
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("pages:report.id")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("pages:report.title")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("pages:report.tags")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("pages:report.created")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("pages:report.status")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("pages:report.actions")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    {t("pages:report.loadingReports")}
                  </td>
                </tr>
              ) : filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    {t("pages:report.noReports")}
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {report.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{report.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{report.tags}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.created}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        report.status === t("pages:report.published") 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          className="text-blue-600 hover:text-blue-900"
                          title={t("pages:report.viewDetails")}
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          className="text-gray-600 hover:text-gray-900"
                          title={t("pages:report.edit")}
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                        {report.status === t("pages:report.draft") && (
                          <button
                            type="button"
                            className="text-green-600 hover:text-green-900"
                            title={t("pages:report.markPublished")}
                          >
                            <Check className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}