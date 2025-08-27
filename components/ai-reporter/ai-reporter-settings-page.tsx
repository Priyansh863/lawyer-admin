"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { X, Info } from "lucide-react"

interface AiReporterSettings {
  tagsToTarget: string[]
  legalFields: string[]
  lawyersToFollow: string[]
  generateFrequency: "Daily" | "Weekly" | "Manual"
  maxArticlesPerDay: string
  timeOfGeneration: string
  minViewsToAutoArchive: string
  maxArticleAgeDays: string
  archiveVisibility: string[]
}

export function AiReporterSettingsPage() {
  const [settings, setSettings] = useState<AiReporterSettings>({
    tagsToTarget: [],
    legalFields: [],
    lawyersToFollow: [],
    generateFrequency: "Daily",
    maxArticlesPerDay: "",
    timeOfGeneration: "",
    minViewsToAutoArchive: "",
    maxArticleAgeDays: "",
    archiveVisibility: [],
  })
  const [loading, setLoading] = useState(true)
  const [newTagInput, setNewTagInput] = useState("")
  const [newLawyerInput, setNewLawyerInput] = useState("")

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true)
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 700))
        const simulatedData: AiReporterSettings = {
          tagsToTarget: ["Divorce", "Criminal"],
          legalFields: ["Family Law", "Property Law", "Criminal Law"],
          lawyersToFollow: ["Adv. Roy", "Adv. Smith"],
          generateFrequency: "Daily",
          maxArticlesPerDay: "5",
          timeOfGeneration: "09:00 AM",
          minViewsToAutoArchive: "100",
          maxArticleAgeDays: "30",
          archiveVisibility: ["Homepage", "Dashboard", "Search only"],
        }
        setSettings(simulatedData)
      } catch (error) {
        console.error("Failed to fetch AI Reporter settings:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  const handleTagAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTagInput.trim() !== "") {
      e.preventDefault()
      setSettings((prev) => ({
        ...prev,
        tagsToTarget: [...prev.tagsToTarget, newTagInput.trim()],
      }))
      setNewTagInput("")
    }
  }

  const handleTagRemove = (tagToRemove: string) => {
    setSettings((prev) => ({
      ...prev,
      tagsToTarget: prev.tagsToTarget.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleLawyerAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newLawyerInput.trim() !== "") {
      e.preventDefault()
      setSettings((prev) => ({
        ...prev,
        lawyersToFollow: [...prev.lawyersToFollow, newLawyerInput.trim()],
      }))
      setNewLawyerInput("")
    }
  }

  const handleLawyerRemove = (lawyerToRemove: string) => {
    setSettings((prev) => ({
      ...prev,
      lawyersToFollow: prev.lawyersToFollow.filter((lawyer) => lawyer !== lawyerToRemove),
    }))
  }

  const handleLegalFieldChange = (field: string) => {
    setSettings((prev) => ({
      ...prev,
      legalFields: prev.legalFields.includes(field)
        ? prev.legalFields.filter((f) => f !== field)
        : [...prev.legalFields, field],
    }))
  }

  const handleArchiveVisibilityChange = (visibility: string) => {
    setSettings((prev) => ({
      ...prev,
      archiveVisibility: prev.archiveVisibility.includes(visibility)
        ? prev.archiveVisibility.filter((v) => v !== visibility)
        : [...prev.archiveVisibility, visibility],
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("AI Reporter Settings Saved:", settings)
    alert("Settings saved successfully!")
    // In a real app, you'd send this data to your backend
  }

  if (loading) {
    return (
      <div className="space-y-6 p-6 text-center text-gray-500" style={{ fontFamily: "Montserrat, sans-serif" }}>
        Loading settings...
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Target Configuration */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Target Configuration</h2>

          {/* Tags to Target */}
          <div>
            <label htmlFor="tagsToTarget" className="block text-sm font-medium text-gray-700 mb-1">
              Tags to Target
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {settings.tagsToTarget.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleTagRemove(tag)}
                    className="ml-2 -mr-0.5 h-4 w-4 flex-shrink-0 text-green-600 hover:text-green-800"
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove tag {tag}</span>
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              id="tagsToTarget"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm"
              placeholder="Add new tag and press Enter"
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              onKeyDown={handleTagAdd}
            />
          </div>

          {/* Legal Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Legal Fields</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {["Family Law", "Property Law", "Criminal Law", "Corporate Law", "Environmental Law"].map((field) => (
                <div key={field} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`legal-field-${field.replace(/\s/g, "-").toLowerCase()}`}
                    className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
                    checked={settings.legalFields.includes(field)}
                    onChange={() => handleLegalFieldChange(field)}
                  />
                  <label
                    htmlFor={`legal-field-${field.replace(/\s/g, "-").toLowerCase()}`}
                    className="ml-2 text-sm text-gray-900"
                  >
                    {field}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Lawyers to Follow */}
          <div>
            <label htmlFor="lawyersToFollow" className="block text-sm font-medium text-gray-700 mb-1">
              Lawyers to Follow
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {settings.lawyersToFollow.map((lawyer) => (
                <span
                  key={lawyer}
                  className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800"
                >
                  {lawyer}
                  <button
                    type="button"
                    onClick={() => handleLawyerRemove(lawyer)}
                    className="ml-2 -mr-0.5 h-4 w-4 flex-shrink-0 text-green-600 hover:text-green-800"
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove lawyer {lawyer}</span>
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              id="lawyersToFollow"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm"
              placeholder="Add new lawyer and press Enter"
              value={newLawyerInput}
              onChange={(e) => setNewLawyerInput(e.target.value)}
              onKeyDown={handleLawyerAdd}
            />
          </div>
        </div>

        {/* Article Frequency */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Article Frequency</h2>

          {/* Generate Frequency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Generate Frequency</label>
            <div className="flex flex-wrap gap-4">
              {["Daily", "Weekly", "Manual"].map((frequency) => (
                <div key={frequency} className="flex items-center">
                  <input
                    type="radio"
                    id={`frequency-${frequency.toLowerCase()}`}
                    name="generateFrequency"
                    className="h-4 w-4 text-black border-gray-300 focus:ring-black"
                    value={frequency}
                    checked={settings.generateFrequency === frequency}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        generateFrequency: e.target.value as "Daily" | "Weekly" | "Manual",
                      }))
                    }
                  />
                  <label htmlFor={`frequency-${frequency.toLowerCase()}`} className="ml-2 text-sm text-gray-900">
                    {frequency}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Max Articles Per Day */}
            <div>
              <label htmlFor="maxArticlesPerDay" className="block text-sm font-medium text-gray-700 mb-1">
                Max Articles Per Day
              </label>
              <input
                type="number"
                id="maxArticlesPerDay"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm"
                value={settings.maxArticlesPerDay}
                onChange={(e) => setSettings((prev) => ({ ...prev, maxArticlesPerDay: e.target.value }))}
              />
            </div>

            {/* Time of Generation */}
            <div>
              <label htmlFor="timeOfGeneration" className="block text-sm font-medium text-gray-700 mb-1">
                Time of Generation
              </label>
              <div className="relative">
                <input
                  type="text" // Using text for custom format, could be type="time" for browser picker
                  id="timeOfGeneration"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm pr-10"
                  placeholder="HH:MM AM/PM"
                  value={settings.timeOfGeneration}
                  onChange={(e) => setSettings((prev) => ({ ...prev, timeOfGeneration: e.target.value }))}
                />
                <Info className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Archive Rules */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Archive Rules</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Min Views to Auto-Archive */}
            <div>
              <label htmlFor="minViewsToAutoArchive" className="block text-sm font-medium text-gray-700 mb-1">
                Min Views to Auto-Archive
              </label>
              <input
                type="number"
                id="minViewsToAutoArchive"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm"
                value={settings.minViewsToAutoArchive}
                onChange={(e) => setSettings((prev) => ({ ...prev, minViewsToAutoArchive: e.target.value }))}
              />
            </div>

            {/* Max Article Age (in days) */}
            <div>
              <label htmlFor="maxArticleAgeDays" className="block text-sm font-medium text-gray-700 mb-1">
                Max Article Age (in days)
              </label>
              <input
                type="number"
                id="maxArticleAgeDays"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm"
                value={settings.maxArticleAgeDays}
                onChange={(e) => setSettings((prev) => ({ ...prev, maxArticleAgeDays: e.target.value }))}
              />
            </div>
          </div>

          {/* Archive Visibility */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Archive Visibility</label>
            <div className="flex flex-wrap gap-4">
              {["Homepage", "Dashboard", "Search only"].map((visibility) => (
                <div key={visibility} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`archive-visibility-${visibility.replace(/\s/g, "-").toLowerCase()}`}
                    className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
                    checked={settings.archiveVisibility.includes(visibility)}
                    onChange={() => handleArchiveVisibilityChange(visibility)}
                  />
                  <label
                    htmlFor={`archive-visibility-${visibility.replace(/\s/g, "-").toLowerCase()}`}
                    className="ml-2 text-sm text-gray-900"
                  >
                    {visibility}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div>
          <button
            type="submit"
            className="px-8 py-2 bg-black text-white rounded-md shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  )
}
