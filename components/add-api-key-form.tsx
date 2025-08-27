"use client"

import type React from "react"

import { useState } from "react"
import { ChevronLeft, ChevronDown } from "lucide-react"

interface AddApiKeyFormProps {
  onBack: () => void
}

export function AddApiKeyForm({ onBack }: AddApiKeyFormProps) {
  const [keyName, setKeyName] = useState("")
  const [serviceProvider, setServiceProvider] = useState("OpenAI")
  const [apiKey, setApiKey] = useState("")
  const [status, setStatus] = useState("Active")
  const [notes, setNotes] = useState("")

  const [isServiceProviderDropdownOpen, setIsServiceProviderDropdownOpen] = useState(false)
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission logic here, e.g., send data to an API
    console.log({ keyName, serviceProvider, apiKey, status, notes })
    // After submission, you might want to navigate back or show a success message
    onBack()
  }

  return (
    <div className="space-y-6" style={{ fontFamily: "Montserrat, sans-serif" }}>
      {/* Page Header */}
      <div>
        <button onClick={onBack} className="text-gray-600 hover:text-gray-900 flex items-center space-x-2 mb-2">
          <ChevronLeft className="h-5 w-5" />
          <span className="font-medium">Add API Key</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Add API Key</h1>
        <p className="text-gray-600 mt-1">Add API Key</p>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Key Name */}
          <div>
            <label htmlFor="keyName" className="block text-sm font-medium text-gray-700 mb-1">
              Key Name
            </label>
            <input
              type="text"
              id="keyName"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm"
              placeholder='e.g., "OpenAI GPT Key"'
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
              required
            />
          </div>

          {/* Service Provider */}
          <div className="relative">
            <label htmlFor="serviceProvider" className="block text-sm font-medium text-gray-700 mb-1">
              Service Provider
            </label>
            <button
              type="button"
              onClick={() => setIsServiceProviderDropdownOpen(!isServiceProviderDropdownOpen)}
              className="flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-left text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
              aria-haspopup="true"
              aria-expanded={isServiceProviderDropdownOpen}
            >
              <span>{serviceProvider}</span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>
            {isServiceProviderDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                {["OpenAI", "Ayrshare", "Stripe", "Other"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setServiceProvider(option)
                      setIsServiceProviderDropdownOpen(false)
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* API Key */}
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
              API Key
            </label>
            <input
              type="text"
              id="apiKey"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm"
              placeholder="****sk-abc123"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              required
            />
          </div>

          {/* Status */}
          <div className="relative">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <button
              type="button"
              onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              className="flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-left text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
              aria-haspopup="true"
              aria-expanded={isStatusDropdownOpen}
            >
              <span>{status}</span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>
            {isStatusDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                {["Active", "Inactive"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setStatus(option)
                      setIsStatusDropdownOpen(false)
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="md:col-span-2">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              id="notes"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm"
              placeholder="----------"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2 bg-black text-white rounded-md shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
