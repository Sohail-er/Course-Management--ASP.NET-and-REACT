export function Card({ children, className = "" }) {
  return <div className={`bg-white shadow rounded-lg ${className}`}>{children}</div>
}

export function CardHeader({ children, className = "" }) {
  return <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>{children}</div>
}

export function CardContent({ children, className = "" }) {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>
}

export function CardTitle({ children, className = "" }) {
  return <h3 className={`text-lg font-medium text-gray-900 ${className}`}>{children}</h3>
}

export function CardDescription({ children, className = "" }) {
  return <p className={`mt-1 text-sm text-gray-600 ${className}`}>{children}</p>
}
