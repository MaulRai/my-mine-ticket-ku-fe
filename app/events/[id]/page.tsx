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
  Share,
  Heart,
} from "lucide-react"

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

// Mock data - in a real app, this would come from an API or database
const eventData: Record<string, EventDataType> = {
  "1": {
    id: 1,
    name: "Neon Waves Festival",
    logo: "/images/example/cover-1.png",
    banner: "/images/example/banner-1.png",
    category: "Music",
    featuring: ["Grrrls Gang", "Reality Club", "Hindia"],
    location: "Jakarta Convention Center",
    address: "Jl. Gatot Subroto, Jakarta Pusat, DKI Jakarta",
    date: "June 15, 2025",
    time: "18:00 - 23:00 WIB",
    capacity: "5,000 attendees",
    regularTickets: 4000,
    regularTicketsSold: 3880,
    vipTickets: 1000,
    vipTicketsSold: 970,
    description:
      "Experience the ultimate music festival featuring Indonesia's hottest indie and alternative bands. Neon Waves Festival brings together the best of contemporary Indonesian music in an unforgettable night of performances, lights, and energy.",
    ticketPrice: "Starting from Rp 350,000",
    organizer: "Wave Entertainment",
    soldOut: true,
  },
  "2": {
    id: 2,
    name: "Islands of Sound 2025",
    logo: "/images/example/cover-2.png",
    banner: "/images/example/banner-2.png",
    category: "Music",
    featuring: ["The Adams", "Kunto Aji", "Pamungkas"],
    location: "Bali Art Center",
    address: "Jl. Nusa Indah, Denpasar, Bali",
    date: "July 20, 2025",
    time: "17:00 - 22:00 WITA",
    capacity: "3,500 attendees",
    regularTickets: 2800,
    regularTicketsSold: 1680,
    vipTickets: 700,
    vipTicketsSold: 420,
    description:
      "A tropical music experience in the heart of Bali. Islands of Sound brings together soulful Indonesian artists for an evening of acoustic and indie performances in a stunning cultural venue.",
    ticketPrice: "Starting from Rp 450,000",
    organizer: "Island Vibes Productions",
    soldOut: false,
  },
}

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
  const [devSoldOutMode, setDevSoldOutMode] = useState(event.soldOut)
  const [isFavorite, setIsFavorite] = useState(false)

  const TICKETS_PER_PAGE = 9
  const totalPages = Math.ceil(resaleTickets.length / TICKETS_PER_PAGE)
  const currentTickets = resaleTickets.slice(marketPage * TICKETS_PER_PAGE, (marketPage + 1) * TICKETS_PER_PAGE)

  const isSoldOut = devSoldOutMode

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

  const handleCheckout = () => {
    router.push(`/events/${id}/checkout`)
  }

  return (
    <div className="min-h-screen bg-background">
      <button
        onClick={() => setDevSoldOutMode(!devSoldOutMode)}
        className="fixed top-24 right-6 z-50 glass-effect px-4 py-2 rounded-full hover:bg-white/30 transition-all flex items-center gap-2 border border-white/20"
        title="Toggle between normal and sold-out mode"
      >
        <Eye className="h-4 w-4 text-white" />
        <span className="text-white font-subheading text-sm font-semibold">
          DEV: {devSoldOutMode ? "Sold Out" : "Available"}
        </span>
      </button>

      {/* Hero Section with Banner */}
      <div className="relative h-[370px] m-8 mt-0 mb-0 overflow-visible rounded-b-2xl bg-black">
        <div className="absolute inset-0 overflow-hidden rounded-b-2xl">
          <Image src={event.banner || "/placeholder.svg"} alt="Event banner" fill className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 via-60% to-black/80 rounded-b-2xl" />

        <div className="absolute inset-0 flex items-end justify-start">
          <div className="text-white px-12 pb-12 flex flex-row items-start gap-6">
            <Link href="/events">
              <button className="glass-effect p-3 rounded-full hover:bg-white/30 transition-all z-10" aria-label="Back">
                <ArrowLeft className="h-6 w-6 text-white" />
              </button>
            </Link>

            {/* Event Logo */}
            <div className="relative h-40 w-40 rounded-xl overflow-hidden shadow-2xl border-4 border-white/20">
              <Image src={event.logo || "/placeholder.svg"} alt={event.name} fill className="object-cover" />
            </div>

            {/* Event Info */}
            <div className="flex-1 pb-2">
              <div className="mb-3 flex items-center gap-3">
                <Badge className="glass-effect text-white border-white/30 font-subheading font-semibold text-sm px-4 py-1.5">
                  {event.category}
                </Badge>
                <button
                  onClick={handleShare}
                  className="glass-effect p-2 rounded-full hover:bg-white/30 transition-all"
                  aria-label="Share event"
                >
                  <Share className="h-5 w-5 text-white" />
                </button>
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`glass-effect p-2 rounded-full hover:bg-white/30 transition-all ${
                    isFavorite ? "bg-red-500/30" : ""
                  }`}
                  aria-label="Favorite event"
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-white"}`} />
                </button>
              </div>
              <h1 className="text-5xl font-heading mb-4 text-balance">{event.name}</h1>
              <div className="mb-4">
                <p className="text-xl font-subheading font-semibold text-gray-200">
                  Featuring: {event.featuring.join(", ")}
                </p>
              </div>
              <div className="flex items-center gap-2 glass-effect px-4 py-2 rounded-full w-fit">
                <Ticket className="h-5 w-5 text-white" />
                <span className="text-white font-subheading font-semibold text-sm">
                  {totalTicketsSold.toLocaleString("id-ID")} / {totalTickets.toLocaleString("id-ID")} tickets sold (
                  {ticketsSoldPercentage}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Ticket Purchase Card - Positioned at border */}
        <div className="absolute top-[calc(100%-5rem)] right-12 w-96 z-20">
          <Card className="border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md shadow-2xl">
            <CardContent className="p-6 space-y-6">
              {isSoldOut ? (
                <>
                  <div>
                    <h2 className="text-2xl font-heading text-white mb-2">Tickets Sold Out</h2>
                    <p className="text-gray-400 font-body text-sm">
                      All tickets have been sold. Check the resale marketplace below for available tickets.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border-2 border-red-500/30 bg-red-500/10">
                    <div className="flex items-center gap-3 mb-2">
                      <Ticket className="h-6 w-6 text-red-400" />
                      <h3 className="font-subheading font-semibold text-red-400">No Tickets Available</h3>
                    </div>
                    <p className="text-gray-300 font-body text-sm">
                      Browse resale tickets from verified sellers in the marketplace section below.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-gray-400 font-body text-xs text-center">
                      Organized by <span className="text-white font-semibold">{event.organizer}</span>
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h2 className="text-2xl font-heading text-white mb-2">Get Your Tickets</h2>
                    <p className="text-gray-400 font-body text-sm">Secure your spot at this amazing event</p>
                  </div>

                  <div className="space-y-3">
                    <div className="p-4 rounded-lg border-2 border-white/10 hover:border-white/20 transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-subheading font-semibold text-white">Regular Ticket</h3>
                      </div>
                      <p className="text-2xl font-heading text-white mb-1">Rp 350,000</p>
                      <p className="text-gray-400 font-body text-xs mb-2">General admission</p>
                      <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <span className="text-gray-400 font-body text-xs">Remaining</span>
                        <span className="text-white font-subheading font-semibold text-sm">
                          {regularTicketsRemaining.toLocaleString("id-ID")} /{" "}
                          {event.regularTickets.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg border-2 border-white/10 hover:border-white/20 transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-subheading font-semibold text-white">VIP Ticket</h3>
                      </div>
                      <p className="text-2xl font-heading text-white mb-1">Rp 750,000</p>
                      <p className="text-gray-400 font-body text-xs mb-2">Premium seating + exclusive perks</p>
                      <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <span className="text-gray-400 font-body text-xs">Remaining</span>
                        <span className="text-white font-subheading font-semibold text-sm">
                          {vipTicketsRemaining.toLocaleString("id-ID")} / {event.vipTickets.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    className="w-full h-12 bg-gradient-to-b from-gray-400 via-gray-500 to-gray-700 hover:from-gray-300 hover:to-gray-600 text-white font-subheading font-semibold text-base transition-all duration-300"
                  >
                    <Ticket className="h-5 w-5 mr-2" />
                    Purchase Ticket
                  </Button>

                  <div className="pt-4 border-t border-white/10">
                    <p className="text-gray-400 font-body text-xs text-center">
                      Organized by <span className="text-white font-semibold">{event.organizer}</span>
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Details - Left side with space for ticket card */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <Card className="border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md">
              <CardContent className="p-6">
                <h2 className="text-2xl font-heading text-white mb-4">About This Event</h2>
                <p className="text-gray-300 font-body leading-relaxed text-base">{event.description}</p>
              </CardContent>
            </Card>

            {/* Event Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md hover:border-white/20 transition-all">
                <CardContent className="px-6 py-2">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 border border-white/20">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-subheading font-semibold text-white mb-1">Location</h3>
                      <p className="text-gray-300 font-body text-sm">{event.location}</p>
                      <p className="text-gray-400 font-body text-xs mt-1">{event.address}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md hover:border-white/20 transition-all">
                <CardContent className="px-6 py-2">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 border border-white/20">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-subheading font-semibold text-white mb-1">Date</h3>
                      <p className="text-gray-300 font-body text-sm">{event.date}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md hover:border-white/20 transition-all">
                <CardContent className="px-6 py-2">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 border border-white/20">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-subheading font-semibold text-white mb-1">Time</h3>
                      <p className="text-gray-300 font-body text-sm">{event.time}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md hover:border-white/20 transition-all">
                <CardContent className="px-6 py-2">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 border border-white/20">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-subheading font-semibold text-white mb-1">Capacity</h3>
                      <p className="text-gray-300 font-body text-sm">{event.capacity}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {isSoldOut && (
              <Card className="border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-heading text-white mb-2">Resale Marketplace</h2>
                      <p className="text-gray-400 font-body text-sm">Verified resale tickets from other attendees</p>
                    </div>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 font-subheading font-semibold">
                      {resaleTickets.length} Available
                    </Badge>
                  </div>

                  {/* Marketplace Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {currentTickets.map((ticket) => {
                      const priceIncrease = ((ticket.price - ticket.originalPrice) / ticket.originalPrice) * 100
                      return (
                        <Card
                          key={ticket.id}
                          className="border-white/10 bg-gradient-to-br from-gray-800/50 to-gray-900/50 hover:border-white/30 transition-all cursor-pointer"
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="font-subheading font-semibold text-white text-sm mb-1">
                                  {ticket.type} Ticket
                                </h3>
                                <p className="text-gray-400 font-body text-xs">Seller: {ticket.seller}</p>
                              </div>
                              <Badge
                                className={`${
                                  priceIncrease > 10
                                    ? "bg-orange-500/20 text-orange-400 border-orange-500/30"
                                    : "bg-green-500/20 text-green-400 border-green-500/30"
                                } font-subheading text-xs`}
                              >
                                {priceIncrease > 0 ? "+" : ""}
                                {priceIncrease.toFixed(0)}%
                              </Badge>
                            </div>
                            <div className="mb-3">
                              <p className="text-2xl font-heading text-white">
                                Rp {ticket.price.toLocaleString("id-ID")}
                              </p>
                              <p className="text-gray-500 font-body text-xs line-through">
                                Rp {ticket.originalPrice.toLocaleString("id-ID")}
                              </p>
                            </div>
                            <Button className="w-full h-9 bg-gradient-to-b from-gray-400 via-gray-600 to-gray-700 hover:from-gray-300 hover:to-gray-600 text-white font-subheading font-semibold text-sm">
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
                      Previous
                    </Button>
                    <div className="text-gray-400 font-body text-sm">
                      Page {marketPage + 1} of {totalPages}
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setMarketPage((prev) => Math.min(totalPages - 1, prev + 1))}
                      disabled={marketPage === totalPages - 1}
                      className="border-white/20 bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Next
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
