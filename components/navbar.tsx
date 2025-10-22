import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="glass-effect flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link href="/events" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <div className="relative w-48 h-10 md:w-64">
              <Image src="/images/app-logo.png" alt="App Logo" fill className="object-contain" />
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2 md:gap-4">
            <Link href="/profile?tab=my-tickets">
              <Button
                variant="ghost"
                className="font-body text-sm text-white/90 transition-colors hover:bg-white/10 hover:text-white md:text-base"
              >
                My Tickets
              </Button>
            </Link>
            <Link href="/events">
              <Button
                variant="ghost"
                className="font-body text-sm text-white/90 transition-colors hover:bg-white/10 hover:text-white md:text-base"
              >
                Explore Tickets
              </Button>
            </Link>
            <Link href="/profile">
              <Button
                variant="ghost"
                className="font-body text-sm text-white/90 transition-colors hover:bg-white/10 hover:text-white md:text-base"
              >
                Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
