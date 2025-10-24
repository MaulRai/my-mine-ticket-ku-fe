"use client"

import { use, useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ExternalLink, Award, Calendar, DollarSign, Hash, Clock } from "lucide-react"

// Mock ticket data with full details
const ticketsData = [
  {
    id: 1,
    eventName: "Neon Waves Festival",
    eventCover: "/images/example/cover-1.png",
    eventDate: "2025-11-15",
    eventTime: "18:00",
    eventLocation: "Sunset Arena, Los Angeles",
    ticketCategory: "VIP",
    nftCode: "NFT-23A91F8C4D2E",
    purchaseDate: "2025-10-20",
    status: "active",
    salePrice: "0.25 ETH",
    salePriceUSD: "$500.00",
    transactionHash: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb9A1F3D8E2C4B6A8",
    transactionHistory: [
      {
        id: 1,
        type: "purchase",
        from: "Primary Sale",
        to: "0x742d35Cc...f0bEb",
        price: "0.25 ETH",
        date: "2025-10-20",
        time: "14:32",
      },
    ],
    poapBadge: {
      name: "Neon Waves 2025 Attendee",
      image: "/neon-waves-festival-badge.jpg",
      earned: false,
    },
  },
  {
    id: 2,
    eventName: "Islands of Sound 2025",
    eventCover: "/images/example/cover-2.png",
    eventDate: "2025-12-01",
    eventTime: "16:00",
    eventLocation: "Beach Paradise, Miami",
    ticketCategory: "Regular",
    nftCode: "NFT-7B5E9A1C3F6D",
    purchaseDate: "2025-10-15",
    status: "active",
    salePrice: "45.00 SOL",
    salePriceUSD: "$900.00",
    transactionHash: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063B2E4D7F1A9C5",
    transactionHistory: [
      {
        id: 1,
        type: "purchase",
        from: "Primary Sale",
        to: "0x8f3Cf7ad...6A063",
        price: "45.00 SOL",
        date: "2025-10-15",
        time: "16:45",
      },
    ],
    poapBadge: {
      name: "Islands of Sound Explorer",
      image: "/tropical-island-music-badge.jpg",
      earned: false,
    },
  },
  {
    id: 3,
    eventName: "Sonic Future Conference",
    eventCover: "/images/example/cover-3.png",
    eventDate: "2025-10-05",
    eventTime: "09:00",
    eventLocation: "Tech Hub, San Francisco",
    ticketCategory: "VIP",
    nftCode: "NFT-4D8F2A6B9E1C",
    purchaseDate: "2025-09-28",
    status: "used",
    salePrice: "0.12 ETH",
    salePriceUSD: "$240.00",
    transactionHash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d",
    transactionHistory: [
      {
        id: 1,
        type: "purchase",
        from: "Primary Sale",
        to: "0x1a2b3c4d...7c8d",
        price: "0.12 ETH",
        date: "2025-09-28",
        time: "13:55",
      },
    ],
    poapBadge: {
      name: "Sonic Future Pioneer",
      image: "/futuristic-tech-conference-badge.jpg",
      earned: true,
    },
  },
  {
    id: 4,
    eventName: "Taste & Tunes Fest",
    eventCover: "/images/example/cover-4.png",
    eventDate: "2025-11-20",
    eventTime: "12:00",
    eventLocation: "Central Park, New York",
    ticketCategory: "Regular",
    nftCode: "NFT-9C3E7F1A5B8D",
    purchaseDate: "2025-09-15",
    status: "active",
    salePrice: "0.08 ETH",
    salePriceUSD: "$160.00",
    transactionHash: "0x9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b",
    transactionHistory: [
      {
        id: 1,
        type: "purchase",
        from: "Primary Sale",
        to: "0x5a4b3c2d...8b9a",
        price: "0.06 ETH",
        date: "2025-09-10",
        time: "10:20",
      },
      {
        id: 2,
        type: "resale",
        from: "0x5a4b3c2d...8b9a",
        to: "0x9e8d7c6b...3c2b",
        price: "0.08 ETH",
        date: "2025-09-15",
        time: "15:30",
      },
    ],
    poapBadge: {
      name: "Taste & Tunes Foodie",
      image: "/food-and-music-festival-badge.jpg",
      earned: false,
    },
  },
  {
    id: 5,
    eventName: "Rhythm Arena 2025",
    eventCover: "/images/example/cover-5.png",
    eventDate: "2025-09-10",
    eventTime: "20:00",
    eventLocation: "Grand Stadium, Chicago",
    ticketCategory: "VIP",
    nftCode: "NFT-6A2D8E4C1F9B",
    purchaseDate: "2025-08-30",
    status: "used",
    salePrice: "0.35 ETH",
    salePriceUSD: "$700.00",
    transactionHash: "0x2f3e4d5c6b7a8f9e0d1c2b3a4f5e6d7c8b9a0f1e2d3c4b5a6f7e8d9c",
    transactionHistory: [
      {
        id: 1,
        type: "purchase",
        from: "Primary Sale",
        to: "0x2f3e4d5c...8d9c",
        price: "0.35 ETH",
        date: "2025-08-30",
        time: "11:45",
      },
    ],
    poapBadge: {
      name: "Rhythm Arena Legend",
      image: "/concert-arena-music-badge.jpg",
      earned: true,
    },
  },
  {
    id: 6,
    eventName: "Rock Concert Night",
    eventCover: "/images/example/example-cover.png",
    eventDate: "2025-11-30",
    eventTime: "19:30",
    eventLocation: "Rock Hall, Seattle",
    ticketCategory: "Regular",
    nftCode: "NFT-1F7B3D9A5E2C",
    purchaseDate: "2025-08-12",
    status: "active",
    salePrice: "0.15 ETH",
    salePriceUSD: "$300.00",
    transactionHash: "0x7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b",
    transactionHistory: [
      {
        id: 1,
        type: "purchase",
        from: "Primary Sale",
        to: "0x3c4d5e6f...2d1c",
        price: "0.12 ETH",
        date: "2025-08-05",
        time: "14:15",
      },
      {
        id: 2,
        type: "resale",
        from: "0x3c4d5e6f...2d1c",
        to: "0x7e6d5c4b...1c0b",
        price: "0.15 ETH",
        date: "2025-08-12",
        time: "09:30",
      },
    ],
    poapBadge: {
      name: "Rock Night Rocker",
      image: "/rock-concert-badge.jpg",
      earned: false,
    },
  },
]

