"use client"

type LogoProps = {
  alt?: string
  className?: string
}

// Render both logo variants and let CSS decide which to show. This avoids
// hydration mismatches because the DOM is identical on server and client.
export default function Logo({ alt = "SLIIT Mozilla Logo", className = "" }: LogoProps) {
  return (
    <span className={className} style={{ display: 'inline-block' }}>
      <img src="/logo.png" alt={alt} className="logo-light" />
      <img src="/logo-dark-mode.png" alt={alt} className="logo-dark" />
    </span>
  )
}
