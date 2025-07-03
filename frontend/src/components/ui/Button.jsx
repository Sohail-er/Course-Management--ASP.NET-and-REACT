"use client"

function Button({
  children,
  onClick,
  disabled = false,
  variant = "default",
  size = "default",
  className = "",
  type = "button",
}) {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"

  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-blue-500",
  }

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-8 px-3 text-sm",
    lg: "h-12 px-8",
  }

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}

export default Button
