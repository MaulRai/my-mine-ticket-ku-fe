"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Calendar } from "lucide-react"

const featuredEvents = [
  {
    id: 1,
    name: "Summer Music Festival 2025",
    logo: "/images/example-cover.png",
    featuring: ["Artist A", "Artist B", "Artist C"],
    location: "Jakarta Convention Center",
    date: "June 15, 2025",
    banner: "/images/example-banner.png",
  },
  {
    id: 2,
    name: "Art & Culture Expo",
    logo: "/images/example-cover.png",
    featuring: ["Gallery X", "Museum Y"],
    location: "Bali Art Center",
    date: "July 20, 2025",
    banner: "/images/example-banner.png",
  },
  {
    id: 3,
    name: "Tech Conference 2025",
    logo: "/images/example-cover.png",
    featuring: ["Speaker 1", "Speaker 2", "Speaker 3"],
    location: "Surabaya Convention Hall",
    date: "August 10, 2025",
    banner: "/images/example-banner.png",
  },
  {
    id: 4,
    name: "Food Festival",
    logo: "/images/example-cover.png",
    featuring: ["Chef A", "Chef B"],
    location: "Bandung Square",
    date: "September 5, 2025",
    banner: "/images/example-banner.png",
  },
  {
    id: 5,
    name: "Sports Championship",
    logo: "/images/example-cover.png",
    featuring: ["Team A", "Team B", "Team C"],
    location: "Gelora Bung Karno",
    date: "October 12, 2025",
    banner: "/images/example-banner.png",
  },
  {
    id: 6,
    name: "Fashion Week 2025",
    logo: "/images/example-cover.png",
    featuring: ["Designer X", "Designer Y"],
    location: "Grand Indonesia",
    date: "November 18, 2025",
    banner: "/images/example-banner.png",
  },
]

const allEvents = [
  {
    id: 1,
    name: "Rock Concert Night",
    logo: "/images/example-cover.png",
    category: "Music",
    location: "Jakarta",
    date: "Dec 25, 2025",
  },
  {
    id: 2,
    name: "Modern Art Exhibition",
    logo: "/images/example-cover.png",
    category: "Art & Exhibition",
    location: "Bali",
    date: "Jan 10, 2026",
  },
  {
    id: 3,
    name: "Marathon 2025",
    logo: "/images/example-cover.png",
    category: "Sport",
    location: "Surabaya",
    date: "Feb 14, 2026",
  },
  {
    id: 4,
    name: "Jazz Festival",
    logo: "/images/example-cover.png",
    category: "Music",
    location: "Bandung",
    date: "Mar 20, 2026",
  },
  {
    id: 5,
    name: "Photography Showcase",
    logo: "/images/example-cover.png",
    category: "Art & Exhibition",
    location: "Yogyakarta",
    date: "Apr 5, 2026",
  },
  {
    id: 6,
    name: "Basketball Tournament",
    logo: "/images/example-cover.png",
    category: "Sport",
    location: "Jakarta",
    date: "May 15, 2026",
  },
  {
    id: 7,
    name: "EDM Party",
    logo: "/images/example-cover.png",
    category: "Music",
    location: "Bali",
    date: "Jun 30, 2026",
  },
  {
    id: 8,
    name: "Sculpture Exhibition",
    logo: "/images/example-cover.png",
    category: "Art & Exhibition",
    location: "Jakarta",
    date: "Jul 22, 2026",
  },
]

const categories = ["All", "Music", "Art & Exhibition", "Sport"]

export default function EventsPage() {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % featuredEvents.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const filteredEvents = allEvents.filter((event) => {
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || event.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const currentFeaturedEvent = featuredEvents[currentBannerIndex]

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-[400px] m-8 overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl">
        <Image
          src={currentFeaturedEvent.banner || "/placeholder.svg"}
          alt="Banner background"
          fill
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <div className="mb-6 flex justify-center">
              <div className="relative h-32 w-32 rounded-lg overflow-hidden border-4 border-white shadow-2xl">
                <Image
                  src={currentFeaturedEvent.logo || "/placeholder.svg"}
                  alt={currentFeaturedEvent.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">{currentFeaturedEvent.name}</h1>
            <div className="mb-4">
              <p className="text-lg font-semibold mb-2">Featuring:</p>
              <p className="text-base">{currentFeaturedEvent.featuring.join(", ")}</p>
            </div>
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{currentFeaturedEvent.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{currentFeaturedEvent.date}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {featuredEvents.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBannerIndex(index)}
              className={`h-2 rounded-full transition-all ${index === currentBannerIndex ? "w-8 bg-white" : "w-2 bg-white/50"
                }`}
              aria-label={`Go to banner ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
        </div>

        <div className="mb-8 flex justify-center gap-3 flex-wrap">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="relative h-48 w-full">
                <Image src={event.logo || "/placeholder.svg"} alt={event.name} fill className="object-cover" />
              </div>
              <CardContent className="p-4">
                <Badge className="mb-2">{event.category}</Badge>
                <h3 className="font-semibold text-lg mb-3 line-clamp-2">{event.name}</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{event.date}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No events found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
