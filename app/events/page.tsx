"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Calendar, ChevronLeft, ChevronRight } from "lucide-react"

const featuredEvents = [
  {
    id: 1,
    name: "Neon Waves Festival",
    logo: "/images/example/cover-1.png",
    featuring: ["Girls Gang", "Reality Club", "Hindia"],
    location: "Jakarta Convention Center",
    date: "June 15, 2025",
    banner: "/images/example/banner-1.png",
  },
  {
    id: 2,
    name: "Islands of Sound 2025",
    logo: "/images/example/cover-2.png",
    featuring: ["The Adams", "Kunto Aji", "Pamungkas"],
    location: "Bali Art Center",
    date: "July 20, 2025",
    banner: "/images/example/banner-2.png",
  },
  {
    id: 3,
    name: "Sonic Future Conference",
    logo: "/images/example/cover-3.png",
    featuring: ["Rumahsakit", "Efek Rumah Kaca", "Feast."],
    location: "Surabaya Convention Hall",
    date: "August 10, 2025",
    banner: "/images/example/banner-3.png",
  },
  {
    id: 4,
    name: "Taste & Tunes Fest",
    logo: "/images/example/cover-4.png",
    featuring: ["Morfem", "White Shoes & The Couples Company", "Sisitipsi"],
    location: "Bandung Square",
    date: "September 5, 2025",
    banner: "/images/example/banner-4.png",
  },
  {
    id: 5,
    name: "Rhythm Arena 2025",
    logo: "/images/example/cover-5.png",
    featuring: ["The Jansen", "Barasuara", "Goodnight Electric"],
    location: "Gelora Bung Karno",
    date: "October 12, 2025",
    banner: "/images/example/banner-5.png",
  },
];


const allEvents = [
  {
    id: 1,
    name: "Rock Concert Night",
    logo: "/images/example/example-cover.png",
    category: "Music",
    location: "Jakarta",
    date: "Dec 25, 2025",
  },
  {
    id: 2,
    name: "Modern Art Exhibition",
    logo: "/images/example/example-cover.png",
    category: "Art & Exhibition",
    location: "Bali",
    date: "Jan 10, 2026",
  },
  {
    id: 3,
    name: "Marathon 2025",
    logo: "/images/example/example-cover.png",
    category: "Sport",
    location: "Surabaya",
    date: "Feb 14, 2026",
  },
  {
    id: 4,
    name: "Jazz Festival",
    logo: "/images/example/example-cover.png",
    category: "Music",
    location: "Bandung",
    date: "Mar 20, 2026",
  },
  {
    id: 5,
    name: "Photography Showcase",
    logo: "/images/example/example-cover.png",
    category: "Art & Exhibition",
    location: "Yogyakarta",
    date: "Apr 5, 2026",
  },
  {
    id: 6,
    name: "Basketball Tournament",
    logo: "/images/example/example-cover.png",
    category: "Sport",
    location: "Jakarta",
    date: "May 15, 2026",
  },
  {
    id: 7,
    name: "EDM Party",
    logo: "/images/example/example-cover.png",
    category: "Music",
    location: "Bali",
    date: "Jun 30, 2026",
  },
  {
    id: 8,
    name: "Sculpture Exhibition",
    logo: "/images/example/example-cover.png",
    category: "Art & Exhibition",
    location: "Jakarta",
    date: "Jul 22, 2026",
  },
]

const categories = ["All", "Music", "Art & Exhibition", "Sport"]

export default function EventsPage() {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0)
  const [nextBannerIndex, setNextBannerIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentBannerIndex + 1) % featuredEvents.length
      setNextBannerIndex(nextIndex)
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentBannerIndex(nextIndex)
        setIsTransitioning(false)
      }, 300)
    }, 5000)
    return () => clearInterval(interval)
  }, [currentBannerIndex])

  const handlePrevBanner = () => {
    const nextIndex = (currentBannerIndex - 1 + featuredEvents.length) % featuredEvents.length
    setNextBannerIndex(nextIndex)
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentBannerIndex(nextIndex)
      setIsTransitioning(false)
    }, 600)
  }

  const handleNextBanner = () => {
    const nextIndex = (currentBannerIndex + 1) % featuredEvents.length
    setNextBannerIndex(nextIndex)
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentBannerIndex(nextIndex)
      setIsTransitioning(false)
    }, 600)
  }

  const filteredEvents = allEvents.filter((event) => {
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || event.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const currentFeaturedEvent = featuredEvents[currentBannerIndex]

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-[400px] m-8 mb-16 overflow-visible rounded-2xl bg-black">
        {/* Background image */}
        <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          <Image
            src={currentFeaturedEvent.banner || "/placeholder.svg"}
            alt="Banner background"
            fill
            className="object-cover rounded-2xl"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/10 via-80% to-black/30 rounded-2xl" />
        <div className={`absolute inset-0 flex items-center justify-start transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          <div className="text-center text-white px-24 flex flex-row">
            <div className="mb-6">
              <div className="relative h-32 w-32 rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src={currentFeaturedEvent.logo || "/placeholder.svg"}
                  alt={currentFeaturedEvent.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="items-start text-left ml-6">
              <h1 className="text-3xl font-heading mb-4">{currentFeaturedEvent.name}</h1>
              <div className="mb-4">
                <p className="text-lg font-subheading font-semibold">{currentFeaturedEvent.featuring.join(", ")}</p>
              </div>
              <div className="glass-effect inline-flex items-center gap-6 text-sm font-subheading font-semibold w-auto">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{currentFeaturedEvent.location}</span>
                </div>
                <div className="flex items-center mr-2 gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{currentFeaturedEvent.date}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={handlePrevBanner}
          className="glass-effect absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full hover:bg-white/30 transition-all"
          aria-label="Previous banner"
        >
          <ChevronLeft className="h-6 w-6 text-white" />
        </button>
        <button
          onClick={handleNextBanner}
          className="glass-effect absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full hover:bg-white/30 transition-all"
          aria-label="Next banner"
        >
          <ChevronRight className="h-6 w-6 text-white" />
        </button>

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

        {/* Search Bar Overlay */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl px-8">
          <div className="clear-glass-effect bg-black/80 p-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/70" />
              <Input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base bg-transparent border-none text-white placeholder:text-white/60 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 mt-8">
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
