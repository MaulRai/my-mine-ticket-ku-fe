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

// Static dates from Oct 25 to late Dec (10 events)
const dates = [
  "October 25, 2025",
  "November 1, 2025",
  "November 8, 2025",
  "November 15, 2025",
  "November 22, 2025",
  "November 29, 2025",
  "December 6, 2025",
  "December 13, 2025",
  "December 20, 2025",
  "December 28, 2025",
]

// Static banner assignments (1-5)
const banners = [1, 3, 2, 5, 4, 1, 3, 5, 2, 4]

// Static featuring bands for each event (4-8 bands per event)
const featuringBands = [
  ["Barasuara", "Hindia", "Reality Club", "Pamungkas", "Kunto Aji"],
  ["Grrrl Gang", "Feast", "Sisitipsi", "The Adams", "White Shoes", "Morfem"],
  ["Efek Rumah Kaca", "Goodnight Electric", "The Jansen", "Noah Logo"],
  ["Nidji", "Kangenband", "The Jeblogs", "Sheila On", "Reality Club", "Hindia"],
  ["Pamungkas", "Barasuara", "Kunto Aji", "Morfem", "Feast", "Grrrl Gang", "White Shoes"],
  ["Sisitipsi", "The Adams", "Goodnight Electric", "Efek Rumah Kaca"],
  ["Reality Club", "Hindia", "The Jansen", "Noah Logo", "Nidji"],
  ["Kangenband", "Sheila On", "The Jeblogs", "Barasuara", "Pamungkas", "Kunto Aji"],
  ["Morfem", "Feast", "Grrrl Gang", "White Shoes", "Sisitipsi", "The Adams"],
  ["Goodnight Electric", "Efek Rumah Kaca", "The Jansen", "Reality Club", "Hindia", "Noah Logo"],
]

// All events data
export const allEvents = eventNames.map((eventName, index) => ({
  id: index + 1,
  name: formatEventName(eventName),
  logo: `${eventLogoDir}/${eventName}.png`,
  featuring: featuringBands[index],
  location: locations[index],
  date: dates[index],
  banner: `/images/example/banner-${banners[index]}.png`,
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
