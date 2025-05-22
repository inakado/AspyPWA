import { getLots } from './lots'
import { getArtists } from './artists'
import type { LotModel } from './lots'
import type { ArtistModel } from './artists'

/**
 * Результаты поиска
 */
export interface SearchResults {
  artworks: LotModel[]
  artists: ArtistModel[]
}

/**
 * Поиск по названию работ и художникам
 */
export async function searchArtworksAndArtists(query: string): Promise<SearchResults> {
  if (!query || query.trim() === '') {
    return { artworks: [], artists: [] }
  }

  // Нормализуем поисковый запрос
  const normalizedQuery = query.trim().toLowerCase()
  
  // Получаем все лоты и художников
  const [allLots, allArtists] = await Promise.all([
    getLots(),
    getArtists(),
  ])

  // Ищем среди работ по названию
  const matchingArtworks = allLots.filter(lot => 
    lot.name.toLowerCase().includes(normalizedQuery)
  )

  // Ищем среди художников по имени
  const matchingArtists = allArtists.filter(artist => 
    artist.name.toLowerCase().includes(normalizedQuery) || 
    artist.displayName.toLowerCase().includes(normalizedQuery)
  )

  return {
    artworks: matchingArtworks,
    artists: matchingArtists,
  }
} 