// Event data configuration
const eventLogoDir = "/images/event"
const bandLogoDir = "/images/bands"

const eventNames = [
  "burnout",
  "cravier",
  "glenovare",
  "hyde",
  "jazz_goes_to_campus",
  "lovestival",
  "neverland",
  "pestipalin",
  "skyavenue",
  "soundsfest",
]

const bandNames = [
  "barasuara",
  "efek_rumah_kaca",
  "feast",
  "goodnight_electric",
  "grrrl_gang",
  "hindia",
  "kangenband",
  "kunto_aji",
  "morfem",
  "nidji",
  "noah_logo",
  "pamungkas",
  "reality_club",
  "sheila_on",
  "sisitipsi",
  "the_adams",
  "the_jansen",
  "the_jeblogs",
  "white_shoes",
]

// Helper function to capitalize and format names
const formatEventName = (name: string) => {
  return name
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

const formatBandName = (name: string) => {
  return name
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

// Helper function to get random banner
const getRandomBanner = () => {
  const bannerIndex = Math.floor(Math.random() * 5) + 1 // 1-5
  return `/images/example/banner-${bannerIndex}.png`
}

// Helper function to get random bands
const getRandomBands = () => {
  const count = Math.floor(Math.random() * 5) + 4 // 4-8 bands
  const shuffled = [...bandNames].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count).map(formatBandName)
}

// Indonesian concert locations
const locations = [
  "Gelora Bung Karno, Jakarta",
  "Jakarta International Expo, Jakarta",
  "ICE BSD, Tangerang",
  "Istora Senayan, Jakarta",
  "Bali Nusa Dua Convention Center, Bali",
  "Trans Studio Bandung, Bandung",
  "Surabaya Convention Hall, Surabaya",
  "The Kasablanka Hall, Jakarta",
  "Yogyakarta Convention Center, Yogyakarta",
  "Ancol Beach City, Jakarta",
]

// Helper function to generate dates from Oct 25 to late Dec (10 events)
const generateDates = () => {
  const startDate = new Date(2025, 9, 25) // Oct 25, 2025
  const endDate = new Date(2025, 11, 28) // Dec 28, 2025
  const totalDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  const interval = Math.floor(totalDays / 9) // 9 intervals for 10 events

  const dates: string[] = []
  for (let i = 0; i < 10; i++) {
    const eventDate = new Date(startDate)
    eventDate.setDate(startDate.getDate() + i * interval)
    
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]
    
    const formatted = `${monthNames[eventDate.getMonth()]} ${eventDate.getDate()}, ${eventDate.getFullYear()}`
    dates.push(formatted)
  }
  
  return dates
}

const dates = generateDates()

// All events data
export const allEvents = eventNames.map((eventName, index) => ({
  id: index + 1,
  name: formatEventName(eventName),
  logo: `${eventLogoDir}/${eventName}.png`,
  featuring: getRandomBands(),
  location: locations[index],
  date: dates[index],
  banner: getRandomBanner(),
  category: "Music",
}))

// Featured events (first 5 events)
export const featuredEvents = allEvents.slice(0, 5)

// Export types
export interface EventData {
  id: number
  name: string
  logo: string
  featuring: string[]
  location: string
  date: string
  banner: string
  category: string
}