export default function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const ticketId = Number.parseInt(resolvedParams.id)
  const ticket = ticketsData.find((t) => t.id === ticketId)
  const ticketRef = useRef<HTMLDivElement>(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ticketRef.current) return

      const rect = ticketRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const mouseX = e.clientX - centerX
      const mouseY = e.clientY - centerY

      const maxTilt = 5
      const rotateY = (mouseX / (rect.width / 2)) * maxTilt
      const rotateX = -(mouseY / (rect.height / 2)) * maxTilt

      setRotation({ x: rotateX, y: rotateY })
    }

    const handleMouseLeave = () => {
      setRotation({ x: 0, y: 0 })
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  if (!ticket) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-12">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-3xl font-heading text-white mb-4">Tiket Tidak Ditemukan</h1>
          <Button
            onClick={() => router.push("/profile")}
            className="bg-linear-to-b from-gray-400 via-gray-600 to-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Profil
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-12 relative overflow-hidden">
      {/* Dark Cyan-Turquoise Ambient Background */}
      <div className="fixed inset-0 overflow-hidden opacity-70 pointer-events-none">
        <div className="absolute top-0 -left-1/3 w-2/3 h-full bg-gradient-radial from-cyan-600/80 to-transparent animate-pulse-slow" />
        <div className="absolute bottom-0 -right-1/3 w-2/3 h-full bg-gradient-radial from-teal-600/60 to-transparent animate-pulse-slow animation-delay-2000" />
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-cyan-500/40 rounded-full blur-3xl animate-float-drift" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-teal-500/40 rounded-full blur-3xl animate-float-drift animation-delay-4000" />
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push("/profile")}
          className="mb-6 text-gray-400 hover:text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali ke Tiketku
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Main ticket design */}
            <div className="relative overflow-hidden bg-linear-to-br from-gray-900 via-gray-950 to-black border border-white/20 shadow-2xl rounded-lg">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)`,
                  }}
                />
              </div>            {/* Event Cover Header */}
            <div className="relative h-64 w-full overflow-hidden">
              <Image
                src={ticket.eventCover || "/placeholder.svg"}
                alt={ticket.eventName}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent" />

              {/* Status Badge */}
              <div className="absolute top-6 right-6">
                <Badge
                  className={`font-subheading font-bold text-sm px-4 py-2 ${
                    ticket.status === "active"
                      ? "bg-green-500 text-white border-green-400"
                      : "bg-white text-gray-900 border-white"
                  }`}
                >
                  {ticket.status === "active" ? "Aktif / Belum Ditukar" : "Terpakai"}
                </Badge>
              </div>

              {/* Event Info Overlay */}
              <div className="absolute bottom-6 left-6 right-6">
                <h1 className="text-3xl font-heading text-white mb-2 text-balance">{ticket.eventName}</h1>
                <div className="flex flex-wrap items-center gap-4 text-gray-300 font-body text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(ticket.eventDate).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}{" "}
                      pukul {ticket.eventTime}
                    </span>
                  </div>
                  <span className="text-gray-600">•</span>
                  <span>{ticket.eventLocation}</span>
                </div>
              </div>
            </div>

            {/* Ticket Content */}
            <div className="p-8 space-y-6">
              {/* QR Code and Ticket Category */}
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* QR Code */}
                <div className="shrink-0">
                  <div className="p-4 bg-white rounded-xl">
                    <Image
                      src={`/images/example/qr-example.png?height=180&width=180&query=QR code for ${ticket.nftCode}`}
                      alt="QR Code"
                      width={180}
                      height={180}
                      className="w-full h-auto"
                    />
                  </div>
                  <p className="text-center text-xs text-gray-400 font-body mt-2">Pindai saat check-in di venue</p>
                </div>

                {/* Ticket Details */}
                <div className="flex-1 space-y-4">
                  {/* Ticket Category */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                    <span className="text-gray-400 font-body text-sm">Kategori Tiket</span>
                    <Badge
                      className={`font-subheading font-bold text-sm px-4 py-1.5 ${
                        ticket.ticketCategory === "VIP"
                          ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                          : "bg-blue-500/20 text-blue-300 border-blue-500/40"
                      }`}
                    >
                      {ticket.ticketCategory}
                    </Badge>
                  </div>

                  {/* NFT Code */}
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Hash className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-400 font-body text-sm">Kode NFT</span>
                    </div>
                    <p className="text-lg text-white font-mono font-semibold">#{ticket.nftCode}</p>
                  </div>

                  {/* Sale Price */}
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-400 font-body text-sm">Harga Jual</span>
                    </div>
                    <p className="text-lg text-white font-subheading font-bold">{ticket.salePrice}</p>
                    <p className="text-sm text-gray-400 font-body">{ticket.salePriceUSD}</p>
                  </div>

                  {/* Purchase Date */}
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-400 font-body text-sm">Tanggal Pembelian</span>
                    </div>
                    <p className="text-lg text-white font-subheading font-semibold">
                      {new Date(ticket.purchaseDate).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Transaction Hash */}
              <div className="p-4 rounded-lg bg-linear-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-400 font-body text-sm mb-1">Hash Transaksi di Sophon</p>
                    <p className="text-white font-mono text-sm truncate">{ticket.transactionHash}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="shrink-0 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                    onClick={() => window.open(`https://sophon.xyz/tx/${ticket.transactionHash}`, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Lihat
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction History */}
          {ticket.transactionHistory.length > 0 && (
            <Card className="border-white/10 bg-linear-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md">
              <CardContent className="p-6">
                <h2 className="text-xl font-subheading font-semibold text-white mb-4">Riwayat Transaksi</h2>
                <div className="space-y-3">
                {ticket.transactionHistory.map((transaction, index) => (
                  <div
                    key={transaction.id}
                    className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            variant="outline"
                            className={`text-xs font-body ${
                              transaction.type === "purchase"
                                ? "border-green-500/30 text-green-400"
                                : "border-blue-500/30 text-blue-400"
                            }`}
                          >
                            {transaction.type === "purchase" ? "Penjualan Primer" : "Jual Beli"}
                          </Badge>
                          {index === ticket.transactionHistory.length - 1 && (
                            <Badge variant="outline" className="text-xs font-body border-purple-500/30 text-purple-400">
                              Pemilik Saat Ini
                            </Badge>
                          )}
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2 text-gray-400 font-body">
                            <span>Dari:</span>
                            <span className="text-white font-mono">{transaction.from}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-400 font-body">
                            <span>Ke:</span>
                            <span className="text-white font-mono">{transaction.to}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-subheading font-bold text-white">{transaction.price}</p>
                        <p className="text-xs text-gray-400 font-body mt-1">
                          {transaction.date} pukul {transaction.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
        )}

        {/* POAP Badge */}
        <Card className="border-white/10 bg-linear-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
                <Award className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-subheading font-semibold text-white">Bukti Protokol Kehadiran (POAP)</h2>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-lg bg-linear-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
              <div className="shrink-0">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-yellow-500/30">
                  <Image
                    src={ticket.poapBadge.image || "/placeholder.svg"}
                    alt={ticket.poapBadge.name}
                    fill
                    className="object-cover"
                  />
                  {!ticket.poapBadge.earned && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-white font-subheading font-bold text-sm">Terkunci</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-subheading font-bold text-white mb-2">{ticket.poapBadge.name}</h3>
                {ticket.poapBadge.earned ? (
                  <div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 font-subheading mb-2">
                      Diperoleh
                    </Badge>
                    <p className="text-gray-400 font-body text-sm">
                      Selamat! Anda telah memperoleh lencana POAP ini karena menghadiri acara.
                    </p>
                  </div>
                ) : (
                  <div>
                    <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30 font-subheading mb-2">
                      Belum Diperoleh
                    </Badge>
                    <p className="text-gray-400 font-body text-sm">
                      Hadiri acara dan check-in di venue untuk memperoleh lencana POAP eksklusif ini.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Interactive 3D Ticket (Desktop Only) */}
      <div className="hidden lg:block lg:col-span-1">
        <div className="sticky top-36">
          <div
            ref={ticketRef}
            className="relative"
            style={{
              perspective: "1000px",
              transformStyle: "preserve-3d",
            }}
          >
            <div
              className="relative overflow-hidden bg-linear-to-br from-[#230c3f] via-[#0f051d] to-[#2e0535] border border-purple-700/20 shadow-2xl shadow-purple-900/30 transition-transform duration-100 ease-out"
              style={{
                transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                clipPath: "polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",
              }}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)`,
                  }}
                />
              </div>

              {/* Ticket Content */}
              <div className="relative p-6 space-y-4">
                {/* Event Name */}
                <div>
                  <h3 className="text-2xl font-heading text-white mb-2">{ticket.eventName}</h3>
                  <Badge
                    className={`font-subheading font-bold text-xs px-3 py-1 ${
                      ticket.ticketCategory === "VIP"
                        ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                        : "bg-blue-500/20 text-blue-300 border-blue-500/40"
                    }`}
                  >
                    {ticket.ticketCategory}
                  </Badge>
                </div>

                {/* Divider */}
                <div className="border-t border-white/10 border-dashed" />

                {/* Event Details */}
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-400 font-body text-xs mb-1">Tanggal & Waktu</p>
                    <p className="text-white font-subheading font-semibold">
                      {new Date(ticket.eventDate).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-gray-300 font-body">{ticket.eventTime}</p>
                  </div>

                  <div>
                    <p className="text-gray-400 font-body text-xs mb-1">Lokasi</p>
                    <p className="text-white font-subheading font-semibold text-sm">{ticket.eventLocation}</p>
                  </div>

                  <div>
                    <p className="text-gray-400 font-body text-xs mb-1">Kode NFT</p>
                    <p className="text-white font-mono text-xs break-all">#{ticket.nftCode}</p>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-white/10 border-dashed" />

                {/* Barcode */}
                <div className="space-y-2">
                  <div className="flex gap-[2px] h-16">
                    {Array.from({ length: 30 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-white"
                        style={{
                          opacity: Math.random() > 0.3 ? 1 : 0.3,
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-center text-gray-400 font-mono text-xs">{ticket.nftCode}</p>
                </div>
              </div>

              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-purple-500/40" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-purple-500/40" />
            </div>
          </div>
        </div>
      </div>
      </div>
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