"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Wallet, ArrowUpRight, ArrowDownLeft, Plus, ExternalLink, Ticket } from "lucide-react"

type Tab = "my-tickets" | "wallet-info"

// Mock wallet data
const connectedWallets = [
  {
    id: 1,
    name: "MetaMask",
    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    balance: "2.45 ETH",
    balanceUSD: "Rp76.773.000",
    type: "Ethereum",
    isDefault: true,
  },
  {
    id: 2,
    name: "Phantom",
    address: "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
    balance: "125.30 SOL",
    balanceUSD: "Rp39.344.200",
    type: "Solana",
    isDefault: false,
  },
  {
    id: 3,
    name: "Coinbase Wallet",
    address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
    balance: "0.15 BTC",
    balanceUSD: "Rp101.265.000",
    type: "Bitcoin",
    isDefault: false,
  },
]

// Mock transaction history
const transactions = [
  {
    id: 1,
    type: "purchase",
    description: "Neon Waves Festival - VIP Ticket",
    amount: "-0.25 ETH",
    amountUSD: "-Rp7.850.000",
    date: "2025-10-20",
    time: "14:32",
    status: "completed",
    wallet: "MetaMask",
  },
  {
    id: 2,
    type: "deposit",
    description: "Deposit from Bank Account",
    amount: "+1.00 ETH",
    amountUSD: "+Rp31.400.000",
    date: "2025-10-18",
    time: "09:15",
    status: "completed",
    wallet: "MetaMask",
  },
  {
    id: 3,
    type: "purchase",
    description: "Islands of Sound 2025 - General Admission",
    amount: "-45.00 SOL",
    amountUSD: "-Rp14.130.000",
    date: "2025-10-15",
    time: "16:45",
    status: "completed",
    wallet: "Phantom",
  },
  {
    id: 4,
    type: "sale",
    description: "Resale: Rock Concert Night - Standard",
    amount: "+0.18 ETH",
    amountUSD: "+Rp5.652.000",
    date: "2025-10-12",
    time: "11:20",
    status: "completed",
    wallet: "MetaMask",
  },
  {
    id: 5,
    type: "purchase",
    description: "Sonic Future Conference - Early Bird",
    amount: "-0.12 ETH",
    amountUSD: "-Rp3.768.000",
    date: "2025-10-10",
    time: "13:55",
    status: "completed",
    wallet: "MetaMask",
  },
  {
    id: 6,
    type: "withdrawal",
    description: "Withdrawal to Bank Account",
    amount: "-0.50 ETH",
    amountUSD: "-Rp15.700.000",
    date: "2025-10-08",
    time: "10:30",
    status: "pending",
    wallet: "MetaMask",
  },
]

// Mock ticket data with NFT codes and status
const myTickets = [
  {
    id: 1,
    eventName: "Neon Waves Festival",
    eventCover: "/images/example/cover-1.png",
    ticketCategory: "VIP",
    nftCode: "NFT-23A91F8C4D2E",
    purchaseDate: "2025-10-20",
    status: "active",
  },
  {
    id: 2,
    eventName: "Islands of Sound 2025",
    eventCover: "/images/example/cover-2.png",
    ticketCategory: "Regular",
    nftCode: "NFT-7B5E9A1C3F6D",
    purchaseDate: "2025-10-15",
    status: "active",
  },
  {
    id: 3,
    eventName: "Sonic Future Conference",
    eventCover: "/images/example/cover-3.png",
    ticketCategory: "VIP",
    nftCode: "NFT-4D8F2A6B9E1C",
    purchaseDate: "2025-09-28",
    status: "used",
  },
  {
    id: 4,
    eventName: "Taste & Tunes Fest",
    eventCover: "/images/example/cover-4.png",
    ticketCategory: "Regular",
    nftCode: "NFT-9C3E7F1A5B8D",
    purchaseDate: "2025-09-15",
    status: "active",
  },
  {
    id: 5,
    eventName: "Rhythm Arena 2025",
    eventCover: "/images/example/cover-5.png",
    ticketCategory: "VIP",
    nftCode: "NFT-6A2D8E4C1F9B",
    purchaseDate: "2025-08-30",
    status: "used",
  },
  {
    id: 6,
    eventName: "Rock Concert Night",
    eventCover: "/images/example/example-cover.png",
    ticketCategory: "Regular",
    nftCode: "NFT-1F7B3D9A5E2C",
    purchaseDate: "2025-08-12",
    status: "active",
  },
]

