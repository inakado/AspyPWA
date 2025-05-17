'use client'

import { useState, useEffect } from 'react'
import { UserModel } from '@/lib/services'

/**
 * Хук для получения списка всех пользователей
 */
export function useUsers() {
	const [users, setUsers] = useState<UserModel[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				setIsLoading(true)
				const response = await fetch('/api/users')
				
				if (!response.ok) {
					throw new Error('Не удалось загрузить данные о пользователях')
				}
				
				const data = await response.json()
				setUsers(data)
			} catch (err) {
				console.error('Ошибка при получении пользователей:', err)
				setError((err as Error).message)
			} finally {
				setIsLoading(false)
			}
		}

		fetchUsers()
	}, [])

	return { users, isLoading, error }
}

/**
 * Хук для получения пользователя по ID
 */
export function useUser(id: number | null) {
	const [user, setUser] = useState<UserModel | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (!id) {
			setIsLoading(false)
			return
		}

		const fetchUser = async () => {
			try {
				setIsLoading(true)
				const response = await fetch(`/api/users?id=${id}`)
				
				if (!response.ok) {
					throw new Error(`Не удалось загрузить данные о пользователе с ID ${id}`)
				}
				
				const data = await response.json()
				setUser(data)
			} catch (err) {
				console.error(`Ошибка при получении пользователя с ID ${id}:`, err)
				setError((err as Error).message)
			} finally {
				setIsLoading(false)
			}
		}

		fetchUser()
	}, [id])

	return { user, isLoading, error }
}

/**
 * Хук для получения пользователя по Telegram ID
 */
export function useUserByTelegramId(telegramId: string | null) {
	const [user, setUser] = useState<UserModel | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (!telegramId) {
			setIsLoading(false)
			return
		}

		const fetchUser = async () => {
			try {
				setIsLoading(true)
				const response = await fetch(`/api/users?telegramId=${telegramId}`)
				
				if (response.status === 404) {
					// Пользователь не найден, но это не ошибка
					setUser(null)
					return
				}
				
				if (!response.ok) {
					throw new Error(`Не удалось загрузить данные о пользователе с Telegram ID ${telegramId}`)
				}
				
				const data = await response.json()
				setUser(data)
			} catch (err) {
				console.error(`Ошибка при получении пользователя с Telegram ID ${telegramId}:`, err)
				setError((err as Error).message)
			} finally {
				setIsLoading(false)
			}
		}

		fetchUser()
	}, [telegramId])

	return { user, isLoading, error }
}

/**
 * Хук для создания нового пользователя
 */
export function useCreateUser() {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [createdUser, setCreatedUser] = useState<UserModel | null>(null)

	const createUser = async (
		telegramId: string,
		username: string,
		phoneNumber?: string,
		profileImage?: string
	) => {
		try {
			setIsLoading(true)
			setError(null)
			setCreatedUser(null)

			const response = await fetch('/api/users', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					telegramId,
					username,
					phoneNumber,
					profileImage,
				}),
			})

			const data = await response.json()

			// Проверяем на конфликт (пользователь уже существует)
			if (response.status === 409) {
				// Возвращаем существующего пользователя
				setCreatedUser(data.user)
				return data.user
			}

			if (!response.ok) {
				throw new Error(data.error || 'Не удалось создать пользователя')
			}

			setCreatedUser(data)
			return data
		} catch (err) {
			console.error('Ошибка при создании пользователя:', err)
			setError((err as Error).message)
			return null
		} finally {
			setIsLoading(false)
		}
	}

	return { createUser, isLoading, error, createdUser }
}

/**
 * Хук для обновления пользователя
 */
export function useUpdateUser() {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [updatedUser, setUpdatedUser] = useState<UserModel | null>(null)

	const updateUser = async (id: number, userData: Partial<UserModel>) => {
		try {
			setIsLoading(true)
			setError(null)
			setUpdatedUser(null)

			const response = await fetch('/api/users', {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					id,
					...userData,
				}),
			})

			if (!response.ok) {
				const errorData = await response.json()
				throw new Error(errorData.error || 'Не удалось обновить пользователя')
			}

			const data = await response.json()
			setUpdatedUser(data)
			return data
		} catch (err) {
			console.error(`Ошибка при обновлении пользователя с ID ${id}:`, err)
			setError((err as Error).message)
			return null
		} finally {
			setIsLoading(false)
		}
	}

	return { updateUser, isLoading, error, updatedUser }
} 