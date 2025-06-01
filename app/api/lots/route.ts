import { NextResponse } from 'next/server'
import { getLots, getLotById, getActiveLots, getLotsByArtistId, getLotsByAuctionId, getSoldLots, getFavoriteArtworks } from '@/lib/services'

/**
 * GET /api/lots - получение всех лотов
 * GET /api/lots?id=123 - получение лота по ID
 * GET /api/lots?active=true - получение только активных лотов
 * GET /api/lots?sold=true - получение только проданных лотов
 * GET /api/lots?artistId=123 - получение лотов определенного художника
 * GET /api/lots?auctionId=123 - получение лотов определенного аукциона
 * GET /api/lots?favorite=true - получение избранных лотов
 */
export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url)
		const id = searchParams.get('id')
		const active = searchParams.get('active')
		const sold = searchParams.get('sold')
		const artistId = searchParams.get('artistId')
		const auctionId = searchParams.get('auctionId')
		const favorite = searchParams.get('favorite')

		// Получение лота по ID
		if (id) {
			const lotId = parseInt(id, 10)
			const lot = await getLotById(lotId)

			if (!lot) {
				return NextResponse.json(
					{ error: `Лот с ID ${id} не найден` },
					{ status: 404 }
				)
			}

			return NextResponse.json(lot)
		}

		// Получение лотов конкретного художника
		if (artistId) {
			const artist = parseInt(artistId, 10)
			const lots = await getLotsByArtistId(artist)
			return NextResponse.json(lots)
		}

		// Получение лотов конкретного аукциона
		if (auctionId) {
			const auction = parseInt(auctionId, 10)
			const lots = await getLotsByAuctionId(auction)
			return NextResponse.json(lots)
		}

		// Получение только активных лотов
		if (active === 'true') {
			const activeLots = await getActiveLots()
			return NextResponse.json(activeLots)
		}
		
		// Получение только проданных лотов
		if (sold === 'true') {
			const soldLots = await getSoldLots()
			return NextResponse.json(soldLots)
		}
		
		// Получение только избранных лотов
		if (favorite === 'true') {
			const favoriteLots = await getFavoriteArtworks()
			return NextResponse.json(favoriteLots)
		}

		// Получение всех лотов
		const lots = await getLots()
		return NextResponse.json(lots)
	} catch (error) {
		console.error('Ошибка при обработке запроса лотов:', error)
		return NextResponse.json(
			{ error: 'Ошибка при получении данных' },
			{ status: 500 }
		)
	}
} 