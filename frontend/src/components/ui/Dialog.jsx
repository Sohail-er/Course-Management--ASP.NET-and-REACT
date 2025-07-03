"use client"

import React from "react"

export function Dialog({ open, onOpenChange, children }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => onOpenChange(false)} />
      <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  )
}

export function DialogTrigger({ asChild, children, ...props }) {
  if (asChild) {
    return React.cloneElement(children, props)
  }
  return <button {...props}>{children}</button>
}

export function DialogContent({ children, className = "" }) {
  return <div className={`p-6 ${className}`}>{children}</div>
}

export function DialogHeader({ children, className = "" }) {
  return <div className={`mb-4 ${className}`}>{children}</div>
}

export function DialogTitle({ children, className = "" }) {
  return <h2 className={`text-lg font-semibold text-gray-900 ${className}`}>{children}</h2>
}

export function DialogDescription({ children, className = "" }) {
  return <p className={`text-sm text-gray-600 mt-1 ${className}`}>{children}</p>
}
