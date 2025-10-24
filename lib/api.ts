const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export enum Role {
  ADMIN = 'ADMIN',
  EO = 'EO',
  USER = 'USER'
}

export enum EventStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  ACTIVE = 'ACTIVE',
  ENDED = 'ENDED',
  CANCELLED = 'CANCELLED'
}

export enum ProposalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum TransactionType {
  PURCHASE = 'PURCHASE',
  RESALE_BUY = 'RESALE_BUY',
  USE = 'USE'
}

export interface User {
  id: string;
  username?: string;
  email?: string;
  walletAddress?: string;
  role: Role;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface NonceResponse {
  message: string;
  nonce: number;
  timestamp: number;
}

export interface Event {
  id: string;
  eventId: number;
  name: string;
  description: string;
  location: string;
  date: string;
  posterUrl?: string;
  status: EventStatus;
  creatorId: string;
  creator?: User;
  createdAt: string;
  updatedAt: string;
  ticketTypes?: TicketType[];
  proposals?: Proposal[];
  tickets?: Ticket[];
}

export interface TicketType {
  id: string;
  typeId: number;
  eventId: string;
  event?: Event;
  name: string;
  description?: string;
  price: string;
  stock: number;
  sold: number;
  saleStartDate: string;
  saleEndDate: string;
  benefits?: any;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  tickets?: Ticket[];
}

export interface Proposal {
  id: string;
  eventId: string;
  event?: Event;
  creatorId: string;
  creator?: User;
  revenueBeneficiaries: Array<{
    address: string;
    name?: string;
    percentage: number;
  }>;
  taxWalletAddress: string;
  status: ProposalStatus;
  adminComment?: string;
  submittedAt: string;
  reviewedAt?: string;
}

export interface Ticket {
  id: string;
  ticketId: number;
  eventId: string;
  event?: Event;
  typeId: string;
  ticketType?: TicketType;
  ownerId: string;
  owner?: User;
  txHash: string;
  blockNumber: number;
  originalPrice: string;
  isUsed: boolean;
  isForResale: boolean;
  resalePrice?: string;
  resaleDeadline?: string;
  resaleCount: number;
  qrCode: string;
  tokenURI?: string;
  mintedAt: string;
  usedAt?: string;
  createdAt: string;
  updatedAt: string;
  transactions?: Transaction[];
}

export interface Transaction {
  id: string;
  txHash: string;
  userId: string;
  user?: User;
  type: TransactionType;
  from: string;
  to?: string;
  amount: string;
  eventId?: string;
  event?: Event;
  ticketId?: string;
  ticket?: Ticket;
  blockNumber: number;
  timestamp: string;
  createdAt: string;
}

export interface AdminStats {
  totalEvents: number;
  activeEvents: number;
  totalTicketsSold: number;
  totalRevenue: string;
  recentTransactions: Transaction[];
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(this.token ? { 'Authorization': `Bearer ${this.token}` } : {}),
        ...(options?.headers as Record<string, string>),
      };

      console.log('API Request:', {
        url,
        method: options?.method || 'GET',
        hasToken: !!this.token,
        tokenPreview: this.token ? `${this.token.substring(0, 20)}...` : 'none',
        headers: {
          ...headers,
          Authorization: headers.Authorization ? `Bearer ${headers.Authorization.substring(7, 27)}...` : 'none'
        }
      });

