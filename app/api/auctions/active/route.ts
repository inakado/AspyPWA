import { NextResponse } from 'next/server'
import { getActiveAuction } from '@/lib/services/auctions'

export async function GET() {
	try {
		const activeAuction = await getActiveAuction()
		
		if (!activeAuction) {
			return NextResponse.json(
				{ error: 'Нет активного аукциона' },
				{ status: 404 }
			)
		}

		return NextResponse.json(activeAuction)
	} catch (error) {
		console.error('Ошибка при получении активного аукциона:', error)
		return NextResponse.json(
			{ error: 'Ошибка при получении активного аукциона' },
			{ status: 500 }
		)
	}
} 