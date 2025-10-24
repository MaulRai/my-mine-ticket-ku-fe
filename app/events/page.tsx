"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { allEvents, featuredEvents } from "@/lib/events-data"

const categories = ["Semua", "Musik", "Seni & Pameran", "Olahraga"]

export default function EventsPage() {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Semua")
  const [selectedTimeFilter, setSelectedTimeFilter] = useState("Semua")
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    setProgress(0)
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100
        return prev + 100 / 50
      })
    }, 100)
    return () => clearInterval(progressInterval)
  }, [currentBannerIndex])

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentBannerIndex + 1) % featuredEvents.length
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
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentBannerIndex(nextIndex)
      setIsTransitioning(false)
    }, 600)
  }

  const handleNextBanner = () => {
    const nextIndex = (currentBannerIndex + 1) % featuredEvents.length
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentBannerIndex(nextIndex)
      setIsTransitioning(false)
    }, 600)
  }

  // Helper function to parse Indonesian date format
  const parseIndonesianDate = (dateString: string): Date => {
    const monthMap: Record<string, number> = {
      Januari: 0,
      Februari: 1,
      Maret: 2,
      April: 3,
      Mei: 4,
      Juni: 5,
      Juli: 6,
      Agustus: 7,
      September: 8,
      Oktober: 9,
      November: 10,
      Desember: 11,
    }

    const parts = dateString.split(" ")
    const day = parseInt(parts[0])
    const month = monthMap[parts[1]]
    const year = parseInt(parts[2])

    return new Date(year, month, day)
  }

  const filterEventsByTime = (event: typeof allEvents[0]) => {
    const eventDate = parseIndonesianDate(event.date)
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset time to start of day

    if (selectedTimeFilter === "Seminggu ke Depan") {
      const oneWeekFromNow = new Date(today)
      oneWeekFromNow.setDate(today.getDate() + 7)
      return eventDate >= today && eventDate <= oneWeekFromNow
    } else if (selectedTimeFilter === "Sebulan ke Depan") {
      const oneMonthFromNow = new Date(today)
      oneMonthFromNow.setMonth(today.getMonth() + 1)
      return eventDate >= today && eventDate <= oneMonthFromNow
    }
    // "Semua" filter
    return true
  }

  const filteredEvents = allEvents.filter((event) => {
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "Semua" || event.category === selectedCategory
    const matchesTime = filterEventsByTime(event)
    return matchesSearch && matchesCategory && matchesTime
  })

  const currentFeaturedEvent = featuredEvents[currentBannerIndex]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000000] via-[#000a1a] to-[#000000]">
      <div className="relative h-[400px] m-4 sm:m-6 md:m-8 my-4 overflow-visible rounded-2xl bg-black">
        {/* Background image */}
        <div className={`transition-opacity duration-300 ${isTransitioning ? "opacity-0" : "opacity-100"}`}>
          <Image
            src={currentFeaturedEvent.banner || "/placeholder.svg"}
            alt="Banner background"
            fill
            className="object-cover rounded-2xl"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/20 via-80% to-black/30 rounded-2xl" />
        <div
          className={`absolute inset-0 flex items-center justify-start transition-opacity duration-300 ${isTransitioning ? "opacity-0" : "opacity-100"}`}
        >
          <div className="text-center text-white px-4 sm:px-8 md:px-12 lg:px-24 flex flex-col sm:flex-row gap-4 sm:gap-6 w-full">
            <div className="mb-4 sm:mb-6 flex justify-center sm:justify-start">
              <div className="relative h-20 w-20 sm:h-28 sm:w-28 md:h-32 md:w-32 rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src={currentFeaturedEvent.logo || "/placeholder.svg"}
                  alt={currentFeaturedEvent.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="items-start text-center sm:text-left sm:ml-0 md:ml-6 flex-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-heading mb-2 sm:mb-3 md:mb-4">{currentFeaturedEvent.name}</h1>
              <div className="mb-2 sm:mb-3 md:mb-4">
                <p className="text-sm sm:text-base md:text-lg font-subheading font-semibold">{currentFeaturedEvent.featuring.join(", ")}</p>
              </div>
              <div className="glass-fx inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-4 md:gap-6 text-xs sm:text-sm font-subheading font-semibold w-auto px-3 py-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>{currentFeaturedEvent.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>{currentFeaturedEvent.date}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={handlePrevBanner}
          className="glass-fx absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full hover:bg-white/30 transition-all"
          aria-label="Previous banner"
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        </button>
        <button
          onClick={handleNextBanner}
          className="glass-fx absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full hover:bg-white/30 transition-all"
          aria-label="Next banner"
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        </button>

        <div className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 w-full max-w-xs sm:max-w-md md:max-w-2xl px-4 sm:px-8">
          <div className="flex gap-1.5 sm:gap-2">
            {featuredEvents.map((_, index) => (
              <div key={index} className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-100 ease-linear"
                  style={{
                    width:
                      index < currentBannerIndex
                        ? "100%" // Completed slides
                        : index === currentBannerIndex
                          ? `${progress}%` // Current slide with progress
                          : "0%", // Upcoming slides
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Search Bar Overlay */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-full max-w-xs sm:max-w-md md:max-w-2xl px-4 sm:px-8">
          <div className="clear-glass-fx bg-black/60 p-1.5 sm:p-2">
            <div className="relative">
              <Search className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-white/70" />
              <Input
                type="text"
                placeholder="Cari acara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 sm:pl-10 h-10 sm:h-12 text-sm sm:text-base bg-transparent border-none text-white placeholder:text-white/60 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4">
          {/* Time Filter Buttons - Left */}
          <div className="inline-flex items-center gap-1 bg-gray-900/60 backdrop-blur-md border border-white/10 p-1.5 rounded-full w-full sm:w-auto justify-center">
            {["Semua", "Seminggu ke Depan", "Sebulan ke Depan"].map((timeFilter) => {
              const isActive = selectedTimeFilter === timeFilter
              return (
                <Button
                  key={timeFilter}
                  variant="ghost"
                  onClick={() => setSelectedTimeFilter(timeFilter)}
                  className={`relative rounded-full px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium transition-all duration-300 flex-1 sm:flex-initial
                    ${
                      isActive
                        ? "text-white shadow-md bg-gradient-to-b from-gray-400 via-gray-600 to-gray-700"
                        : "text-gray-300 hover:text-white hover:bg-white/10"
                    }`}
                >
                  {timeFilter}
                </Button>
              )
            })}
          </div>

          {/* Category Dropdown - Right */}
          <div className="relative w-full sm:w-fit">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-10 px-4 sm:px-5 pr-10 rounded-full bg-gradient-to-b from-gray-300/60 via-gray-500/60 to-gray-700/60 border border-none text-white text-sm sm:text-base font-medium backdrop-blur-md cursor-pointer appearance-none transition-all duration-200 focus:ring-2 focus:ring-white/30 hover:from-gray-200/70 hover:to-gray-600/70 w-full sm:w-auto"
            >
              {categories.map((category) => (
                <option key={category} value={category} className="bg-gray-800 text-white">
                  {category}
                </option>
              ))}
            </select>

            {/* Custom caret icon */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="h-4 w-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {filteredEvents.map((event) => (
            <Link key={event.id} href={`/events/${event.id}`}>
              <Card className="group overflow-hidden pb-0 border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-white/5 cursor-pointer hover:-translate-y-1">
                <div className="relative h-40 sm:h-44 md:h-48 w-full overflow-hidden">
                  <Image
                    src={event.logo || "/placeholder.svg"}
                    alt={event.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Gradient overlay for better text contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

                  {/* Category badge positioned on image */}
                  <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                    <Badge className="glass-fx text-white border-white/30 font-subheading font-semibold text-xs px-2 sm:px-3 py-0.5 sm:py-1">
                      {event.category}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4 sm:p-5 space-y-2 sm:space-y-3">
                  <h3 className="font-subheading font-semibold text-base sm:text-lg text-white leading-tight line-clamp-2 group-hover:text-gray-100 transition-colors">
                    {event.name}
                  </h3>

                  <div className="space-y-2 sm:space-y-2.5 text-xs sm:text-sm">
                    <div className="flex items-center gap-2 sm:gap-2.5 text-gray-300 group-hover:text-white transition-colors">
                      <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors shrink-0">
                        <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </div>
                      <span className="font-subheading font-medium truncate">{event.location}</span>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-2.5 text-gray-300 group-hover:text-white transition-colors">
                      <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors shrink-0">
                        <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </div>
                      <span className="font-subheading font-medium">{event.date}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg">Tidak ada acara yang sesuai dengan kriteria Anda.</p>
          </div>
        )}
      </div>
    </div>
  )
}
