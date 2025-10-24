"use client"

import { useState, use } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  ArrowLeft,
  Ticket,
  ChevronLeft,
  ChevronRight,
  Eye,
  Heart,
  Share2,
} from "lucide-react"
import { allEvents } from "@/lib/events-data"

interface EventDataType {
  id: number
  name: string
  logo: string
  banner: string
  category: string
  featuring: string[]
  location: string
  address: string
  date: string
  time: string
  capacity: string
  regularTickets: number
  regularTicketsSold: number
  vipTickets: number
  vipTicketsSold: number
  description: string
  ticketPrice: string
  organizer: string
  soldOut: boolean
}

// Generate enhanced event data from allEvents
const generateEventDetails = (): Record<string, EventDataType> => {
  const addresses = [
    "Jl. Pintu Satu Senayan, Jakarta Pusat, DKI Jakarta",
    "Jl. Pluit Selatan Raya, Jakarta Utara, DKI Jakarta",
    "BSD Green Office Park, Tangerang, Banten",
    "Jl. Pintu Satu Senayan, Jakarta Pusat, DKI Jakarta",
    "Kawasan ITDC, Nusa Dua, Bali",
    "Jl. Gatot Subroto No.289, Bandung, Jawa Barat",
    "Jl. Basuki Rahmat No.8-12, Surabaya, Jawa Timur",
    "Jl. Casablanca Kav.88, Jakarta Selatan, DKI Jakarta",
    "Jl. AM Sangaji, Yogyakarta, DIY",
    "Jl. Lodan Timur No.7, Jakarta Utara, DKI Jakarta",
  ]

  const times = [
    "18:00 - 23:00 WIB",
    "19:00 - 00:00 WIB",
    "17:00 - 22:00 WIB",
    "20:00 - 01:00 WIB",
    "16:00 - 22:00 WITA",
    "18:30 - 23:30 WIB",
    "19:00 - 00:00 WIB",
    "17:30 - 22:30 WIB",
    "18:00 - 23:00 WIB",
    "19:30 - 00:30 WIB",
  ]

  const capacities = [
    "5.000 peserta",
    "4.500 peserta",
    "3.500 peserta",
    "6.000 peserta",
    "4.000 peserta",
    "3.000 peserta",
    "5.500 peserta",
    "2.500 peserta",
    "4.200 peserta",
    "4.800 peserta",
  ]

  const organizers = [
    "Wave Entertainment",
    "Live Nation Indonesia",
    "Ismaya Live",
    "Java Musikindo",
    "Island Vibes Productions",
    "Rajawali Indonesia",
    "Concert Pro Indonesia",
    "Urban Motion",
    "Jogja Live",
    "Coastline Events",
  ]

  const ticketConfigs = [
    { regular: 4000, regularSold: 3200, vip: 1000, vipSold: 850 },
    { regular: 3500, regularSold: 3500, vip: 1000, vipSold: 1000 },
    { regular: 2800, regularSold: 1400, vip: 700, vipSold: 350 },
    { regular: 4800, regularSold: 3840, vip: 1200, vipSold: 1080 },
    { regular: 3200, regularSold: 2240, vip: 800, vipSold: 560 },
    { regular: 2400, regularSold: 1200, vip: 600, vipSold: 300 },
    { regular: 4400, regularSold: 2640, vip: 1100, vipSold: 660 },
    { regular: 2000, regularSold: 1000, vip: 500, vipSold: 250 },
    { regular: 3360, regularSold: 1680, vip: 840, vipSold: 420 },
    { regular: 3840, regularSold: 1920, vip: 960, vipSold: 480 },
  ]

  const eventData: Record<string, EventDataType> = {}

  allEvents.forEach((event, index) => {
    eventData[event.id.toString()] = {
      ...event,
      address: addresses[index],
      time: times[index],
      capacity: capacities[index],
      regularTickets: ticketConfigs[index].regular,
      regularTicketsSold: ticketConfigs[index].regularSold,
      vipTickets: ticketConfigs[index].vip,
      vipTicketsSold: ticketConfigs[index].vipSold,
      description: `Rasakan pengalaman festival musik terbaik yang menampilkan ${event.featuring.slice(0, 3).join(", ")} dan banyak lagi! ${event.name} menghadirkan musik Indonesia terbaik dalam malam pertunjukan, cahaya, dan energi yang tak terlupakan. Bergabunglah dengan ribuan pencinta musik untuk acara spektakuler ini.`,
      ticketPrice: "Mulai dari Rp 350.000",
      organizer: organizers[index],
      soldOut: false,
    }
  })

  return eventData
}

