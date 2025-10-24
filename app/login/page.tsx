"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { apiClient } from "@/lib/api"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await apiClient.login(email, password)
      
      if (response.token) {
        apiClient.setToken(response.token)
        
        if (response.user.role === 'ADMIN') {
          router.push('/admin/dashboard')
        } else if (response.user.role === 'EO') {
          router.push('/eo/dashboard')
        } else {
          router.push('/events')
        }
      }
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
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
          
          <div className="glass-fx p-8">
            <div className="mb-8 text-center">
              <h1 className="font-heading mb-2 text-4xl text-white">Welcome Back</h1>
              <p className="font-body text-white/60">Sign in to access your tickets</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-red-400 font-body text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-body text-sm font-medium text-white/90">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="font-body border-white/20 bg-white/5 text-white placeholder:text-white/40 focus:border-purple-500/50 focus:ring-purple-500/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="font-body text-sm font-medium text-white/90">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="font-body border-white/20 bg-white/5 text-white placeholder:text-white/40 focus:border-purple-500/50 focus:ring-purple-500/20"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    disabled={isLoading}
                    className="border-white/20 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                  />
                  <Label htmlFor="remember" className="font-body text-sm text-white/70 cursor-pointer">
                    Remember me
                  </Label>
                </div>
                <Link href="#" className="font-body text-sm text-purple-400 hover:text-purple-300 transition-colors">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="font-body w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-purple-500/20"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <p className="font-body mt-6 text-center text-sm text-white/60">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-purple-400 hover:text-purple-300 transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}