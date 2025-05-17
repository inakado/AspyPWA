import { NextResponse } from 'next/server'
import { getArtists, getArtistById } from '@/lib/services'

/**
 * GET /api/artists - получение всех художников
 */
export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url)
		const id = searchParams.get('id')

		if (id) {
			// Если указан ID, возвращаем конкретного художника
			const artistId = parseInt(id, 10)
			const artist = await getArtistById(artistId)

			if (!artist) {
				return NextResponse.json(
					{ error: `Художник с ID ${id} не найден` },
					{ status: 404 }
				)
			}

			return NextResponse.json(artist)
		}

		// Иначе возвращаем всех художников
		const artists = await getArtists()
		return NextResponse.json(artists)
	} catch (error) {
		console.error('Ошибка при обработке запроса художников:', error)
		return NextResponse.json(
			{ error: 'Ошибка при получении данных' },
			{ status: 500 }
		)
	}
} 