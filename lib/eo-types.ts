// Types for Event Organizer (EO) features

export interface Partner {
  id: string
  walletAddress: string
  shareType: "percentage" | "fixed"
  shareValue: number // percentage (0-100) or fixed amount in IDR
}

export interface TicketCategory {
  id: string
  name: string
  price: number
  description: string
  quantity: number
  sold?: number
}

export interface EventFormData {
  name: string
  date: string
  location: string
  poster: string | File
  description: string
  minSecondaryFactor: number // minimum multiplier for resale (e.g., 0.8 = 80% of original)
  maxSecondaryFactor: number // maximum multiplier for resale (e.g., 2.0 = 200% of original)
  partners: Partner[]
  maxTicketsPerUser: number
  ticketCategories: TicketCategory[]
  taxAllocationPercentage: number
}

export interface EventFinancials {
  grossRevenue: number
  eoShare: number
  sponsorShare: number
  vendorShare: number
  taxAmount: number
  netRevenue: number
}

export interface EventStats {
  id: number
  name: string
  status: "verified" | "unverified"
  likes: number
  ticketsSold: number
  totalTickets: number
  financials: EventFinancials
  taxPaid: boolean
  date: string
  location: string
}
