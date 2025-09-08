"use client"

import { useEffect, useState } from "react"
import { X, Info } from "lucide-react"
import axios from "axios"

interface Lawyer {
  _id: string
  first_name: string
  last_name: string
  email: string
  pratice_area: string
}

interface AiReporterSettings {
  targetTags: string[]
  legalFields: string[]
  lawyersToFollow: string[]
  generationMode: "Daily" | "Weekly" | "Manual"
  maxArticlesPerDay: number
  timeOfGeneration: string
  minViewsToAutoArchive: number
  maxArticleAge: number
  archiveVisibility: {
    homepage: boolean
    dashboard: boolean
    searchOnly: boolean
  }
  isActive: boolean
}

export function AiReporterSettingsPage() {
  const [settings, setSettings] = useState<AiReporterSettings>({
    targetTags: [],
    legalFields: [],
    lawyersToFollow: [],
    generationMode: "Daily",
    maxArticlesPerDay: 5,
    timeOfGeneration: "09:00",
    minViewsToAutoArchive: 100,
    maxArticleAge: 30,
    archiveVisibility: {
      homepage: true,
      dashboard: true,
      searchOnly: false
    },
    isActive: true
  })
  
  const [availableLawyers, setAvailableLawyers] = useState<Lawyer[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newTagInput, setNewTagInput] = useState("")

  const legalFieldOptions = [
    'Family Law',
    'Property Law', 
    'Criminal Law',
    'Corporate Law',
    'Labor Law',
    'Tax Law',
    'Intellectual Property',
    'Immigration'
  ]

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/ai-reporter/settings`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data.success) {
        setSettings(response.data.data)
      }
    } catch (error) {
      console.error("Failed to fetch AI Reporter settings:", error)
    }
  }

  const fetchAvailableLawyers = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/ai-reporter/lawyers`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data.success) {
        setAvailableLawyers(response.data.data)
      }
    } catch (error) {
      console.error("Failed to fetch available lawyers:", error)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        await Promise.all([
          fetchSettings(),
          fetchAvailableLawyers()
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleTagAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTagInput.trim() !== "") {
      e.preventDefault()
      setSettings((prev) => ({
        ...prev,
        targetTags: [...prev.targetTags, newTagInput.trim()],
      }))
      setNewTagInput("")
    }
  }

  const handleTagRemove = (tagToRemove: string) => {
    setSettings((prev) => ({
      ...prev,
      targetTags: prev.targetTags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleLawyerToggle = (lawyerId: string) => {
    setSettings((prev) => {
      const isSelected = prev.lawyersToFollow.includes(lawyerId)
      return {
        ...prev,
        lawyersToFollow: isSelected
          ? prev.lawyersToFollow.filter(id => id !== lawyerId)
          : [...prev.lawyersToFollow, lawyerId]
      }
    })
  }

  const handleLegalFieldChange = (field: string) => {
    setSettings((prev) => {
      const isSelected = prev.legalFields.includes(field)
      return {
        ...prev,
        legalFields: isSelected
          ? prev.legalFields.filter(f => f !== field)
          : [...prev.legalFields, field]
      }
    })
  }

  const handleArchiveVisibilityChange = (field: keyof typeof settings.archiveVisibility) => {
    setSettings((prev) => ({
      ...prev,
      archiveVisibility: {
        ...prev.archiveVisibility,
        [field]: !prev.archiveVisibility[field]
      }
    }))
  }

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/ai-reporter/settings`, settings, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data.success) {
        alert('Settings saved successfully!')
      }
    } catch (error) {
      console.error("Failed to save settings:", error)
      alert('Failed to save settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading settings...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6" style={{ fontFamily: "Montserrat, sans-serif" }}>
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Reporter Settings</h1>
        <p className="text-gray-600 mt-1">Automated summarization</p>
      </div>

      {/* Target Configuration */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Target Configuration</h2>
        
        {/* Tags to Target */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags to Target
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {settings.targetTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleTagRemove(tag)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            value={newTagInput}
            onChange={(e) => setNewTagInput(e.target.value)}
            onKeyDown={handleTagAdd}
            placeholder="Add new tag and press Enter"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Legal Fields */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Legal Fields
          </label>
          <div className="grid grid-cols-2 gap-3">
            {legalFieldOptions.map((field) => (
              <label key={field} className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.legalFields.includes(field)}
                  onChange={() => handleLegalFieldChange(field)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">{field}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Lawyers to Follow */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lawyers to Follow
          </label>
          <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-md p-3">
            {availableLawyers.map((lawyer) => (
              <label key={lawyer._id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={settings.lawyersToFollow.includes(lawyer._id)}
                  onChange={() => handleLawyerToggle(lawyer._id)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {lawyer.first_name} {lawyer.last_name} - {lawyer.pratice_area}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Article Frequency */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Article Frequency</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Generate Frequency
            </label>
            <div className="space-y-2">
              {["Daily", "Weekly", "Manual"].map((mode) => (
                <label key={mode} className="flex items-center">
                  <input
                    type="radio"
                    name="generationMode"
                    value={mode}
                    checked={settings.generationMode === mode}
                    onChange={(e) => setSettings(prev => ({ ...prev, generationMode: e.target.value as any }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">{mode}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Articles Per Day
              </label>
              <input
                type="number"
                value={settings.maxArticlesPerDay}
                onChange={(e) => setSettings(prev => ({ ...prev, maxArticlesPerDay: parseInt(e.target.value) || 5 }))}
                min="1"
                max="20"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time of Generation
              </label>
              <input
                type="time"
                value={settings.timeOfGeneration}
                onChange={(e) => setSettings(prev => ({ ...prev, timeOfGeneration: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Archive Rules */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Archive Rules</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min Views to Auto Archive
            </label>
            <input
              type="number"
              value={settings.minViewsToAutoArchive}
              onChange={(e) => setSettings(prev => ({ ...prev, minViewsToAutoArchive: parseInt(e.target.value) || 100 }))}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Article Age (in days)
            </label>
            <input
              type="number"
              value={settings.maxArticleAge}
              onChange={(e) => setSettings(prev => ({ ...prev, maxArticleAge: parseInt(e.target.value) || 30 }))}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Archive Visibility
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.archiveVisibility.homepage}
                onChange={() => handleArchiveVisibilityChange('homepage')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Homepage</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.archiveVisibility.dashboard}
                onChange={() => handleArchiveVisibilityChange('dashboard')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Dashboard</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.archiveVisibility.searchOnly}
                onChange={() => handleArchiveVisibilityChange('searchOnly')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Search only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveSettings}
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  )
}
