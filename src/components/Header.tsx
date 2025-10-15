"use client"
import React from "react"

export default function Header() {
  return (
    <header className="bg-white sticky top-0 z-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 py-4 shadow-sm border-b border-gray-200">
      {/* Left Section: Logo + Title */}
      <div className="flex items-center gap-4">
        <img src="/logo.png" alt="SLIIT Mozilla Logo" className="w-16 h-auto" />
        <h1 className="text-xl font-semibold text-gray-900">SLIIT Mozilla GitHub Leaderboard</h1>
      </div>

      {/* Right Section: Social Media Icons */}
      <div className="flex space-x-4 text-gray-700">
        <a
          className="hover:text-primary transition-colors"
          href="https://www.facebook.com/sliitmozilla"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-facebook h-5 w-5"
          >
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
          </svg>
        </a>

        <a
          className="hover:text-primary transition-colors"
          href="https://www.instagram.com/sliitmozilla"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-instagram h-5 w-5"
          >
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
        </a>

        <a
          className="hover:text-primary transition-colors"
          href="https://github.com/Mozilla-Campus-Club-of-SLIIT"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-github h-5 w-5"
          >
            <path d="M9 19c-4.5 1.5-4.5-2.5-6-3m12 6v-3.87a3.37 3.37 0 0 0-.94-2.61C15.07 14.11 16.5 13 16.5 10a4 4 0 0 0-1.14-2.86 3.8 3.8 0 0 0-.07-2.82S14.06 4 12 5.38A11.4 11.4 0 0 0 3 4.5s-.36 1.35 0 2.85A4 4 0 0 0 1.5 10c0 3 1.43 4.11 3.44 4.52a3.37 3.37 0 0 0-.94 2.61V22" />
          </svg>
        </a>

        <a
          className="hover:text-primary transition-colors"
          href="https://www.youtube.com/@sliitmozilla"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-youtube h-5 w-5"
          >
            <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2A29.9 29.9 0 0 0 1 12a29.9 29.9 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2A29.9 29.9 0 0 0 23 12a29.9 29.9 0 0 0-.46-5.58z" />
            <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
          </svg>
        </a>

        <a
          className="hover:text-primary transition-colors"
          href="https://www.linkedin.com/company/sliitmozilla/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-linkedin h-5 w-5"
          >
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
            <rect x="2" y="9" width="4" height="12" />
            <circle cx="4" cy="4" r="2" />
          </svg>
        </a>
      </div>
    </header>
  )
}
