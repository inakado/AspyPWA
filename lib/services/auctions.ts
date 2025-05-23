import { baserowClient } from '../baserow'
import type { Auction } from '../baserow'

/**
 * Адаптированная модель аукциона для использования на клиенте
 */
export interface AuctionModel {
	id: number
	name: string
	startDate: string
	endDate: string
	venue: string
	city: string
	lotCount: number
	lotsSold: number
	totalSalesRub: number
	description: string
	image: string | null
	isActive: boolean
	status: 'active' | 'upcoming' | 'past'
}

/**
 * Получение списка всех аукционов
 */
export async function getAuctions(): Promise<AuctionModel[]> {
	try {
		const response = await baserowClient.getAuctions()
		return response.results.map(transformAuctionToModel)
	} catch (error) {
		console.error('Ошибка при получении списка аукционов:', error)
		return []
	}
}

/**
 * Получение активного аукциона
 */
export async function getActiveAuction(): Promise<AuctionModel | null> {
	try {
		const auctions = await getAuctions()
		// Ищем первый активный аукцион
		const activeAuction = auctions.find(auction => auction.status === 'active')
		return activeAuction || null
	} catch (error) {
		console.error('Ошибка при получении активного аукциона:', error)
		return null
	}
}

/**
 * Получение аукциона по ID
 */
export async function getAuctionById(id: number): Promise<AuctionModel | null> {
	try {
		const auction = await baserowClient.getAuctionById(id)
		return transformAuctionToModel(auction)
	} catch (error) {
		console.error(`Ошибка при получении аукциона с ID ${id}:`, error)
		return null
	}
}

/**
 * Преобразование данных из Baserow в модель аукциона
 */
function transformAuctionToModel(auction: Auction): AuctionModel {
	// Получаем основное изображение аукциона
	const image = auction.photo?.length > 0 ? auction.photo[0].url : null

	// Определяем статус аукциона
	const currentDate = new Date()
	const startDate = new Date(auction.start_date)
	const endDate = new Date(auction.end_date)
	
	let status: 'active' | 'upcoming' | 'past'
	
	// Проверяем флаг is_active - теперь это boolean
	const isActiveFlag = auction.is_active
	
	if (isActiveFlag) {
		status = 'active'
	} else if (currentDate < startDate) {
		status = 'upcoming'
	} else {
		status = 'past'
	}

	return {
		id: auction.id,
		name: auction.name || '',
		startDate: auction.start_date,
		endDate: auction.end_date,
		venue: auction.venue || '',
		city: auction.city || '',
		lotCount: parseInt(auction.lot_count) || 0,
		lotsSold: parseInt(auction.lots_sold) || 0,
		totalSalesRub: parseInt(auction.total_sales_rub) || 0,
		description: auction.description_short || '',
		image,
		isActive: isActiveFlag,
		status,
	}
} 