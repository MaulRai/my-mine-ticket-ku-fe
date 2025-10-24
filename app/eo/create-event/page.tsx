"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, Loader2, ArrowLeft, Upload, Calendar as CalendarIcon, Clock, X, CheckCircle, AlertCircle, AlertTriangle, FileText } from "lucide-react"
import { apiClient } from "@/lib/api"
import { blockchainService } from "@/lib/blockchain"
import Image from "next/image"

interface RevenueBeneficiary {
  address: string
  name: string
  percentage: number
}

type AlertType = 'success' | 'error' | 'warning' | 'info'

interface Alert {
  id: string
  type: AlertType
  title: string
  message: string
}

const convertPercentageToBasisPoints = (percentage: number): number => {
  return Math.round(percentage * 100)
}

const validateTotalPercentage = (percentages: number[]): boolean => {
  const total = percentages.reduce((sum, p) => sum + p, 0)
  return Math.abs(total - 100) < 0.01
}

const uploadToPinata = async (file: File): Promise<string> => {
  const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT

  if (!PINATA_JWT) {
    throw new Error('Pinata JWT not configured')
  }

  const formData = new FormData()
  formData.append('file', file)

  const metadata = JSON.stringify({
    name: file.name,
    keyvalues: {
      type: file.type.startsWith('image/') ? 'event-poster' : 'proposal-attachment',
      uploadedAt: new Date().toISOString()
    }
  })
  formData.append('pinataMetadata', metadata)

  const options = JSON.stringify({
    cidVersion: 1,
  })
  formData.append('pinataOptions', options)

  const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PINATA_JWT}`,
    },
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Failed to upload to IPFS')
  }

  const data = await response.json()
  return `https://bronze-cheerful-barracuda-21.mypinata.cloud/ipfs/${data.IpfsHash}`
}

