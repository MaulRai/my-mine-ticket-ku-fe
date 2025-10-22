"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "./navbar"

export function ConditionalNavbar() {
  const pathname = usePathname()
  
  // Hide navbar on login and register pages
  const hideNavbar = pathname === "/login" || pathname === "/register"
  
  if (hideNavbar) {
    return null
  }
  
  return <Navbar />
}
