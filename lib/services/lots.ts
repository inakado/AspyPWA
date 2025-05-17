import { baserowClient } from '../baserow'
import type { BaserowReference, Lot } from '../baserow'

/**
 * Адаптированная модель лота для использования на клиенте
 */
export interface LotModel {
	id: number
	name: string
	lotNumber: string
	description: string
	image: string | null
	images: string[]
	initialPrice: number
	finalPrice: number | null
	currentBid: number | null
	artists: { id: number; name: string; displayName?: string }[]
	specs: string
	year: string
	technique: string
	isActive: boolean
	bets: { id: number; value: string }[]
}

/**
 * Получение списка всех лотов
 */
export async function getLots(): Promise<LotModel[]> {
	try {
		const response = await baserowClient.getLots()
		
		// Получаем все уникальные ID художников из всех лотов
		const artistIds = new Set<number>()
		response.results.forEach(lot => {
			lot.Artists?.forEach(artist => artistIds.add(artist.id))
		})
		
		// Загружаем полную информацию о художниках
		const artistsMap = await getArtistsDisplayNames(Array.from(artistIds))
		
		// Трансформируем лоты с дополнительной информацией о художниках
		return response.results.map(lot => transformLotToModel(lot, artistsMap))
	} catch (error) {
		console.error('Ошибка при получении списка лотов:', error)
		return []
	}
}

/**
 * Получение активных лотов (со статусом true)
 */
export async function getActiveLots(): Promise<LotModel[]> {
	try {
		const response = await baserowClient.getLots()
		
		// Получаем все уникальные ID художников из активных лотов
		const artistIds = new Set<number>()
		response.results
			.filter(lot => lot.status === true)
			.forEach(lot => {
				lot.Artists?.forEach(artist => artistIds.add(artist.id))
			})
		
		// Загружаем полную информацию о художниках
		const artistsMap = await getArtistsDisplayNames(Array.from(artistIds))
		
		return response.results
			.filter(lot => lot.status === true)
			.map(lot => transformLotToModel(lot, artistsMap))
	} catch (error) {
		console.error('Ошибка при получении активных лотов:', error)
		return []
	}
}

/**
 * Получение проданных лотов (со статусом false)
 */
export async function getSoldLots(): Promise<LotModel[]> {
	try {
		const response = await baserowClient.getLots()
		// Проверяем наличие данных перед фильтрацией
		if (!response || !response.results || !Array.isArray(response.results)) {
			console.warn('Получен некорректный ответ от API при запросе проданных лотов')
			return []
		}
		
		// Получаем все уникальные ID художников из проданных лотов
		const artistIds = new Set<number>()
		response.results
			.filter(lot => lot.status === false)
			.forEach(lot => {
				lot.Artists?.forEach(artist => artistIds.add(artist.id))
			})
		
		// Загружаем полную информацию о художниках
		const artistsMap = await getArtistsDisplayNames(Array.from(artistIds))
		
		return response.results
			.filter(lot => lot.status === false)
			.map(lot => transformLotToModel(lot, artistsMap))
	} catch (error) {
		console.error('Ошибка при получении проданных лотов:', error)
		return []
	}
}

/**
 * Получение лота по ID
 */
export async function getLotById(id: number): Promise<LotModel | null> {
	try {
		const lot = await baserowClient.getLotById(id)
		
		// Получаем ID художников этого лота
		const artistIds = (lot.Artists || []).map(artist => artist.id)
		
		// Загружаем полную информацию о художниках
		const artistsMap = await getArtistsDisplayNames(artistIds)
		
		return transformLotToModel(lot, artistsMap)
	} catch (error) {
		console.error(`Ошибка при получении лота с ID ${id}:`, error)
		return null
	}
}

/**
 * Получение лотов определенного художника
 */
