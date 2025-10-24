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

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "USER"
  })
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError("Kata sandi tidak cocok!")
      return
    }

    if (!agreeToTerms) {
      setError("Harap setujui syarat dan ketentuan")
      return
    }

    if (formData.password.length < 6) {
      setError("Kata sandi harus minimal 6 karakter")
      return
    }

    setIsLoading(true)

    try {
      const response = await apiClient.register(
        formData.username,
        formData.email,
        formData.password,
        formData.role
      )

      if (response.token) {
        apiClient.setToken(response.token)
        
        if (response.user.role === 'EO') {
          router.push('/eo/dashboard')
        } else {
          router.push('/events')
        }
      }
    } catch (err: any) {
      console.error('Registration error:', err)
      setError(err.message || 'Registration failed. Please try again.')
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
              <h1 className="font-heading mb-2 text-4xl text-white">Buat Akun</h1>
              <p className="font-body text-white/60">Bergabunglah dengan kami dan mulai kumpulkan tiket</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-red-400 font-body text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="font-body text-sm font-medium text-white/90">
                  Nama Pengguna
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="johndoe"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="font-body border-white/20 bg-white/5 text-white placeholder:text-white/40 focus:border-purple-500/50 focus:ring-purple-500/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="font-body text-sm font-medium text-white/90">
                  Alamat Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="awak@misalan.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="font-body border-white/20 bg-white/5 text-white placeholder:text-white/40 focus:border-purple-500/50 focus:ring-purple-500/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="font-body text-sm font-medium text-white/90">
                  Tipe Akun
                </Label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full h-9 px-3 rounded-md border border-white/20 bg-white/5 text-white text-sm focus:border-purple-500/50 focus:ring-purple-500/20 focus:outline-none"
                >
                  <option value="USER" className="bg-gray-800">Pengguna Reguler</option>
                  <option value="EO" className="bg-gray-800">Event Organizer (EO)</option>
                </select>
                <p className="text-xs text-white/50 mt-1">
                  {formData.role === 'EO' 
                    ? 'Akun EO dapat membuat dan mengelola acara tetapi tidak dapat membeli tiket' 
                    : 'Pengguna reguler dapat membeli dan mengumpulkan tiket'}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="font-body text-sm font-medium text-white/90">
                  Kata Sandi
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="font-body border-white/20 bg-white/5 text-white placeholder:text-white/40 focus:border-purple-500/50 focus:ring-purple-500/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="font-body text-sm font-medium text-white/90">
                  Konfirmasi Kata Sandi
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="font-body border-white/20 bg-white/5 text-white placeholder:text-white/40 focus:border-purple-500/50 focus:ring-purple-500/20"
                />
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                  disabled={isLoading}
                  className="mt-1 border-white/20 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                />
                <Label htmlFor="terms" className="font-body text-sm text-white/70 cursor-pointer leading-relaxed">
                  Saya menyetujui{" "}
                  <Link href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                    Syarat Layanan
                  </Link>{" "}
                  dan{" "}
                  <Link href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                    Kebijakan Privasi
                  </Link>
                </Label>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="font-body w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-purple-500/20"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Membuat akun...
                  </>
                ) : (
                  'Buat Akun'
                )}
              </Button>
            </form>

            <p className="font-body mt-6 text-center text-sm text-white/60">
              Sudah punya akun?{" "}
              <Link href="/login" className="text-purple-400 hover:text-purple-300 transition-colors">
                Masuk
              </Link>
            </p>
          </div>

          <div className="mt-4">
            <Link href="/">
              <Button
                variant="outline"
                className="border-white/20 bg-white/5 hover:bg-white/10 text-white hover:text-purple-500 font-body text-sm"
              >
                ← Kembali ke Landing Page
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}