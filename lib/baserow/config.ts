/**
 * Конфигурация для подключения к Baserow API
 */

// ID таблиц
export const BASEROW_TABLE_IDS = {
	LOTS: 425401,
	ARTISTS: 425410,
	BETS: 427189,
	USERS: 427190,
	AUCTIONS: 547257,
}

// Настройки подключения
export const BASEROW_CONFIG = {
	API_URL: process.env.NEXT_PUBLIC_BASEROW_API_URL || 'https://api.baserow.io',
	API_TOKEN: process.env.BASEROW_API_TOKEN || '',
	USER_FIELD_NAMES: true, // Использовать оригинальные имена полей из Baserow
}

// Стандартные параметры запросов
export const DEFAULT_FETCH_PARAMS = {
	page: 1,
	size: 100,
} 