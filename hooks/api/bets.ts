'use client'

import { useState, useEffect } from 'react'
import { BetModel } from '@/lib/services'

/**
 * Хук для получения списка всех ставок
 */
export function useBets() {
	const [bets, setBets] = useState<BetModel[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchBets = async () => {
			try {
				setIsLoading(true)
				const response = await fetch('/api/bets')
				
				if (!response.ok) {
					throw new Error('Не удалось загрузить данные о ставках')
				}
				
				const data = await response.json()
				setBets(data)
			} catch (err) {
				console.error('Ошибка при получении ставок:', err)
				setError((err as Error).message)
			} finally {
				setIsLoading(false)
			}
		}

		fetchBets()
	}, [])

	return { bets, isLoading, error }
}

/**
 * Хук для получения ставок по ID лота
 */
export function useLotBets(lotId: number | null) {
	const [bets, setBets] = useState<BetModel[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (!lotId) {
			setIsLoading(false)
			return
		}

		const fetchLotBets = async () => {
			try {
				setIsLoading(true)
				const response = await fetch(`/api/bets?lotId=${lotId}`)
				
				if (!response.ok) {
					throw new Error(`Не удалось загрузить данные о ставках лота с ID ${lotId}`)
				}
				
				const data = await response.json()
				setBets(data)
			} catch (err) {
				console.error(`Ошибка при получении ставок лота с ID ${lotId}:`, err)
				setError((err as Error).message)
			} finally {
				setIsLoading(false)
			}
		}

		fetchLotBets()
	}, [lotId])

	return { bets, isLoading, error }
}

/**
 * Хук для получения ставок пользователя
 */
export function useUserBets(userId: number | null) {
	const [bets, setBets] = useState<BetModel[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (!userId) {
			setIsLoading(false)
			return
		}

		const fetchUserBets = async () => {
			try {
				setIsLoading(true)
				const response = await fetch(`/api/bets?userId=${userId}`)
				
				if (!response.ok) {
					throw new Error(`Не удалось загрузить данные о ставках пользователя с ID ${userId}`)
				}
				
				const data = await response.json()
				setBets(data)
			} catch (err) {
				console.error(`Ошибка при получении ставок пользователя с ID ${userId}:`, err)
				setError((err as Error).message)
			} finally {
				setIsLoading(false)
			}
		}

		fetchUserBets()
	}, [userId])

	return { bets, isLoading, error }
}

/**
 * Хук для создания новой ставки
 */
export function useCreateBet() {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [createdBet, setCreatedBet] = useState<BetModel | null>(null)

	const createBet = async (lotId: number, userId: number, value: number) => {
		try {
			setIsLoading(true)
			setError(null)
			setCreatedBet(null)

			const response = await fetch('/api/bets', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ lotId, userId, value }),
			})

			if (!response.ok) {
				const errorData = await response.json()
				throw new Error(errorData.error || 'Не удалось создать ставку')
			}

			const data = await response.json()
			setCreatedBet(data)
			return data
		} catch (err) {
			console.error('Ошибка при создании ставки:', err)
			setError((err as Error).message)
			return null
		} finally {
			setIsLoading(false)
		}
	}

	return { createBet, isLoading, error, createdBet }
} 