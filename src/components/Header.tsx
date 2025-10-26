"use client"
import React from "react"
import { Facebook, Github, Youtube, Instagram, Linkedin } from "lucide-react"

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
          <Facebook size={24} color="#171717" />
        </a>

        <a
          className="hover:text-primary transition-colors"
          href="https://www.instagram.com/sliitmozilla"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Instagram size={24} color="#171717" />
        </a>

        <a
          className="hover:text-primary transition-colors"
          href="https://github.com/Mozilla-Campus-Club-of-SLIIT"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github size={24} color="#171717" />
        </a>

        <a
          className="hover:text-primary transition-colors"
          href="https://www.youtube.com/@sliitmozilla"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Youtube size={24} color="#171717" />
        </a>

        <a
          className="hover:text-primary transition-colors"
          href="https://www.linkedin.com/company/sliitmozilla/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Linkedin size={24} color="#171717" />
        </a>
      </div>
    </header>
  )
}
