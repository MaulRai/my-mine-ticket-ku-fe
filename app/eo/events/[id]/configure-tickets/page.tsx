"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react"
import { apiClient, type Event, type TicketType, EventStatus } from "@/lib/api"

interface TicketTypeForm {
  id?: string
  name: string
  description: string
  price: string
  stock: string
  saleStartDate: string
  saleEndDate: string
  benefits: string
}

type AlertType = 'success' | 'error' | 'warning' | 'info'

interface Alert {
  id: string
  type: AlertType
  title: string
  message: string
}

export default function ConfigureTicketsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [event, setEvent] = useState<Event | null>(null)
  const [ticketForms, setTicketForms] = useState<TicketTypeForm[]>([
    {
      name: "",
      description: "",
      price: "",
      stock: "",
      saleStartDate: "",
      saleEndDate: "",
      benefits: ""
    }
  ])
  const [alerts, setAlerts] = useState<Alert[]>([])

  useEffect(() => {
    checkEOAccess()
  }, [])

  const checkEOAccess = async () => {
    try {
      const { user } = await apiClient.verifyToken()
      
      if (user.role !== 'EO' && user.role !== 'ADMIN') {
        router.push('/events')
        return
      }
      
      await fetchEventDetail()
    } catch (err: any) {
      console.error('EO access error:', err)
      showAlert('error', 'Access Denied', err.message)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const fetchEventDetail = async () => {
    try {
      const data = await apiClient.getEventById(id)
      setEvent(data)

      if (data.status !== EventStatus.APPROVED && data.status !== EventStatus.ACTIVE) {
        showAlert('error', 'Event Not Approved', 'Event harus disetujui admin terlebih dahulu sebelum mengkonfigurasi tiket')
        setTimeout(() => router.push('/eo/dashboard'), 2000)
        return
      }

      if (data.ticketTypes && data.ticketTypes.length > 0) {
        setTicketForms(data.ticketTypes.map(type => ({
          id: type.id,
          name: type.name,
          description: type.description || "",
          price: (parseFloat(type.price) / 1e18).toString(),
          stock: type.stock.toString(),
          saleStartDate: type.saleStartDate.split('.')[0],
          saleEndDate: type.saleEndDate.split('.')[0],
          benefits: type.benefits ? JSON.stringify(type.benefits, null, 2) : ""
        })))
      }
    } catch (err: any) {
      console.error('Error fetching event:', err)
      showAlert('error', 'Error', err.message)
    }
  }

  const showAlert = (type: AlertType, title: string, message: string) => {
    const newAlert = { id: Date.now().toString(), type, title, message }
    setAlerts(prev => [...prev, newAlert])
    setTimeout(() => removeAlert(newAlert.id), 5000)
  }

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id))
  }

  const getAlertIcon = (type: AlertType) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5" />
      case 'error': return <XCircle className="h-5 w-5" />
      case 'warning': return <AlertCircle className="h-5 w-5" />
      default: return <AlertCircle className="h-5 w-5" />
    }
  }

  const addTicketForm = () => {
    setTicketForms([...ticketForms, {
      name: "",
      description: "",
      price: "",
      stock: "",
      saleStartDate: "",
      saleEndDate: "",
      benefits: ""
    }])
  }

  const removeTicketForm = (index: number) => {
    setTicketForms(ticketForms.filter((_, i) => i !== index))
  }

  const updateTicketForm = (index: number, field: keyof TicketTypeForm, value: string) => {
    const updated = [...ticketForms]
    updated[index] = { ...updated[index], [field]: value }
    setTicketForms(updated)
  }

  const validateForm = () => {
    for (let i = 0; i < ticketForms.length; i++) {
      const form = ticketForms[i]
      
      if (!form.name.trim()) {
        showAlert('error', 'Validation Error', `Ticket ${i + 1}: Nama tiket harus diisi`)
        return false
      }
      
      if (!form.price || parseFloat(form.price) <= 0) {
        showAlert('error', 'Validation Error', `Ticket ${i + 1}: Harga harus lebih dari 0`)
        return false
      }
      
      if (!form.stock || parseInt(form.stock) <= 0) {
        showAlert('error', 'Validation Error', `Ticket ${i + 1}: Stok harus lebih dari 0`)
        return false
      }
      
      if (!form.saleStartDate) {
        showAlert('error', 'Validation Error', `Ticket ${i + 1}: Tanggal mulai penjualan harus diisi`)
        return false
      }
      
      if (!form.saleEndDate) {
        showAlert('error', 'Validation Error', `Ticket ${i + 1}: Tanggal akhir penjualan harus diisi`)
        return false
      }
      
      if (new Date(form.saleStartDate) >= new Date(form.saleEndDate)) {
        showAlert('error', 'Validation Error', `Ticket ${i + 1}: Tanggal akhir penjualan harus setelah tanggal mulai`)
        return false
      }

      if (form.benefits) {
        try {
          JSON.parse(form.benefits)
        } catch {
          showAlert('error', 'Validation Error', `Ticket ${i + 1}: Format benefits tidak valid (harus JSON)`)
          return false
        }
      }
    }
    
    return true
  }

  const handleSave = async () => {
    if (!validateForm()) return

    setSaving(true)
    try {
      const promises = ticketForms.map(async (form) => {
        const priceInWei = (parseFloat(form.price) * 1e18).toString()
        
        const data = {
          name: form.name,
          description: form.description || undefined,
          price: priceInWei,
          stock: parseInt(form.stock),
          saleStartDate: form.saleStartDate,
          saleEndDate: form.saleEndDate,
          benefits: form.benefits ? JSON.parse(form.benefits) : undefined
        }

        if (form.id) {
          return apiClient.updateTicketType(form.id, data)
        } else {
          return apiClient.addTicketType(id, data)
        }
      })

      await Promise.all(promises)
      
      showAlert('success', 'Success', 'Konfigurasi tiket berhasil disimpan')
      
      setTimeout(() => {
        router.push('/eo/dashboard')
      }, 1500)
    } catch (err: any) {
      console.error('Error saving tickets:', err)
      showAlert('error', 'Error', err.message || 'Gagal menyimpan konfigurasi tiket')
    } finally {
      setSaving(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-12 flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-white animate-spin" />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <Card className="border-white/10 bg-linear-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md">
            <CardContent className="p-12 text-center">
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <p className="text-gray-400 font-body">Event tidak ditemukan</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="fixed top-24 right-8 z-50 space-y-2 max-w-md">
          {alerts.map(alert => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border backdrop-blur-md animate-in slide-in-from-right ${
                alert.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
                alert.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                alert.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' :
                'bg-blue-500/10 border-blue-500/30 text-blue-400'
              }`}
            >
              <div className="flex items-start gap-3">
                {getAlertIcon(alert.type)}
                <div className="flex-1">
                  <p className="font-subheading font-semibold text-sm mb-1">{alert.title}</p>
                  <p className="font-body text-xs">{alert.message}</p>
                </div>
                <button
                  onClick={() => removeAlert(alert.id)}
                  className="text-current hover:opacity-70 transition-opacity"
                >
                  <XCircle className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <Link href="/eo/dashboard">
            <Button variant="ghost" className="text-white hover:text-white/80">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Dashboard
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-heading text-white mb-2">Konfigurasi Tiket</h1>
          <p className="text-gray-400 font-body mb-4">{event.name}</p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="font-body">{event.location}</span>
              <span>•</span>
              <span className="font-body">{formatDate(event.date)}</span>
            </div>
            <Badge className={
              event.status === EventStatus.APPROVED 
                ? 'bg-green-500/20 text-green-400 border-green-500/30'
                : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
            }>
              {event.status}
            </Badge>
          </div>
        </div>

        <div className="space-y-6 mb-8">
          {ticketForms.map((form, index) => (
            <Card key={index} className="border-white/10 bg-linear-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white font-subheading">
                    Jenis Tiket {index + 1}
                    {form.id && (
                      <Badge className="ml-3 bg-blue-500/20 text-blue-400 border-blue-500/30">
                        Existing
                      </Badge>
                    )}
                  </CardTitle>
                  {ticketForms.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTicketForm(index)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`name-${index}`} className="text-gray-300 font-body">
                      Nama Tiket *
                    </Label>
                    <Input
                      id={`name-${index}`}
                      value={form.name}
                      onChange={(e) => updateTicketForm(index, 'name', e.target.value)}
                      placeholder="contoh: VIP, Regular, Early Bird"
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`price-${index}`} className="text-gray-300 font-body">
                      Harga (ETH) *
                    </Label>
                    <Input
                      id={`price-${index}`}
                      type="number"
                      step="0.0001"
                      value={form.price}
                      onChange={(e) => updateTicketForm(index, 'price', e.target.value)}
                      placeholder="0.15"
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor={`description-${index}`} className="text-gray-300 font-body">
                    Deskripsi
                  </Label>
                  <Textarea
                    id={`description-${index}`}
                    value={form.description}
                    onChange={(e) => updateTicketForm(index, 'description', e.target.value)}
                    placeholder="Deskripsi singkat tentang jenis tiket ini"
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 min-h-20"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`stock-${index}`} className="text-gray-300 font-body">
                      Stok *
                    </Label>
                    <Input
                      id={`stock-${index}`}
                      type="number"
                      value={form.stock}
                      onChange={(e) => updateTicketForm(index, 'stock', e.target.value)}
                      placeholder="1000"
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-300 font-body">
                      Status
                    </Label>
                    <div className="h-10 flex items-center">
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        Aktif
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`saleStartDate-${index}`} className="text-gray-300 font-body">
                      Tanggal Mulai Penjualan *
                    </Label>
                    <Input
                      id={`saleStartDate-${index}`}
                      type="datetime-local"
                      value={form.saleStartDate}
                      onChange={(e) => updateTicketForm(index, 'saleStartDate', e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`saleEndDate-${index}`} className="text-gray-300 font-body">
                      Tanggal Akhir Penjualan *
                    </Label>
                    <Input
                      id={`saleEndDate-${index}`}
                      type="datetime-local"
                      value={form.saleEndDate}
                      onChange={(e) => updateTicketForm(index, 'saleEndDate', e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor={`benefits-${index}`} className="text-gray-300 font-body">
                    Benefits (JSON Format)
                  </Label>
                  <Textarea
                    id={`benefits-${index}`}
                    value={form.benefits}
                    onChange={(e) => updateTicketForm(index, 'benefits', e.target.value)}
                    placeholder='{"access": ["VIP Lounge", "Fast Track"], "perks": ["Free Drink", "Merchandise"]}'
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 font-mono text-xs min-h-24"
                  />
                  <p className="text-gray-500 text-xs mt-1 font-body">
                    Opsional: Masukkan benefits dalam format JSON. Contoh: {`{"access": ["VIP Area"], "perks": ["Free drink"]}`}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={addTicketForm}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10 font-subheading"
          >
            <Plus className="h-4 w-4 mr-2" />
            Tambah Jenis Tiket
          </Button>

          <div className="flex gap-3">
            <Link href="/eo/dashboard">
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 font-subheading"
              >
                Batal
              </Button>
            </Link>
            
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white font-subheading font-semibold"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Simpan Konfigurasi
                </>
              )}
            </Button>
          </div>
        </div>

        <Card className="border-white/10 bg-linear-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-md">
          <CardContent className="p-6">
            <h3 className="text-white font-subheading font-semibold mb-3 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Catatan Penting
            </h3>
            <ul className="space-y-2 text-gray-300 font-body text-sm">
              <li>• Semua field yang ditandai dengan * wajib diisi</li>
              <li>• Harga tiket dalam satuan ETH (contoh: 0.15 ETH)</li>
              <li>• Tanggal akhir penjualan harus setelah tanggal mulai penjualan</li>
              <li>• Stok tiket harus lebih dari 0</li>
              <li>• Benefits bersifat opsional dan harus dalam format JSON yang valid</li>
              <li>• Setelah disimpan, tiket akan tersedia untuk dijual sesuai tanggal yang ditentukan</li>
              <li>• Event harus dalam status APPROVED sebelum dapat mengkonfigurasi tiket</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
