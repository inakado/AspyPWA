import { BASEROW_CONFIG, BASEROW_TABLE_IDS, DEFAULT_FETCH_PARAMS } from './config'
import type {
	Auction,
	Artist,
	BaserowListResponse,
	Bet,
	FetchRecordsParams,
	Lot,
	User,
} from './types'

/**
 * Клиент для работы с Baserow API
 */
export class BaserowClient {
	private readonly apiUrl: string
	private readonly apiToken: string
	private readonly userFieldNames: boolean

	constructor() {
		this.apiUrl = BASEROW_CONFIG.API_URL
		this.apiToken = BASEROW_CONFIG.API_TOKEN
		this.userFieldNames = BASEROW_CONFIG.USER_FIELD_NAMES
	}

	/**
	 * Получение базовых заголовков для запросов
	 */
	private getHeaders(): HeadersInit {
		const headers: HeadersInit = {
			'Content-Type': 'application/json',
		}

		// Добавляем токен только если он существует
		if (this.apiToken) {
			headers['Authorization'] = `Token ${this.apiToken}`
		}

		return headers
	}

	/**
	 * Получение списка записей из таблицы
	 */
	private async fetchRecords<T>(
		tableId: number,
		params: FetchRecordsParams = DEFAULT_FETCH_PARAMS
	): Promise<BaserowListResponse<T>> {
		const { page = 1, size = 100, search = '' } = params
		const queryParams = new URLSearchParams({
			page: page.toString(),
			size: size.toString(),
			user_field_names: this.userFieldNames.toString(),
			search,
		})

		const url = `${this.apiUrl}/api/database/rows/table/${tableId}/?${queryParams}`
		
		try {
			const response = await fetch(url, {
				headers: this.getHeaders(),
			})

			if (!response.ok) {
				// Попытка получить детали ошибки
				let errorDetails = response.statusText
				try {
					const errorBody = await response.json()
					errorDetails = JSON.stringify(errorBody)
				} catch {
					// Если не удалось распарсить JSON, оставляем statusText
				}
				
				throw new Error(`Ошибка при получении данных: ${response.status} ${errorDetails}. URL: ${url}`)
			}

			return response.json()
		} catch (error) {
			if (error instanceof Error) {
				throw error
			}
			throw new Error(`Неожиданная ошибка при запросе данных: ${String(error)}. URL: ${url}`)
		}
	}

	/**
	 * Получение одной записи из таблицы по ID
	 */
	private async fetchRecordById<T>(tableId: number, id: number): Promise<T> {
		const queryParams = new URLSearchParams({
			user_field_names: this.userFieldNames.toString(),
		})

		const response = await fetch(
			`${this.apiUrl}/api/database/rows/table/${tableId}/${id}/?${queryParams}`,
			{
				headers: this.getHeaders(),
			}
		)

		if (!response.ok) {
			throw new Error(`Ошибка при получении записи: ${response.statusText}`)
		}

		return response.json()
	}

	/**
	 * Создание новой записи в таблице
	 */
	private async createRecord<T>(tableId: number, data: Partial<T>): Promise<T> {
		const queryParams = new URLSearchParams({
			user_field_names: this.userFieldNames.toString(),
		})

		const response = await fetch(
			`${this.apiUrl}/api/database/rows/table/${tableId}/?${queryParams}`,
			{
				method: 'POST',
				headers: this.getHeaders(),
				body: JSON.stringify(data),
			}
		)

		if (!response.ok) {
			throw new Error(`Ошибка при создании записи: ${response.statusText}`)
		}

		return response.json()
	}

	/**
	 * Обновление записи в таблице
	 */
	private async updateRecord<T>(
		tableId: number,
		id: number,
		data: Partial<T>
	): Promise<T> {
		const queryParams = new URLSearchParams({
			user_field_names: this.userFieldNames.toString(),
		})

		const response = await fetch(
			`${this.apiUrl}/api/database/rows/table/${tableId}/${id}/?${queryParams}`,
			{
				method: 'PATCH',
				headers: this.getHeaders(),
				body: JSON.stringify(data),
			}
		)

		if (!response.ok) {
			throw new Error(`Ошибка при обновлении записи: ${response.statusText}`)
		}

		return response.json()
	}

	/**
	 * Удаление записи из таблицы
	 */
	private async deleteRecord(tableId: number, id: number): Promise<void> {
		const response = await fetch(
			`${this.apiUrl}/api/database/rows/table/${tableId}/${id}/`,
			{
				method: 'DELETE',
				headers: this.getHeaders(),
			}
		)

		if (!response.ok) {
			throw new Error(`Ошибка при удалении записи: ${response.statusText}`)
		}
	}

	// === Методы для работы с лотами ===

	/**
	 * Получение списка лотов
	 */
	async getLots(params?: FetchRecordsParams): Promise<BaserowListResponse<Lot>> {
		return this.fetchRecords<Lot>(BASEROW_TABLE_IDS.LOTS, params)
	}

	/**
	 * Получение лота по ID
	 */
	async getLotById(id: number): Promise<Lot> {
		return this.fetchRecordById<Lot>(BASEROW_TABLE_IDS.LOTS, id)
	}

	/**
	 * Создание нового лота
	 */
	async createLot(data: Partial<Lot>): Promise<Lot> {
		return this.createRecord<Lot>(BASEROW_TABLE_IDS.LOTS, data)
	}

