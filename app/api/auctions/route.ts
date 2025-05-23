import { NextResponse } from 'next/server'
import { getAuctions } from '@/lib/services/auctions'

export async function GET() {
	try {
		const auctions = await getAuctions()
		return NextResponse.json(auctions)
	} catch (error) {
		console.error('Ошибка при получении аукционов:', error)
		return NextResponse.json(
			{ error: 'Ошибка при получении аукционов' },
			{ status: 500 }
		)
	}
} 