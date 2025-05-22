'use client'

import { useState, useEffect } from 'react'
import { LotModel } from '@/lib/services'

/**
 * Хук для получения списка всех лотов
 */
export function useLots() {
	const [lots, setLots] = useState<LotModel[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchLots = async () => {
			try {
				setIsLoading(true)
				const response = await fetch('/api/lots')
				
				if (!response.ok) {
					throw new Error('Не удалось загрузить данные о лотах')
				}
				
				const data = await response.json()
				setLots(data)
			} catch (err) {
				console.error('Ошибка при получении лотов:', err)
				setError((err as Error).message)
			} finally {
				setIsLoading(false)
			}
		}

		fetchLots()
	}, [])

	return { lots, isLoading, error }
}

/**
 * Хук для получения списка активных лотов
 */
export function useActiveLots() {
	const [lots, setLots] = useState<LotModel[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchActiveLots = async () => {
			try {
				setIsLoading(true)
				const response = await fetch('/api/lots?active=true')
				
				if (!response.ok) {
					throw new Error('Не удалось загрузить данные об активных лотах')
				}
				
				const data = await response.json()
				setLots(data)
			} catch (err) {
				console.error('Ошибка при получении активных лотов:', err)
				setError((err as Error).message)
			} finally {
				setIsLoading(false)
			}
		}

		fetchActiveLots()
	}, [])

	return { lots, isLoading, error }
}

/**
 * Хук для получения списка проданных лотов
 */
export function useSoldLots() {
	const [lots, setLots] = useState<LotModel[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [retryCount, setRetryCount] = useState(0)
	const MAX_RETRIES = 3

	useEffect(() => {
		const fetchSoldLots = async () => {
			try {
				setIsLoading(true)
				setError(null)
				
				const response = await fetch('/api/lots?sold=true')
				
				if (!response.ok) {
					throw new Error('Не удалось загрузить данные о проданных лотах')
				}
				
				const data = await response.json()
				setLots(data)
			} catch (err) {
				console.error('Ошибка при получении проданных лотов:', err)
				
				// Если это не последняя попытка, повторяем
				if (retryCount < MAX_RETRIES) {
					setTimeout(() => {
						setRetryCount(prev => prev + 1)
					}, 1000) // 1 секунда между попытками
				} else {
					setError((err as Error).message)
				}
			} finally {
				setIsLoading(false)
			}
		}

		fetchSoldLots()
	}, [retryCount])

	// Функция для ручного повторного запроса
	const retry = () => setRetryCount(0)

	return { lots, isLoading, error, retry }
}

/**
 * Хук для получения информации о конкретном лоте по ID
 */
export function useLot(id: number | null) {
	const [lot, setLot] = useState<LotModel | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (!id) {
			setIsLoading(false)
			return
		}

		const fetchLot = async () => {
			try {
				setIsLoading(true)
				const response = await fetch(`/api/lots?id=${id}`)
				
				if (!response.ok) {
					throw new Error(`Не удалось загрузить данные о лоте с ID ${id}`)
				}
				
				const data = await response.json()
				setLot(data)
			} catch (err) {
				console.error(`Ошибка при получении лота с ID ${id}:`, err)
				setError((err as Error).message)
			} finally {
				setIsLoading(false)
			}
		}

		fetchLot()
	}, [id])

	return { lot, isLoading, error }
}

/**
 * Хук для получения списка лотов конкретного художника
 */
export function useArtistLots(artistId: number | null) {
	const [lots, setLots] = useState<LotModel[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (!artistId) {
			setIsLoading(false)
			return
		}

		const fetchArtistLots = async () => {
			try {
				setIsLoading(true)
				const response = await fetch(`/api/lots?artistId=${artistId}`)
				
				if (!response.ok) {
					throw new Error(`Не удалось загрузить данные о лотах художника с ID ${artistId}`)
				}
				
				const data = await response.json()
				setLots(data)
			} catch (err) {
				console.error(`Ошибка при получении лотов художника с ID ${artistId}:`, err)
				setError((err as Error).message)
			} finally {
				setIsLoading(false)
			}
		}

		fetchArtistLots()
	}, [artistId])

	return { lots, isLoading, error }
} 

/**
 * Хук для получения списка избранных лотов
 */
export function useFavoriteArtworks() {
	const [lots, setLots] = useState<LotModel[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [retryCount, setRetryCount] = useState(0)
	const MAX_RETRIES = 3

	useEffect(() => {
		const fetchFavoriteArtworks = async () => {
			try {
				setIsLoading(true)
				setError(null)
				
				const response = await fetch('/api/lots?favorite=true')
				
				if (!response.ok) {
					throw new Error('Не удалось загрузить данные об избранных работах')
				}
				
				const data = await response.json()
				setLots(data)
			} catch (err) {
				console.error('Ошибка при получении избранных работ:', err)
				
				// Если это не последняя попытка, повторяем
				if (retryCount < MAX_RETRIES) {
					setTimeout(() => {
						setRetryCount(prev => prev + 1)
					}, 1000) // 1 секунда между попытками
				} else {
					setError((err as Error).message)
				}
			} finally {
				setIsLoading(false)
			}
		}

		fetchFavoriteArtworks()
	}, [retryCount])

	// Функция для ручного повторного запроса
	const retry = () => setRetryCount(0)

	return { lots, isLoading, error, retry }
} 