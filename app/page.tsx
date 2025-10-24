"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Shield, Users, TrendingUp } from "lucide-react"

const rotatingTexts = ["Penyelenggara", "Artis", "Penggemar", "Sponsor", "Investor", "Semua Orang"]

export default function Home() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentTextIndex((prev) => (prev + 1) % rotatingTexts.length)
        setIsAnimating(false)
      }, 500)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0a0a0a] via-[#1a0a2e] to-[#0a0a0a]">
      {/* Overlay Background Image */}
      <div className="absolute top-0 right-0 w-3/4 h-3/4 pointer-events-none opacity-70 z-0">
        <Image
          src="/images/overlay-1.png"
          alt="Overlay"
          fill
          className="object-contain object-top-right"
          priority
        />
      </div>

      {/* Ambient animated background */}
      <div className="fixed inset-0 overflow-hidden opacity-40 pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial from-blue-900/30 to-transparent animate-pulse-slow" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-radial from-blue-800/25 to-transparent animate-pulse-slow animation-delay-2000" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl animate-float-drift" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-800/20 rounded-full blur-3xl animate-float-drift animation-delay-4000" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Hero Section */}
        <section className="flex-1 flex items-center justify-center px-4 py-20 pt-36">
          <div className="max-w-6xl mx-auto w-full">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Left Content */}
              <div className="flex-1 space-y-4">
                {/* Main Heading with Animation */}
                <div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading text-white leading-tight text-left">
                    Ticketing Web3 untuk
                  </h1>
                  <div className="h-20 sm:h-24 md:h-28 lg:h-32 flex items-center justify-start overflow-visible">
                    <h2
                      className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading bg-gradient-to-b from-white via-[#afa7d7] to-[#1b1166] bg-clip-text text-transparent transition-all duration-500 leading-tight ${isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
                        }`}
                    >
                      {rotatingTexts[currentTextIndex]}
                    </h2>
                  </div>
                </div>

                {/* Subtext */}
                <p className="text-base sm:text-lg md:text-xl text-gray-300 font-body leading-relaxed max-w-2xl text-left">
                  Memberdayakan ekosistem kreatif melalui sistem tiket berbasis <span className="italic">blockchain</span>{" "}
                  yang transparan, terverifikasi, dan berbagi hasil secara otomatis.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-start items-start pt-8">
                  <Link href="/events">
                    <Button
                      size="lg"
                      className="px-8 py-6 text-base sm:text-lg bg-white hover:bg-gray-100 text-black font-subheading font-semibold shadow-lg shadow-white/20 transition-all"
                    >
                      Jelajahi Acara
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/explore-tickets">
                    <Button
                      size="lg"
                      variant="outline"
                      className="px-8 py-6 text-base sm:text-lg border-2 border-white/20 bg-black/40 hover:bg-white/10 text-white hover:text-[#9060ce] font-subheading font-semibold backdrop-blur-sm transition-all"
                    >
                      Verifikasi Tiket NFT
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right - App Icon */}
              <div className="flex justify-center md:justify-end items-center flex-shrink-0">
                <Image
                  src="/images/app-icon-new.png"
                  alt="MyMineTicketKu Logo"
                  width={300}
                  height={300}
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Vision Statement Section */}
        <section className="py-20 px-4 relative">
          {/* Overlay Background Image */}
          <div className="absolute top-0 left-0 w-3/4 h-full pointer-events-none opacity-50 z-0">
            <Image
              src="/images/overlay-6.png"
              alt="Overlay"
              fill
              className="object-contain object-left-center"
            />
          </div>

          <div className="max-w-6xl mx-auto relative z-10">
            {/* Section Header */}
            <div className="text-center mb-16 space-y-4">
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-heading text-white">
                Kami melihat masa depan acara dengan cara yang berbeda.
              </h3>
            </div>

            {/* Vision Content */}
            <div className="space-y-8 max-w-4xl mx-auto">
              <div className="glass-fx bg-black/20 p-8 rounded-2xl border border-white/10">
                <p className="text-base sm:text-lg text-gray-300 font-body leading-relaxed">
                  Semua dimulai dari <span className="text-[#4a0dc3] font-semibold">tokenisasi tiket acara</span> —
                  membawa konser dan pameran ke <span className="italic">blockchain</span> untuk membantu <span className="italic">event organizer</span>, artis,
                  <span className="italic">partner</span>, dan penggemar memverifikasi keaslian, menghilangkan penipuan, serta
                  mengotomatiskan <span className="italic">revenue sharing</span>.
                </p>
              </div>

              <div className="glass-fx bg-black/20 p-8 rounded-2xl border border-white/10">
                <p className="text-base sm:text-lg text-gray-300 font-body leading-relaxed">
                  <span className="text-white font-semibold">MyMineTicketKu</span> menghadirkan sistem <span className="italic">ticketing</span> yang
                  efisien melalui NFT, <span className="italic">smart contract</span>, dan <span className="italic">transparent revenue sharing</span>,
                  memberdayakan seluruh ekosistem kreatif.

                </p>
              </div>

              <div className="glass-fx bg-black/20 p-8 rounded-2xl border border-white/10">
                <p className="text-base sm:text-lg text-gray-300 font-body leading-relaxed">
                  Baik Anda seorang artis, <span className="italic">event organizer</span>, <span className="italic">partner</span>, maupun penggemar,{" "}
                  <span className="text-white font-semibold">MyMineTicketKu</span> menjadikan setiap ticket sebagai bukti
                  <span className="italic">authenticity</span>, <span className="italic">ownership</span>, dan keberhasilan bersama di dunia
                  <span className="italic">entertainment-Web3</span>.

                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 relative">
          {/* Overlay Background Image */}
          <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-50 z-0">
            <Image
              src="/images/overlay-3.png"
              alt="Overlay"
              fill
              className="object-cover object-right-center"
            />
          </div>

          <div className="max-w-6xl mx-auto relative z-10">
            <h3 className="text-3xl sm:text-4xl font-heading text-white text-center mb-12">Mengapa MyMineTicketKu?</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Feature 1 */}
              <div className="glass-fx bg-gray-900/40 p-6 rounded-xl border border-white/10 hover:border-blue-500/30 transition-all group">
                <div className="w-12 h-12 bg-blue-200/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-all">
                  <Shield className="h-6 w-6 text-[#4a0dc3]" />
                </div>
                <h4 className="font-subheading text-xl font-semibold text-white mb-2">Terverifikasi Blockchain</h4>
                <p className="font-body text-gray-400 text-sm leading-relaxed">
                  Setiap ticket terukir abadi dalam <span className="italic">blockchain</span> dimana jejak digital yang tak
                  terhapus, kepercayaan yang terverifikasi di setiap langkah perjalanan Anda.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="glass-fx bg-gray-900/40 p-6 rounded-xl border border-white/10 hover:border-blue-500/30 transition-all group">
                <div className="w-12 h-12 bg-blue-200/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-all">
                  <TrendingUp className="h-6 w-6 text-[#4a0dc3]" />
                </div>
                <h4 className="font-subheading text-xl font-semibold text-white mb-2">Pembagian Hasil Otomatis</h4>
                <p className="font-body text-gray-400 text-sm leading-relaxed">
                  Biarkan teknologi berbicara. <span className="italic">Smart contract</span> mengalirkan <span className="italic">revenue</span> secara transparan
                  kepada artis, <span className="italic">event organizer</span>, dan setiap pihak yang berhak secara adil, otomatis, tanpa perantara.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="glass-fx bg-gray-900/40 p-6 rounded-xl border border-white/10 hover:border-blue-500/30 transition-all group">
                <div className="w-12 h-12 bg-blue-200/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-all">
                  <Users className="h-6 w-6 text-[#4a0dc3]" />
                </div>
                <h4 className="font-subheading text-xl font-semibold text-white mb-2">Transparansi Kepatuhan Finansial</h4>
                <p className="font-body text-gray-400 text-sm leading-relaxed">
                  Laporan keuangan dan status pajak <span className="italic">event</span> tersaji secara <span className="italic">real-time</span>. Memudahkan 
                  <span className="italic">Event Organizer</span> dengan integrasi sederhana untuk laporan royalti otomatis ke LMKN dan menyediakan data yang 
                  kompatibel untuk audit oleh regulator dan sponsor
                </p>
              </div>

              {/* Feature 4 */}
              <div className="glass-fx bg-gray-900/40 p-6 rounded-xl border border-white/10 hover:border-blue-500/30 transition-all group">
                <div className="w-12 h-12 bg-blue-200/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-all">
                  <Sparkles className="h-6 w-6 text-[#4a0dc3]" />
                </div>
                <h4 className="font-subheading text-xl font-semibold text-white mb-2">NFT & POAP Badge</h4>
                <p className="font-body text-gray-400 text-sm leading-relaxed">
                  Kenangan yang bernyawa. Tiket NFT sebagai bukti digital <span className="italic">ownership</span>
                  dan POAP badge eksklusif untuk setiap momen spesial yang Anda hadiri
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-heading text-white">
              Siap memasuki era baru Web3 <span className="italic">ticketing?</span>
            </h3>
            <p className="text-lg sm:text-xl text-gray-300 font-body">
              Mulai perjalanan Anda bersama MyMineTicketKu hari ini.
            </p>
            <Link href="/events">
              <Button
                size="lg"
                className="px-10 py-7 text-lg bg-white hover:bg-gray-100 text-black font-subheading font-semibold shadow-xl shadow-white/20 transition-all"
              >
                Mulai Sekarang
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </Link>
          </div>
        </section>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.25; }
          33% { opacity: 0.35; }
          66% { opacity: 0.45; }
        }
        @keyframes float-drift {
          0% { transform: translate(0px, 0px); opacity: 0.2; }
          25% { transform: translate(30px, -25px); opacity: 0.25; }
          50% { transform: translate(-20px, -40px); opacity: 0.3; }
          75% { transform: translate(-35px, -15px); opacity: 0.25; }
          100% { transform: translate(0px, 0px); opacity: 0.2; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 12s ease-in-out infinite;
        }
        .animate-float-drift {
          animation: float-drift 20s ease-in-out infinite;
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
