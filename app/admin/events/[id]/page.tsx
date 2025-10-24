"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Clock,
  DollarSign,
  Ticket,
  TrendingUp,
  Eye,
  Loader2,
  XCircle
} from "lucide-react"
import { apiClient, type Event, EventStatus } from "@/lib/api"

interface EventStatistics {
  totalViews?: number
  totalRevenue?: string
  totalTicketsSold?: number
}

export default function AdminEventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [event, setEvent] = useState<Event | null>(null)
  const [statistics, setStatistics] = useState<EventStatistics | null>(null)
  const [error, setError] = useState<string | null>(null)

  const checkAdminAccess = async () => {
    try {
      const { user } = await apiClient.verifyToken()
      
      if (user.role !== 'ADMIN') {
        router.push('/events')
        return
      }
      
      await Promise.all([
        fetchEventDetail(),
        fetchEventStatistics()
      ])
    } catch (error) {
      const err = error as Error
      console.error('Admin access error:', err)
      setError(err.message)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAdminAccess()
  }, [checkAdminAccess])

  const fetchEventDetail = async () => {
    try {
      const data = await apiClient.getEventById(id)
      setEvent(data)
    } catch (error) {
      const err = error as Error
      console.error('Error fetching event:', err)
      setError(err.message)
    }
  }

  const fetchEventStatistics = async () => {
    try {
      const data = await apiClient.getEventStatistics(id)
      setStatistics(data as EventStatistics)
    } catch (error) {
      console.error('Error fetching statistics:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const formatEther = (wei: string) => {
    try {
      return (parseFloat(wei) / 1e18).toFixed(4)
    } catch {
      return '0.0000'
    }
  }

  const getStatusColor = (status: EventStatus) => {
    switch (status) {
      case EventStatus.APPROVED:
      case EventStatus.ACTIVE:
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case EventStatus.PENDING:
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case EventStatus.ENDED:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      case EventStatus.CANCELLED:
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    }
  }

  const getTotalTicketsAvailable = () => {
    if (!event?.ticketTypes) return 0
    return event.ticketTypes.reduce((total, type) => total + type.stock, 0)
  }

  const getTotalTicketsSold = () => {
    if (!event?.ticketTypes) return 0
    return event.ticketTypes.reduce((total, type) => total + type.sold, 0)
  }

  const getTotalRevenue = () => {
    if (!event?.ticketTypes) return '0'
    const total = event.ticketTypes.reduce((sum, type) => {
      return sum + (parseFloat(type.price) * type.sold)
    }, 0)
    return total.toString()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-12 flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-white animate-spin" />
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="mb-6">
            <Link href="/admin/dashboard">
              <Button variant="ghost" className="text-white hover:text-white/80">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Dashboard
              </Button>
            </Link>
          </div>
          <Card className="border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md">
            <CardContent className="p-12 text-center">
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <p className="text-gray-400 font-body">{error || 'Event tidak ditemukan'}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-6">
          <Link href="/admin/dashboard">
            <Button variant="ghost" className="text-white hover:text-white/80">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Dashboard
            </Button>
          </Link>
        </div>

        <div className="mb-8 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-4xl font-heading text-white">{event.name}</h1>
              <Badge className={getStatusColor(event.status)}>
                {event.status}
              </Badge>
            </div>
            <div className="space-y-2 text-gray-400">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="font-body">Organizer: {event.creator?.username || event.creator?.email || 'Unknown'}</span>
              </div>
              {event.creator?.walletAddress && (
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">{event.creator.walletAddress}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 font-body text-sm mb-1">Total Tiket</p>
                  <p className="text-3xl font-heading text-white">{getTotalTicketsAvailable()}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Ticket className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 font-body text-sm mb-1">Tiket Terjual</p>
                  <p className="text-3xl font-heading text-white">{getTotalTicketsSold()}</p>
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
                  <p className="text-gray-400 font-body text-sm mb-1">Total Pendapatan</p>
                  <p className="text-2xl font-heading text-white">{formatEther(getTotalRevenue())} ETH</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 font-body text-sm mb-1">Total View</p>
                  <p className="text-3xl font-heading text-white">{statistics?.totalViews || 0}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Eye className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <Card className="border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white font-subheading">Detail Event</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {event.posterUrl && (
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                    <Image
                      src={event.posterUrl}
                      alt={event.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-gray-400 font-body text-sm mb-1">Lokasi</p>
                      <p className="text-white font-subheading">{event.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-gray-400 font-body text-sm mb-1">Tanggal Event</p>
                      <p className="text-white font-subheading">{formatDate(event.date)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-gray-400 font-body text-sm mb-1">Dibuat</p>
                      <p className="text-white font-subheading">{formatDate(event.createdAt)}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <p className="text-gray-400 font-body text-sm mb-2">Deskripsi</p>
                  <p className="text-white font-body leading-relaxed">{event.description}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white font-subheading">Proposal Info</CardTitle>
              </CardHeader>
              <CardContent>
                {event.proposals && event.proposals.length > 0 ? (
                  <div className="space-y-4">
                    {event.proposals.map((proposal) => (
                      <div key={proposal.id} className="space-y-3">
                        <div>
                          <p className="text-gray-400 font-body text-xs mb-1">Status</p>
                          <Badge className={`${
                            proposal.status === 'APPROVED' 
                              ? 'bg-green-500/20 text-green-400 border-green-500/30'
                              : proposal.status === 'REJECTED'
                              ? 'bg-red-500/20 text-red-400 border-red-500/30'
                              : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                          }`}>
                            {proposal.status}
                          </Badge>
                        </div>

                        <div>
                          <p className="text-gray-400 font-body text-xs mb-1">Tax Wallet</p>
                          <p className="text-white font-mono text-xs break-all">{proposal.taxWalletAddress}</p>
                        </div>

                        <div>
                          <p className="text-gray-400 font-body text-xs mb-2">Revenue Split</p>
                          <div className="space-y-2">
                            {proposal.revenueBeneficiaries.map((beneficiary, idx) => (
                              <div key={idx} className="p-2 bg-white/5 rounded border border-white/10">
                                {beneficiary.name && (
                                  <p className="text-white font-subheading text-xs mb-1">{beneficiary.name}</p>
                                )}
                                <p className="text-gray-400 font-mono text-xs mb-1">{beneficiary.address}</p>
                                <p className="text-white font-heading text-sm">{(beneficiary.percentage / 100).toFixed(2)}%</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {proposal.adminComment && (
                          <div>
                            <p className="text-gray-400 font-body text-xs mb-1">Admin Comment</p>
                            <p className="text-white font-body text-sm">{proposal.adminComment}</p>
                          </div>
                        )}

                        <div>
                          <p className="text-gray-400 font-body text-xs mb-1">Submitted</p>
                          <p className="text-white font-subheading text-sm">{formatDate(proposal.submittedAt)}</p>
                        </div>

                        {proposal.reviewedAt && (
                          <div>
                            <p className="text-gray-400 font-body text-xs mb-1">Reviewed</p>
                            <p className="text-white font-subheading text-sm">{formatDate(proposal.reviewedAt)}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 font-body text-sm">Tidak ada proposal</p>
                )}
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white font-subheading">Blockchain Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-gray-400 font-body text-xs mb-1">Event ID</p>
                  <p className="text-white font-mono text-sm">#{event.eventId}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-body text-xs mb-1">Creator Address</p>
                  <p className="text-white font-mono text-xs break-all">{event.creator?.walletAddress || 'N/A'}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {event.ticketTypes && event.ticketTypes.length > 0 && (
          <Card className="border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white font-subheading">Jenis Tiket</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {event.ticketTypes.map((ticketType) => (
                  <div 
                    key={ticketType.id}
                    className="p-4 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-subheading font-semibold text-white">
                            {ticketType.name}
                          </h3>
                          <Badge className={ticketType.active ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'}>
                            {ticketType.active ? 'Aktif' : 'Nonaktif'}
                          </Badge>
                        </div>
                        {ticketType.description && (
                          <p className="text-gray-400 font-body text-sm mb-3">{ticketType.description}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-heading text-white">{formatEther(ticketType.price)} ETH</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-gray-400 font-body text-xs mb-1">Stok Total</p>
                        <p className="text-white font-heading text-lg">{ticketType.stock}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 font-body text-xs mb-1">Terjual</p>
                        <p className="text-white font-heading text-lg">{ticketType.sold}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 font-body text-xs mb-1">Tersisa</p>
                        <p className="text-white font-heading text-lg">{ticketType.stock - ticketType.sold}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 font-body text-xs mb-1">Progress</p>
                        <p className="text-white font-heading text-lg">{((ticketType.sold / ticketType.stock) * 100).toFixed(1)}%</p>
                      </div>
                    </div>

                    <div className="w-full bg-white/10 rounded-full h-2 mb-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                        style={{ width: `${(ticketType.sold / ticketType.stock) * 100}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400 font-body text-xs mb-1">Mulai Penjualan</p>
                        <p className="text-white font-subheading text-xs">{formatDate(ticketType.saleStartDate)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 font-body text-xs mb-1">Akhir Penjualan</p>
                        <p className="text-white font-subheading text-xs">{formatDate(ticketType.saleEndDate)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
