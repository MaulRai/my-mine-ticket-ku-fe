"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  Ticket, 
  DollarSign, 
  TrendingUp,
  Plus,
  Loader2,
  Eye,
  Settings
} from "lucide-react"
import { apiClient, type Event } from "@/lib/api"
import { blockchainService } from "@/lib/blockchain"

export default function EODashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [stats, setStats] = useState<any>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkEOAccess()
  }, [])

  const checkEOAccess = async () => {
    try {
      const { user } = await apiClient.verifyToken()
      
      if (user.role !== 'EO' && user.role !== 'ADMIN') {
        router.push('/events')
        return
      }

      // Try to get wallet address, but don't require it for EO/Admin users
      const address = await blockchainService.getCurrentAccount()
      
      // Use wallet address if available, otherwise use user's wallet address from profile
      const walletToUse = address || user.walletAddress || null
      
      if (walletToUse) {
        setWalletAddress(walletToUse)
        await Promise.all([
          fetchDashboardStats(walletToUse),
          fetchEOEvents(walletToUse)
        ])
      } else {
        // If no wallet address, still show the page but with empty data
        setWalletAddress(null)
        setStats({
          totalEvents: 0,
          activeEvents: 0,
          totalTicketsSold: 0,
          totalRevenue: '0'
        })
        setEvents([])
      }
    } catch (err: any) {
      console.error('EO access error:', err)
      setError(err.message)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const getTotalTicketsSold = (event: Event): number => {
    return event.ticketTypes?.reduce((total, type) => total + type.sold, 0) || 0;
    }

  const fetchDashboardStats = async (address: string) => {
    try {
      const data = await apiClient.getDashboardStats(address)
      setStats(data)
    } catch (err: any) {
      console.error('Error fetching stats:', err)
    }
  }

  const fetchEOEvents = async (address: string) => {
    try {
      const data = await apiClient.getEOEvents(address)
      setEvents(data)
    } catch (err: any) {
      console.error('Error fetching events:', err)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatEther = (wei: string) => {
    try {
      return (parseFloat(wei) / 1e18).toFixed(4)
    } catch {
      return '0.0000'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
      case 'ACTIVE':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'PENDING':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'ENDED':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      case 'CANCELLED':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-12 flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-white animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-12 relative overflow-hidden">
      {/* Dark Blue Ambient Background */}
      <div className="fixed inset-0 overflow-hidden opacity-70 pointer-events-none">
        <div className="absolute top-0 -left-1/3 w-2/3 h-full bg-gradient-radial from-blue-600/80 to-transparent animate-pulse-slow" />
        <div className="absolute bottom-0 -right-1/3 w-2/3 h-full bg-gradient-radial from-indigo-600/60 to-transparent animate-pulse-slow animation-delay-2000" />
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-500/40 rounded-full blur-3xl animate-float-drift" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-indigo-500/40 rounded-full blur-3xl animate-float-drift animation-delay-4000" />
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-heading text-white mb-2">EO Dashboard</h1>
            <p className="text-gray-400 font-body">Manage your events and track performance</p>
          </div>
          <Button
            onClick={() => router.push('/eo/create-event')}
            className="bg-linear-to-r from-blue-600 via-blue-500 to-indigo-500 hover:from-blue-500 hover:via-blue-400 hover:to-indigo-400 text-white font-subheading font-semibold shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-400/60 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Event
          </Button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400 font-body text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 font-body text-sm mb-1">Total Events</p>
                  <p className="text-3xl font-heading text-white">{stats?.totalEvents || 0}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 font-body text-sm mb-1">Active Events</p>
                  <p className="text-3xl font-heading text-white">{stats?.activeEvents || 0}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 font-body text-sm mb-1">Tickets Sold</p>
                  <p className="text-3xl font-heading text-white">{stats?.totalTicketsSold || 0}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Ticket className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 font-body text-sm mb-1">Total Revenue</p>
                  <p className="text-2xl font-heading text-white">Rp{(parseFloat(stats?.totalRevenue || '0')).toLocaleString('id-ID')}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-subheading font-semibold text-white mb-4">Your Events</h2>
        </div>

        {events.length === 0 ? (
          <Card className="border-white/10 bg-linear-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md">
            <CardContent className="p-12 text-center">
              <Calendar className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 font-body mb-4">You haven't created any events yet</p>
              <Button
                onClick={() => router.push('/eo/create-event')}
                className="bg-linear-to-r from-blue-600 via-blue-500 to-indigo-500 hover:from-blue-500 hover:via-blue-400 hover:to-indigo-400 text-white shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-400/60 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Your First Event
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="group overflow-hidden border-white/10 bg-linear-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1">
                <div className="relative h-40 w-full overflow-hidden">
                  <Image
                    src={event.posterUrl || "/placeholder.svg"}
                    alt={event.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
                  
                  <div className="absolute top-3 right-3">
                    <Badge className={`font-subheading font-semibold text-xs px-3 py-1 ${getStatusColor(event.status)}`}>
                      {event.status}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-5 space-y-3">
                  <h3 className="font-subheading font-semibold text-lg text-white leading-tight line-clamp-2">
                    {event.name}
                  </h3>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 font-body">Date</span>
                      <span className="text-white font-subheading">{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 font-body">Tickets Sold</span>
                      <span className="text-white font-subheading font-semibold">
                        {getTotalTicketsSold(event)}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-white/10">
                    <Button
                      onClick={() => router.push(`/eo/events/${event.id}`)}
                      variant="outline"
                      size="sm"
                      className="flex-1 border-white/20 text-white hover:bg-white/10"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button
                      onClick={() => router.push(`/eo/events/${event.id}/settings`)}
                      variant="outline"
                      size="sm"
                      className="flex-1 border-white/20 text-white hover:bg-white/10"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Manage
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.25; }
          33% { opacity: 0.35; }
          66% { opacity: 0.45; }
        }
        @keyframes float-drift {
          0%, 100% { transform: translate(0px, 0px); opacity: 0.2; }
          25% { transform: translate(30px, -25px); opacity: 0.25; }
          50% { transform: translate(-20px, -40px); opacity: 0.3; }
          75% { transform: translate(-35px, -15px); opacity: 0.25; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 12s ease-in-out infinite;
          opacity: 0.25;
        }
        .animate-float-drift {
          animation: float-drift 20s ease-in-out infinite;
          opacity: 0.2;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  )
}