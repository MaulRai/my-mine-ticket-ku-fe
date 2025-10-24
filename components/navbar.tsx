"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import { usePathname } from "next/navigation"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="glass-fx flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link href="/events" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <div className="relative w-48 h-8 sm:w-48 sm:h-10 md:w-64">
              <Image src="/images/app-logo.png" alt="App Logo" fill className="object-contain" />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-2 md:gap-4">
            <Link href="/profile?tab=my-tickets">
              <Button
                variant="ghost"
                className="font-body text-sm text-white/90 transition-colors hover:bg-white/10 hover:text-white md:text-base"
              >
                Tiket Saya
              </Button>
            </Link>
            <Link href="/explore-tickets">
              <Button
                variant="ghost"
                className="font-body text-sm text-white/90 transition-colors hover:bg-white/10 hover:text-white md:text-base"
              >
                Jelajahi Tiket
              </Button>
            </Link>
            <Link href="/profile">
              <Button
                variant="ghost"
                className="font-body text-sm text-white/90 transition-colors hover:bg-white/10 hover:text-white md:text-base"
              >
                Profil
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden glass-fx p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <Menu className="h-6 w-6 text-white" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-2 glass-fx px-4 py-3 space-y-2">
            <Link href="/profile?tab=my-tickets" onClick={() => setIsMenuOpen(false)}>
              <Button
                variant="ghost"
                className="w-full justify-start font-body text-sm text-white/90 transition-colors hover:bg-white/10 hover:text-white"
              >
                Tiket Saya
              </Button>
            </Link>
            <Link href="/explore-tickets" onClick={() => setIsMenuOpen(false)}>
              <Button
                variant="ghost"
                className="w-full justify-start font-body text-sm text-white/90 transition-colors hover:bg-white/10 hover:text-white"
              >
                Jelajahi Tiket
              </Button>
            </Link>
            <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
              <Button
                variant="ghost"
                className="w-full justify-start font-body text-sm text-white/90 transition-colors hover:bg-white/10 hover:text-white"
              >
                Profil
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
