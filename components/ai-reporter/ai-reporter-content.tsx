"use client"

import { useEffect, useState } from "react"
import { Search, ChevronDown, Download, Eye, Pencil, Check, FileText, Calendar, Settings, Archive, Trash2, Plus } from "lucide-react"
import axios from "axios"
import { useTranslation } from "@/hooks/useTranslation"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

interface DashboardStats {
  totalArticles: number
  publishedArticles: number
  draftArticles: number
  archivedArticles: number
}

interface Article {
  _id: string
  title: string
  tags: string[]
  legalField: string
  status: 'Draft' | 'Published' | 'Archived'
  created_at: string
  views: number
  likes: number
  shares: number
}

export function AiReporterContent() {
  const { t } = useTranslation()
  const [dashboardStats, setDashboardStats] = useState<any | null>(null)
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/ai-reporter/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setDashboardStats(response.data.data)
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error)
    }
  }

  const fetchArticles = async (page = 1, status = selectedStatus) => {
    try {
      const token = localStorage.getItem('token')
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      })
      
      if (status !== 'All') {
        params.append('status', status)
      }

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/ai-reporter/articles?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      setArticles(response.data.data.articles)
      setTotalPages(response.data.data.pagination.totalPages)
      setCurrentPage(response.data.data.pagination.currentPage)
    } catch (error) {
      console.error("Failed to fetch articles:", error)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        await Promise.all([
          fetchDashboardStats(),
          fetchArticles()
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (!loading) {
      fetchArticles(1, selectedStatus)
    }
  }, [selectedStatus])

  const generateArticle = async () => {
    setIsGenerating(true)
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/ai-reporter/articles/generate`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      await fetchArticles()
      await fetchDashboardStats()
    } catch (error) {
      console.error("Failed to generate article:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const publishArticle = async (articleId: string) => {
    try {
      const token = localStorage.getItem('token')
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/ai-reporter/articles/${articleId}/publish`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      await fetchArticles()
      await fetchDashboardStats()
    } catch (error) {
      console.error("Failed to publish article:", error)
    }
  }

  const archiveArticle = async (articleId: string) => {
    try {
      const token = localStorage.getItem('token')
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/ai-reporter/articles/${articleId}/archive`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      await fetchArticles()
      await fetchDashboardStats()
    } catch (error) {
      console.error("Failed to archive article:", error)
    }
  }

  const deleteArticle = async (articleId: string) => {
    if (!confirm(t("pages:commons.confirmDelete"))) return
    
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/ai-reporter/articles/${articleId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      await fetchArticles()
      await fetchDashboardStats()
    } catch (error) {
      console.error("Failed to delete article:", error)
    }
  }

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.join(', ').toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.legalField.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  // Skeleton rows for loading state
  const skeletonRows = Array.from({ length: 5 }).map((_, index) => (
    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
      <td className="px-4 py-3 whitespace-nowrap">
        <Skeleton width={40} />
      </td>
      <td className="px-4 py-3">
        <Skeleton width={200} />
      </td>
      <td className="px-4 py-3">
        <Skeleton width={120} />
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <Skeleton width={80} />
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <Skeleton width={70} height={24} />
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex items-center space-x-1">
          <Skeleton circle width={32} height={32} />
          <Skeleton circle width={32} height={32} />
          <Skeleton circle width={32} height={32} />
        </div>
      </td>
    </tr>
  ))

  return (
    <div className="space-y-6" style={{ fontFamily: "Montserrat, sans-serif" }}>
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t("pages:report.title")}</h1>
        <p className="text-gray-600 mt-1">{t("pages:report.subtitle")}</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton circle width={20} height={20} />
              </div>
              <Skeleton width={120} height={16} className="mb-2" />
              <Skeleton width={60} height={32} />
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton circle width={20} height={20} />
              </div>
              <Skeleton width={120} height={16} className="mb-2" />
              <Skeleton width={60} height={32} />
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton circle width={20} height={20} />
              </div>
              <Skeleton width={120} height={16} className="mb-2" />
              <Skeleton width={60} height={32} />
            </div>
          </>
        ) : (
          <>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <FileText className="h-5 w-5 text-gray-400" />
              </div>
              <div className="text-sm font-medium text-gray-600">{t("pages:report.metrics.articlesWritten")}</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">{dashboardStats?.stats.totalArticles || 0}</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <div className="text-sm font-medium text-gray-600">{t("pages:report.metrics.lastActive")}</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">
                {new Date(dashboardStats?.latestActivity).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Settings className="h-5 w-5 text-gray-400" />
              </div>
              <div className="text-sm font-medium text-gray-600">{t("pages:report.metrics.generationMode")}</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">
                {dashboardStats?.generationMode || t("pages:report.modes.daily")}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Filters and Actions Container */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-auto">
            {loading ? (
              <Skeleton width={320} height={36} />
            ) : (
              <>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder={t("pages:commons.searchPlaceholder")}
                  className="pl-10 pr-4 py-2 w-full sm:w-80 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </>
            )}
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            {loading ? (
              <>
                <Skeleton width={100} height={36} />
                <Skeleton width={140} height={36} />
              </>
            ) : (
              <>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                    className="flex items-center border border-gray-300 px-3 py-2 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
                    aria-haspopup="true"
                    aria-expanded={isStatusDropdownOpen}
                  >
                    <span>{t("pages:commons.status")}</span>
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </button>
                  {isStatusDropdownOpen && (
                    <div className="absolute z-10 mt-2 w-40 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {["All", "Published", "Draft", "Archived"].map((statusOption) => (
                        <button
                          key={statusOption}
                          onClick={() => {
                            setSelectedStatus(statusOption)
                            setIsStatusDropdownOpen(false)
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {t(`pages:commons.statusOptions.${statusOption.toLowerCase()}`)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={generateArticle}
                  disabled={isGenerating}
                  className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {isGenerating ? t("pages:commons.generating") : t("pages:report.generateButton")}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* AI Reports Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t("pages:report.table.id")}</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t("pages:report.table.title")}</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t("pages:report.table.tags")}</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t("pages:report.table.created")}</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t("pages:report.table.status")}</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t("pages:report.table.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              skeletonRows
            ) : filteredArticles.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  {t("pages:commons.noData")}
                </td>
              </tr>
            ) : (
              filteredArticles.map((article, index) => (
                <tr key={article._id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">A{article._id.slice(-3)}</td>
                  <td className="px-4 py-3 text-gray-600">
                    <div className="max-w-xs truncate">{article.title}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    <div className="max-w-xs truncate">{article.tags.join(', ')}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                    {new Date(article.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        article.status === "Published" 
                          ? "bg-green-100 text-green-800" 
                          : article.status === "Draft"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {t(`pages:commons.statusOptions.${article.status.toLowerCase()}`)}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      <button
                        type="button"
                        onClick={() => window.open(`/ai-reporter/article/${article._id}`, '_blank')}
                        className="p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-200"
                        title={t("pages:commons.view")}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {article.status === "Draft" && (
                        <button
                          type="button"
                          onClick={() => publishArticle(article._id)}
                          className="p-2 rounded-md text-green-600 hover:bg-green-50 hover:text-green-700 focus:outline-none focus:ring-2 focus:ring-green-200"
                          title={t("pages:commons.publish")}
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                      {article.status === "Published" && (
                        <button
                          type="button"
                          onClick={() => archiveArticle(article._id)}
                          className="p-2 rounded-md text-orange-600 hover:bg-orange-50 hover:text-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-200"
                          title={t("pages:commons.archive")}
                        >
                          <Archive className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => deleteArticle(article._id)}
                        className="p-2 rounded-md text-red-600 hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-200"
                        title={t("pages:commons.delete")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}