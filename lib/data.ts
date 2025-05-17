// Mock data for the art auction platform

// Active Event
export function getActiveEvent() {
  return {
    id: "event-1",
    title: "Осенний аукцион современного искусства",
    date: "2025-05-20",
    startTime: "18:00",
    endTime: "22:00",
    location: 'Галерея "Артпространство", Москва',
    description:
      "Эксклюзивный аукцион современного искусства с работами ведущих российских художников. Специальная коллекция весенних работ и новые имена в мире искусства.",
    image: "/placeholder.svg?height=600&width=800",
    totalLots: 45,
  }
}

// Hot Bids
export function getHotBids() {
  return [
    {
      id: "artwork-1",
      title: "Весенний пейзаж",
      image: "/placeholder.svg?height=400&width=300",
      artist: "Анна Соколова",
      artistId: "artist-1",
      currentBid: 75000,
      timeLeft: "2ч 15м",
    },
    {
      id: "artwork-2",
      title: "Абстракция №7",
      image: "/placeholder.svg?height=400&width=300",
      artist: "Михаил Ветров",
      artistId: "artist-2",
      currentBid: 120000,
      timeLeft: "45м",
    },
    {
      id: "artwork-3",
      title: "Городской ритм",
      image: "/placeholder.svg?height=400&width=300",
      artist: "Елена Морозова",
      artistId: "artist-3",
      currentBid: 95000,
      timeLeft: "1ч 30м",
    },
    {
      id: "artwork-4",
      title: "Тишина",
      image: "/placeholder.svg?height=400&width=300",
      artist: "Дмитрий Волков",
      artistId: "artist-4",
      currentBid: 65000,
      timeLeft: "3ч 10м",
    },
  ]
}

// Announcements
export function getAnnouncements() {
  return [
    {
      id: "announcement-1",
      type: "event",
      title: "Летний аукцион 2025",
      description:
        "Приглашаем вас на эксклюзивный летний аукцион, где будут представлены работы молодых художников и признанных мастеров.",
      date: "2025-07-15",
      startTime: "19:00",
      location: "Центральный выставочный зал",
    },
    {
      id: "announcement-2",
      type: "news",
      title: "Новая коллекция работ Ивана Петрова",
      description:
        "Мы рады сообщить о поступлении новой коллекции работ известного художника Ивана Петрова. Работы будут доступны для предварительного просмотра с 1 июня.",
      date: "2025-06-01",
    },
  ]
}

