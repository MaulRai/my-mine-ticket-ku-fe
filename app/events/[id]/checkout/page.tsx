"use client"

import { useState, use } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Ticket, Plus, Minus, Wallet, CheckCircle2, ExternalLink, AlertCircle } from "lucide-react"

interface EventData {
  id: number
  name: string
  logo: string
  date: string
  time: string
  location: string
  category?: string
  regularTickets: number
  regularTicketsSold: number
  regularTicketPrice: number
  vipTickets: number
  vipTicketsSold: number
  vipTicketPrice: number
  ticketCategories?: Array<{
    id: number
    name: string
    price: number
    priceUSD: string
    available: number
    benefits: string[]
  }>
}

// Mock data - in a real app, this would come from an API or database
const eventData: Record<string, EventData> = {
  "1": {
    id: 1,
    name: "Neon Waves Festival",
    logo: "/images/example/cover-1.png",
    date: "June 15, 2025",
    time: "18:00 - 23:00 WIB",
    location: "Jakarta Convention Center",
    regularTickets: 4000,
    regularTicketsSold: 3880,
    regularTicketPrice: 0.15,
    vipTickets: 1000,
    vipTicketsSold: 970,
    vipTicketPrice: 0.35,
  },
  "2": {
    id: 2,
    name: "Islands of Sound 2025",
    logo: "/images/example/cover-2.png",
    date: "July 20, 2025",
    time: "17:00 - 22:00 WITA",
    location: "Bali Art Center",
    regularTickets: 2800,
    regularTicketsSold: 1680,
    regularTicketPrice: 0.18,
    vipTickets: 700,
    vipTicketsSold: 420,
    vipTicketPrice: 0.40,
  },
}

const walletOptions = [
  { id: "metamask", name: "MetaMask", icon: "🦊" },
  { id: "walletconnect", name: "WalletConnect", icon: "🔗" },
  { id: "custodial", name: "Custodial Wallet", icon: "🔐" },
]

