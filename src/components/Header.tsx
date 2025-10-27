"use client"
import React from "react"
import { Facebook, Github, Youtube, Instagram, Linkedin, Sun, Moon } from "lucide-react"
import { useTheme } from "@/contexts/ThemeContext"

export default function Header() {
  const { theme, toggleTheme, mounted } = useTheme()

  return (
    <header
      className="sticky top-0 z-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 py-4 shadow-sm"
      style={{
        backgroundColor: "var(--header-bg)",
        borderBottom: "1px solid var(--header-border)",
      }}
    >
      {/* Left Section: Logo + Title */}
      <div className="flex items-center gap-4">
        {mounted ? (
          <img
            src={theme === "dark" ? "/logoWhite.png" : "/logo.png"}
            alt="SLIIT Mozilla Logo"
            className="w-16 h-auto"
          />
        ) : (
          <div className="w-16 h-16" />
        )}
        <h1
          className="text-xl font-semibold"
          style={{ color: "var(--header-text)" }}
        >
          SLIIT Mozilla GitHub Leaderboard
        </h1>
      </div>

      {/* Right Section: Theme Toggle + Social Media Icons */}
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleTheme}
          className="hover:opacity-70 transition-opacity p-1 cursor-pointer"
          aria-label="Toggle theme"
        >
          {theme === "light" ? (
            <Moon size={24} style={{ color: "var(--icon-color)" }} />
          ) : (
            <Sun size={24} style={{ color: "var(--icon-color)" }} />
          )}
        </button>

        <a
          className="hover:opacity-70 transition-opacity"
          href="https://www.facebook.com/sliitmozilla"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Facebook size={24} style={{ color: "var(--icon-color)" }} />
        </a>

        <a
          className="hover:opacity-70 transition-opacity"
          href="https://www.instagram.com/sliitmozilla"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Instagram size={24} style={{ color: "var(--icon-color)" }} />
        </a>

        <a
          className="hover:opacity-70 transition-opacity"
          href="https://github.com/Mozilla-Campus-Club-of-SLIIT"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github size={24} style={{ color: "var(--icon-color)" }} />
        </a>

        <a
          className="hover:opacity-70 transition-opacity"
          href="https://www.youtube.com/@sliitmozilla"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Youtube size={24} style={{ color: "var(--icon-color)" }} />
        </a>

        <a
          className="hover:opacity-70 transition-opacity"
          href="https://www.linkedin.com/company/sliitmozilla/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Linkedin size={24} style={{ color: "var(--icon-color)" }} />
        </a>
      </div>
    </header>
  )
}
