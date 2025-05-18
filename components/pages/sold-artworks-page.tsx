'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useSoldLots } from '@/hooks/api'
import { Search } from 'lucide-react'

export default function SoldArtworksPage() {
	const { lots: soldArtworks, isLoading, error, retry } = useSoldLots()
	const [currentPage, setCurrentPage] = useState(1)
	const [searchQuery, setSearchQuery] = useState('')
	const itemsPerPage = 12

	// Фильтрация работ по поисковому запросу
	const filteredArtworks = soldArtworks.filter((artwork) =>
		artwork.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
		artwork.artists.some(artist => 
			(artist.displayName || artist.name).toLowerCase().includes(searchQuery.toLowerCase())
		)
	)

	// Пагинация
	const indexOfLastItem = currentPage * itemsPerPage
	const indexOfFirstItem = indexOfLastItem - itemsPerPage
	const currentItems = filteredArtworks.slice(indexOfFirstItem, indexOfLastItem)
	const totalPages = Math.ceil(filteredArtworks.length / itemsPerPage)

	// Генерация страниц для пагинации
	const getPageNumbers = () => {
		const pages = []
		for (let i = 1; i <= totalPages; i++) {
			pages.push(i)
		}
		return pages
	}

	// Обработка поиска
	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault()
		setCurrentPage(1) // Сбрасываем на первую страницу при поиске
	}

	// Отображение состояния загрузки
	if (isLoading) {
		return (
			<div className="container py-10">
				<h1 className="text-4xl font-serif font-medium text-art-primary mb-6">Проданные работы</h1>
				<div className="mb-6 w-full max-w-md">
					<Skeleton className="h-10 w-full" />
				</div>
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{[...Array(8)].map((_, index) => (
						<Card key={index}>
							<Skeleton className="aspect-[3/4] w-full" />
							              <CardContent className="pt-5">
                <Skeleton className="h-6 w-40 mb-2" />
								<Skeleton className="h-4 w-32 mb-4" />
								<div className="flex items-center justify-between mt-4">
									<div>
										<Skeleton className="h-3 w-20 mb-1" />
										<Skeleton className="h-5 w-24" />
									</div>
									<Skeleton className="h-4 w-24" />
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		)
	}

	// Обработка ошибки с возможностью повторной попытки
	if (error) {
		return (
			<div className="container py-10">
				<h1 className="text-4xl font-serif font-medium text-art-primary mb-6">Проданные работы</h1>
				<Alert variant="destructive" className="mb-4">
					<AlertDescription>{error}</AlertDescription>
				</Alert>
				<Button
					onClick={retry}
					variant="default"
					className="bg-art-primary hover:bg-art-accent"
				>
					Попробовать снова
				</Button>
			</div>
		)
	}

	// Если нет проданных работ
	if (soldArtworks.length === 0) {
		return (
			<div className="container py-10">
				<h1 className="text-4xl font-serif font-medium text-art-primary mb-6">Проданные работы</h1>
				<p className="text-muted-foreground">Нет проданных работ</p>
			</div>
		)
	}

	return (
		<div className="container py-10">
			<h1 className="text-4xl font-serif font-medium text-art-primary mb-6">Проданные работы</h1>
			
			{/* Поиск */}
			<form onSubmit={handleSearch} className="mb-8 flex gap-2 max-w-md">
				<Input
					type="text"
					placeholder="Поиск по названию или художнику"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="w-full"
				/>
				<Button type="submit" variant="outline">
					<Search className="h-4 w-4" />
				</Button>
			</form>
			
			{filteredArtworks.length === 0 ? (
				<p className="text-muted-foreground">По вашему запросу ничего не найдено</p>
			) : (
				<>
					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{currentItems.map((artwork) => (
							<Card key={artwork.id}>
								<div className="relative aspect-[3/4]">
									<Image
										src={artwork.image || "/placeholder.svg"}
										alt={artwork.name}
										fill
										className="object-cover"
										sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
									/>
									<div className="absolute inset-0 flex items-center justify-center bg-[#1E3557]/40">
										<span className="px-3 py-1 text-sm font-medium text-white bg-art-primary/90 rounded-sm">Продано</span>
									</div>
								</div>
								                <CardContent className="pt-5">
                  <Link href={`/artworks/${artwork.id}`} className="elegant-link">
										<h3 className="font-serif font-medium text-art-primary">{artwork.name}</h3>
									</Link>
									{artwork.artists.length > 0 && (
										<Link
											href={`/artists/${artwork.artists[0].id}`}
											className="text-sm text-foreground/70 hover:text-art-accent transition-colors"
										>
											{artwork.artists[0].displayName || artwork.artists[0].name}
										</Link>
									)}
									<div className="flex items-center justify-between mt-4">
										<div>
											<p className="text-xs text-foreground/70">Продано за</p>
											<p className="font-medium text-art-primary">
												{artwork.finalPrice ? artwork.finalPrice.toLocaleString('ru-RU') : artwork.initialPrice.toLocaleString('ru-RU')} ₽
											</p>
										</div>
										{/* <p className="text-sm text-foreground/70">{new Date().toLocaleDateString("ru-RU")}</p> */}
									</div>
								</CardContent>
							</Card>
						))}
					</div>

					{/* Пагинация */}
					{totalPages > 1 && (
						<Pagination className="mt-8">
							<PaginationContent>
								<PaginationItem>
									<PaginationPrevious
										href="#"
										onClick={(e) => {
											e.preventDefault()
											if (currentPage > 1) setCurrentPage(currentPage - 1)
										}}
										className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
									/>
								</PaginationItem>
								
								{getPageNumbers().map(page => (
									<PaginationItem key={page}>
										<PaginationLink
											href="#"
											onClick={(e) => {
												e.preventDefault()
												setCurrentPage(page)
											}}
											isActive={page === currentPage}
										>
											{page}
										</PaginationLink>
									</PaginationItem>
								))}
								
								<PaginationItem>
									<PaginationNext
										href="#"
										onClick={(e) => {
											e.preventDefault()
											if (currentPage < totalPages) setCurrentPage(currentPage + 1)
										}}
										className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
									/>
								</PaginationItem>
							</PaginationContent>
						</Pagination>
					)}
				</>
			)}
		</div>
	)
} 