export default function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const event = eventData[id] || eventData["1"]

  const [regularTicketCount, setRegularTicketCount] = useState(0)
  const [vipTicketCount, setVipTicketCount] = useState(0)
  const [buyerName, setBuyerName] = useState("")
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)
  const [walletAddress, setWalletAddress] = useState("")
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transactionHash, setTransactionHash] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const regularTicketsRemaining = event.regularTickets - event.regularTicketsSold
  const vipTicketsRemaining = event.vipTickets - event.vipTicketsSold

  const MAX_TICKETS = 5
  const PLATFORM_FEE_PERCENTAGE = 2.5

  const totalTickets = regularTicketCount + vipTicketCount
  const subtotal = regularTicketCount * event.regularTicketPrice + vipTicketCount * event.vipTicketPrice
  const platformFee = subtotal * (PLATFORM_FEE_PERCENTAGE / 100)
  const totalPrice = subtotal + platformFee

  const canAddRegular = regularTicketCount < regularTicketsRemaining && totalTickets < MAX_TICKETS
  const canAddVip = vipTicketCount < vipTicketsRemaining && totalTickets < MAX_TICKETS

  const handleIncrement = (type: "regular" | "vip") => {
    if (type === "regular" && canAddRegular) {
      setRegularTicketCount((prev) => prev + 1)
    } else if (type === "vip" && canAddVip) {
      setVipTicketCount((prev) => prev + 1)
    }
  }

  const handleDecrement = (type: "regular" | "vip") => {
    if (type === "regular" && regularTicketCount > 0) {
      setRegularTicketCount((prev) => prev - 1)
    } else if (type === "vip" && vipTicketCount > 0) {
      setVipTicketCount((prev) => prev - 1)
    }
  }

  const handlePayNow = async () => {
    if (!selectedWallet || !agreedToTerms || totalTickets === 0) return

    setIsProcessing(true)

    // Simulate blockchain transaction
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate mock transaction hash
    const mockHash = "0x" + Math.random().toString(16).substring(2, 66)
    setTransactionHash(mockHash)
    setShowSuccess(true)
    setIsProcessing(false)
  }

  const isRegularSoldOut = regularTicketsRemaining === 0
  const isVipSoldOut = vipTicketsRemaining === 0

  if (showSuccess && transactionHash) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500/50 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-green-400" />
              </div>
            </div>

            <h1 className="text-3xl font-heading text-white mb-3">Pembayaran Berhasil!</h1>
            <p className="text-gray-300 font-body text-lg mb-6">Tiket Anda telah berhasil dibeli</p>

            <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400 font-body text-sm">Acara</span>
                <span className="text-white font-subheading font-semibold">{event.name}</span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400 font-body text-sm">Tiket</span>
                <span className="text-white font-subheading font-semibold">
                  {regularTicketCount > 0 && `${regularTicketCount}x Reguler`}
                  {regularTicketCount > 0 && vipTicketCount > 0 && ", "}
                  {vipTicketCount > 0 && `${vipTicketCount}x VIP`}
                </span>
              </div>
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
                <span className="text-gray-400 font-body text-sm">Total Dibayar</span>
                <span className="text-white font-heading text-xl">{totalPrice.toFixed(4)} ETH</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 font-body text-sm">Hash Transaksi</span>
                <a
                  href={`https://explorer.sophon.xyz/tx/${transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-mono text-xs transition-colors"
                >
                  {transactionHash.substring(0, 10)}...{transactionHash.substring(transactionHash.length - 8)}
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <Link href={`/events/${id}`} className="flex-1">
                <Button
                  variant="outline"
                  className="w-full border-white/20 bg-white/5 hover:bg-white/10 text-white font-subheading font-semibold"
                >
                  Kembali ke Acara
                </Button>
              </Link>
              <Link href="/profile" className="flex-1">
                <Button className="w-full bg-gradient-to-b from-gray-300 via-gray-500 to-gray-700 hover:from-gray-200 hover:to-gray-600 text-white font-subheading font-semibold">
                  Lihat Tiketku
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link href={`/events/${id}`}>
            <button className="glass-fx p-3 rounded-full hover:bg-white/30 transition-all mb-6" aria-label="Back">
              <ArrowLeft className="h-6 w-6 text-white" />
            </button>
          </Link>
          <h1 className="text-4xl font-heading text-white mb-2">Checkout</h1>
          <p className="text-gray-400 font-body">Selesaikan pembelian tiket Anda</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Ticket Selection & Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Info */}
            <Card className="border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 rounded-lg overflow-hidden">
                    <Image src={event.logo || "/placeholder.svg"} alt={event.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-heading text-white mb-1">{event.name}</h2>
                    <p className="text-gray-400 font-body text-sm">{event.date}</p>
                    <p className="text-gray-400 font-body text-sm">{event.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ticket Selection */}
            <Card className="border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md">
              <CardContent className="p-6">
                <h2 className="text-2xl font-heading text-white mb-4">Pilih Tiket</h2>
                <p className="text-gray-400 font-body text-sm mb-6">Maksimal {MAX_TICKETS} tiket per pembelian</p>

                <div className="space-y-4">
                  {/* Regular Ticket */}
                  <div
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isRegularSoldOut
                        ? "border-white/5 bg-white/5 opacity-50"
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-subheading font-semibold text-white text-lg">Tiket Reguler</h3>
                          {isRegularSoldOut && (
                            <Badge className="bg-red-500/20 text-red-400 border-red-500/30 font-subheading text-xs">
                              Habis
                            </Badge>
                          )}
                        </div>
                        <p className="text-2xl font-heading text-white mb-1">
                          {event.regularTicketPrice} ETH
                        </p>
                        <p className="text-gray-400 font-body text-sm">
                          {regularTicketsRemaining.toLocaleString("id-ID")} tiket tersisa
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDecrement("regular")}
                          disabled={regularTicketCount === 0 || isRegularSoldOut}
                          className="h-10 w-10 rounded-full border-white/20 bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Minus className="h-5 w-5" />
                        </Button>
                        <span className="text-white font-heading text-2xl w-8 text-center">{regularTicketCount}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleIncrement("regular")}
                          disabled={!canAddRegular || isRegularSoldOut}
                          className="h-10 w-10 rounded-full border-white/20 bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Plus className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* VIP Ticket */}
                  <div
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isVipSoldOut ? "border-white/5 bg-white/5 opacity-50" : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-subheading font-semibold text-white text-lg">Tiket VIP</h3>
                          {isVipSoldOut && (
                            <Badge className="bg-red-500/20 text-red-400 border-red-500/30 font-subheading text-xs">
                              Habis
                            </Badge>
                          )}
                        </div>
                        <p className="text-2xl font-heading text-white mb-1">
                          {event.vipTicketPrice} ETH
                        </p>
                        <p className="text-gray-400 font-body text-sm">
                          {vipTicketsRemaining.toLocaleString("id-ID")} tiket tersisa
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDecrement("vip")}
                          disabled={vipTicketCount === 0 || isVipSoldOut}
                          className="h-10 w-10 rounded-full border-white/20 bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Minus className="h-5 w-5" />
                        </Button>
                        <span className="text-white font-heading text-2xl w-8 text-center">{vipTicketCount}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleIncrement("vip")}
                          disabled={!canAddVip || isVipSoldOut}
                          className="h-10 w-10 rounded-full border-white/20 bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Plus className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {totalTickets >= MAX_TICKETS && (
                  <div className="mt-4 p-3 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-orange-400 flex-shrink-0" />
                    <p className="text-orange-400 font-body text-sm">
                      Batas maksimal tiket tercapai ({MAX_TICKETS} tiket)
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>            

            {/* Wallet Selection */}
            <Card className="border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md">
              <CardContent className="p-6">
                <h2 className="text-2xl font-heading text-white mb-4">Metode Pembayaran</h2>
                <p className="text-gray-400 font-body text-sm mb-6">Pilih dompet Anda untuk menyelesaikan transaksi</p>

                <div className="space-y-3 mb-4">
                  {walletOptions.map((wallet) => (
                    <div
                      key={wallet.id}
                      onClick={() => setSelectedWallet(wallet.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedWallet === wallet.id
                          ? "border-white/40 bg-white/10"
                          : "border-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{wallet.icon}</span>
                          <span className="font-subheading font-semibold text-white">{wallet.name}</span>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selectedWallet === wallet.id ? "border-white bg-white" : "border-white/40"
                          }`}
                        >
                          {selectedWallet === wallet.id && <div className="w-2.5 h-2.5 rounded-full bg-black" />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedWallet && (
                  <div>
                    <Label htmlFor="walletAddress" className="text-white font-subheading mb-2 block">
                      Alamat Dompet
                    </Label>
                    <Input
                      id="walletAddress"
                      type="text"
                      placeholder="0x..."
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-white/40 font-mono"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md sticky top-8">
              <CardContent className="p-6">
                <h2 className="text-2xl font-heading text-white mb-6">Ringkasan Pesanan</h2>

                <div className="space-y-4 mb-6">
                  {regularTicketCount > 0 && (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-subheading font-semibold">Tiket Reguler</p>
                        <p className="text-gray-400 font-body text-sm">
                          {regularTicketCount}x {event.regularTicketPrice} ETH
                        </p>
                      </div>
                      <p className="text-white font-heading text-lg">
                        {(regularTicketCount * event.regularTicketPrice).toFixed(4)} ETH
                      </p>
                    </div>
                  )}

                  {vipTicketCount > 0 && (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-subheading font-semibold">Tiket VIP</p>
                        <p className="text-gray-400 font-body text-sm">
                          {vipTicketCount}x {event.vipTicketPrice} ETH
                        </p>
                      </div>
                      <p className="text-white font-heading text-lg">
                        {(vipTicketCount * event.vipTicketPrice).toFixed(4)} ETH
                      </p>
                    </div>
                  )}

                  {totalTickets === 0 && (
                    <div className="text-center py-8">
                      <Ticket className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-500 font-body text-sm">Belum ada tiket dipilih</p>
                    </div>
                  )}
                </div>

                {totalTickets > 0 && (
                  <>
                    <div className="border-t border-white/10 pt-4 mb-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-gray-400 font-body text-sm">Subtotal</p>
                        <p className="text-white font-subheading">{subtotal.toFixed(4)} ETH</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-gray-400 font-body text-sm">Biaya Platform ({PLATFORM_FEE_PERCENTAGE}%)</p>
                        <p className="text-white font-subheading">{platformFee.toFixed(4)} ETH</p>
                      </div>
                    </div>

                    <div className="border-t border-white/10 pt-4 mb-6">
                      <div className="flex items-center justify-between">
                        <p className="text-white font-subheading font-semibold text-lg">Total</p>
                        <p className="text-white font-heading text-2xl">{totalPrice.toFixed(4)} ETH</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-start gap-3 p-4 rounded-lg bg-white/5 border border-white/10">
                        <Checkbox
                          id="terms"
                          checked={agreedToTerms}
                          onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                          className="mt-1"
                        />
                        <label htmlFor="terms" className="text-gray-300 font-body text-sm cursor-pointer">
                          Saya menyetujui{" "}
                          <a href="#" className="text-blue-400 hover:text-blue-300 underline">
                            Syarat & Ketentuan
                          </a>{" "}
                          acara ini
                        </label>
                      </div>
                    </div>

                    <Button
                      onClick={handlePayNow}
                      disabled={!selectedWallet || !agreedToTerms || isProcessing}
                      className="w-full h-12 bg-gradient-to-b from-gray-300 via-gray-500 to-gray-700 hover:from-gray-200 hover:to-gray-600 text-white font-subheading font-semibold text-base transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                          Memproses...
                        </>
                      ) : (
                        <>
                          <Wallet className="h-5 w-5 mr-2" />
                          Bayar Sekarang
                        </>
                      )}
                    </Button>

                    <p className="text-gray-500 font-body text-xs text-center mt-4">
                      Pembayaran aman didukung oleh blockchain Sophon
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