export async function getLotsByArtistId(artistId: number): Promise<LotModel[]> {
	try {
		const response = await baserowClient.getLots()
		
		// Получаем все уникальные ID художников из лотов этого художника
		const artistIds = new Set<number>([artistId])
		response.results
			.filter(lot => lot.Artists?.some(artist => artist.id === artistId))
			.forEach(lot => {
				lot.Artists?.forEach(artist => artistIds.add(artist.id))
			})
		
		// Загружаем полную информацию о художниках
		const artistsMap = await getArtistsDisplayNames(Array.from(artistIds))
		
		return response.results
			.filter(lot => 
				lot.Artists?.some(artist => artist.id === artistId)
			)
			.map(lot => transformLotToModel(lot, artistsMap))
	} catch (error) {
		console.error(`Ошибка при получении лотов художника с ID ${artistId}:`, error)
		return []
	}
}

/**
 * Получение displayName художников по их ID
 */
async function getArtistsDisplayNames(artistIds: number[]): Promise<Map<number, { displayName: string }>> {
	const artistsMap = new Map<number, { displayName: string }>()
	
	if (artistIds.length === 0) {
		return artistsMap
	}
	
	try {
		// Получаем информацию о каждом художнике
		const promises = artistIds.map(async id => {
			try {
				const artist = await baserowClient.getArtistById(id)
				artistsMap.set(id, { displayName: artist.displayName || artist.Name })
			} catch (err) {
				console.warn(`Не удалось загрузить информацию о художнике с ID ${id}:`, err)
			}
		})
		
		await Promise.all(promises)
	} catch (error) {
		console.error('Ошибка при получении информации о художниках:', error)
	}
	
	return artistsMap
}

/**
 * Преобразование данных из Baserow в модель лота
 */
function transformLotToModel(lot: Lot, artistsMap?: Map<number, { displayName: string }>): LotModel {
	// Проверка на валидность объекта лота
	if (!lot || typeof lot !== 'object') {
		console.warn('Получен некорректный объект лота:', lot)
		return {
			id: 0,
			name: '',
			lotNumber: '',
			description: '',
			image: null,
			images: [],
			initialPrice: 0,
			finalPrice: null,
			currentBid: null,
			artists: [],
			specs: '',
			year: '',
			technique: '',
			isActive: false,
			bets: [],
		}
	}

	// Получаем основное изображение лота (первое в списке или null)
	const mainImage = lot.Image?.length > 0 
		? lot.Image[0].url 
		: null

	// Получаем все изображения лота
	const images = lot.Image?.map(img => img.url) || []

	// Получаем список художников лота с displayName, если доступно
	const artists = lot.Artists?.map(artist => {
		const extraData = artistsMap?.get(artist.id)
		return transformReference(artist, extraData)
	}) || []

	// Получаем список ставок лота
	const bets = lot.Bets?.map(bet => transformReference(bet)) || []

	// Определяем текущую ставку (максимальную из всех)
	const currentBid = bets.length > 0
		? Math.max(...bets.map(bet => parseFloat(bet.value)))
		: null

	// Преобразуем строковую цену в число
	const initialPrice = parseFloat(lot.InitialPrice || '0')
	
	// Проверяем наличие поля FinalPrice и преобразуем в число
	// Это поле может отсутствовать в старых записях
	const finalPrice = lot.FinalPrice !== undefined ? parseFloat(lot.FinalPrice || '0') : null

	return {
		id: lot.id,
		name: lot.Name || '',
		lotNumber: lot.LotNumber || '',
		description: lot.description || '',
		image: mainImage,
		images,
		initialPrice,
		finalPrice,
		currentBid,
		artists,
		specs: lot.specs || '',
		year: lot.year || '',
		technique: lot.technique || '',
		isActive: lot.status || false,
		bets,
	}
}

/**
 * Преобразование ссылки Baserow в объект { id, name/value }
 */
function transformReference(ref: BaserowReference, extraData?: any) {
	return {
		id: ref.id,
		name: ref.value,
		value: ref.value,
		...extraData
	}
} 