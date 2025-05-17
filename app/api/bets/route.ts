import { NextResponse } from 'next/server'
import {
	getBets,
	getBetById,
	getBetsByLotId,
	getBetsByUserId,
	createBet,
} from '@/lib/services'

/**
 * GET /api/bets - получение всех ставок
 * GET /api/bets?id=123 - получение ставки по ID
 * GET /api/bets?lotId=123 - получение ставок определенного лота
 * GET /api/bets?userId=123 - получение ставок определенного пользователя
 */
export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url)
		const id = searchParams.get('id')
		const lotId = searchParams.get('lotId')
		const userId = searchParams.get('userId')

		// Получение ставки по ID
		if (id) {
			const betId = parseInt(id, 10)
			const bet = await getBetById(betId)

			if (!bet) {
				return NextResponse.json(
					{ error: `Ставка с ID ${id} не найдена` },
					{ status: 404 }
				)
			}

			return NextResponse.json(bet)
		}

		// Получение ставок определенного лота
		if (lotId) {
			const lot = parseInt(lotId, 10)
			const bets = await getBetsByLotId(lot)
			return NextResponse.json(bets)
		}

		// Получение ставок определенного пользователя
		if (userId) {
			const user = parseInt(userId, 10)
			const bets = await getBetsByUserId(user)
			return NextResponse.json(bets)
		}

		// Получение всех ставок
		const bets = await getBets()
		return NextResponse.json(bets)
	} catch (error) {
		console.error('Ошибка при обработке запроса ставок:', error)
		return NextResponse.json(
			{ error: 'Ошибка при получении данных' },
			{ status: 500 }
		)
	}
}

/**
 * POST /api/bets - создание новой ставки
 */
export async function POST(request: Request) {
	try {
		const body = await request.json()
		const { lotId, userId, value } = body

		// Проверка наличия необходимых данных
		if (!lotId || !userId || !value) {
			return NextResponse.json(
				{ error: 'Необходимо указать lotId, userId и value' },
				{ status: 400 }
			)
		}

		// Создание новой ставки
		const newBet = await createBet(
			parseInt(lotId, 10),
			parseInt(userId, 10),
			parseFloat(value)
		)

		if (!newBet) {
			return NextResponse.json(
				{ error: 'Не удалось создать ставку' },
				{ status: 500 }
			)
		}

		return NextResponse.json(newBet, { status: 201 })
	} catch (error) {
		console.error('Ошибка при создании ставки:', error)
		return NextResponse.json(
			{ error: 'Ошибка при создании ставки' },
			{ status: 500 }
		)
	}
} 