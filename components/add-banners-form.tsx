"use client"

import type React from "react"
import { useState, useRef } from "react"
import { ChevronLeft, ChevronDown, Upload } from "lucide-react"

interface AddBannersFormProps {
  onBack: () => void
}

export function AddBannersForm({ onBack }: AddBannersFormProps) {
  const [link, setLink] = useState("")
  const [position, setPosition] = useState("Homepage")
  const [status, setStatus] = useState(true) // true for Active, false for Inactive
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const [isPositionDropdownOpen, setIsPositionDropdownOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const positionOptions = ["Homepage", "Dashboard", "Profile Page", "Search Results", "Footer", "Header"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission logic here
    console.log({
      uploadedFile: uploadedFile?.name,
      link,
      position,
      status: status ? "Active" : "Inactive",
    })
    // After submission, you might want to navigate back or show a success message
    alert("Banner created successfully!")
    onBack()
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0])
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-6" style={{ fontFamily: "Montserrat, sans-serif" }}>
      {/* Page Header */}
      <div>
        <button onClick={onBack} className="text-gray-600 hover:text-gray-900 flex items-center space-x-2 mb-2">
          <ChevronLeft className="h-5 w-5" />
          <span className="font-medium">Banners</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Banners</h1>
        <p className="text-gray-600 mt-1">Add Banners</p>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Upload Image and Link */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
              <div
                className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  dragActive
                    ? "border-gray-400 bg-gray-50"
                    : uploadedFile
                      ? "border-green-300 bg-green-50"
                      : "border-gray-300 hover:border-gray-400"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={handleUploadClick}
              >
                <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                <div className="flex flex-col items-center space-y-2">
                  <Upload className="h-8 w-8 text-gray-400" />
                  {uploadedFile ? (
                    <div className="text-sm text-green-600">
                      <p className="font-medium">{uploadedFile.name}</p>
                      <p className="text-xs text-gray-500">Click to change file</p>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">
                      <p>Upload file here</p>
                      <p className="text-xs">or drag and drop</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">
                Link
              </label>
              <input
                type="url"
                id="link"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm"
                placeholder="www.XXXXXXX.com"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Position and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                Position
              </label>
              <button
                type="button"
                onClick={() => setIsPositionDropdownOpen(!isPositionDropdownOpen)}
                className="flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-left text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                aria-haspopup="true"
                aria-expanded={isPositionDropdownOpen}
              >
                <span>{position}</span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>
              {isPositionDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                  {positionOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setPosition(option)
                        setIsPositionDropdownOpen(false)
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <div className="flex items-center mt-2">
                <button
                  type="button"
                  onClick={() => setStatus(!status)}
                  className={`relative inline-flex h-8 w-16 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 ${
                    status ? "bg-green-500" : "bg-gray-200"
                  }`}
                  role="switch"
                  aria-checked={status}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      status ? "translate-x-8" : "translate-x-0"
                    }`}
                  />
                </button>
                <span className="ml-3 text-sm font-medium text-gray-900">{status ? "Active" : "Inactive"}</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-2 bg-black text-white rounded-md shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
