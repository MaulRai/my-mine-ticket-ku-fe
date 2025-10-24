"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Plus,
    TrendingUp,
    Heart,
    Ticket,
    DollarSign,
    Download,
    CheckCircle,
    AlertCircle,
    Calendar,
    MapPin,
} from "lucide-react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { EventStats } from "@/lib/eo-types"

// Mock data for demonstration
const mockEvents: EventStats[] = [
    {
        id: 1,
        name: "Burnout Festival",
        status: "verified",
        likes: 1250,
        ticketsSold: 4050,
        totalTickets: 5000,
        date: "25 Oktober 2025",
        location: "Gelora Bung Karno, Jakarta",
        financials: {
            grossRevenue: 1417500000,
            eoShare: 1134000000,
            sponsorShare: 141750000,
            vendorShare: 70875000,
            taxAmount: 70875000,
            netRevenue: 1063125000,
        },
        taxPaid: true,
    },
    {
        id: 2,
        name: "Cravier Music Fest",
        status: "verified",
        likes: 890,
        ticketsSold: 4500,
        totalTickets: 4500,
        date: "1 November 2025",
        location: "Jakarta International Expo",
        financials: {
            grossRevenue: 1575000000,
            eoShare: 1260000000,
            sponsorShare: 157500000,
            vendorShare: 78750000,
            taxAmount: 78750000,
            netRevenue: 1181250000,
        },
        taxPaid: true,
    },
    {
        id: 3,
        name: "Glenovare Live",
        status: "unverified",
        likes: 420,
        ticketsSold: 1750,
        totalTickets: 3500,
        date: "8 November 2025",
        location: "ICE BSD, Tangerang",
        financials: {
            grossRevenue: 612500000,
            eoShare: 490000000,
            sponsorShare: 61250000,
            vendorShare: 30625000,
            taxAmount: 30625000,
            netRevenue: 459375000,
        },
        taxPaid: false,
    },
]

// Mock sales data for chart
const salesData = [
    { month: "Jun", revenue: 450000000 },
    { month: "Jul", revenue: 680000000 },
    { month: "Aug", revenue: 920000000 },
    { month: "Sep", revenue: 1150000000 },
    { month: "Okt", revenue: 1417500000 },
    { month: "Nov", revenue: 1575000000 },
]

