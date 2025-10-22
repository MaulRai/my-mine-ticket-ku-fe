"use client"

import { useState, use } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Calendar, Clock, Users, ArrowLeft, Ticket } from "lucide-react"

// Mock data - in a real app, this would come from an API or database
const eventData: Record<string, any> = {
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
    description:
      "Experience the ultimate music festival featuring Indonesia's hottest indie and alternative bands. Neon Waves Festival brings together the best of contemporary Indonesian music in an unforgettable night of performances, lights, and energy.",
    ticketPrice: "Starting from Rp 350,000",
    organizer: "Wave Entertainment",
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
    description:
      "A tropical music experience in the heart of Bali. Islands of Sound brings together soulful Indonesian artists for an evening of acoustic and indie performances in a stunning cultural venue.",
    ticketPrice: "Starting from Rp 450,000",
    organizer: "Island Vibes Productions",
  },
}

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const event = eventData[id] || eventData["1"]
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-6">
        <Link href="/events">
          <Button variant="ghost" className="glass-effect text-white hover:bg-white/20 transition-all border-white/30">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Button>
        </Link>
      </div>

      {/* Hero Section with Banner */}
      <div className="relative h-[500px] m-8 my-6 overflow-hidden rounded-2xl bg-black">
        <Image src={event.banner || "/placeholder.svg"} alt="Event banner" fill className="object-cover rounded-2xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 via-60% to-black/80 rounded-2xl" />

        <div className="absolute inset-0 flex items-end justify-start">
          <div className="text-white px-12 pb-12 flex flex-row items-end gap-6">
            {/* Event Logo */}
            <div className="relative h-40 w-40 rounded-xl overflow-hidden shadow-2xl border-4 border-white/20">
              <Image src={event.logo || "/placeholder.svg"} alt={event.name} fill className="object-cover" />
            </div>

            {/* Event Info */}
            <div className="flex-1 pb-2">
              <div className="mb-3">
                <Badge className="glass-effect text-white border-white/30 font-subheading font-semibold text-sm px-4 py-1.5">
                  {event.category}
                </Badge>
              </div>
              <h1 className="text-5xl font-heading mb-4 text-balance">{event.name}</h1>
              <div className="mb-4">
                <p className="text-xl font-subheading font-semibold text-gray-200">
                  Featuring: {event.featuring.join(", ")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Event Details */}
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
                <CardContent className="p-6">
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
                <CardContent className="p-6">
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
                <CardContent className="p-6">
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
                <CardContent className="p-6">
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
          </div>

          {/* Right Column - Ticket Purchase */}
          <div className="lg:col-span-1">
            <Card className="border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md sticky top-6">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h2 className="text-2xl font-heading text-white mb-2">Get Your Tickets</h2>
                  <p className="text-gray-400 font-body text-sm">Secure your spot at this amazing event</p>
                </div>

                <div className="space-y-3">
                  <div
                    onClick={() => setSelectedTicket("regular")}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedTicket === "regular"
                        ? "border-white/40 bg-white/10"
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-subheading font-semibold text-white">Regular Ticket</h3>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedTicket === "regular" ? "border-white bg-white" : "border-white/40"
                        }`}
                      >
                        {selectedTicket === "regular" && <div className="w-2.5 h-2.5 rounded-full bg-black" />}
                      </div>
                    </div>
                    <p className="text-2xl font-heading text-white mb-1">Rp 350,000</p>
                    <p className="text-gray-400 font-body text-xs">General admission</p>
                  </div>

                  <div
                    onClick={() => setSelectedTicket("vip")}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedTicket === "vip" ? "border-white/40 bg-white/10" : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-subheading font-semibold text-white">VIP Ticket</h3>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedTicket === "vip" ? "border-white bg-white" : "border-white/40"
                        }`}
                      >
                        {selectedTicket === "vip" && <div className="w-2.5 h-2.5 rounded-full bg-black" />}
                      </div>
                    </div>
                    <p className="text-2xl font-heading text-white mb-1">Rp 750,000</p>
                    <p className="text-gray-400 font-body text-xs">Premium seating + exclusive perks</p>
                  </div>
                </div>

                <Button
                  disabled={!selectedTicket}
                  className="w-full h-12 bg-gradient-to-b from-gray-300 via-gray-500 to-gray-700 hover:from-gray-200 hover:to-gray-600 text-white font-subheading font-semibold text-base transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Ticket className="h-5 w-5 mr-2" />
                  Purchase Ticket
                </Button>

                <div className="pt-4 border-t border-white/10">
                  <p className="text-gray-400 font-body text-xs text-center">
                    Organized by <span className="text-white font-semibold">{event.organizer}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
