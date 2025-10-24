# MyMineTicketKu - Frontend

![MyMineTicketKu Logo](public/images/app-logo.png)

**Ticketing Web3 untuk Penyelenggara, Artis, Penggemar, Sponsor, Investor, dan Semua Orang**

MyMineTicketKu adalah platform ticketing berbasis blockchain yang memberdayakan ekosistem kreatif melalui sistem tiket terverifikasi, transparan, dan berbagi hasil secara otomatis.

---

## 🔗 Related Repositories

- **Backend API**: [my-mine-ticket-ku-be](https://github.com/mir4na/my-mine-ticket-ku-be)
- **Smart Contract**: [my-mine-ticket-ku-smart-contract](https://github.com/mir4na/my-mine-ticket-ku-smart-contract)

---

## 📖 Overview

MyMineTicketKu menghadirkan revolusi dalam industri ticketing dengan memanfaatkan teknologi blockchain untuk:

- **Tokenisasi tiket acara** - Mengubah tiket konser dan pameran menjadi NFT yang terverifikasi
- **Menghilangkan penipuan** - Setiap tiket memiliki jejak digital yang tak terhapus di blockchain
- **Otomasi revenue sharing** - Smart contract mendistribusikan pendapatan secara transparan kepada event organizer, artis, dan partner
- **Transparansi finansial** - Laporan keuangan dan status pajak tersedia secara real-time

---

## ✨ Key Features

### 🎫 Untuk Pengguna (Buyers)
- **Jelajahi Events** - Browse berbagai event konser dan pameran
- **Beli Tiket NFT** - Pembelian tiket yang aman menggunakan wallet crypto
- **Verifikasi Tiket** - Cek keaslian tiket NFT secara real-time
- **Resell Tickets** - Jual kembali tiket dengan pembagian royalty otomatis
- **Profile Dashboard** - Kelola koleksi tiket NFT dan riwayat transaksi
- **POAP Badge** - Dapatkan NFT badge eksklusif sebagai proof of attendance

### 🎤 Untuk Event Organizer (EO)
- **Create Event** - Buat event dengan detail lengkap dan upload poster
- **Configure Tickets** - Set berbagai jenis tiket dengan harga dan benefit
- **Revenue Sharing Setup** - Konfigurasi pembagian hasil untuk artis dan partner
- **Dashboard Analytics** - Monitor penjualan tiket dan pendapatan real-time
- **Tax Compliance** - Integrasi otomatis untuk pelaporan royalti ke LMKN
- **Event Management** - Kelola event dari draft hingga selesai

### 👨‍💼 Untuk Admin
- **Approve/Reject Proposals** - Review dan validasi proposal event dari EO
- **Platform Statistics** - Monitor total events, tickets sold, dan revenue
- **User Management** - Kelola event organizers dan users
- **Transaction Monitoring** - Oversight semua transaksi di platform

### 🔐 Blockchain Integration
- **Wallet Connection** - Integrasi dengan MetaMask dan wallet Web3 lainnya
- **Smart Contract Interaction** - Direct interaction dengan Ethereum smart contracts
- **NFT Minting** - Otomatis mint tiket sebagai NFT saat pembelian
- **On-chain Verification** - Verifikasi keaslian tiket langsung dari blockchain
- **Transparent Revenue Split** - Revenue distribution yang terverifikasi on-chain

---

## 🎨 Landing Page Highlights

Halaman landing MyMineTicketKu menampilkan:

### Hero Section
- **Dynamic Rotating Text** - Menampilkan berbagai stakeholder (Penyelenggara, Artis, Penggemar, dll)
- **Call-to-Action** - Akses cepat ke "Jelajahi Events" dan "Verifikasi Tiket NFT"
- **Modern UI/UX** - Desain glassmorphism dengan animasi yang smooth

### Vision Statement
Menjelaskan misi platform:
- Tokenisasi tiket acara untuk verifikasi keaslian
- Sistem ticketing efisien melalui NFT dan smart contracts
- Memberdayakan seluruh ekosistem kreatif

### Core Features Showcase

#### 1. ✅ Terverifikasi Blockchain
Setiap tiket terukir abadi dalam blockchain dengan jejak digital yang tak terhapus dan kepercayaan yang terverifikasi.

#### 2. 💰 Pembagian Hasil Otomatis
Smart contract mengalirkan revenue secara transparan kepada artis, event organizer, dan setiap pihak yang berhak secara adil dan otomatis.

#### 3. 📊 Transparansi Kepatuhan Finansial
- Laporan keuangan dan status pajak event tersaji real-time
- Integrasi sederhana untuk laporan royalti otomatis ke LMKN
- Data kompatibel untuk audit oleh regulator dan sponsor

#### 4. 🎨 NFT & POAP Badge
- Tiket NFT sebagai bukti digital ownership
- POAP badge eksklusif untuk setiap momen spesial yang dihadiri

---

## 🛠️ Tech Stack

### Frontend Framework
- **Next.js 15.5.6** - React framework dengan App Router
- **React 19** - UI library
- **TypeScript** - Type safety

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/UI** - Re-usable component library
- **Lucide Icons** - Icon system
- **Custom Glassmorphism** - Modern UI effects

### Blockchain Integration
- **ethers.js** - Ethereum library untuk Web3 interaction
- **MetaMask** - Wallet connection
- **Smart Contract ABI** - Interface untuk contract interaction

### State Management & API
- **Custom API Client** - Centralized API management
- **LocalStorage** - Client-side data persistence
- **React Hooks** - State dan effect management

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MetaMask browser extension
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/MaulRai/my-mine-ticket-ku-fe.git
cd my-mine-ticket-ku-fe
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_RPC_URL=https://...
```

4. Run development server
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

---

## 🏗️ Project Structure

```
my-mine-ticket-ku/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # Landing page
│   ├── events/                  # Event browsing & detail
│   │   ├── page.tsx            # Events list
│   │   └── [id]/               # Event detail & checkout
│   ├── explore-tickets/         # Ticket verification
│   ├── profile/                 # User dashboard
│   ├── login/                   # Authentication
│   ├── register/                # User registration
│   ├── admin/                   # Admin panel
│   │   ├── dashboard/          # Admin overview
│   │   └── events/[id]/        # Event approval
│   ├── eo/                      # Event Organizer panel
│   │   ├── create-event/       # Create new event
│   │   ├── dashboard/          # EO overview
│   │   └── events/[id]/        # Configure tickets
│   └── api/                     # API routes
│       └── proxy/              # Backend proxy
├── components/                  # Reusable components
│   ├── navbar.tsx              # Navigation bar
│   ├── conditional-navbar.tsx  # Conditional rendering
│   └── ui/                     # Shadcn UI components
├── lib/                         # Utility libraries
│   ├── api.ts                  # API client
│   ├── blockchain.ts           # Web3 integration
│   ├── utils.ts                # Helper functions
│   └── events-data.ts          # Mock data
├── public/                      # Static assets
│   └── images/                 # Images & icons
└── README.md                    # This file
```

---

## 🔑 Key Pages & Routes

### Public Routes
- `/` - Landing page
- `/events` - Browse all events
- `/events/[id]` - Event detail
- `/events/[id]/checkout` - Purchase tickets
- `/explore-tickets` - Verify ticket authenticity
- `/tickets/[id]` - Ticket detail
- `/login` - User login
- `/register` - User registration

### Protected Routes (User)
- `/profile` - User dashboard & ticket collection

### Protected Routes (Event Organizer)
- `/eo/dashboard` - EO dashboard
- `/eo/create-event` - Create new event
- `/eo/events/[id]/configure-tickets` - Configure ticket types

### Protected Routes (Admin)
- `/admin/dashboard` - Admin overview
- `/admin/events/[id]` - Event detail & approval

---

## 🎯 Core Functionalities

### Authentication & Authorization
- Email/password login
- Wallet-based authentication (MetaMask)
- Role-based access control (USER, EO, ADMIN)
- JWT token management
- Dummy user for testing

### Event Management
- Create event with detailed information
- Upload event poster (IPFS integration)
- Configure multiple ticket types
- Set sale periods and pricing
- Revenue beneficiary configuration
- Admin approval workflow

### Ticket Purchase Flow
1. Browse events
2. Select ticket type and quantity
3. Connect wallet
4. Configure revenue split (optional)
5. Execute blockchain transaction
6. Receive NFT tickets

### NFT Ticket Features
- Blockchain verification
- Ownership transfer
- Resale with royalty split
- QR code for event entry
- POAP badge minting

### Revenue Distribution
- Automated split via smart contracts
- Multiple beneficiaries support
- Transparent on-chain records
- Withdrawable earnings tracking

---

## 🧪 Testing

### Dummy Account
For testing purposes, use the dummy account:
- **Email**: `dummy@user.com`
- **Password**: `dummy123`

Click "Login dengan Akun Dummy" button on login page for quick access.

### Build for Production
```bash
npm run build
npm run start
```

### Linting
```bash
npm run lint
```

---

## 🔐 Environment Variables

Required environment variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Blockchain Configuration
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddress
NEXT_PUBLIC_RPC_URL=https://your-rpc-url

# Optional
NEXT_PUBLIC_CHAIN_ID=11155111
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 Related Documentation

- [Backend Repository](https://github.com/mir4na/my-mine-ticket-ku-be) - RESTful API, database, and business logic
- [Smart Contract Repository](https://github.com/mir4na/my-mine-ticket-ku-smart-contract) - Solidity contracts for NFT ticketing and revenue sharing

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👥 Team

Created for Hackathon Project

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Shadcn for the beautiful UI components
- The blockchain community for inspiration
- All contributors and supporters

---

## 📞 Support

For support, please open an issue in the repository or contact the development team.

---

**Built with ❤️ using Next.js, TypeScript, and Blockchain Technology**
