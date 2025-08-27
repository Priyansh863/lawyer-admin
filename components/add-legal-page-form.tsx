"use client"

import type React from "react"
import { useState } from "react"
import {
  ChevronLeft,
  Undo,
  Redo,
  ChevronDown,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Link,
  List,
  ListOrdered,
  ImageIcon,
  Quote,
} from "lucide-react"
import axios from '../lib/axiosInstance';
import API_ROUTES from '../lib/apiRoutes';

interface AddLegalPageFormProps {
  onBack: () => void
}

export function AddLegalPageForm({ onBack }: AddLegalPageFormProps) {
  const [title, setTitle] = useState("Privacy Policy")
  const [urlSlug, setUrlSlug] = useState("/privacy")
  const [content, setContent] = useState(`<h1>Heading1</h1>
<h2>Heading2</h2>
<h3>Heading3</h3>
<h1>Heading1</h1>
<p>Nothing is impossible, the word itself says "I'm possible!"</p>`)
  const [status, setStatus] = useState(true) // true for Active, false for Inactive
  const [textFormat, setTextFormat] = useState("Normal text")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(API_ROUTES.POLICIES, {
        title,
        url: urlSlug,
        content,
        status: status ? "Active" : "Inactive",
      });
      alert("Legal page (policy) created successfully!");
      onBack();
    } catch (error) {
      alert("Failed to add policy. Please try again.");
      console.error(error);
    }
  };

  const formatOptions = ["Normal text", "Heading 1", "Heading 2", "Heading 3", "Paragraph"]

  return (
    <div className="space-y-6" style={{ fontFamily: "Montserrat, sans-serif" }}>
      {/* Page Header */}
      <div>
        <button onClick={onBack} className="text-gray-600 hover:text-gray-900 flex items-center space-x-2 mb-2">
          <ChevronLeft className="h-5 w-5" />
          <span className="font-medium">Add Legal Page</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Add Legal Page</h1>
        <p className="text-gray-600 mt-1">Add Legal Page</p>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title and URL Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="urlSlug" className="block text-sm font-medium text-gray-700 mb-1">
                URL Slug
              </label>
              <input
                type="text"
                id="urlSlug"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm"
                value={urlSlug}
                onChange={(e) => setUrlSlug(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Rich Text Editor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>

            {/* Editor Toolbar */}
            <div className="border border-gray-300 rounded-t-md bg-gray-50 p-2 flex items-center space-x-1 flex-wrap">
              <button type="button" className="p-1 rounded hover:bg-gray-200" title="Undo">
                <Undo className="h-4 w-4" />
              </button>
              <button type="button" className="p-1 rounded hover:bg-gray-200" title="Redo">
                <Redo className="h-4 w-4" />
              </button>

              <div className="w-px h-6 bg-gray-300 mx-1"></div>

              <div className="relative">
                <button type="button" className="flex items-center px-2 py-1 rounded hover:bg-gray-200 text-sm">
                  {textFormat}
                  <ChevronDown className="h-3 w-3 ml-1" />
                </button>
              </div>

              <div className="w-px h-6 bg-gray-300 mx-1"></div>

              <button type="button" className="p-1 rounded hover:bg-gray-200" title="Bold">
                <Bold className="h-4 w-4" />
              </button>
              <button type="button" className="p-1 rounded hover:bg-gray-200" title="Italic">
                <Italic className="h-4 w-4" />
              </button>
              <button type="button" className="p-1 rounded hover:bg-gray-200" title="Underline">
                <Underline className="h-4 w-4" />
              </button>
              <button type="button" className="p-1 rounded hover:bg-gray-200" title="Strikethrough">
                <Strikethrough className="h-4 w-4" />
              </button>
              <button type="button" className="p-1 rounded hover:bg-gray-200" title="Code">
                <Code className="h-4 w-4" />
              </button>

              <div className="w-px h-6 bg-gray-300 mx-1"></div>

              <button type="button" className="p-1 rounded hover:bg-gray-200" title="Bullet List">
                <List className="h-4 w-4" />
              </button>
              <button type="button" className="p-1 rounded hover:bg-gray-200" title="Numbered List">
                <ListOrdered className="h-4 w-4" />
              </button>

              <div className="w-px h-6 bg-gray-300 mx-1"></div>

              <button type="button" className="p-1 rounded hover:bg-gray-200" title="Link">
                <Link className="h-4 w-4" />
              </button>
              <button type="button" className="p-1 rounded hover:bg-gray-200" title="Image">
                <ImageIcon className="h-4 w-4" />
              </button>
              <button type="button" className="p-1 rounded hover:bg-gray-200" title="Quote">
                <Quote className="h-4 w-4" />
              </button>
            </div>

            {/* Editor Content Area */}
            <div
              className="border border-t-0 border-gray-300 rounded-b-md p-4 min-h-[300px] bg-white focus-within:ring-2 focus-within:ring-gray-200"
              contentEditable
              dangerouslySetInnerHTML={{ __html: content }}
              onInput={(e) => setContent(e.currentTarget.innerHTML)}
              style={{ outline: "none" }}
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div className="flex items-center">
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
