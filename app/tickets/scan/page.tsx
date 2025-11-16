"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  Camera, 
  X, 
  Check, 
  AlertCircle, 
  History,
  Keyboard,
  RotateCcw,
  ChevronDown,
  User,
  Ticket,
  ArrowLeft
} from "lucide-react"

// Mock ticket data for demo
const mockTickets = [
  { id: "NFT-23A91F8C4D2E", name: "John Doe", type: "VIP", status: "unused" },
  { id: "NFT-7B5E9A1C3F6D", name: "Jane Smith", type: "Regular", status: "unused" },
  { id: "NFT-4D8F2A6B9E1C", name: "Bob Wilson", type: "VIP", status: "used" },
  { id: "NFT-9C3E7F1A5B8D", name: "Alice Brown", type: "Regular", status: "unused" },
]

type ScanStatus = "ready" | "scanning" | "success" | "error" | "already-used"

interface ScannedTicket {
  id: string
  name: string
  type: string
  timestamp: string
}

export default function TicketScanPage() {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [scanStatus, setScanStatus] = useState<ScanStatus>("ready")
  const [scannedTicket, setScannedTicket] = useState<ScannedTicket | null>(null)
  const [recentScans, setRecentScans] = useState<ScannedTicket[]>([])
  const [totalScanned, setTotalScanned] = useState(45)
  const [totalTickets] = useState(200)
  const [showHistory, setShowHistory] = useState(false)
  const [showManualEntry, setShowManualEntry] = useState(false)
  const [manualTicketId, setManualTicketId] = useState("")
  const [cameraReady, setCameraReady] = useState(false)

  // Hide navbar on this page
  useEffect(() => {
    const navbar = document.querySelector('nav')
    if (navbar instanceof HTMLElement) {
      navbar.style.display = 'none'
    }

    return () => {
      if (navbar instanceof HTMLElement) {
        navbar.style.display = ''
      }
    }
  }, [])

  // Initialize camera
  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "environment" } 
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          setCameraReady(true)
        }
      } catch (error) {
        console.error("Camera error:", error)
        setScanStatus("error")
      }
    }

    initCamera()

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  // Simulate QR scanning
  const simulateScan = () => {
    if (scanStatus === "scanning") return
    
    setScanStatus("scanning")
    
    setTimeout(() => {
      // Randomly pick a ticket for demo
      const randomTicket = mockTickets[Math.floor(Math.random() * mockTickets.length)]
      
      if (randomTicket.status === "used") {
        setScanStatus("already-used")
        setScannedTicket({
          id: randomTicket.id,
          name: randomTicket.name,
          type: randomTicket.type,
          timestamp: new Date().toLocaleTimeString("id-ID", { 
            hour: "2-digit", 
            minute: "2-digit" 
          })
        })
      } else {
        setScanStatus("success")
        setScannedTicket({
          id: randomTicket.id,
          name: randomTicket.name,
          type: randomTicket.type,
          timestamp: new Date().toLocaleTimeString("id-ID", { 
            hour: "2-digit", 
            minute: "2-digit" 
          })
        })
      }
    }, 1000)
  }

  const handleConfirmEntry = () => {
    if (scannedTicket) {
      setRecentScans(prev => [scannedTicket, ...prev.slice(0, 4)])
      setTotalScanned(prev => prev + 1)
      
      // Haptic feedback if supported
      if (navigator.vibrate) {
        navigator.vibrate(200)
      }
    }
    
    resetScan()
  }

  const resetScan = () => {
    setScanStatus("ready")
    setScannedTicket(null)
  }

  const handleManualEntry = () => {
    if (!manualTicketId.trim()) return
    
    const ticket = mockTickets.find(t => t.id === manualTicketId)
    
    if (ticket) {
      if (ticket.status === "used") {
        setScanStatus("already-used")
      } else {
        setScanStatus("success")
      }
      setScannedTicket({
        id: ticket.id,
        name: ticket.name,
        type: ticket.type,
        timestamp: new Date().toLocaleTimeString("id-ID", { 
          hour: "2-digit", 
          minute: "2-digit" 
        })
      })
    } else {
      setScanStatus("error")
      setScannedTicket({
        id: manualTicketId,
        name: "Unknown",
        type: "N/A",
        timestamp: new Date().toLocaleTimeString("id-ID", { 
          hour: "2-digit", 
          minute: "2-digit" 
        })
      })
    }
    
    setShowManualEntry(false)
    setManualTicketId("")
  }

  const getStatusConfig = () => {
    switch (scanStatus) {
      case "ready":
        return {
          text: "Siap Memindai",
          icon: Camera,
          color: "bg-blue-500/20 text-blue-400 border-blue-500/30"
        }
      case "scanning":
        return {
          text: "Memindai...",
          icon: Camera,
          color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30 animate-pulse"
        }
      case "success":
        return {
          text: "Tiket Valid ✓",
          icon: Check,
          color: "bg-green-500/20 text-green-400 border-green-500/30"
        }
      case "already-used":
        return {
          text: "Tiket Sudah Digunakan",
          icon: AlertCircle,
          color: "bg-orange-500/20 text-orange-400 border-orange-500/30"
        }
      case "error":
        return {
          text: "Tiket Tidak Valid ✗",
          icon: X,
          color: "bg-red-500/20 text-red-400 border-red-500/30"
        }
    }
  }

  const statusConfig = getStatusConfig()
  const StatusIcon = statusConfig.icon

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Compact Header */}
      <div className="bg-gradient-to-b from-gray-900 to-gray-950 border-b border-white/10 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              onClick={() => router.push('/eo/dashboard')}
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/10 -ml-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Ticket className="h-5 w-5 text-blue-400" />
            <span className="text-white font-subheading font-semibold text-sm truncate max-w-[150px]">
              Neon Waves Festival
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-white/10 text-white border-white/20 font-mono text-xs">
              {totalScanned}/{totalTickets}
            </Badge>
            <span className="text-gray-400 text-xs font-mono">
              {new Date().toLocaleTimeString("id-ID", { 
                hour: "2-digit", 
                minute: "2-digit" 
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-4">
        {/* Camera Frame */}
        <div className="relative w-full aspect-[3/4] max-h-[60vh] mb-4 rounded-2xl overflow-hidden bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          
          {/* Scanning Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-64 h-64">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-blue-500" />
              <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-blue-500" />
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-blue-500" />
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-blue-500" />
              
              {/* Scanning line */}
              {scanStatus === "scanning" && (
                <div className="absolute inset-x-0 h-1 bg-blue-500 animate-scan" />
              )}
            </div>
          </div>

          {/* Camera Ready Indicator */}
          {!cameraReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80">
              <div className="text-center">
                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2 animate-pulse" />
                <p className="text-gray-400 text-sm">Mengaktifkan kamera...</p>
              </div>
            </div>
          )}
        </div>

        {/* Status Badge */}
        <div className="flex justify-center mb-4">
          <Badge className={`font-subheading font-semibold text-sm px-4 py-2 ${statusConfig.color}`}>
            <StatusIcon className="h-4 w-4 mr-2" />
            {statusConfig.text}
          </Badge>
        </div>

        {/* Demo Scan Button (Remove in production) */}
        {scanStatus === "ready" && (
          <Button
            onClick={simulateScan}
            className="w-full mb-4 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Simulasi Pindai (Demo)
          </Button>
        )}

        {/* Ticket Info Card (Slides up after scan) */}
        {scannedTicket && scanStatus !== "ready" && (
          <Card className={`border-white/10 bg-gradient-to-br from-gray-900/95 to-gray-950/95 backdrop-blur-md mb-4 transition-all duration-300 ${
            scanStatus === "success" ? "border-green-500/30" :
            scanStatus === "already-used" ? "border-orange-500/30" :
            "border-red-500/30"
          }`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  scanStatus === "success" ? "bg-green-500/20" :
                  scanStatus === "already-used" ? "bg-orange-500/20" :
                  "bg-red-500/20"
                }`}>
                  <User className={`h-6 w-6 ${
                    scanStatus === "success" ? "text-green-400" :
                    scanStatus === "already-used" ? "text-orange-400" :
                    "text-red-400"
                  }`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-subheading font-bold text-lg mb-1">
                    {scannedTicket.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Badge className={`text-xs font-body ${
                      scannedTicket.type === "VIP" 
                        ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                        : "bg-blue-500/20 text-blue-300 border-blue-500/40"
                    }`}>
                      {scannedTicket.type}
                    </Badge>
                    <span className="text-gray-400 text-xs font-mono">
                      {scannedTicket.timestamp}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs font-mono mt-1">
                    {scannedTicket.id}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                {scanStatus === "success" && (
                  <Button
                    onClick={handleConfirmEntry}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-subheading font-semibold"
                  >
                    <Check className="h-5 w-5 mr-2" />
                    Konfirmasi Masuk
                  </Button>
                )}
                <Button
                  onClick={resetScan}
                  variant="outline"
                  className={`${scanStatus === "success" ? "w-auto" : "flex-1"} border-white/20 text-white hover:bg-white/10`}
                >
                  <X className="h-5 w-5 mr-2" />
                  {scanStatus === "success" ? "Batal" : "Pindai Lagi"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Scans Drawer */}
      {showHistory && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setShowHistory(false)}>
          <div 
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-b from-gray-900 to-gray-950 border-t border-white/10 rounded-t-2xl p-4 max-h-[60vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-1.5 bg-gray-700 rounded-full mx-auto mb-4" />
            <h3 className="text-white font-subheading font-semibold text-lg mb-4">
              Pemindaian Terakhir
            </h3>
            <div className="space-y-2">
              {recentScans.length === 0 ? (
                <p className="text-gray-400 text-center py-8">Belum ada pemindaian</p>
              ) : (
                recentScans.map((scan, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                    <div>
                      <p className="text-white font-subheading font-semibold text-sm">
                        {scan.name}
                      </p>
                      <p className="text-gray-400 text-xs">{scan.type}</p>
                    </div>
                    <span className="text-gray-400 text-xs font-mono">{scan.timestamp}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Manual Entry Modal */}
      {showManualEntry && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowManualEntry(false)}>
          <Card 
            className="w-full max-w-md border-white/10 bg-gradient-to-br from-gray-900 to-gray-950"
            onClick={(e) => e.stopPropagation()}
          >
            <CardContent className="p-6">
              <h3 className="text-white font-subheading font-semibold text-lg mb-4">
                Input Manual Kode Tiket
              </h3>
              <Input
                value={manualTicketId}
                onChange={(e) => setManualTicketId(e.target.value)}
                placeholder="NFT-XXXXXXXXXXXX"
                className="mb-4 bg-white/5 border-white/20 text-white font-mono"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleManualEntry}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Verifikasi
                </Button>
                <Button
                  onClick={() => setShowManualEntry(false)}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Batal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="sticky bottom-0 bg-gradient-to-t from-gray-950 to-gray-900 border-t border-white/10 p-4">
        <div className="flex items-center justify-center gap-2">
          <Button
            onClick={resetScan}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-subheading font-semibold h-12"
            disabled={scanStatus === "scanning"}
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            Pindai Lagi
          </Button>
          <Button
            onClick={() => setShowManualEntry(true)}
            variant="outline"
            className="h-12 w-12 border-white/20 text-white hover:bg-white/10"
          >
            <Keyboard className="h-5 w-5" />
          </Button>
          <Button
            onClick={() => setShowHistory(true)}
            variant="outline"
            className="h-12 w-12 border-white/20 text-white hover:bg-white/10 relative"
          >
            <History className="h-5 w-5" />
            {recentScans.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {recentScans.length}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Scanning Animation Styles */}
      <style jsx>{`
        @keyframes scan {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }
        .animate-scan {
          animation: scan 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