// Artists
export function getArtists() {
  // Используем мок-данные, пока не настроено подключение к Baserow API
  // TODO: Заменить на вызов API из lib/services
  return [
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
}

// Sold Artworks
export function getSoldArtworks() {
  return [
    {
      id: "sold-1",
      title: "Летний сад",
      image: "/placeholder.svg?height=400&width=300",
      artist: {
        id: "artist-1",
        name: "Анна Соколова",
      },
      soldPrice: 85000,
      soldDate: "2025-04-10",
    },
    {
      id: "sold-2",
      title: "Геометрия света",
      image: "/placeholder.svg?height=400&width=300",
      artist: {
        id: "artist-2",
        name: "Михаил Ветров",
      },
      soldPrice: 130000,
      soldDate: "2025-04-05",
    },
    {
      id: "sold-3",
      title: "Ночной город",
      image: "/placeholder.svg?height=400&width=300",
      artist: {
        id: "artist-3",
        name: "Елена Морозова",
      },
      soldPrice: 110000,
      soldDate: "2025-04-01",
    },
    {
      id: "sold-4",
      title: "Линии",
      image: "/placeholder.svg?height=400&width=300",
      artist: {
        id: "artist-4",
        name: "Дмитрий Волков",
      },
      soldPrice: 70000,
      soldDate: "2025-03-28",
    },
  ]
}

// Get Artist by ID
export function getArtist(id: string) {
  const artists = [
    {
      id: "artist-1",
      name: "Анна Соколова",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Анна Соколова — современная российская художница, работающая преимущественно в жанре пейзажа. Её работы отличаются яркими красками и особым вниманием к игре света. Выпускница Московской художественной академии, участница многочисленных выставок в России и за рубежом.",
      tags: ["Пейзаж", "Масло", "Импрессионизм", "Природа", "Реализм"],
    },
    {
      id: "artist-2",
      name: "Михаил Ветров",
      image: "/placeholder.svg?height=400&width=400",
      bio: 'Михаил Ветров — художник-абстракционист, экспериментирующий с формами и цветом. В своих работах он исследует взаимодействие геометрических форм и эмоциональное воздействие цвета на зрителя. Лауреат премии "Современное искусство России".',
      tags: ["Абстракция", "Акрил", "Современное искусство", "Геометрия", "Цвет"],
    },
    {
      id: "artist-3",
      name: "Елена Морозова",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Елена Морозова специализируется на городских пейзажах, передавая атмосферу и ритм современных мегаполисов. Её работы находятся в частных коллекциях по всему миру. Выпускница Санкт-Петербургской академии художеств, преподаватель живописи.",
      tags: ["Городской пейзаж", "Смешанная техника", "Урбанизм", "Архитектура"],
    },
    {
      id: "artist-4",
      name: "Дмитрий Волков",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Дмитрий Волков — художник-минималист, работающий преимущественно в монохромной технике. Его работы отличаются лаконичностью и глубиной. Участник международных биеннале современного искусства, его произведения выставлялись в ведущих галереях Европы.",
      tags: ["Минимализм", "Графика", "Монохром", "Концептуальное искусство"],
    },
    {
      id: "artist-5",
      name: "Сергей Кузнецов",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Сергей Кузнецов — мастер реалистичной живописи, специализирующийся на портретах и жанровых сценах. Его работы отличаются вниманием к деталям и психологической глубиной. Выпускник Российской академии живописи, ваяния и зодчества.",
      tags: ["Реализм", "Масло", "Портрет", "Жанровая живопись"],
    },
    {
      id: "artist-6",
      name: "Ольга Новикова",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Ольга Новикова — фотограф и концептуальный художник, исследующий темы идентичности и памяти. Её работы представляют собой синтез фотографии и других медиа. Лауреат международных конкурсов современной фотографии.",
      tags: ["Фотография", "Концептуальное искусство", "Мультимедиа", "Идентичность"],
    },
    {
      id: "artist-7",
      name: "Иван Петров",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Иван Петров — скульптор, работающий преимущественно с бронзой и камнем. Его работы сочетают классические традиции и современные тенденции. Участник многочисленных выставок и симпозиумов по скульптуре в России и за рубежом.",
      tags: ["Скульптура", "Бронза", "Камень", "Современное искусство"],
    },
    {
      id: "artist-8",
      name: "Мария Смирнова",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Мария Смирнова — акварелист, создающий нежные и воздушные работы в жанрах пейзажа и натюрморта. Её работы отличаются особой прозрачностью и лёгкостью. Член Союза художников России, участница многочисленных выставок акварели.",
      tags: ["Акварель", "Пейзаж", "Натюрморт"],
    },
  ]

  return artists.find((artist) => artist.id === id)
}

// Get all auctions
export function getAllAuctions() {
  return [
    {
      id: "auction-1",
      title: "Весенний аукцион современного искусства",
      date: "2025-05-20",
      startTime: "18:00",
      endTime: "22:00",
      location: 'Галерея "Артпространство", Москва',
      description:
        "Эксклюзивный аукцион современного искусства с работами ведущих российских художников. Специальная коллекция весенних работ и новые имена в мире искусства.",
      image: "/placeholder.svg?height=600&width=800",
      totalLots: 45,
      status: "active",
    },
    {
      id: "auction-2",
      title: "Летний аукцион 2025",
      date: "2025-07-15",
      startTime: "19:00",
      endTime: "23:00",
      location: "Центральный выставочный зал",
      description:
        "Приглашаем вас на эксклюзивный летний аукцион, где будут представлены работы молодых художников и признанных мастеров.",
      image: "/placeholder.svg?height=600&width=800",
      totalLots: 60,
      status: "upcoming",
    },
    {
      id: "auction-3",
      title: "Зимний аукцион классического искусства",
      date: "2025-01-10",
      startTime: "17:00",
      endTime: "21:00",
      location: 'Галерея "Классика", Санкт-Петербург',
      description:
        "Аукцион классического искусства с работами известных мастеров XIX-XX веков. Редкие произведения из частных коллекций.",
      image: "/placeholder.svg?height=600&width=800",
      totalLots: 35,
      status: "past",
    },
    {
      id: "auction-4",
      title: "Осенний аукцион фотографии",
      date: "2025-09-25",
      startTime: "18:30",
      endTime: "22:30",
      location: 'Центр современной фотографии "Объектив"',
      description:
        "Специализированный аукцион фотографии, представляющий работы как признанных мастеров, так и молодых талантливых фотографов.",
      image: "/placeholder.svg?height=600&width=800",
      totalLots: 50,
      status: "upcoming",
    },
  ]
}

// Get auction by ID
export function getAuction(id: string) {
  return getAllAuctions().find((auction) => auction.id === id)
}

// Get auction lots
export function getAuctionLots(auctionId: string) {
  // Mock data for auction lots
  const auctionLotsMap: Record<string, any[]> = {
    "auction-1": [
      {
        id: "artwork-1",
        lotNumber: 1,
        title: "Весенний пейзаж",
        image: "/placeholder.svg?height=400&width=300",
        artist: "Анна Соколова",
        artistId: "artist-1",
        currentBid: 75000,
        startingPrice: 50000,
        timeLeft: "2ч 15м",
      },
      {
        id: "artwork-2",
        lotNumber: 2,
        title: "Абстракция №7",
        image: "/placeholder.svg?height=400&width=300",
        artist: "Михаил Ветров",
        artistId: "artist-2",
        currentBid: 120000,
        startingPrice: 90000,
        timeLeft: "45м",
      },
      {
        id: "artwork-3",
        lotNumber: 3,
        title: "Городской ритм",
        image: "/placeholder.svg?height=400&width=300",
        artist: "Елена Морозова",
        artistId: "artist-3",
        currentBid: 95000,
        startingPrice: 70000,
        timeLeft: "1ч 30м",
      },
      {
        id: "artwork-4",
        lotNumber: 4,
        title: "Тишина",
        image: "/placeholder.svg?height=400&width=300",
        artist: "Дмитрий Волков",
        artistId: "artist-4",
        currentBid: 65000,
        startingPrice: 40000,
        timeLeft: "3ч 10м",
      },
      {
        id: "artwork-5",
        lotNumber: 5,
        title: "Портрет незнакомки",
        image: "/placeholder.svg?height=400&width=300",
        artist: "Сергей Кузнецов",
        artistId: "artist-5",
        currentBid: 110000,
        startingPrice: 80000,
        timeLeft: "4ч 20м",
      },
      {
        id: "artwork-6",
        lotNumber: 6,
        title: "Отражения",
        image: "/placeholder.svg?height=400&width=300",
        artist: "Ольга Новикова",
        artistId: "artist-6",
        currentBid: 85000,
        startingPrice: 60000,
        timeLeft: "5ч 05м",
      },
    ],
    "auction-2": [
      {
        id: "artwork-7",
        lotNumber: 1,
        title: "Движение",
        image: "/placeholder.svg?height=400&width=300",
        artist: "Иван Петров",
        artistId: "artist-7",
        startingPrice: 150000,
      },
      {
        id: "artwork-8",
        lotNumber: 2,
        title: "Цветущий луг",
        image: "/placeholder.svg?height=400&width=300",
        artist: "Мария Смирнова",
        artistId: "artist-8",
        startingPrice: 30000,
      },
    ],
    "auction-3": [
      {
        id: "sold-1",
        lotNumber: 1,
        title: "Летний сад",
        image: "/placeholder.svg?height=400&width=300",
        artist: "Анна Соколова",
        artistId: "artist-1",
        soldPrice: 85000,
        startingPrice: 55000,
      },
      {
        id: "sold-2",
        lotNumber: 2,
        title: "Геометрия света",
        image: "/placeholder.svg?height=400&width=300",
        artist: "Михаил Ветров",
        artistId: "artist-2",
        soldPrice: 130000,
        startingPrice: 90000,
      },
    ],
    "auction-4": [],
  }

  return auctionLotsMap[auctionId] || []
}

// Get Artwork by ID
export function getArtwork(id: string) {
  const artworks = [
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
      description: "Яркий весенний пейзаж, выполненный в технике импрессионизма.",
      dimensions: "60x80 см",
      condition: "Отличное",
      certificate: true,
      auctionEnds: "2024-05-20T22:00:00.000Z",
      bidHistory: [
        { userId: "user-1", amount: 70000, time: "2024-05-19T10:00:00.000Z" },
        { userId: "user-2", amount: 72000, time: "2024-05-19T12:00:00.000Z" },
        { userId: "user-3", amount: 75000, time: "2024-05-19T14:00:00.000Z" },
      ],
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
      description: "Абстрактная композиция, выполненная в ярких цветах.",
      dimensions: "100x100 см",
      condition: "Отличное",
      certificate: true,
      auctionEnds: "2024-05-20T22:00:00.000Z",
      bidHistory: [
        { userId: "user-4", amount: 110000, time: "2024-05-19T11:00:00.000Z" },
        { userId: "user-5", amount: 115000, time: "2024-05-19T13:00:00.000Z" },
        { userId: "user-6", amount: 120000, time: "2024-05-19T15:00:00.000Z" },
      ],
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
      description: "Городской пейзаж, выполненный в смешанной технике.",
      dimensions: "80x120 см",
      condition: "Отличное",
      certificate: true,
      auctionEnds: "2024-05-20T22:00:00.000Z",
      bidHistory: [
        { userId: "user-7", amount: 90000, time: "2024-05-19T12:00:00.000Z" },
        { userId: "user-8", amount: 92000, time: "2024-05-19T14:00:00.000Z" },
        { userId: "user-9", amount: 95000, time: "2024-05-19T16:00:00.000Z" },
      ],
    },
  ]

  return artworks.find((artwork) => artwork.id === id)
}

// Get Artist Artworks
export function getArtistArtworks(artistId: string) {
  const artworks = [
    {
      id: "artwork-1",
      title: "Весенний пейзаж",
      image: "/placeholder.svg?height=400&width=300",
      artist: "Анна Соколова",
      artistId: "artist-1",
      currentBid: 75000,
      startingPrice: 50000,
      status: "active",
      year: "2024",
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
      year: "2024",
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
      year: "2024",
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
      year: "2024",
    },
  ]

  return artworks.filter((artwork) => artwork.artistId === artistId)
}