export default function EODashboard() {
    const [selectedEvent, setSelectedEvent] = useState<EventStats | null>(mockEvents[0])

    const totalRevenue = mockEvents.reduce((sum, event) => sum + event.financials.grossRevenue, 0)
    const totalTicketsSold = mockEvents.reduce((sum, event) => sum + event.ticketsSold, 0)
    const totalLikes = mockEvents.reduce((sum, event) => sum + event.likes, 0)

    const handleExportReport = (eventId: number) => {
        // Mock export functionality
        alert(`Exporting report for event ID: ${eventId}`)
    }

    return (
        <div className="mt-20 min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a0a2e] to-[#0a0a0a]">
            <div className="container mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-heading text-white mb-2">Dashboard Event Organizer</h1>
                        <p className="text-gray-400 font-body">Kelola acara dan pantau performa penjualan tiket Anda</p>
                    </div>
                    <Link href="/eo/create-event">
                        <Button className="bg-gradient-to-b from-white via-gray-100 to-gray-300 hover:from-gray-100 hover:to-gray-400 text-black font-subheading font-semibold">
                            <Plus className="h-5 w-5 mr-2" />
                            Buat Acara
                        </Button>
                    </Link>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <Card className="border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-gray-400 font-body text-sm">Total Pendapatan</p>
                                <DollarSign className="h-5 w-5 text-green-400" />
                            </div>
                            <p className="text-2xl font-heading text-white">Rp {(totalRevenue / 1000000).toFixed(1)}M</p>
                            <p className="text-xs text-green-400 font-body mt-1">+12.5% dari bulan lalu</p>
                        </CardContent>
                    </Card>

                    <Card className="border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-gray-400 font-body text-sm">Tiket Terjual</p>
                                <Ticket className="h-5 w-5 text-blue-400" />
                            </div>
                            <p className="text-2xl font-heading text-white">{totalTicketsSold.toLocaleString("id-ID")}</p>
                            <p className="text-xs text-blue-400 font-body mt-1">Dari {mockEvents.length} acara</p>
                        </CardContent>
                    </Card>

                    <Card className="border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-gray-400 font-body text-sm">Total Likes</p>
                                <Heart className="h-5 w-5 text-red-400" />
                            </div>
                            <p className="text-2xl font-heading text-white">{totalLikes.toLocaleString("id-ID")}</p>
                            <p className="text-xs text-red-400 font-body mt-1">Engagement tinggi</p>
                        </CardContent>
                    </Card>

                    <Card className="border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-gray-400 font-body text-sm">Acara Aktif</p>
                                <TrendingUp className="h-5 w-5 text-purple-400" />
                            </div>
                            <p className="text-2xl font-heading text-white">{mockEvents.length}</p>
                            <p className="text-xs text-purple-400 font-body mt-1">
                                {mockEvents.filter((e) => e.status === "verified").length} terverifikasi
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Sales Chart */}
                <Card className="border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md mb-8">
                    <CardHeader>
                        <CardTitle className="text-white font-heading">Grafik Penjualan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={salesData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                                <XAxis dataKey="month" stroke="#ffffff60" />
                                <YAxis stroke="#ffffff60" tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#1a1a1a",
                                        border: "1px solid #ffffff20",
                                        borderRadius: "8px",
                                    }}
                                    labelStyle={{ color: "#ffffff" }}
                                    formatter={(value: number) => [`Rp ${(value / 1000000).toFixed(1)}M`, "Revenue"]}
                                />
                                <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: "#8b5cf6" }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Events List */}
                <Card className="border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md">
                    <CardHeader>
                        <CardTitle className="text-white font-heading">Acara Saya</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {mockEvents.map((event) => (
                                <div
                                    key={event.id}
                                    className="p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
                                    onClick={() => setSelectedEvent(event)}
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-subheading font-semibold text-white">{event.name}</h3>
                                                <Badge
                                                    className={
                                                        event.status === "verified"
                                                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                                                            : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                                    }
                                                >
                                                    {event.status === "verified" ? (
                                                        <>
                                                            <CheckCircle className="h-3 w-3 mr-1" />
                                                            Terverifikasi
                                                        </>
                                                    ) : (
                                                        <>
                                                            <AlertCircle className="h-3 w-3 mr-1" />
                                                            Belum Terverifikasi
                                                        </>
                                                    )}
                                                </Badge>
                                            </div>
                                            <div className="flex flex-wrap gap-4 text-sm text-gray-400 font-body">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4" />
                                                    {event.date}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="h-4 w-4" />
                                                    {event.location}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-6">
                                            <div>
                                                <p className="text-xs text-gray-400 font-body mb-1">Likes</p>
                                                <p className="text-lg font-subheading font-semibold text-white flex items-center gap-1">
                                                    <Heart className="h-4 w-4 text-red-400" />
                                                    {event.likes}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 font-body mb-1">Tiket Terjual</p>
                                                <p className="text-lg font-subheading font-semibold text-white">
                                                    {event.ticketsSold}/{event.totalTickets}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 font-body mb-1">Pendapatan Bruto</p>
                                                <p className="text-lg font-subheading font-semibold text-green-400">
                                                    Rp {(event.financials.grossRevenue / 1000000).toFixed(1)}M
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 font-body mb-1">Status Pajak</p>
                                                <Badge
                                                    className={
                                                        event.taxPaid
                                                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                                                            : "bg-red-500/20 text-red-400 border-red-500/30"
                                                    }
                                                >
                                                    {event.taxPaid ? "Lunas" : "Belum Bayar"}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Financial Breakdown */}
                                    {selectedEvent?.id === event.id && (
                                        <div className="mt-4 pt-4 border-t border-white/10">
                                            <h4 className="text-sm font-subheading font-semibold text-white mb-3">Laporan Keuangan</h4>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                                                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                                                    <p className="text-xs text-gray-400 font-body mb-1">Bruto</p>
                                                    <p className="text-sm font-subheading font-semibold text-white">
                                                        Rp {(event.financials.grossRevenue / 1000000).toFixed(1)}M
                                                    </p>
                                                </div>
                                                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                                                    <p className="text-xs text-gray-400 font-body mb-1">Bagian EO</p>
                                                    <p className="text-sm font-subheading font-semibold text-blue-400">
                                                        Rp {(event.financials.eoShare / 1000000).toFixed(1)}M
                                                    </p>
                                                </div>
                                                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                                                    <p className="text-xs text-gray-400 font-body mb-1">Sponsor</p>
                                                    <p className="text-sm font-subheading font-semibold text-purple-400">
                                                        Rp {(event.financials.sponsorShare / 1000000).toFixed(1)}M
                                                    </p>
                                                </div>
                                                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                                                    <p className="text-xs text-gray-400 font-body mb-1">Vendor</p>
                                                    <p className="text-sm font-subheading font-semibold text-orange-400">
                                                        Rp {(event.financials.vendorShare / 1000000).toFixed(1)}M
                                                    </p>
                                                </div>
                                                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                                                    <p className="text-xs text-gray-400 font-body mb-1">Pajak</p>
                                                    <p className="text-sm font-subheading font-semibold text-red-400">
                                                        Rp {(event.financials.taxAmount / 1000000).toFixed(1)}M
                                                    </p>
                                                </div>
                                                <div className="p-3 rounded-lg bg-white/5 border border-green-500/30">
                                                    <p className="text-xs text-gray-400 font-body mb-1">Netto</p>
                                                    <p className="text-sm font-subheading font-semibold text-green-400">
                                                        Rp {(event.financials.netRevenue / 1000000).toFixed(1)}M
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="mt-4 flex gap-3">
                                                <Button
                                                    onClick={() => handleExportReport(event.id)}
                                                    variant="outline"
                                                    className="border-white/20 bg-white/5 hover:bg-white/10 text-white"
                                                >
                                                    <Download className="h-4 w-4 mr-2" />
                                                    Export Laporan
                                                </Button>
                                                {!event.taxPaid && (
                                                    <Button className="bg-gradient-to-b from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 text-white">
                                                        Bayar Pajak
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