const eventData = generateEventDetails()

const resaleTickets = [
  { id: 1, seller: "John D.", type: "Regular", price: 385000, originalPrice: 350000 },
  { id: 2, seller: "Sarah M.", type: "VIP", price: 825000, originalPrice: 750000 },
  { id: 3, seller: "Mike R.", type: "Regular", price: 370000, originalPrice: 350000 },
  { id: 4, seller: "Lisa K.", type: "VIP", price: 900000, originalPrice: 750000 },
  { id: 5, seller: "David P.", type: "Regular", price: 400000, originalPrice: 350000 },
  { id: 6, seller: "Emma W.", type: "Regular", price: 365000, originalPrice: 350000 },
  { id: 7, seller: "Chris B.", type: "VIP", price: 850000, originalPrice: 750000 },
  { id: 8, seller: "Anna L.", type: "Regular", price: 390000, originalPrice: 350000 },
  { id: 9, seller: "Tom H.", type: "Regular", price: 375000, originalPrice: 350000 },
  { id: 10, seller: "Rachel S.", type: "VIP", price: 880000, originalPrice: 750000 },
  { id: 11, seller: "Kevin J.", type: "Regular", price: 395000, originalPrice: 350000 },
  { id: 12, seller: "Sophie T.", type: "Regular", price: 360000, originalPrice: 350000 },
  { id: 13, seller: "Mark W.", type: "VIP", price: 920000, originalPrice: 750000 },
  { id: 14, seller: "Julia F.", type: "Regular", price: 380000, originalPrice: 350000 },
  { id: 15, seller: "Alex C.", type: "Regular", price: 405000, originalPrice: 350000 },
]

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const event = eventData[id] || eventData["1"]
  const [marketPage, setMarketPage] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)

  const TICKETS_PER_PAGE = 9
  const totalPages = Math.ceil(resaleTickets.length / TICKETS_PER_PAGE)
  const currentTickets = resaleTickets.slice(marketPage * TICKETS_PER_PAGE, (marketPage + 1) * TICKETS_PER_PAGE)

  // sold out state will be derived from ticket counts below

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.name,
          text: `Check out ${event.name} - ${event.featuring.join(", ")}`,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  const regularTicketsRemaining = event.regularTickets - event.regularTicketsSold
  const vipTicketsRemaining = event.vipTickets - event.vipTicketsSold
  const totalTickets = event.regularTickets + event.vipTickets
  const totalTicketsSold = event.regularTicketsSold + event.vipTicketsSold
  const ticketsSoldPercentage = ((totalTicketsSold / totalTickets) * 100).toFixed(1)
  // Determine sold-out mode from ticket configuration (both tiers sold)
  const isSoldOut = (regularTicketsRemaining <= 0 && vipTicketsRemaining <= 0) || event.soldOut

  const handleCheckout = () => {
    router.push(`/events/${id}/checkout`)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* sold-out mode is derived from ticket config; dev toggle removed */}

      {/* Hero Section with Banner */}
      <div className="relative h-[370px] m-4 sm:m-6 md:m-8 mt-0 mb-0 overflow-visible rounded-b-2xl bg-black">
        <div className="absolute inset-0 overflow-hidden rounded-b-2xl">
          <Image src={event.banner || "/placeholder.svg"} alt="Event banner" fill className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 via-60% to-black/80 rounded-b-2xl" />

        <div className="absolute inset-0 flex items-end justify-start">
          <div className="text-white px-4 sm:px-6 md:px-12 pb-6 sm:pb-8 md:pb-12 flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
            <Link href="/events">
              <button className="glass-fx p-2 sm:p-3 rounded-full hover:bg-white/30 transition-all z-10" aria-label="Back">
                <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </button>
            </Link>

            {/* Event Logo */}
            <div className="relative h-24 w-24 sm:h-32 sm:w-32 md:h-40 md:w-40 rounded-xl overflow-hidden shadow-2xl border-2 sm:border-4 border-white/20">
              <Image src={event.logo || "/placeholder.svg"} alt={event.name} fill className="object-cover" />
            </div>

            {/* Event Info */}
            <div className="flex-1 pb-2 w-full sm:w-auto">
              <div className="mb-2 sm:mb-3 flex items-center gap-2 sm:gap-3 flex-wrap">
                <Badge className="glass-fx text-white font-subheading font-semibold text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-1.5">
                  {event.category}
                </Badge>
                <button
                  onClick={handleShare}
                  className="glass-fx p-1.5 sm:p-2 rounded-full hover:bg-white/30 transition-all"
                  aria-label="Share event"
                >
                  <Share2 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </button>
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`glass-fx p-1.5 sm:p-2 rounded-full hover:bg-white/30 transition-all ${
                    isFavorite ? "bg-red-500/30" : ""
                  }`}
                  aria-label="Favorite event"
                >
                  <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-white"}`} />
                </button>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading mb-2 sm:mb-4 text-balance">{event.name}</h1>
              <div className="mb-2 sm:mb-4">
                <p className="text-sm sm:text-base md:text-lg lg:text-xl font-subheading font-semibold text-gray-200">
                  Menampilkan: {event.featuring.join(", ")}
                </p>
              </div>
              <div className="flex items-center gap-2 glass-fx px-3 sm:px-4 py-1.5 sm:py-2 rounded-full w-fit">
                <Ticket className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                <span className="text-white font-subheading font-semibold text-xs sm:text-sm">
                  {totalTicketsSold.toLocaleString("id-ID")} / {totalTickets.toLocaleString("id-ID")} tiket terjual (
                  {ticketsSoldPercentage}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Ticket Purchase Card - Positioned at border (Desktop only) */}
        <div className="hidden lg:block absolute top-[calc(100%-5rem)] right-4 sm:right-6 md:right-12 w-full max-w-[calc(100%-2rem)] sm:max-w-[calc(100%-3rem)] md:w-96 z-20">
          <Card className="border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md shadow-2xl">
            <CardContent className="p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
              {isSoldOut ? (
                <>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-heading text-white mb-2">Tiket Habis Terjual</h2>
                    <p className="text-gray-400 font-body text-xs sm:text-sm">
                      Semua tiket sudah terjual. Periksa pasar jual beli tiket di bawah untuk tiket yang tersedia.
                    </p>
                  </div>
                  <div className="p-3 sm:p-4 rounded-lg border-2 border-red-500/30 bg-red-500/10">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                      <Ticket className="h-5 w-5 sm:h-6 sm:w-6 text-red-400" />
                      <h3 className="font-subheading font-semibold text-sm sm:text-base text-red-400">Tidak Ada Tiket Tersedia</h3>
                    </div>
                    <p className="text-gray-300 font-body text-xs sm:text-sm">
                      Jelajahi tiket jual beli dari penjual terverifikasi di bagian pasar di bawah.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-gray-400 font-body text-xs text-center">
                      Diselenggarakan oleh <span className="text-white font-semibold">{event.organizer}</span>
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-heading text-white mb-2">Dapatkan Tiket Anda</h2>
                    <p className="text-gray-400 font-body text-xs sm:text-sm">Pesan tiketmu dan jadi bagian dari momen luar biasa ini</p>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <div className="p-3 sm:p-4 rounded-lg border-2 border-white/10 hover:border-white/20 transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-subheading font-semibold text-sm sm:text-base text-white">Tiket Reguler</h3>
                      </div>
                      <p className="text-xl sm:text-2xl font-heading text-white mb-1">Rp 350.000</p>
                      <p className="text-gray-400 font-body text-xs mb-2">Masuk umum</p>
                      <div className="space-y-1 mb-3">
                        <p className="text-gray-300 font-body text-xs flex items-start gap-1.5">
                          <span className="text-green-400 mt-0.5">✓</span>
                          <span>Akses ke area umum venue</span>
                        </p>
                        <p className="text-gray-300 font-body text-xs flex items-start gap-1.5">
                          <span className="text-green-400 mt-0.5">✓</span>
                          <span>Tiket NFT terverifikasi <span className="italic">blockchain</span></span>
                        </p>
                        <p className="text-gray-300 font-body text-xs flex items-start gap-1.5">
                          <span className="text-green-400 mt-0.5">✓</span>
                          <span>Akses ke semua panggung utama</span>
                        </p>
                        <p className="text-gray-300 font-body text-xs flex items-start gap-1.5">
                          <span className="text-green-400 mt-0.5">✓</span>
                          <span>Kesempatan mendapat <span className="italic">POAP badge</span></span>
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <span className="text-gray-400 font-body text-xs">Tersisa</span>
                        <span className="text-white font-subheading font-semibold text-xs sm:text-sm">
                          {regularTicketsRemaining.toLocaleString("id-ID")} /{" "}
                          {event.regularTickets.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 sm:p-4 rounded-lg border-2 border-purple-500/30 bg-purple-500/5 hover:border-purple-500/40 transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-subheading font-semibold text-sm sm:text-base text-white">Tiket VIP</h3>
                        <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 font-subheading text-xs">Premium</Badge>
                      </div>
                      <p className="text-xl sm:text-2xl font-heading text-white mb-1">Rp 750.000</p>
                      <p className="text-gray-400 font-body text-xs mb-2">Akses area premium dengan pengalaman eksklusif</p>
                      <div className="space-y-1 mb-3">
                        <p className="text-gray-300 font-body text-xs flex items-start gap-1.5">
                          <span className="text-purple-400 mt-0.5">✓</span>
                          <span className="font-semibold text-purple-200">Semua benefit Tiket Reguler</span>
                        </p>
                        <p className="text-gray-300 font-body text-xs flex items-start gap-1.5">
                          <span className="text-purple-400 mt-0.5">✓</span>
                          <span>Akses area VIP eksklusif dengan view terbaik</span>
                        </p>
                        <p className="text-gray-300 font-body text-xs flex items-start gap-1.5">
                          <span className="text-purple-400 mt-0.5">✓</span>
                          <span>Lounge premium dengan makanan & minuman gratis</span>
                        </p>
                        <p className="text-gray-300 font-body text-xs flex items-start gap-1.5">
                          <span className="text-purple-400 mt-0.5">✓</span>
                          <span>Prioritas masuk & jalur <span className="italic">fast-track</span></span>
                        </p>
                        <p className="text-gray-300 font-body text-xs flex items-start gap-1.5">
                          <span className="text-purple-400 mt-0.5">✓</span>
                          <span>Merchandise eksklusif & <span className="italic">meet & greet</span></span>
                        </p>
                        <p className="text-gray-300 font-body text-xs flex items-start gap-1.5">
                          <span className="text-purple-400 mt-0.5">✓</span>
                          <span>Parkir khusus VIP</span>
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-purple-500/20">
                        <span className="text-gray-400 font-body text-xs">Tersisa</span>
                        <span className="text-white font-subheading font-semibold text-xs sm:text-sm">
                          {vipTicketsRemaining.toLocaleString("id-ID")} / {event.vipTickets.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    className="w-full h-10 sm:h-11 md:h-12 bg-gradient-to-b from-gray-400 via-gray-500 to-gray-700 hover:from-gray-300 hover:to-gray-600 text-white font-subheading font-semibold text-sm sm:text-base transition-all duration-300"
                  >
                    <Ticket className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Beli Tiket
                  </Button>

                  <div className="pt-4 border-t border-white/10">
                    <p className="text-gray-400 font-body text-xs text-center">
                      Diselenggarakan oleh <span className="text-white font-semibold">{event.organizer}</span>
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 pt-8 sm:pt-10 md:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Event Details - Left side with space for ticket card */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Ticket Purchase Card - Mobile/Tablet First */}
            <div className="lg:hidden">
              <Card className="border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md shadow-2xl">
                <CardContent className="p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
              {isSoldOut ? (
                <>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-heading text-white mb-2">Tiket Habis Terjual</h2>
                    <p className="text-gray-400 font-body text-xs sm:text-sm">
                      Semua tiket sudah terjual. Periksa pasar jual beli tiket di bawah untuk tiket yang tersedia.
                    </p>
                  </div>
                  <div className="p-3 sm:p-4 rounded-lg border-2 border-red-500/30 bg-red-500/10">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                      <Ticket className="h-5 w-5 sm:h-6 sm:w-6 text-red-400" />
                      <h3 className="font-subheading font-semibold text-sm sm:text-base text-red-400">
                        Tidak Ada Tiket Tersedia
                      </h3>
                    </div>
                    <p className="text-gray-300 font-body text-xs sm:text-sm">
                      Jelajahi tiket jual beli dari penjual terverifikasi di bagian pasar di bawah.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-gray-400 font-body text-xs text-center">
                      Diselenggarakan oleh <span className="text-white font-semibold">{event.organizer}</span>
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-heading text-white mb-2">Dapatkan Tiket Anda</h2>
                    <p className="text-gray-400 font-body text-xs sm:text-sm">Amankan tempat Anda di acara luar biasa ini</p>
                  </div>                      <div className="space-y-2 sm:space-y-3">
                        <div className="p-3 sm:p-4 rounded-lg border-2 border-white/10 hover:border-white/20 transition-all">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-subheading font-semibold text-sm sm:text-base text-white">Tiket Reguler</h3>
                          </div>
                          <p className="text-xl sm:text-2xl font-heading text-white mb-1">Rp 350.000</p>
                          <p className="text-gray-400 font-body text-xs mb-2">Masuk umum</p>
                          <div className="space-y-1 mb-3">
                            <p className="text-gray-300 font-body text-xs flex items-start gap-1.5">
                              <span className="text-green-400 mt-0.5">✓</span>
                              <span>Akses ke area umum venue</span>
                            </p>
                            <p className="text-gray-300 font-body text-xs flex items-start gap-1.5">
                              <span className="text-green-400 mt-0.5">✓</span>
                              <span>Tiket NFT terverifikasi <span className="italic">blockchain</span></span>
                            </p>
                            <p className="text-gray-300 font-body text-xs flex items-start gap-1.5">
                              <span className="text-green-400 mt-0.5">✓</span>
                              <span>Akses ke semua panggung utama</span>
                            </p>
                            <p className="text-gray-300 font-body text-xs flex items-start gap-1.5">
                              <span className="text-green-400 mt-0.5">✓</span>
                              <span>Kesempatan mendapat <span className="italic">POAP badge</span></span>
                            </p>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-white/10">
                            <span className="text-gray-400 font-body text-xs">Tersisa</span>
                            <span className="text-white font-subheading font-semibold text-xs sm:text-sm">
                              {regularTicketsRemaining.toLocaleString("id-ID")} /{" "}
                              {event.regularTickets.toLocaleString("id-ID")}
                            </span>
                          </div>
                        </div>

                        <div className="p-3 sm:p-4 rounded-lg border-2 border-purple-500/30 bg-purple-500/5 hover:border-purple-500/40 transition-all">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-subheading font-semibold text-sm sm:text-base text-white">Tiket VIP</h3>
                            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 font-subheading text-xs">Premium</Badge>
                          </div>
                          <p className="text-xl sm:text-2xl font-heading text-white mb-1">Rp 750.000</p>
                          <p className="text-gray-400 font-body text-xs mb-2">Akses area premium dengan pengalaman eksklusif</p>
                          <div className="space-y-1 mb-3">
                            <p className="text-gray-300 font-body text-xs flex items-start gap-1.5">
                              <span className="text-purple-400 mt-0.5">✓</span>
                              <span className="font-semibold text-purple-200">Semua benefit Tiket Reguler</span>
                            </p>
                            <p className="text-gray-300 font-body text-xs flex items-start gap-1.5">
                              <span className="text-purple-400 mt-0.5">✓</span>
                              <span>Akses area VIP eksklusif dengan view terbaik</span>
                            </p>
                            <p className="text-gray-300 font-body text-xs flex items-start gap-1.5">
                              <span className="text-purple-400 mt-0.5">✓</span>
                              <span>Lounge premium dengan makanan & minuman gratis</span>
                            </p>
                            <p className="text-gray-300 font-body text-xs flex items-start gap-1.5">
                              <span className="text-purple-400 mt-0.5">✓</span>
                              <span>Prioritas masuk & jalur <span className="italic">fast-track</span></span>
                            </p>
                            <p className="text-gray-300 font-body text-xs flex items-start gap-1.5">
                              <span className="text-purple-400 mt-0.5">✓</span>
                              <span>Merchandise eksklusif & <span className="italic">meet & greet</span></span>
                            </p>
                            <p className="text-gray-300 font-body text-xs flex items-start gap-1.5">
                              <span className="text-purple-400 mt-0.5">✓</span>
                              <span>Parkir khusus VIP</span>
                            </p>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-purple-500/20">
                            <span className="text-gray-400 font-body text-xs">Tersisa</span>
                            <span className="text-white font-subheading font-semibold text-xs sm:text-sm">
                              {vipTicketsRemaining.toLocaleString("id-ID")} / {event.vipTickets.toLocaleString("id-ID")}
                            </span>
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={handleCheckout}
                        className="w-full h-10 sm:h-11 md:h-12 bg-gradient-to-b from-gray-400 via-gray-500 to-gray-700 hover:from-gray-300 hover:to-gray-600 text-white font-subheading font-semibold text-sm sm:text-base transition-all duration-300"
                      >
                        <Ticket className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                        Beli Tiket
                      </Button>

                      <div className="pt-4 border-t border-white/10">
                        <p className="text-gray-400 font-body text-xs text-center">
                          Diselenggarakan oleh <span className="text-white font-semibold">{event.organizer}</span>
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* About Section */}
            <Card className="border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md">
              <CardContent className="p-4 sm:p-5 md:p-6">
                <h2 className="text-xl sm:text-2xl font-heading text-white mb-3 sm:mb-4">Tentang Acara Ini</h2>
                <p className="text-gray-300 font-body leading-relaxed text-sm sm:text-base">{event.description}</p>
              </CardContent>
            </Card>

            {/* Event Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Card className="border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md hover:border-white/20 transition-all">
                <CardContent className="px-4 sm:px-6 py-2">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 border border-white/20 shrink-0">
                      <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-subheading font-semibold text-sm sm:text-base text-white mb-1">Lokasi</h3>
                      <p className="text-gray-300 font-body text-xs sm:text-sm">{event.location}</p>
                      <p className="text-gray-400 font-body text-xs mt-1 break-words">{event.address}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md hover:border-white/20 transition-all">
                <CardContent className="px-4 sm:px-6 py-2">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 border border-white/20 shrink-0">
                      <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-subheading font-semibold text-sm sm:text-base text-white mb-1">Tanggal</h3>
                      <p className="text-gray-300 font-body text-xs sm:text-sm">{event.date}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md hover:border-white/20 transition-all">
                <CardContent className="px-4 sm:px-6 py-2">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 border border-white/20 shrink-0">
                      <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-subheading font-semibold text-sm sm:text-base text-white mb-1">Waktu</h3>
                      <p className="text-gray-300 font-body text-xs sm:text-sm">{event.time}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md hover:border-white/20 transition-all">
                <CardContent className="px-4 sm:px-6 py-2">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 border border-white/20 shrink-0">
                      <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-subheading font-semibold text-sm sm:text-base text-white mb-1">Kapasitas</h3>
                      <p className="text-gray-300 font-body text-xs sm:text-sm">{event.capacity}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {isSoldOut && (
              <Card className="border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md">
                <CardContent className="p-4 sm:p-5 md:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-heading text-white mb-2">Pasar Jual Beli</h2>
                      <p className="text-gray-400 font-body text-xs sm:text-sm">Tiket jual beli terverifikasi dari peserta lain</p>
                    </div>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 font-subheading font-semibold text-xs sm:text-sm px-3 py-1 w-fit">
                      {resaleTickets.length} Tersedia
                    </Badge>
                  </div>

                  {/* Marketplace Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                    {currentTickets.map((ticket) => {
                      const priceIncrease = ((ticket.price - ticket.originalPrice) / ticket.originalPrice) * 100
                      return (
                        <Card
                          key={ticket.id}
                          className="border-white/10 bg-gradient-to-br from-gray-800/50 to-gray-900/50 hover:border-white/30 transition-all cursor-pointer"
                        >
                          <CardContent className="p-3 sm:p-4">
                            <div className="flex items-start justify-between mb-2 sm:mb-3 gap-2">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-subheading font-semibold text-white text-xs sm:text-sm mb-1">
                                  {ticket.type} Ticket
                                </h3>
                                <p className="text-gray-400 font-body text-xs truncate">Seller: {ticket.seller}</p>
                              </div>
                              <Badge
                                className={`${
                                  priceIncrease > 10
                                    ? "bg-orange-500/20 text-orange-400 border-orange-500/30"
                                    : "bg-green-500/20 text-green-400 border-green-500/30"
                                } font-subheading text-xs shrink-0`}
                              >
                                {priceIncrease > 0 ? "+" : ""}
                                {priceIncrease.toFixed(0)}%
                              </Badge>
                            </div>
                            <div className="mb-2 sm:mb-3">
                              <p className="text-xl sm:text-2xl font-heading text-white">
                                Rp {ticket.price.toLocaleString("id-ID")}
                              </p>
                              <p className="text-gray-500 font-body text-xs line-through">
                                Rp {ticket.originalPrice.toLocaleString("id-ID")}
                              </p>
                            </div>
                            <Button className="w-full h-8 sm:h-9 bg-gradient-to-b from-gray-400 via-gray-600 to-gray-700 hover:from-gray-300 hover:to-gray-600 text-white font-subheading font-semibold text-xs sm:text-sm">
                              Buy Now
                            </Button>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>

                  {/* Marketplace Navigation */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <Button
                      variant="outline"
                      onClick={() => setMarketPage((prev) => Math.max(0, prev - 1))}
                      disabled={marketPage === 0}
                      className="border-white/20 bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Sebelumnya
                    </Button>
                    <div className="text-gray-400 font-body text-sm">
                      Halaman {marketPage + 1} dari {totalPages}
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setMarketPage((prev) => Math.min(totalPages - 1, prev + 1))}
                      disabled={marketPage === totalPages - 1}
                      className="border-white/20 bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Selanjutnya
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Empty space for floating ticket card */}
          <div className="lg:col-span-1">{/* This space is reserved for the floating ticket card */}</div>
        </div>
      </div>
    </div>
  )
}
