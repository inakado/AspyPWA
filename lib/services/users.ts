import { baserowClient } from '../baserow'
import type { BaserowReference, User } from '../baserow'

/**
 * Адаптированная модель пользователя для использования на клиенте
 */
export interface UserModel {
	id: number
	username: string
	telegramId: string
	profileImage: string | null
	phoneNumber: string | null
	bets: { id: number; value: string }[]
}

/**
 * Получение списка всех пользователей
 */
export async function getUsers(): Promise<UserModel[]> {
	try {
		const response = await baserowClient.getUsers()
		return response.results.map(transformUserToModel)
	} catch (error) {
		console.error('Ошибка при получении списка пользователей:', error)
		return []
	}
}

/**
 * Получение пользователя по ID
 */
export async function getUserById(id: number): Promise<UserModel | null> {
	try {
		const user = await baserowClient.getUserById(id)
		return transformUserToModel(user)
	} catch (error) {
		console.error(`Ошибка при получении пользователя с ID ${id}:`, error)
		return null
	}
}

/**
 * Получение пользователя по Telegram ID
 */
export async function getUserByTelegramId(telegramId: string): Promise<UserModel | null> {
	try {
		const user = await baserowClient.getUserByTelegramId(telegramId)
		return user ? transformUserToModel(user) : null
	} catch (error) {
		console.error(`Ошибка при получении пользователя с Telegram ID ${telegramId}:`, error)
		return null
	}
}

/**
 * Создание нового пользователя
 */
export async function createUser(
	telegramId: string,
	username: string,
	phoneNumber?: string,
	profileImage?: string
): Promise<UserModel | null> {
	try {
		const userData = {
			TelegramID: telegramId,
			Username: username,
			PhoneNumber: phoneNumber || null,
			ProfileImage: profileImage || '',
		}

		const newUser = await baserowClient.createUser(userData)
		return transformUserToModel(newUser)
	} catch (error) {
		console.error('Ошибка при создании пользователя:', error)
		return null
	}
}

/**
 * Обновление пользователя
 */
export async function updateUser(
	id: number,
	data: Partial<UserModel>
): Promise<UserModel | null> {
	try {
		// Преобразуем модель клиента в модель Baserow
		const userData: Partial<User> = {
			Username: data.username,
			TelegramID: data.telegramId,
			PhoneNumber: data.phoneNumber,
			ProfileImage: data.profileImage || '',
		}

		const updatedUser = await baserowClient.updateUser(id, userData)
		return transformUserToModel(updatedUser)
	} catch (error) {
		console.error(`Ошибка при обновлении пользователя с ID ${id}:`, error)
		return null
	}
}

/**
 * Преобразование данных из Baserow в модель пользователя
 */
function transformUserToModel(user: User): UserModel {
	// Преобразуем ставки
	const bets = user.Bets?.map(transformReference) || []

	return {
		id: user.id,
		username: user.Username || '',
		telegramId: user.TelegramID || '',
		profileImage: user.ProfileImage || null,
		phoneNumber: user.PhoneNumber,
		bets,
	}
}

/**
 * Преобразование ссылки Baserow в объект { id, value }
 */
function transformReference(ref: BaserowReference) {
	return {
		id: ref.id,
		value: ref.value,
	}
} 