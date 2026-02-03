"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api"
import { blockchainService } from "@/lib/blockchain"
import { Loader2, Wallet, ArrowRight } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConnectWallet = async () => {
    setIsConnecting(true)
    setError(null)

    try {
      // Connect to MetaMask
      const address = await blockchainService.connectWallet()

      const mockToken = "metamask-auth-token-" + Date.now()

      const mockUser = {
        id: "wallet-user-" + address.substring(2, 8),
        email: `${address.substring(0, 6)}...@wallet.com`,
        username: `Wallet ${address.substring(0, 6)}...`,
        role: "USER" as const,
        walletAddress: address,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      // Store session
      apiClient.setToken(mockToken)
      localStorage.setItem("dummy_user", JSON.stringify(mockUser))

      // Redirect to profile
      router.push("/profile")

    } catch (err) {
      console.error("Wallet connection error:", err)
      setError("Failed to connect wallet. Please try again.")
      setIsConnecting(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0a0a0a] via-[#1a0a2e] to-[#0a0a0a]">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 h-[200%] w-[200%] animate-spin-slow bg-gradient-to-r from-purple-500/10 via-transparent to-blue-500/10" />
        <div className="absolute top-1/4 right-1/4 h-96 w-96 animate-pulse rounded-full bg-purple-500/5 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      {/* Bottom right overlay */}
      <div className="absolute bottom-0 right-0 w-3/4 h-3/4 pointer-events-none">
        <Image
          src="/images/overlay-5.png"
          alt=""
          fill
          className="object-contain object-bottom-right opacity-60"
        />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 flex justify-center">
            <Image src="/images/app-logo.png" alt="App Logo" width={400} height={80} className="h-auto w-100" />
          </div>

          <div className="glass-fx p-8 text-center">
            <div className="mb-8">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-orange-400/20 to-orange-600/20 rounded-full flex items-center justify-center mb-6 border border-orange-500/30">
                <Image src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask" width={48} height={48} />
              </div>
              <h1 className="font-heading mb-2 text-2xl text-white">Connect Wallet</h1>
              <p className="font-body text-white/60">Connect your MetaMask wallet to access your tickets and profile.</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-red-400 font-body text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <Button
                onClick={handleConnectWallet}
                disabled={isConnecting}
                className="font-body w-full h-14 bg-gradient-to-r from-orange-500 to-amber-600 text-white hover:from-orange-600 hover:to-amber-700 transition-all duration-300 shadow-lg shadow-orange-500/20 text-lg"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet className="h-5 w-5 mr-3" />
                    Connect MetaMask
                  </>
                )}
              </Button>

              <Link href="https://metamask.io/" target="_blank" className="block">
                <Button
                  variant="ghost"
                  className="w-full text-white/40 hover:text-white hover:bg-white/5 font-body text-sm"
                >
                  Don't have a wallet? Get MetaMask <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link href="/">
              <Button
                variant="outline"
                className="border-white/20 bg-white/5 hover:bg-white/10 text-white hover:text-orange-400 font-body text-sm transition-colors"
                disabled={isConnecting}
              >
                ← Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}