	/**
	 * Обновление лота
	 */
	async updateLot(id: number, data: Partial<Lot>): Promise<Lot> {
		return this.updateRecord<Lot>(BASEROW_TABLE_IDS.LOTS, id, data)
	}

	/**
	 * Удаление лота
	 */
	async deleteLot(id: number): Promise<void> {
		return this.deleteRecord(BASEROW_TABLE_IDS.LOTS, id)
	}

	// === Методы для работы с художниками ===

	/**
	 * Получение списка художников
	 */
	async getArtists(
		params?: FetchRecordsParams
	): Promise<BaserowListResponse<Artist>> {
		return this.fetchRecords<Artist>(BASEROW_TABLE_IDS.ARTISTS, params)
	}

	/**
	 * Получение художника по ID
	 */
	async getArtistById(id: number): Promise<Artist> {
		return this.fetchRecordById<Artist>(BASEROW_TABLE_IDS.ARTISTS, id)
	}

	/**
	 * Создание нового художника
	 */
	async createArtist(data: Partial<Artist>): Promise<Artist> {
		return this.createRecord<Artist>(BASEROW_TABLE_IDS.ARTISTS, data)
	}

	/**
	 * Обновление художника
	 */
	async updateArtist(id: number, data: Partial<Artist>): Promise<Artist> {
		return this.updateRecord<Artist>(BASEROW_TABLE_IDS.ARTISTS, id, data)
	}

	/**
	 * Удаление художника
	 */
	async deleteArtist(id: number): Promise<void> {
		return this.deleteRecord(BASEROW_TABLE_IDS.ARTISTS, id)
	}

	// === Методы для работы с аукционами ===

	/**
	 * Получение списка аукционов
	 */
	async getAuctions(
		params?: FetchRecordsParams
	): Promise<BaserowListResponse<Auction>> {
		return this.fetchRecords<Auction>(BASEROW_TABLE_IDS.AUCTIONS, params)
	}

	/**
	 * Получение аукциона по ID
	 */
	async getAuctionById(id: number): Promise<Auction> {
		return this.fetchRecordById<Auction>(BASEROW_TABLE_IDS.AUCTIONS, id)
	}

	/**
	 * Создание нового аукциона
	 */
	async createAuction(data: Partial<Auction>): Promise<Auction> {
		return this.createRecord<Auction>(BASEROW_TABLE_IDS.AUCTIONS, data)
	}

	/**
	 * Обновление аукциона
	 */
	async updateAuction(id: number, data: Partial<Auction>): Promise<Auction> {
		return this.updateRecord<Auction>(BASEROW_TABLE_IDS.AUCTIONS, id, data)
	}

	/**
	 * Удаление аукциона
	 */
	async deleteAuction(id: number): Promise<void> {
		return this.deleteRecord(BASEROW_TABLE_IDS.AUCTIONS, id)
	}

	// === Методы для работы с ставками ===

	/**
	 * Получение списка ставок
	 */
	async getBets(params?: FetchRecordsParams): Promise<BaserowListResponse<Bet>> {
		return this.fetchRecords<Bet>(BASEROW_TABLE_IDS.BETS, params)
	}

	/**
	 * Получение ставки по ID
	 */
	async getBetById(id: number): Promise<Bet> {
		return this.fetchRecordById<Bet>(BASEROW_TABLE_IDS.BETS, id)
	}

	/**
	 * Создание новой ставки
	 */
	async createBet(data: Partial<Bet>): Promise<Bet> {
		return this.createRecord<Bet>(BASEROW_TABLE_IDS.BETS, data)
	}

	/**
	 * Обновление ставки
	 */
	async updateBet(id: number, data: Partial<Bet>): Promise<Bet> {
		return this.updateRecord<Bet>(BASEROW_TABLE_IDS.BETS, id, data)
	}

	/**
	 * Удаление ставки
	 */
	async deleteBet(id: number): Promise<void> {
		return this.deleteRecord(BASEROW_TABLE_IDS.BETS, id)
	}

	// === Методы для работы с пользователями ===

	/**
	 * Получение списка пользователей
	 */
	async getUsers(params?: FetchRecordsParams): Promise<BaserowListResponse<User>> {
		return this.fetchRecords<User>(BASEROW_TABLE_IDS.USERS, params)
	}

	/**
	 * Получение пользователя по ID
	 */
	async getUserById(id: number): Promise<User> {
		return this.fetchRecordById<User>(BASEROW_TABLE_IDS.USERS, id)
	}

	/**
	 * Получение пользователя по Telegram ID
	 */
	async getUserByTelegramId(telegramId: string): Promise<User | null> {
		const response = await this.getUsers({ search: telegramId })
		return response.results.find(user => user.TelegramID === telegramId) || null
	}

	/**
	 * Создание нового пользователя
	 */
	async createUser(data: Partial<User>): Promise<User> {
		return this.createRecord<User>(BASEROW_TABLE_IDS.USERS, data)
	}

	/**
	 * Обновление пользователя
	 */
	async updateUser(id: number, data: Partial<User>): Promise<User> {
		return this.updateRecord<User>(BASEROW_TABLE_IDS.USERS, id, data)
	}

	/**
	 * Удаление пользователя
	 */
	async deleteUser(id: number): Promise<void> {
		return this.deleteRecord(BASEROW_TABLE_IDS.USERS, id)
	}
} 