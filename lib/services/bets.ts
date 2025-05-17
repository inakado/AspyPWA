import { baserowClient } from '../baserow'
import type { BaserowReference, Bet } from '../baserow'

/**
 * Адаптированная модель ставки для использования на клиенте
 */
export interface BetModel {
	id: number
	value: number
	date: Date
	user: { id: number; name: string } | null
	lot: { id: number; name: string } | null
}

/**
 * Получение списка всех ставок
 */
export async function getBets(): Promise<BetModel[]> {
	try {
		const response = await baserowClient.getBets()
		return response.results.map(transformBetToModel)
	} catch (error) {
		console.error('Ошибка при получении списка ставок:', error)
		return []
	}
}

/**
 * Получение ставки по ID
 */
export async function getBetById(id: number): Promise<BetModel | null> {
	try {
		const bet = await baserowClient.getBetById(id)
		return transformBetToModel(bet)
	} catch (error) {
		console.error(`Ошибка при получении ставки с ID ${id}:`, error)
		return null
	}
}

/**
 * Получение ставок для определенного лота
 */
export async function getBetsByLotId(lotId: number): Promise<BetModel[]> {
	try {
		const response = await baserowClient.getBets()
		return response.results
			.filter(bet => 
				bet.Lot?.some(lot => lot.id === lotId)
			)
			.map(transformBetToModel)
	} catch (error) {
		console.error(`Ошибка при получении ставок для лота с ID ${lotId}:`, error)
		return []
	}
}

/**
 * Получение ставок определенного пользователя
 */
export async function getBetsByUserId(userId: number): Promise<BetModel[]> {
	try {
		const response = await baserowClient.getBets()
		return response.results
			.filter(bet => 
				bet.User?.some(user => user.id === userId)
			)
			.map(transformBetToModel)
	} catch (error) {
		console.error(`Ошибка при получении ставок пользователя с ID ${userId}:`, error)
		return []
	}
}

/**
 * Создание новой ставки
 */
export async function createBet(
	lotId: number,
	userId: number,
	value: number
): Promise<BetModel | null> {
	try {
		const betData = {
			Lot: [{ id: lotId }],
			User: [{ id: userId }],
			BetValue: value.toString(),
			Date: new Date().toISOString(),
		}

		const newBet = await baserowClient.createBet(betData)
		return transformBetToModel(newBet)
	} catch (error) {
		console.error('Ошибка при создании ставки:', error)
		return null
	}
}

/**
 * Преобразование данных из Baserow в модель ставки
 */
function transformBetToModel(bet: Bet): BetModel {
	// Получаем данные пользователя
	const user = bet.User?.length > 0
		? transformReference(bet.User[0])
		: null

	// Получаем данные лота
	const lot = bet.Lot?.length > 0
		? transformReference(bet.Lot[0])
		: null

	// Преобразуем строковое значение ставки в число
	const value = parseFloat(bet.BetValue || '0')

	return {
		id: bet.id,
		value,
		date: new Date(bet.Date),
		user,
		lot,
	}
}

/**
 * Преобразование ссылки Baserow в объект { id, name }
 */
function transformReference(ref: BaserowReference) {
	return {
		id: ref.id,
		name: ref.value,
	}
} 