export default function CreateEventPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploadingPoster, setUploadingPoster] = useState(false)
  const [uploadingAttachments, setUploadingAttachments] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string>("")
  const [posterFile, setPosterFile] = useState<File | null>(null)
  const [posterPreview, setPosterPreview] = useState<string>("")
  const [attachmentFiles, setAttachmentFiles] = useState<File[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    eventDate: "",
    eventTime: "",
    posterUrl: "",
    taxWalletAddress: "",
    attachments: [] as Array<{fileName: string, fileUrl: string, fileType: string, fileSize: number}>
  })
  
  const [beneficiaries, setBeneficiaries] = useState<RevenueBeneficiary[]>([
    { address: "", name: "", percentage: 0 }
  ])

  useEffect(() => {
    checkEOAccess()
  }, [])

  const showAlert = (type: AlertType, title: string, message: string) => {
    const id = Date.now().toString()
    setAlerts(prev => [...prev, { id, type, title, message }])
    setTimeout(() => {
      setAlerts(prev => prev.filter(alert => alert.id !== id))
    }, 5000)
  }

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id))
  }

  const getAlertIcon = (type: AlertType) => {
    switch (type) {
      case 'success': return CheckCircle
      case 'error': return AlertCircle
      case 'warning': return AlertTriangle
      default: return AlertCircle
    }
  }

  const getAlertStyles = (type: AlertType) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200 text-green-900'
      case 'error': return 'bg-red-50 border-red-200 text-red-900'
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-900'
      default: return 'bg-blue-50 border-blue-200 text-blue-900'
    }
  }

  const checkEOAccess = async () => {
    try {
      const { user } = await apiClient.verifyToken()
      
      if (user.role !== 'EO' && user.role !== 'ADMIN') {
        router.push('/events')
        return
      }

      const address = await blockchainService.getCurrentAccount()
      if (!address) {
        router.push('/login')
        return
      }

      setWalletAddress(address)
      setFormData(prev => ({
        ...prev,
        taxWalletAddress: address
      }))
    } catch (err) {
      console.error('EO access error:', err)
      router.push('/login')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handlePosterChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      showAlert('error', 'Invalid File', 'Please upload an image file (PNG or JPG)')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      showAlert('error', 'File Too Large', 'Image must be less than 5MB')
      return
    }

    setPosterFile(file)
    
    const reader = new FileReader()
    reader.onloadend = () => {
      setPosterPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    setUploadingPoster(true)
    try {
      const ipfsUrl = await uploadToPinata(file)
      setFormData(prev => ({ ...prev, posterUrl: ipfsUrl }))
      showAlert('success', 'Upload Successful', 'Poster uploaded to IPFS successfully')
    } catch (error) {
      showAlert('error', 'Upload Failed', 'Failed to upload poster. Please try again.')
      setPosterFile(null)
      setPosterPreview('')
    } finally {
      setUploadingPoster(false)
    }
  }

  const handleAttachmentsChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/png',
      'image/jpeg',
      'image/jpg'
    ]

    const invalidFiles = files.filter(file => !validTypes.includes(file.type))
    if (invalidFiles.length > 0) {
      showAlert('error', 'Invalid File Type', 'Only PDF, Word, Excel, and images are allowed')
      return
    }

    const oversizedFiles = files.filter(file => file.size > 10 * 1024 * 1024)
    if (oversizedFiles.length > 0) {
      showAlert('error', 'File Too Large', 'Each file must be less than 10MB')
      return
    }

    setAttachmentFiles(prev => [...prev, ...files])

    setUploadingAttachments(true)
    try {
      const uploadedAttachments = await Promise.all(
        files.map(async (file) => {
          const ipfsUrl = await uploadToPinata(file)
          return {
            fileName: file.name,
            fileUrl: ipfsUrl,
            fileType: file.type,
            fileSize: file.size
          }
        })
      )

      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...uploadedAttachments]
      }))

      showAlert('success', 'Upload Successful', `${files.length} file(s) uploaded to IPFS`)
    } catch (error) {
      showAlert('error', 'Upload Failed', 'Failed to upload attachments. Please try again.')
    } finally {
      setUploadingAttachments(false)
    }
  }

  const removeAttachment = (index: number) => {
    setAttachmentFiles(prev => prev.filter((_, i) => i !== index))
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }))
  }

  const handleBeneficiaryChange = (index: number, field: keyof RevenueBeneficiary, value: string | number) => {
    const updated = [...beneficiaries]
    updated[index] = {
      ...updated[index],
      [field]: value
    }
    setBeneficiaries(updated)
  }

  const addBeneficiary = () => {
    setBeneficiaries([
      ...beneficiaries,
      { address: "", name: "", percentage: 0 }
    ])
  }

  const removeBeneficiary = (index: number) => {
    if (beneficiaries.length > 1) {
      setBeneficiaries(beneficiaries.filter((_, i) => i !== index))
    } else {
      showAlert('warning', 'Cannot Remove', 'At least one beneficiary is required')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)

      if (!formData.eventDate || !formData.eventTime) {
        showAlert('error', 'Missing Fields', 'Please select event date and time')
        return
      }

      if (!formData.posterUrl) {
        showAlert('error', 'Missing Poster', 'Please upload an event poster')
        return
      }

      const hasEmptyBeneficiary = beneficiaries.some(b => !b.address)
      if (hasEmptyBeneficiary) {
        showAlert('error', 'Invalid Beneficiaries', 'Please fill in all beneficiary wallet addresses')
        return
      }

      const percentages = beneficiaries.map(b => Number(b.percentage))
      if (!validateTotalPercentage(percentages)) {
        const total = percentages.reduce((sum, p) => sum + p, 0)
        showAlert('warning', 'Invalid Percentages', `Total percentage must equal 100%. Current total: ${total.toFixed(2)}%`)
        return
      }

      const basisPoints = percentages.map(p => convertPercentageToBasisPoints(p))

      const beneficiariesWithBasisPoints = beneficiaries.map((b, index) => ({
        address: b.address,
        name: b.name,
        percentage: basisPoints[index]
      }))

      const eventDateTime = new Date(`${formData.eventDate}T${formData.eventTime}`)

      const response = await apiClient.createEvent({
        name: formData.name,
        description: formData.description,
        location: formData.location,
        date: eventDateTime.toISOString(),
        posterUrl: formData.posterUrl,
        revenueBeneficiaries: beneficiariesWithBasisPoints,
        taxWalletAddress: formData.taxWalletAddress || undefined,
        attachments: formData.attachments
      })

      showAlert('success', 'Event Created', 'Your event has been submitted for admin approval')
      
      setTimeout(() => {
        router.push('/eo/dashboard')
      }, 2000)
    } catch (err: any) {
      console.error('Error creating event:', err)
      showAlert('error', 'Submission Failed', err.message || 'Failed to create event')
    } finally {
      setLoading(false)
    }
  }

  const totalPercentage = beneficiaries.reduce((sum, b) => sum + Number(b.percentage), 0)

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return '📄'
    if (fileType.includes('word')) return '📝'
    if (fileType.includes('sheet') || fileType.includes('excel')) return '📊'
    if (fileType.includes('image')) return '🖼️'
    return '📎'
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-12">
      <div className="fixed top-4 right-4 z-50 space-y-3 max-w-md">
        {alerts.map(alert => {
          const IconComponent = getAlertIcon(alert.type)
          const styles = getAlertStyles(alert.type)
          
          return (
            <div
              key={alert.id}
              className={`${styles} border rounded-lg shadow-lg p-4 flex items-start gap-3 animate-slide-in`}
              style={{
                animation: 'slideIn 0.3s ease-out'
              }}
            >
              <IconComponent className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm mb-1">{alert.title}</h4>
                <p className="text-sm opacity-90">{alert.message}</p>
              </div>
              <button
                onClick={() => removeAlert(alert.id)}
                className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )
        })}
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>

      <div className="container mx-auto px-4 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => router.push('/eo/dashboard')}
          className="mb-6 text-gray-400 hover:text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-heading text-white mb-2">Create New Event</h1>
          <p className="text-gray-400 font-body">Fill in the details to submit your event for approval</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md mb-6">
            <CardContent className="p-6 space-y-6">
              <h2 className="text-xl font-subheading font-semibold text-white">Event Information</h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-white font-subheading mb-2 block">
                    Event Name <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter event name"
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-white font-subheading mb-2 block">
                    Description <span className="text-red-400">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    placeholder="Describe your event"
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <Label htmlFor="location" className="text-white font-subheading mb-2 block">
                    Location <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    placeholder="Event location"
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="eventDate" className="text-white font-subheading mb-2 block">
                      Event Date <span className="text-red-400">*</span>
                    </Label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      <Input
                        id="eventDate"
                        name="eventDate"
                        type="date"
                        value={formData.eventDate}
                        onChange={handleInputChange}
                        required
                        min={new Date().toISOString().split('T')[0]}
                        className="pl-10 bg-white/5 border-white/20 text-white [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-50"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="eventTime" className="text-white font-subheading mb-2 block">
                      Event Time <span className="text-red-400">*</span>
                    </Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      <Input
                        id="eventTime"
                        name="eventTime"
                        type="time"
                        value={formData.eventTime}
                        onChange={handleInputChange}
                        required
                        className="pl-10 bg-white/5 border-white/20 text-white [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-50"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="posterFile" className="text-white font-subheading mb-2 block">
                    Event Poster <span className="text-red-400">*</span>
                  </Label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <label htmlFor="posterFile" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border-2 border-dashed border-white/20 hover:border-white/40 transition-colors">
                          <Upload className="h-5 w-5 text-gray-400" />
                          <div className="flex-1">
                            <p className="text-sm text-white font-medium">
                              {posterFile ? posterFile.name : 'Click to upload poster'}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              PNG, JPG up to 5MB
                            </p>
                          </div>
                          {uploadingPoster && (
                            <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />
                          )}
                        </div>
                        <input
                          id="posterFile"
                          type="file"
                          accept="image/png,image/jpeg,image/jpg"
                          onChange={handlePosterChange}
                          className="hidden"
                          disabled={uploadingPoster}
                        />
                      </label>
                    </div>
                    
                    {posterPreview && (
                      <div className="relative w-full h-48 rounded-lg overflow-hidden border border-white/10">
                        <Image
                          src={posterPreview}
                          alt="Poster preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    {formData.posterUrl && (
                      <p className="text-xs text-green-400">
                        ✓ Uploaded to IPFS: {formData.posterUrl.substring(0, 50)}...
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="attachmentFiles" className="text-white font-subheading mb-2 block">
                    Proposal Attachments
                  </Label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <label htmlFor="attachmentFiles" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border-2 border-dashed border-white/20 hover:border-white/40 transition-colors">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <div className="flex-1">
                            <p className="text-sm text-white font-medium">
                              Click to upload attachments
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              PDF, Word, Excel, Images up to 10MB each
                            </p>
                          </div>
                          {uploadingAttachments && (
                            <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />
                          )}
                        </div>
                        <input
                          id="attachmentFiles"
                          type="file"
                          multiple
                          accept=".pdf,.doc,.docx,.xls,.xlsx,image/png,image/jpeg,image/jpg"
                          onChange={handleAttachmentsChange}
                          className="hidden"
                          disabled={uploadingAttachments}
                        />
                      </label>
                    </div>

                    {formData.attachments.length > 0 && (
                      <div className="space-y-2">
                        {formData.attachments.map((attachment, index) => (
                          <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <span className="text-2xl">{getFileIcon(attachment.fileType)}</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-white font-medium truncate">{attachment.fileName}</p>
                                <p className="text-xs text-gray-400">{formatFileSize(attachment.fileSize)}</p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAttachment(index)}
                              className="text-red-400 hover:bg-red-500/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="taxWalletAddress" className="text-white font-subheading mb-2 block">
                    Tax Wallet Address <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="taxWalletAddress"
                    name="taxWalletAddress"
                    value={formData.taxWalletAddress}
                    onChange={handleInputChange}
                    required
                    placeholder="0x..."
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 font-mono"
                  />
                  <p className="text-xs text-gray-500 mt-1">10% of revenue will go to this address</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md mb-6">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-subheading font-semibold text-white">Revenue Distribution</h2>
                  <p className="text-sm text-gray-400 mt-1">Total must equal 100%</p>
                </div>
                <Button
                  type="button"
                  onClick={addBeneficiary}
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Beneficiary
                </Button>
              </div>

              <div className="space-y-4">
                {beneficiaries.map((beneficiary, index) => (
                  <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <h3 className="text-white font-subheading font-semibold">Beneficiary #{index + 1}</h3>
                      {beneficiaries.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeBeneficiary(index)}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:bg-red-500/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <Label className="text-white font-body text-sm mb-2 block">
                          Wallet Address <span className="text-red-400">*</span>
                        </Label>
                        <Input
                          value={beneficiary.address}
                          onChange={(e) => handleBeneficiaryChange(index, 'address', e.target.value)}
                          required
                          placeholder="0x..."
                          className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 font-mono text-sm"
                        />
                      </div>

                      <div>
                        <Label className="text-white font-body text-sm mb-2 block">
                          Percentage (%) <span className="text-red-400">*</span>
                        </Label>
                        <Input
                          type="number"
                          value={beneficiary.percentage || ''}
                          onChange={(e) => handleBeneficiaryChange(index, 'percentage', Number(e.target.value))}
                          required
                          min="0"
                          max="100"
                          step="0.01"
                          placeholder="0-100"
                          className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Will convert to {convertPercentageToBasisPoints(beneficiary.percentage)} BP
                        </p>
                      </div>

                      <div className="md:col-span-3">
                        <Label className="text-white font-body text-sm mb-2 block">
                          Name (Optional)
                        </Label>
                        <Input
                          value={beneficiary.name}
                          onChange={(e) => handleBeneficiaryChange(index, 'name', e.target.value)}
                          placeholder="Beneficiary name"
                          className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <div className="flex items-center justify-between">
                  <span className="text-blue-400 font-subheading font-semibold">Total Percentage:</span>
                  <span className={`text-lg font-heading ${
                    totalPercentage === 100 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {totalPercentage.toFixed(2)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              type="button"
              onClick={() => router.push('/eo/dashboard')}
              variant="outline"
              className="flex-1 border-white/20 text-white hover:bg-white/10"
              disabled={loading || uploadingPoster}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || uploadingPoster}
              className="flex-1 bg-gradient-to-b from-blue-500 via-blue-600 to-blue-700 hover:from-blue-400 hover:to-blue-600 text-white font-subheading font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Event'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}