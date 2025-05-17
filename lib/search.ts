// Mock database of all artworks
const allArtworks = [
  {
    id: "artwork-1",
    title: "Весенний пейзаж",
    image: "/placeholder.svg?height=400&width=300",
    artist: "Анна Соколова",
    artistId: "artist-1",
    currentBid: 75000,
    startingPrice: 50000,
    status: "active",
    medium: "Масло, холст",
    year: "2024",
    category: "painting",
    tags: ["Пейзаж", "Весна", "Природа"],
  },
  {
    id: "artwork-2",
    title: "Абстракция №7",
    image: "/placeholder.svg?height=400&width=300",
    artist: "Михаил Ветров",
    artistId: "artist-2",
    currentBid: 120000,
    startingPrice: 90000,
    status: "active",
    medium: "Акрил, холст",
    year: "2024",
    category: "painting",
    tags: ["Абстракция", "Геометрия", "Цвет"],
  },
  {
    id: "artwork-3",
    title: "Городской ритм",
    image: "/placeholder.svg?height=400&width=300",
    artist: "Елена Морозова",
    artistId: "artist-3",
    currentBid: 95000,
    startingPrice: 70000,
    status: "active",
    medium: "Смешанная техника",
    year: "2024",
    category: "mixed",
    tags: ["Город", "Урбанизм", "Ритм"],
  },
  {
    id: "artwork-4",
    title: "Тишина",
    image: "/placeholder.svg?height=400&width=300",
    artist: "Дмитрий Волков",
    artistId: "artist-4",
    currentBid: 65000,
    startingPrice: 40000,
    status: "active",
    medium: "Тушь, бумага",
    year: "2024",
    category: "graphics",
    tags: ["Минимализм", "Монохром", "Тишина"],
  },
  {
    id: "sold-1",
    title: "Летний сад",
    image: "/placeholder.svg?height=400&width=300",
    artist: "Анна Соколова",
    artistId: "artist-1",
    soldPrice: 85000,
    startingPrice: 55000,
    status: "sold",
    medium: "Масло, холст",
    year: "2023",
    category: "painting",
    tags: ["Пейзаж", "Лето", "Сад"],
  },
  {
    id: "sold-2",
    title: "Геометрия света",
    image: "/placeholder.svg?height=400&width=300",
    artist: "Михаил Ветров",
    artistId: "artist-2",
    soldPrice: 130000,
    startingPrice: 90000,
    status: "sold",
    medium: "Акрил, холст",
    year: "2023",
    category: "painting",
    tags: ["Абстракция", "Геометрия", "Свет"],
  },
  {
    id: "artwork-5",
    title: "Портрет незнакомки",
    image: "/placeholder.svg?height=400&width=300",
    artist: "Сергей Кузнецов",
    artistId: "artist-5",
    currentBid: 110000,
    startingPrice: 80000,
    status: "active",
    medium: "Масло, холст",
    year: "2024",
    category: "painting",
    tags: ["Портрет", "Реализм", "Женщина"],
  },
  {
    id: "artwork-6",
    title: "Отражения",
    image: "/placeholder.svg?height=400&width=300",
    artist: "Ольга Новикова",
    artistId: "artist-6",
    currentBid: 85000,
    startingPrice: 60000,
    status: "active",
    medium: "Фотография",
    year: "2024",
    category: "photography",
    tags: ["Фотография", "Отражения", "Город"],
  },
  {
    id: "artwork-7",
    title: "Движение",
    image: "/placeholder.svg?height=400&width=300",
    artist: "Иван Петров",
    artistId: "artist-7",
    currentBid: 180000,
    startingPrice: 150000,
    status: "active",
    medium: "Бронза",
    year: "2024",
    category: "sculpture",
    tags: ["Скульптура", "Движение", "Фигура"],
  },
  {
    id: "artwork-8",
    title: "Цветущий луг",
    image: "/placeholder.svg?height=400&width=300",
    artist: "Мария Смирнова",
    artistId: "artist-8",
    currentBid: 45000,
    startingPrice: 30000,
    status: "active",
    medium: "Акварель, бумага",
    year: "2024",
    category: "painting",
    tags: ["Акварель", "Цветы", "Природа"],
  },
]

// Mock database of all artists
const allArtists = [
  {
    id: "artist-1",
    name: "Анна Соколова",
    image: "/placeholder.svg?height=100&width=100",
    coverImage: "/placeholder.svg?height=300&width=500",
    artworksCount: 24,
    tags: ["Пейзаж", "Масло", "Импрессионизм"],
  },
  {
    id: "artist-2",
    name: "Михаил Ветров",
    image: "/placeholder.svg?height=100&width=100",
    coverImage: "/placeholder.svg?height=300&width=500",
    artworksCount: 18,
    tags: ["Абстракция", "Акрил", "Современное искусство"],
  },
  {
    id: "artist-3",
    name: "Елена Морозова",
    image: "/placeholder.svg?height=100&width=100",
    coverImage: "/placeholder.svg?height=300&width=500",
    artworksCount: 31,
    tags: ["Городской пейзаж", "Смешанная техника"],
  },
  {
    id: "artist-4",
    name: "Дмитрий Волков",
    image: "/placeholder.svg?height=100&width=100",
    coverImage: "/placeholder.svg?height=300&width=500",
    artworksCount: 15,
    tags: ["Минимализм", "Графика", "Монохром"],
  },
  {
    id: "artist-5",
    name: "Сергей Кузнецов",
    image: "/placeholder.svg?height=100&width=100",
    coverImage: "/placeholder.svg?height=300&width=500",
    artworksCount: 22,
    tags: ["Реализм", "Масло", "Портрет"],
  },
  {
    id: "artist-6",
    name: "Ольга Новикова",
    image: "/placeholder.svg?height=100&width=100",
    coverImage: "/placeholder.svg?height=300&width=500",
    artworksCount: 19,
    tags: ["Фотография", "Концептуальное искусство"],
  },
  {
    id: "artist-7",
    name: "Иван Петров",
    image: "/placeholder.svg?height=100&width=100",
    coverImage: "/placeholder.svg?height=300&width=500",
    artworksCount: 27,
    tags: ["Скульптура", "Бронза", "Современное искусство"],
  },
  {
    id: "artist-8",
    name: "Мария Смирнова",
    image: "/placeholder.svg?height=100&width=100",
    coverImage: "/placeholder.svg?height=300&width=500",
    artworksCount: 16,
    tags: ["Акварель", "Пейзаж", "Натюрморт"],
  },
]

// Search for artworks
export async function searchArtworks(query: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  if (!query) return []

  const lowerQuery = query.toLowerCase()

  return allArtworks.filter((artwork) => {
    // Search in title
    if (artwork.title.toLowerCase().includes(lowerQuery)) return true

    // Search in artist name
    if (artwork.artist.toLowerCase().includes(lowerQuery)) return true

    // Search in medium
    if (artwork.medium.toLowerCase().includes(lowerQuery)) return true

    // Search in tags
    if (artwork.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))) return true

    // Search in year
    if (artwork.year.toLowerCase().includes(lowerQuery)) return true

    return false
  })
}

// Search for artists
export async function searchArtists(query: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  if (!query) return []

  const lowerQuery = query.toLowerCase()

  return allArtists.filter((artist) => {
    // Search in name
    if (artist.name.toLowerCase().includes(lowerQuery)) return true

    // Search in tags
    if (artist.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))) return true

    return false
  })
}
