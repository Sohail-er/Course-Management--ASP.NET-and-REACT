"use client"

import { useState } from "react";

function Input({ id, type = "text", value, onChange, placeholder, required = false, className = "" }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className="relative">
      <input
        id={id}
        type={inputType}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${className}`}
      />
      {isPassword && (
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-orange-400 focus:outline-none"
        >
          {showPassword ? (
            // Eye-off SVG
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.221 1.125-4.575m2.122-2.122A9.956 9.956 0 0112 3c5.523 0 10 4.477 10 10 0 2.21-.715 4.254-1.925 5.925M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          ) : (
            // Eye SVG
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm7.5 0a9.77 9.77 0 01-1.5 3.5m-2.122 2.122A9.956 9.956 0 0112 21c-5.523 0-10-4.477-10-10 0-2.21.715-4.254 1.925-5.925M6.343 6.343A9.956 9.956 0 0112 3c5.523 0 10 4.477 10 10 0 1.657-.403 3.221-1.125 4.575" /></svg>
          )}
        </button>
      )}
    </div>
  );
}

export default Input
