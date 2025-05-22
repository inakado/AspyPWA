import { NextResponse } from 'next/server'
import { searchArtworksAndArtists } from '@/lib/services/search'

/**
 * GET /api/search?q=query - поиск по названию работ и художникам
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query) {
      return NextResponse.json(
        { artworks: [], artists: [] },
        { status: 200 }
      )
    }

    const results = await searchArtworksAndArtists(query)
    return NextResponse.json(results)
  } catch (error) {
    console.error('Ошибка при обработке запроса поиска:', error)
    return NextResponse.json(
      { error: 'Ошибка при выполнении поиска' },
      { status: 500 }
    )
  }
} 