"use client"

import React, { useState } from "react"

export function Tabs({ defaultValue, children, className = "" }) {
  const [activeTab, setActiveTab] = useState(defaultValue)

  return (
    <div className={className}>
      {React.Children.map(children, (child) => React.cloneElement(child, { activeTab, setActiveTab }))}
    </div>
  )
}

export function TabsList({ children, activeTab, setActiveTab }) {
  return (
    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
      {React.Children.map(children, (child) => React.cloneElement(child, { activeTab, setActiveTab }))}
    </div>
  )
}

export function TabsTrigger({ value, children, activeTab, setActiveTab }) {
  const isActive = activeTab === value

  return (
    <button
      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
        isActive ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
      }`}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  )
}

export function TabsContent({ value, children, activeTab }) {
  if (activeTab !== value) return null

  return <div>{children}</div>
}
