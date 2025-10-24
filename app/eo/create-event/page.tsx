"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, ArrowLeft, Upload, AlertCircle } from "lucide-react"
import type { EventFormData, Partner, TicketCategory } from "@/lib/eo-types"

export default function CreateEventPage() {
  const router = useRouter()
  const [isVerified] = useState(true) // Mock verification status
  const [formData, setFormData] = useState<EventFormData>({
    name: "",
    date: "",
    location: "",
    poster: "",
    description: "",
    minSecondaryFactor: 0.8,
    maxSecondaryFactor: 2.0,
    partners: [],
    maxTicketsPerUser: 5,
    ticketCategories: [],
    taxAllocationPercentage: 5,
  })

  const addPartner = () => {
    const newPartner: Partner = {
      id: Date.now().toString(),
      walletAddress: "",
      shareType: "percentage",
      shareValue: 0,
    }
    setFormData({ ...formData, partners: [...formData.partners, newPartner] })
  }

  const removePartner = (id: string) => {
    setFormData({
      ...formData,
      partners: formData.partners.filter((p) => p.id !== id),
    })
  }

  const updatePartner = (id: string, field: keyof Partner, value: string | number) => {
    setFormData({
      ...formData,
      partners: formData.partners.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    })
  }

  const addTicketCategory = () => {
    const newCategory: TicketCategory = {
      id: Date.now().toString(),
      name: "",
      price: 0,
      description: "",
      quantity: 0,
    }
    setFormData({
      ...formData,
      ticketCategories: [...formData.ticketCategories, newCategory],
    })
  }

  const removeTicketCategory = (id: string) => {
    setFormData({
      ...formData,
      ticketCategories: formData.ticketCategories.filter((c) => c.id !== id),
    })
  }

  const updateTicketCategory = (id: string, field: keyof TicketCategory, value: string | number) => {
    setFormData({
      ...formData,
      ticketCategories: formData.ticketCategories.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock submission
    console.log("Event data:", formData)
    alert("Acara berhasil dibuat!")
    router.push("/eo/dashboard")
  }

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a0a2e] to-[#0a0a0a] flex items-center justify-center p-4">
        <Card className="border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-2xl font-heading text-white mb-2">Akun Belum Terverifikasi</h2>
            <p className="text-gray-400 font-body mb-6">
              Anda harus memverifikasi akun Event Organizer Anda sebelum dapat membuat acara.
            </p>
            <Button
              onClick={() => router.push("/eo/dashboard")}
              className="bg-gradient-to-b from-white via-gray-100 to-gray-300 hover:from-gray-100 hover:to-gray-400 text-black font-subheading font-semibold"
            >
              Kembali ke Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a0a2e] to-[#0a0a0a]">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={() => router.push("/eo/dashboard")}
            variant="outline"
            className="border-white/20 bg-white/5 hover:bg-white/10 text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl sm:text-4xl font-heading text-white mb-2">Buat Acara Baru</h1>
            <p className="text-gray-400 font-body">Isi detail acara Anda untuk mulai menjual tiket</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white font-heading">Informasi Dasar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-white font-subheading">
                  Nama Acara
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                  placeholder="Contoh: Burnout Festival 2025"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date" className="text-white font-subheading">
                    Tanggal Acara
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="location" className="text-white font-subheading">
                    Lokasi Acara
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                    placeholder="Contoh: Gelora Bung Karno, Jakarta"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="poster" className="text-white font-subheading">
                  Poster Acara
                </Label>
                <div className="mt-2 flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-white/20 bg-white/5 hover:bg-white/10 text-white"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Poster
                  </Button>
                  <span className="text-sm text-gray-400 font-body">PNG, JPG hingga 5MB</span>
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-white font-subheading">
                  Deskripsi Acara
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-white/5 border-white/10 text-white min-h-[120px]"
                  placeholder="Jelaskan tentang acara Anda..."
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Secondary Sales Settings */}
          <Card className="border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white font-heading">Pengaturan Pasar Sekunder</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minFactor" className="text-white font-subheading">
                    Faktor Minimum (%)
                  </Label>
                  <Input
                    id="minFactor"
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={formData.minSecondaryFactor}
                    onChange={(e) =>
                      setFormData({ ...formData, minSecondaryFactor: Number.parseFloat(e.target.value) })
                    }
                    className="bg-white/5 border-white/10 text-white"
                  />
                  <p className="text-xs text-gray-400 font-body mt-1">
                    Harga minimum jual ulang: {(formData.minSecondaryFactor * 100).toFixed(0)}% dari harga asli
                  </p>
                </div>

                <div>
                  <Label htmlFor="maxFactor" className="text-white font-subheading">
                    Faktor Maksimum (%)
                  </Label>
                  <Input
                    id="maxFactor"
                    type="number"
                    step="0.1"
                    min="1"
                    value={formData.maxSecondaryFactor}
                    onChange={(e) =>
                      setFormData({ ...formData, maxSecondaryFactor: Number.parseFloat(e.target.value) })
                    }
                    className="bg-white/5 border-white/10 text-white"
                  />
                  <p className="text-xs text-gray-400 font-body mt-1">
                    Harga maksimum jual ulang: {(formData.maxSecondaryFactor * 100).toFixed(0)}% dari harga asli
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="maxTickets" className="text-white font-subheading">
                  Batas Pembelian per User
                </Label>
                <Input
                  id="maxTickets"
                  type="number"
                  min="1"
                  value={formData.maxTicketsPerUser}
                  onChange={(e) => setFormData({ ...formData, maxTicketsPerUser: Number.parseInt(e.target.value) })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            </CardContent>
          </Card>

          {/* Partners Revenue Sharing */}
          <Card className="border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white font-heading">Bagi Hasil Partner</CardTitle>
                <Button
                  type="button"
                  onClick={addPartner}
                  size="sm"
                  variant="outline"
                  className="border-white/20 bg-white/5 hover:bg-white/10 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Partner
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.partners.length === 0 ? (
                <p className="text-gray-400 font-body text-center py-8">
                  Belum ada partner. Klik tombol di atas untuk menambahkan partner.
                </p>
              ) : (
                formData.partners.map((partner, index) => (
                  <div key={partner.id} className="p-4 rounded-lg border border-white/10 bg-white/5 space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                        Partner {index + 1}
                      </Badge>
                      <Button
                        type="button"
                        onClick={() => removePartner(partner.id)}
                        size="sm"
                        variant="ghost"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div>
                      <Label className="text-white font-subheading text-sm">Wallet Address</Label>
                      <Input
                        value={partner.walletAddress}
                        onChange={(e) => updatePartner(partner.id, "walletAddress", e.target.value)}
                        className="bg-white/5 border-white/10 text-white"
                        placeholder="0x..."
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-white font-subheading text-sm">Tipe Bagi Hasil</Label>
                        <select
                          value={partner.shareType}
                          onChange={(e) =>
                            updatePartner(partner.id, "shareType", e.target.value as "percentage" | "fixed")
                          }
                          className="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white"
                        >
                          <option value="percentage">Persentase</option>
                          <option value="fixed">Harga Pasti</option>
                        </select>
                      </div>

                      <div>
                        <Label className="text-white font-subheading text-sm">
                          {partner.shareType === "percentage" ? "Persentase (%)" : "Jumlah (Rp)"}
                        </Label>
                        <Input
                          type="number"
                          min="0"
                          value={partner.shareValue}
                          onChange={(e) => updatePartner(partner.id, "shareValue", Number.parseFloat(e.target.value))}
                          className="bg-white/5 border-white/10 text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Ticket Categories */}
          <Card className="border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white font-heading">Kategori Tiket</CardTitle>
                <Button
                  type="button"
                  onClick={addTicketCategory}
                  size="sm"
                  variant="outline"
                  className="border-white/20 bg-white/5 hover:bg-white/10 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Kategori
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.ticketCategories.length === 0 ? (
                <p className="text-gray-400 font-body text-center py-8">
                  Belum ada kategori tiket. Klik tombol di atas untuk menambahkan kategori.
                </p>
              ) : (
                formData.ticketCategories.map((category, index) => (
                  <div key={category.id} className="p-4 rounded-lg border border-white/10 bg-white/5 space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Kategori {index + 1}</Badge>
                      <Button
                        type="button"
                        onClick={() => removeTicketCategory(category.id)}
                        size="sm"
                        variant="ghost"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-white font-subheading text-sm">Nama Kategori</Label>
                        <Input
                          value={category.name}
                          onChange={(e) => updateTicketCategory(category.id, "name", e.target.value)}
                          className="bg-white/5 border-white/10 text-white"
                          placeholder="Contoh: VIP, Regular"
                        />
                      </div>

                      <div>
                        <Label className="text-white font-subheading text-sm">Harga (Rp)</Label>
                        <Input
                          type="number"
                          min="0"
                          value={category.price}
                          onChange={(e) =>
                            updateTicketCategory(category.id, "price", Number.parseFloat(e.target.value))
                          }
                          className="bg-white/5 border-white/10 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-white font-subheading text-sm">Deskripsi</Label>
                      <Textarea
                        value={category.description}
                        onChange={(e) => updateTicketCategory(category.id, "description", e.target.value)}
                        className="bg-white/5 border-white/10 text-white"
                        placeholder="Jelaskan benefit kategori tiket ini..."
                      />
                    </div>

                    <div>
                      <Label className="text-white font-subheading text-sm">Jumlah Tiket</Label>
                      <Input
                        type="number"
                        min="0"
                        value={category.quantity}
                        onChange={(e) => updateTicketCategory(category.id, "quantity", Number.parseInt(e.target.value))}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Tax Settings */}
          <Card className="border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white font-heading">Pengaturan Pajak</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="tax" className="text-white font-subheading">
                  Persentase Alokasi Dana untuk Pajak (%)
                </Label>
                <Input
                  id="tax"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.taxAllocationPercentage}
                  onChange={(e) =>
                    setFormData({ ...formData, taxAllocationPercentage: Number.parseFloat(e.target.value) })
                  }
                  className="bg-white/5 border-white/10 text-white"
                />
                <p className="text-xs text-gray-400 font-body mt-1">
                  {formData.taxAllocationPercentage}% dari pendapatan bruto akan dialokasikan untuk pajak
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              onClick={() => router.push("/eo/dashboard")}
              variant="outline"
              className="border-white/20 bg-white/5 hover:bg-white/10 text-white"
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-b from-white via-gray-100 to-gray-300 hover:from-gray-100 hover:to-gray-400 text-black font-subheading font-semibold"
            >
              Buat Acara
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
