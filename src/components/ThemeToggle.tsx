"use client"

import { useEffect, useState } from "react"

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    // read stored preference
    const stored = typeof window !== "undefined" ? localStorage.getItem("theme") : null
    if (stored === "dark" || (stored === null && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add("dark")
      setTheme("dark")
    } else {
      document.documentElement.classList.remove("dark")
      setTheme("light")
    }
  }, [])

  const toggle = () => {
    if (theme === "dark") {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
      setTheme("light")
    } else {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
      setTheme("dark")
    }
    // Force update logo visibility to avoid any CSS ordering/system preference delays
    try {
      const light = document.querySelectorAll<HTMLElement>('.logo-light')
      const dark = document.querySelectorAll<HTMLElement>('.logo-dark')
      const isDarkNow = document.documentElement.classList.contains('dark')
      light.forEach(el => { el.style.display = isDarkNow ? 'none' : 'inline-block' })
      dark.forEach(el => { el.style.display = isDarkNow ? 'inline-block' : 'none' })
    } catch (e) {
      // ignore
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
      className="p-2 rounded-md hover:opacity-90 transition"
      style={{ background: "transparent", border: "none", color: 'var(--fg)' }}
    >
      {theme === "dark" ? (
        // show sun icon when currently dark (click to go light)
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 14v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M21 12h-2M5 12H3m13.78-6.78l-1.42 1.42M6.64 17.36l-1.42 1.42M12 7a5 5 0 100 10 5 5 0 000-10z" />
        </svg>
      ) : (
        // show moon icon when currently light (click to go dark)
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      )}
    </button>
  )
}