function ProfileContent() {
  const [activeTab, setActiveTab] = useState<Tab>("wallet-info")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab === "my-tickets") {
      setActiveTab("my-tickets")
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-background pt-32 pb-12 relative overflow-hidden">
      {/* Dark Magenta Ambient Background */}
      <div className="fixed inset-0 overflow-hidden opacity-70 pointer-events-none">
        <div className="absolute top-0 -left-1/3 w-2/3 h-full bg-gradient-radial from-fuchsia-700/80 to-transparent animate-pulse-slow" />
        <div className="absolute bottom-0 -right-1/3 w-2/3 h-full bg-gradient-radial from-purple-700/60 to-transparent animate-pulse-slow animation-delay-2000" />
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-fuchsia-600/40 rounded-full blur-3xl animate-float-drift" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-purple-600/40 rounded-full blur-3xl animate-float-drift animation-delay-4000" />
      </div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-heading text-white mb-2">Profil Saya</h1>
          <p className="text-gray-400 font-body">Kelola tiket dan informasi dompet Anda</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1 bg-gray-900/60 backdrop-blur-md border border-white/10 p-1.5 rounded-full">
            <Button
              variant="ghost"
              onClick={() => setActiveTab("wallet-info")}
              className={`relative rounded-full px-6 py-2 text-sm font-subheading font-medium transition-all duration-300
                ${
                  activeTab === "wallet-info"
                    ? "text-white shadow-md bg-gradient-to-b from-gray-400 via-gray-600 to-gray-700"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
            >
              Info Dompet
            </Button>
            <Button
              variant="ghost"
              onClick={() => setActiveTab("my-tickets")}
              className={`relative rounded-full px-6 py-2 text-sm font-subheading font-medium transition-all duration-300
                ${
                  activeTab === "my-tickets"
                    ? "text-white shadow-md bg-gradient-to-b from-gray-400 via-gray-600 to-gray-700"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
            >
              Tiketku
            </Button>
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "my-tickets" && (
            <motion.div
              key="my-tickets"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="space-y-6"
            >
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-subheading font-semibold text-white">Tiketku ({myTickets.length})</h2>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 font-subheading text-sm px-3 py-1">
                      {myTickets.filter((t) => t.status === "active").length} Aktif
                    </Badge>
                    <Badge className="bg-white/10 text-white border-white/20 font-subheading text-sm px-3 py-1">
                      {myTickets.filter((t) => t.status === "used").length} Terpakai
                    </Badge>
                  </div>
                </div>
              </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myTickets.map((ticket) => (
                <Card
                  key={ticket.id}
                  onClick={() => router.push(`/tickets/${ticket.id}`)}
                  className="group overflow-hidden border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-white/5 cursor-pointer hover:-translate-y-1"
                >
                  {/* Event Cover Image */}
                  <div className="relative h-40 w-full overflow-hidden">
                    <Image
                      src={ticket.eventCover || "/placeholder.svg"}
                      alt={ticket.eventName}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                    {/* Status Badge on image */}
                    <div className="absolute top-3 right-3">
                      <Badge
                        className={`font-subheading font-semibold text-xs px-3 py-1 ${
                          ticket.status === "active"
                            ? "bg-green-500/90 text-white border-green-400/50"
                            : "bg-white/90 text-gray-900 border-white/50"
                        }`}
                      >
                        {ticket.status === "active" ? "Aktif" : "Terpakai"}
                      </Badge>
                    </div>

                    {/* Ticket icon overlay */}
                    <div className="absolute bottom-3 left-3">
                      <div className="glass-fx p-2 rounded-full">
                        <Ticket className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-5 space-y-3">
                    {/* Event Name */}
                    <h3 className="font-subheading font-semibold text-lg text-white leading-tight line-clamp-2 group-hover:text-gray-100 transition-colors">
                      {ticket.eventName}
                    </h3>

                    {/* Ticket Category */}
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 font-body text-sm">Kategori</span>
                      <Badge
                        className={`font-subheading font-semibold text-xs px-3 py-1 ${
                          ticket.ticketCategory === "VIP"
                            ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                            : "bg-blue-500/20 text-blue-300 border-blue-500/30"
                        }`}
                      >
                        {ticket.ticketCategory}
                      </Badge>
                    </div>

                    {/* NFT Code */}
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <p className="text-xs text-gray-400 font-body mb-1">Kode NFT</p>
                      <p className="text-sm text-white font-mono">#{ticket.nftCode.substring(0, 13)}...</p>
                    </div>

                    {/* Purchase Date */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <span className="text-gray-400 font-body text-xs">Dibeli</span>
                      <span className="text-white font-subheading font-medium text-sm">
                        {new Date(ticket.purchaseDate).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "wallet-info" && (
          <motion.div
            key="wallet-info"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="space-y-8"
          >
            {/* Connected Wallets Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-subheading font-semibold text-white">Dompet Terhubung</h2>
                <Button className="bg-gradient-to-b from-gray-400 via-gray-600 to-gray-700 hover:from-gray-300 hover:via-gray-500 hover:to-gray-600 text-white font-subheading font-medium">
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Dompet
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {connectedWallets.map((wallet) => (
                  <Card
                    key={wallet.id}
                    className="group border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-white/5"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <Wallet className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-lg font-subheading text-white">{wallet.name}</CardTitle>
                            <Badge variant="outline" className="mt-1 text-xs border-white/20 text-gray-300 font-body">
                              {wallet.type}
                            </Badge>
                          </div>
                        </div>
                        {wallet.isDefault && (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs font-body">
                            Utama
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                        <p className="text-xs text-gray-400 font-body mb-1">Alamat</p>
                        <p className="text-sm text-white font-mono truncate">{wallet.address}</p>
                      </div>
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-xs text-gray-400 font-body mb-1">Saldo</p>
                          <p className="text-lg font-subheading font-semibold text-white">{wallet.balance}</p>
                          <p className="text-sm text-gray-400 font-body">{wallet.balanceUSD}</p>
                        </div>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-white/10">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Transaction History Section */}
            <div>
              <h2 className="text-2xl font-subheading font-semibold text-white mb-4">Riwayat Transaksi</h2>

              <Card className="border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md">
                <CardContent className="p-0">
                  <div className="divide-y divide-white/10">
                    {transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="p-4 hover:bg-white/5 transition-colors duration-200 cursor-pointer"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                transaction.type === "purchase"
                                  ? "bg-red-500/20 border border-red-500/30"
                                  : transaction.type === "deposit"
                                    ? "bg-green-500/20 border border-green-500/30"
                                    : transaction.type === "sale"
                                      ? "bg-blue-500/20 border border-blue-500/30"
                                      : "bg-yellow-500/20 border border-yellow-500/30"
                              }`}
                            >
                              {transaction.type === "purchase" || transaction.type === "withdrawal" ? (
                                <ArrowUpRight className="h-5 w-5 text-red-400" />
                              ) : (
                                <ArrowDownLeft className="h-5 w-5 text-green-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-subheading font-medium truncate">
                                {transaction.description}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <p className="text-xs text-gray-400 font-body">
                                  {transaction.date} at {transaction.time}
                                </p>
                                <span className="text-gray-600">•</span>
                                <p className="text-xs text-gray-400 font-body">{transaction.wallet}</p>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p
                              className={`text-lg font-subheading font-semibold ${
                                transaction.amount.startsWith("+") ? "text-green-400" : "text-red-400"
                              }`}
                            >
                              {transaction.amount}
                            </p>
                            <p className="text-sm text-gray-400 font-body">{transaction.amountUSD}</p>
                            <Badge
                              variant="outline"
                              className={`mt-1 text-xs font-body ${
                                transaction.status === "completed"
                                  ? "border-green-500/30 text-green-400"
                                  : "border-yellow-500/30 text-yellow-400"
                              }`}
                            >
                              {transaction.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
        </AnimatePresence>
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

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background pt-32 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-4xl font-heading text-white mb-2">Profil Saya</h1>
            <p className="text-gray-400 font-body">Memuat...</p>
          </div>
        </div>
      </div>
    }>
      <ProfileContent />
    </Suspense>
  )
}
