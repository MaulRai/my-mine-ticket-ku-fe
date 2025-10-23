"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
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
    balanceUSD: "$4,890.00",
    type: "Ethereum",
    isDefault: true,
  },
  {
    id: 2,
    name: "Phantom",
    address: "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
    balance: "125.30 SOL",
    balanceUSD: "$2,506.00",
    type: "Solana",
    isDefault: false,
  },
  {
    id: 3,
    name: "Coinbase Wallet",
    address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
    balance: "0.15 BTC",
    balanceUSD: "$6,450.00",
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
    amountUSD: "-$500.00",
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
    amountUSD: "+$2,000.00",
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
    amountUSD: "-$900.00",
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
    amountUSD: "+$360.00",
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
    amountUSD: "-$240.00",
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
    amountUSD: "-$1,000.00",
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
    <div className="min-h-screen bg-background pt-32 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-heading text-white mb-2">My Profile</h1>
          <p className="text-gray-400 font-body">Manage your tickets and wallet information</p>
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
              Wallet Info
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
              My Tickets
            </Button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "my-tickets" && (
          <div className="space-y-6">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-subheading font-semibold text-white">My Tickets ({myTickets.length})</h2>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 font-subheading text-sm px-3 py-1">
                    {myTickets.filter((t) => t.status === "active").length} Active
                  </Badge>
                  <Badge className="bg-white/10 text-white border-white/20 font-subheading text-sm px-3 py-1">
                    {myTickets.filter((t) => t.status === "used").length} Used
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
                        {ticket.status === "active" ? "Active" : "Used"}
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
                      <span className="text-gray-400 font-body text-sm">Category</span>
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
                      <p className="text-xs text-gray-400 font-body mb-1">NFT Code</p>
                      <p className="text-sm text-white font-mono">#{ticket.nftCode.substring(0, 13)}...</p>
                    </div>

                    {/* Purchase Date */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <span className="text-gray-400 font-body text-xs">Purchased</span>
                      <span className="text-white font-subheading font-medium text-sm">
                        {new Date(ticket.purchaseDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "wallet-info" && (
          <div className="space-y-8">
            {/* Connected Wallets Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-subheading font-semibold text-white">Connected Wallets</h2>
                <Button className="bg-gradient-to-b from-gray-400 via-gray-600 to-gray-700 hover:from-gray-300 hover:via-gray-500 hover:to-gray-600 text-white font-subheading font-medium">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Wallet
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
                            Default
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                        <p className="text-xs text-gray-400 font-body mb-1">Address</p>
                        <p className="text-sm text-white font-mono truncate">{wallet.address}</p>
                      </div>
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-xs text-gray-400 font-body mb-1">Balance</p>
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
              <h2 className="text-2xl font-subheading font-semibold text-white mb-4">Transaction History</h2>

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
          </div>
        )}
      </div>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background pt-32 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-4xl font-heading text-white mb-2">My Profile</h1>
            <p className="text-gray-400 font-body">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <ProfileContent />
    </Suspense>
  )
}
