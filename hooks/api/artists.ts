'use client'

import { useState, useEffect } from 'react'
import { ArtistModel } from '@/lib/services'

/**
 * Хук для получения списка всех художников
 */
export function useArtists() {
	const [artists, setArtists] = useState<ArtistModel[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchArtists = async () => {
			try {
				setIsLoading(true)
				const response = await fetch('/api/artists')
				
				if (!response.ok) {
					throw new Error('Не удалось загрузить данные о художниках')
				}
				
				const data = await response.json()
				setArtists(data)
			} catch (err) {
				console.error('Ошибка при получении художников:', err)
				setError((err as Error).message)
			} finally {
				setIsLoading(false)
			}
		}

		fetchArtists()
	}, [])

	return { artists, isLoading, error }
}

/**
 * Хук для получения информации о конкретном художнике по ID
 */
export function useArtist(id: number | null) {
	const [artist, setArtist] = useState<ArtistModel | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (!id) {
			setIsLoading(false)
			return
		}

		const fetchArtist = async () => {
			try {
				setIsLoading(true)
				const response = await fetch(`/api/artists?id=${id}`)
				
				if (!response.ok) {
					throw new Error(`Не удалось загрузить данные о художнике с ID ${id}`)
				}
				
				const data = await response.json()
				setArtist(data)
			} catch (err) {
				console.error(`Ошибка при получении художника с ID ${id}:`, err)
				setError((err as Error).message)
			} finally {
				setIsLoading(false)
			}
		}

		fetchArtist()
	}, [id])

	return { artist, isLoading, error }
} 