/**
 * Типы данных для работы с Baserow API
 */

export interface BaserowImage {
	url: string
	thumbnails: {
		tiny: { url: string; width: number | null; height: number }
		small: { url: string; width: number; height: number }
		card_cover: { url: string; width: number; height: number }
	}
	visible_name: string
	name: string
	size: number
	mime_type: string
	is_image: boolean
	image_width: number
	image_height: number
	uploaded_at: string
}

export interface BaserowReference {
	id: number
	value: string
	order: string
}

/**
 * Тег художника в Baserow
 */
export interface BaserowTag {
	id: number
	value: string
	color: string
}

/**
 * Таблица Lots (425401)
 */
export interface Lot {
	id: number
	order: string
	Name: string
	Artists: BaserowReference[]
	Image: BaserowImage[]
	LotNumber: string
	Bets: BaserowReference[]
	InitialPrice: string
	FinalPrice: string
	FinalText: string
	specs: string
	description: string
	year: string
	technique: string
	status: boolean
	favoritesArt: boolean
	Auction: BaserowReference[]
}

/**
 * Таблица Artists (425410)
 */
export interface Artist {
	id: number
	order: string
	Name: string
	bio: string
	Lots: BaserowReference[]
	photos: BaserowImage[]
	displayName: string
	mainArt: BaserowImage[]
	tags: BaserowTag[]
}

/**
 * Таблица Auctions (547257)
 */
export interface Auction {
	id: number
	order: string
	name: string
	start_date: string
	end_date: string
	venue: string
	city: string
	lot_count: string
	lots_sold: string
	total_sales_rub: string
	description_short: string
	photo: BaserowImage[]
	is_active: boolean
	Lots: BaserowReference[]
}

/**
 * Таблица Bets (427189)
 */
export interface Bet {
	id: number
	order: string
	BetValue: string
	Date: string
	User: BaserowReference[]
	Lot: BaserowReference[]
}

/**
 * Таблица Users (427190)
 */
export interface User {
	id: number
	order: string
	Username: string
	TelegramID: string
	ProfileImage: string
	Bets: BaserowReference[]
	PhoneNumber: string | null
}

/**
 * Параметры запроса для получения записей
 */
export interface FetchRecordsParams {
	page?: number
	size?: number
	search?: string
}

/**
 * Ответ API на запрос списка записей
 */
export interface BaserowListResponse<T> {
	count: number
	next: string | null
	previous: string | null
	results: T[]
} 