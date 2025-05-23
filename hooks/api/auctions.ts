import { useState, useEffect } from 'react'
import type { AuctionModel } from '@/lib/services/auctions'

interface UseAuctionsResult {
	auctions: AuctionModel[]
	isLoading: boolean
	error: string | null
	retry: () => void
}

interface UseAuctionResult {
	auction: AuctionModel | null
	isLoading: boolean
	error: string | null
	retry: () => void
}

/**
 * Хук для получения списка всех аукционов
 */
export function useAuctions(): UseAuctionsResult {
	const [auctions, setAuctions] = useState<AuctionModel[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const fetchAuctions = async () => {
		try {
			setIsLoading(true)
			setError(null)
			
			const response = await fetch('/api/auctions')
			if (!response.ok) {
				throw new Error('Ошибка при получении аукционов')
			}
			
			const data = await response.json()
			setAuctions(data)
		} catch (err) {
			console.error('Ошибка при загрузке аукционов:', err)
			setError(err instanceof Error ? err.message : 'Неизвестная ошибка')
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		fetchAuctions()
	}, [])

	return {
		auctions,
		isLoading,
		error,
		retry: fetchAuctions,
	}
}

/**
 * Хук для получения активного аукциона
 */
export function useActiveAuction(): UseAuctionResult {
	const [auction, setAuction] = useState<AuctionModel | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const fetchActiveAuction = async () => {
		try {
			setIsLoading(true)
			setError(null)
			
			const response = await fetch('/api/auctions/active')
			if (!response.ok) {
				if (response.status === 404) {
					// Нет активного аукциона - это нормальная ситуация
					setAuction(null)
					return
				}
				throw new Error('Ошибка при получении активного аукциона')
			}
			
			const data = await response.json()
			setAuction(data)
		} catch (err) {
			console.error('Ошибка при загрузке активного аукциона:', err)
			setError(err instanceof Error ? err.message : 'Неизвестная ошибка')
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		fetchActiveAuction()
	}, [])

	return {
		auction,
		isLoading,
		error,
		retry: fetchActiveAuction,
	}
}

/**
 * Хук для получения аукциона по ID
 */
export function useAuction(id: number | null): UseAuctionResult {
	const [auction, setAuction] = useState<AuctionModel | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const fetchAuction = async () => {
		if (!id) {
			setIsLoading(false)
			return
		}

		try {
			setIsLoading(true)
			setError(null)
			
			const response = await fetch(`/api/auctions/${id}`)
			if (!response.ok) {
				throw new Error('Ошибка при получении аукциона')
			}
			
			const data = await response.json()
			setAuction(data)
		} catch (err) {
			console.error('Ошибка при загрузке аукциона:', err)
			setError(err instanceof Error ? err.message : 'Неизвестная ошибка')
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		fetchAuction()
	}, [id])

	return {
		auction,
		isLoading,
		error,
		retry: fetchAuction,
	}
} 