      if (options?.body) {
        console.log('Request body:', JSON.parse(options.body as string));
      }

      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
      });

      const data = await response.json();

      console.log('API Response:', {
        status: response.status,
        ok: response.ok,
        data
      });

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return (data.data !== undefined ? data.data : data) as T;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  async register(
    username: string, 
    email: string, 
    password: string, 
    role: string = 'USER'
  ): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password, role })
    });
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async getWalletNonce(address: string): Promise<NonceResponse> {
    return this.request<NonceResponse>(`/auth/wallet-nonce/${address}`);
  }

  async connectWallet(walletAddress: string, signature: string, message: string): Promise<{ user: User }> {
    return this.request('/auth/connect-wallet', {
      method: 'POST',
      body: JSON.stringify({ walletAddress, signature, message }),
    });
  }

  async disconnectWallet(): Promise<void> {
    await this.request('/auth/disconnect-wallet', {
      method: 'POST',
    });
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', {
        method: 'POST',
      });
    } finally {
      this.clearToken();
    }
  }

  async verifyToken(): Promise<{ user: User }> {
    return this.request('/auth/verify');
  }

  async checkAdmin(address: string): Promise<{ isAdmin: boolean }> {
    return this.request(`/auth/admin-check/${address}`);
  }

  async getEvents(filters?: {
    status?: string;
    location?: string;
    search?: string;
    sortBy?: string;
    order?: string;
  }): Promise<Event[]> {
    const params = new URLSearchParams(filters as any);
    return this.request<Event[]>(`/events?${params}`);
  }

  async getEventById(eventId: string): Promise<Event> {
    return this.request<Event>(`/events/${eventId}`);
  }

  async getEventStatistics(eventId: string) {
    return this.request(`/events/${eventId}/statistics`);
  }

  async getUserTickets(address: string, filters?: {
    status?: string;
    eventId?: string;
  }): Promise<Ticket[]> {
    const params = new URLSearchParams(filters as any);
    return this.request<Ticket[]>(`/tickets/user/${address}?${params}`);
  }

  async getTicketById(ticketId: number): Promise<Ticket> {
    return this.request<Ticket>(`/tickets/${ticketId}`);
  }

  async getUserTransactionHistory(address: string, filters?: {
    type?: string;
    eventId?: string;
  }): Promise<Transaction[]> {
    const params = new URLSearchParams(filters as any);
    return this.request<Transaction[]>(`/users/${address}/transactions?${params}`);
  }

  async getPendingProposals(): Promise<Proposal[]> {
    return this.request<Proposal[]>('/admin/proposals/pending');
  }

  async approveProposal(proposalId: string, data: {
    taxWalletAddress?: string;
    adminComment?: string;
  }): Promise<any> {
    return this.request(`/admin/proposals/${proposalId}/approve`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async rejectProposal(proposalId: string, adminComment: string): Promise<any> {
    return this.request(`/admin/proposals/${proposalId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ adminComment }),
    });
  }

  async getAdminStats(): Promise<AdminStats> {
    return this.request<AdminStats>('/admin/stats');
  }

  async getEventOrganizers(): Promise<any[]> {
    return this.request<any[]>('/admin/eos');
  }

  async addAdmin(address: string): Promise<any> {
    return this.request('/admin/add', {
      method: 'POST',
      body: JSON.stringify({ address }),
    });
  }

  async verifyAdmin(address: string): Promise<{ isAdmin: boolean }> {
    return this.request<{ isAdmin: boolean }>(`/admin/verify/${address}`);
  }

  async createEvent(data: {
    name: string;
    description: string;
    location: string;
    date: string;
    posterUrl?: string;
    revenueBeneficiaries?: Array<{
      address: string;
      name?: string;
      percentage: number;
    }>;
    taxWalletAddress?: string;
    attachments?: Array<{
      fileName: string;
      fileUrl: string;
      fileType: string;
      fileSize: number;
    }>;
  }): Promise<{ event: Event; proposal: Proposal }> {
    return this.request('/eo/events', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getEOEvents(address: string): Promise<Event[]> {
    return this.request<Event[]>(`/eo/events/${address}`);
  }

  async updateEvent(eventId: string, data: {
    description?: string;
    location?: string;
    posterUrl?: string;
  }): Promise<Event> {
    return this.request<Event>(`/eo/events/${eventId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async addTicketType(eventId: string, data: {
    name: string;
    description?: string;
    price: string;
    stock: number;
    saleStartDate: string;
    saleEndDate: string;
    benefits?: any;
  }): Promise<TicketType> {
    return this.request<TicketType>(`/eo/events/${eventId}/ticket-types`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTicketType(typeId: string, data: {
    price?: string;
    stock?: number;
    saleStartDate?: string;
    saleEndDate?: string;
    benefits?: any;
  }): Promise<TicketType> {
    return this.request<TicketType>(`/eo/ticket-types/${typeId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getEventRevenue(eventId: string): Promise<any> {
    return this.request(`/eo/events/${eventId}/revenue`);
  }

  async getEventAnalytics(eventId: string): Promise<any> {
    return this.request(`/eo/events/${eventId}/analytics`);
  }

  async getDashboardStats(address: string): Promise<any> {
    return this.request(`/eo/dashboard/${address}`);
  }

  async verifyTicket(ticketId: number, scannerAddress?: string): Promise<any> {
    return this.request(`/eo/tickets/${ticketId}/verify`, {
      method: 'POST',
      body: JSON.stringify({ scannerAddress }),
    });
  }

  async useTicket(ticketId: number, data: {
    eventCreatorAddress: string;
    scannerAddress: string;
  }): Promise<any> {
    return this.request(`/eo/tickets/${ticketId}/use`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);