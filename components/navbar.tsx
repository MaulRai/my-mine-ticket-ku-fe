"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Menu, X, LogOut, Shield, Briefcase, Wallet, User } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { blockchainService } from "@/lib/blockchain"
import { apiClient } from "@/lib/api"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<'USER' | 'EO' | 'ADMIN' | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = apiClient.getToken()
      if (!token) {
        setIsLoggedIn(false)
        setUserRole(null)
        setWalletAddress(null)
        setUsername(null)
        return
      }

      const { user } = await apiClient.verifyToken()
      setUserRole(user.role)
      setIsLoggedIn(true)
      setUsername(user.username || user.email?.split('@')[0] || 'User')
      
      if (user.walletAddress) {
        setWalletAddress(user.walletAddress)
      }
    } catch (error) {
      console.error("Error checking auth:", error)
      setIsLoggedIn(false)
      setUserRole(null)
      setWalletAddress(null)
      setUsername(null)
      apiClient.clearToken()
    }
  }

  const handleConnectWallet = async () => {
    try {
      if (!isLoggedIn) {
        alert('Please login first before connecting wallet');
        router.push('/login');
        return;
      }

      const address = await blockchainService.connectWallet()
      
      const nonceResponse = await apiClient.getWalletNonce(address)
      const signature = await blockchainService.signMessage(nonceResponse.message)
      
      const response = await apiClient.connectWallet(address, signature, nonceResponse.message)
      
      console.log('Connect wallet response:', response)
      
      setWalletAddress(address)
      
      if (response.user.username) {
        setUsername(response.user.username)
      }
      
      await checkAuth()
    } catch (error: any) {
      console.error("Error connecting wallet:", error)
      alert(error.message || "Failed to connect wallet")
    }
  }

  const handleDisconnectWallet = async () => {
    try {
      await apiClient.disconnectWallet()
      blockchainService.disconnect()
      setWalletAddress(null)
      await checkAuth()
    } catch (error) {
      console.error("Error disconnecting wallet:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await apiClient.logout()
      blockchainService.disconnect()
      setWalletAddress(null)
      setUserRole(null)
      setIsLoggedIn(false)
      setUsername(null)
      router.push("/login")
    } catch (error) {
      console.error("Error during logout:", error)
      apiClient.clearToken()
      setWalletAddress(null)
      setUserRole(null)
      setIsLoggedIn(false)
      setUsername(null)
      router.push("/login")
    }
  }

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  const getDashboardLink = () => {
    if (userRole === 'ADMIN') return '/admin/dashboard'
    if (userRole === 'EO') return '/eo/dashboard'
    return '/profile'
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="glass-fx flex items-center justify-between px-4 py-3">
          <Link href="/events" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <div className="relative w-48 h-8 sm:w-48 sm:h-10 md:w-64">
              <Image src="/images/app-logo.png" alt="App Logo" fill className="object-contain" />
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-2 md:gap-4">
            {isLoggedIn && (
              <>
                {(userRole === 'ADMIN' || userRole === 'EO') && (
                  <Link href={getDashboardLink()}>
                    <Button
                      variant="ghost"
                      className="font-body text-sm text-white/90 transition-colors hover:bg-white/10 hover:text-white md:text-base"
                    >
                      {userRole === 'ADMIN' ? (
                        <>
                          <Shield className="h-4 w-4 mr-2" />
                          Admin Dashboard
                        </>
                      ) : (
                        <>
                          <Briefcase className="h-4 w-4 mr-2" />
                          EO Dashboard
                        </>
                      )}
                    </Button>
                  </Link>
                )}
                
                {userRole === 'USER' && (
                  <Link href="/profile?tab=my-tickets">
                    <Button
                      variant="ghost"
                      className="font-body text-sm transition-colors md:text-base text-white/90 hover:bg-white/10 hover:text-white"
                    >
                      My Tickets
                    </Button>
                  </Link>
                )}
                
                <Link href="/profile">
                  <Button
                    variant="ghost"
                    className="font-body text-sm text-white/90 transition-colors hover:bg-white/10 hover:text-white md:text-base"
                  >
                    Profile
                  </Button>
                </Link>
              </>
            )}
            
            <Link href="/explore-tickets">
              <Button
                variant="ghost"
                className={`font-body text-sm transition-colors md:text-base ${
                  pathname === "/explore-tickets"
                    ? "bg-white/20 text-white font-semibold"
                    : "text-white/90 hover:bg-white/10 hover:text-white"
                }`}
              >
                Jelajahi Tiket
              </Button>
            </Link>

            {isLoggedIn ? (
              <>
                <div className="h-6 w-px bg-white/20" />
                <div className="flex items-center gap-2">
                  {/* Username Display */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                    <User className="h-4 w-4 text-white/70" />
                    <span className="text-sm text-white font-subheading font-semibold">
                      {username}
                    </span>
                  </div>
                  
                  {userRole && (
                    <Badge className={`text-xs font-subheading font-semibold ${
                      userRole === 'ADMIN' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                      userRole === 'EO' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                      'bg-green-500/20 text-green-400 border-green-500/30'
                    }`}>
                      {userRole}
                    </Badge>
                  )}
                  
                  {walletAddress ? (
                    <>
                      <span className="text-sm text-white/70 font-mono">
                        {formatAddress(walletAddress)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={handleDisconnectWallet}
                        className="text-white/90 hover:bg-yellow-500/20 hover:text-yellow-400"
                        title="Disconnect Wallet"
                      >
                        <Wallet className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={handleConnectWallet}
                      variant="outline"
                      size="sm"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Wallet className="h-4 w-4 mr-2" />
                      Connect Wallet
                    </Button>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={handleLogout}
                    className="text-white/90 hover:bg-red-500/20 hover:text-red-400"
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <Link href="/login">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-subheading font-semibold">
                  Login
                </Button>
              </Link>
            )}
          </div>

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

        {isMenuOpen && (
          <div className="md:hidden mt-2 glass-fx px-4 py-3 space-y-2">
            {isLoggedIn && (
              <>
                {(userRole === 'ADMIN' || userRole === 'EO') && (
                  <Link href={getDashboardLink()} onClick={() => setIsMenuOpen(false)}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start font-body text-sm text-white/90 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      {userRole === 'ADMIN' ? (
                        <>
                          <Shield className="h-4 w-4 mr-2" />
                          Admin Dashboard
                        </>
                      ) : (
                        <>
                          <Briefcase className="h-4 w-4 mr-2" />
                          EO Dashboard
                        </>
                      )}
                    </Button>
                  </Link>
                )}
                
                {userRole === 'USER' && (
                  <Link href="/profile?tab=my-tickets" onClick={() => setIsMenuOpen(false)}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start font-body text-sm transition-colors text-white/90 hover:bg-white/10 hover:text-white"
                    >
                      My Tickets
                    </Button>
                  </Link>
                )}
                
                <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start font-body text-sm text-white/90 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    Profile
                  </Button>
                </Link>
              </>
            )}
            
            <Link href="/explore-tickets" onClick={() => setIsMenuOpen(false)}>
              <Button
                variant="ghost"
                className={`w-full justify-start font-body text-sm transition-colors ${
                  pathname === "/explore-tickets"
                    ? "bg-white/20 text-white font-semibold"
                    : "text-white/90 hover:bg-white/10 hover:text-white"
                }`}
              >
                Explore Tickets
              </Button>
            </Link>
            
            {isLoggedIn ? (
              <>
                <div className="border-t border-white/10 my-2" />
                <div className="p-2 rounded-lg bg-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-white/50">Account</p>
                    {userRole && (
                      <Badge className={`text-xs font-subheading font-semibold ${
                        userRole === 'ADMIN' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                        userRole === 'EO' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                        'bg-green-500/20 text-green-400 border-green-500/30'
                      }`}>
                        {userRole}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-white font-subheading font-semibold mb-1">{username}</p>
                  {walletAddress && (
                    <p className="text-sm text-white/70 font-mono">{formatAddress(walletAddress)}</p>
                  )}
                </div>
                
                {walletAddress ? (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      handleDisconnectWallet()
                      setIsMenuOpen(false)
                    }}
                    className="w-full justify-start font-body text-sm text-yellow-400 hover:bg-yellow-500/20 hover:text-yellow-300"
                  >
                    <Wallet className="h-4 w-4 mr-2" />
                    Disconnect Wallet
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      handleConnectWallet()
                      setIsMenuOpen(false)
                    }}
                    variant="ghost"
                    className="w-full justify-start font-body text-sm text-white/90 hover:bg-white/10"
                  >
                    <Wallet className="h-4 w-4 mr-2" />
                    Connect Wallet
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  onClick={() => {
                    handleLogout()
                    setIsMenuOpen(false)
                  }}
                  className="w-full justify-start font-body text-sm text-red-400 hover:bg-red-500/20 hover:text-red-300"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-subheading font-semibold">
                  Login
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}