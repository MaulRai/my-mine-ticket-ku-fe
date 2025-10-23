"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Shuffle } from "lucide-react"

export default function ExploreTicketsPage() {
  const [ticketId, setTicketId] = useState("")
  const router = useRouter()

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    if (ticketId.trim()) {
      router.push(`/tickets/${ticketId.trim()}`)
    }
  }

  const handleRandomTicket = () => {
    // Generate a random ticket ID for demonstration
    // In production, this would fetch a real recently issued ticket ID from your backend
    const randomId = Math.floor(Math.random() * 10000).toString()
    router.push(`/tickets/${randomId}`)
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0a0a0a] via-[#1a0a2e] to-[#0a0a0a]">
      {/* Ambient animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial from-purple-500/10 to-transparent animate-pulse-slow" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-radial from-purple-400/8 to-transparent animate-pulse-slow animation-delay-2000" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl animate-float animation-delay-4000" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16 mt-16">
        <div className="max-w-4xl w-full space-y-12 text-center">
          {/* Header */}
          <div className="space-y-6">
            <h1 className="font-heading text-5xl md:text-7xl text-white tracking-tight">Explore Tickets</h1>
            <p className="font-body text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
              Witness the <span className="font-bold text-white">#TicketingRevolution</span> in action. NFT
              ticketing brings blockchain benefits to a mainstream global audience. Explore the complete Open Ticketing
              Ecosystem: from real-time statistics to the full lifecycle and authenticity verification of individual
              tickets.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="relative">
              <div className="glass-fx bg-black/40 p-2 rounded-2xl">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Enter NFT Ticket identifier..."
                      value={ticketId}
                      onChange={(e) => setTicketId(e.target.value)}
                      className="pl-12 pr-4 py-6 text-lg bg-black/50 border-white/10 text-white placeholder:text-gray-500 focus:bg-black/60 focus:border-purple-500/30 transition-all"
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="px-8 py-6 bg-gradient-to-r from-purple-600/80 to-purple-500/80 hover:from-purple-600 hover:to-purple-500 text-white font-semibold shadow-lg shadow-purple-500/20 transition-all"
                  >
                    Search
                  </Button>
                </div>
              </div>
            </form>
          </div>

          {/* Random Button Section */}
          <div className="space-y-4">
            <p className="font-body text-lg text-gray-400">
              Don&apos;t have a ticket identifier? Discover a recently issued NFT ticket and explore its complete
              journey from creation to current status.
            </p>
            <Button
              onClick={handleRandomTicket}
              size="lg"
              variant="outline"
              className="px-8 py-6 bg-black/40 border-2 border-white/20 hover:bg-black/60 hover:border-purple-500/50 text-white font-semibold backdrop-blur-sm transition-all group"
            >
              <Shuffle className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-500" />
              View Random Ticket
            </Button>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="clear-glass-fx bg-black/40 p-6 rounded-xl space-y-3 border border-white/10">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mx-auto">
                <span className="text-2xl">🔗</span>
              </div>
              <h3 className="font-subheading text-xl font-semibold text-white">Blockchain Verified</h3>
              <p className="font-body text-gray-400 text-sm leading-relaxed">
                Every ticket is cryptographically secured and verifiable on the blockchain
              </p>
            </div>
            <div className="clear-glass-fx bg-black/40 p-6 rounded-xl space-y-3 border border-white/10">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mx-auto">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="font-subheading text-xl font-semibold text-white">Real-Time Tracking</h3>
              <p className="font-body text-gray-400 text-sm leading-relaxed">
                Monitor ticket lifecycle events and ownership transfers in real-time
              </p>
            </div>
            <div className="clear-glass-fx bg-black/40 p-6 rounded-xl space-y-3 border border-white/10">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mx-auto">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="font-subheading text-xl font-semibold text-white">Authenticity Guaranteed</h3>
              <p className="font-body text-gray-400 text-sm leading-relaxed">
                Eliminate fraud with immutable proof of ticket authenticity and ownership
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
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
