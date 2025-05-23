import { NextResponse } from 'next/server'
import { getAuctionById } from '@/lib/services/auctions'

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id: idParam } = await params
		const id = parseInt(idParam, 10)
		
		if (isNaN(id)) {
			return NextResponse.json(
				{ error: 'Некорректный ID аукциона' },
				{ status: 400 }
			)
		}

		const auction = await getAuctionById(id)
		
		if (!auction) {
			return NextResponse.json(
				{ error: 'Аукцион не найден' },
				{ status: 404 }
			)
		}

		return NextResponse.json(auction)
	} catch (error) {
		console.error('Ошибка при получении аукциона:', error)
		return NextResponse.json(
			{ error: 'Ошибка при получении аукциона' },
			{ status: 500 }
		)
	}
} 