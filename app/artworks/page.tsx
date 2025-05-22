'use client'

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useLots } from "@/hooks/api"
import { Skeleton } from "@/components/ui/skeleton"
import { Search } from "lucide-react"

export default function ArtworksPage() {
  const { lots, isLoading, error } = useLots()
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [artistFilter, setArtistFilter] = useState('all')

  // Получаем уникальных художников для фильтра
  const artists = useMemo(() => {
    if (!lots.length) return []

    const artistsMap = new Map()
    
    lots.forEach(lot => {
      lot.artists.forEach(artist => {
        if (!artistsMap.has(artist.id)) {
          artistsMap.set(artist.id, {
            id: artist.id,
            name: artist.displayName || artist.name
          })
        }
      })
    })
    
    return Array.from(artistsMap.values())
  }, [lots])

  // Фильтрация и сортировка работ
  const filteredArtworks = useMemo(() => {
    if (!lots.length) return []

    let result = [...lots]

    // Фильтрация по поисковому запросу
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        lot => lot.name.toLowerCase().includes(query) ||
              lot.artists.some(artist => 
                (artist.displayName || artist.name).toLowerCase().includes(query)
              )
      )
    }

    // Фильтрация по художнику
    if (artistFilter !== 'all') {
      result = result.filter(lot => 
        lot.artists.some(artist => artist.id === parseInt(artistFilter))
      )
    }

    // Сортировка результатов
    result.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name)
      } else if (sortBy === 'price') {
        return a.initialPrice - b.initialPrice
      } else if (sortBy === 'date') {
        // Сортировка по году (предполагая, что это число)
        return parseInt(b.year) - parseInt(a.year)
      }
      return 0
    })

    return result
  }, [lots, searchQuery, sortBy, artistFilter])

  // Обработка поиска
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="text-3xl font-serif font-medium text-art-primary mb-6">Все работы</h1>

      <div className="flex flex-col gap-4 mb-6 md:flex-row">
        <div className="flex-1">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input 
              type="search" 
              placeholder="Поиск по названию или художнику..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" variant="outline">
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>
        <div className="flex gap-2 flex-col sm:flex-row">
          <Select value={artistFilter} onValueChange={setArtistFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Художник" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все художники</SelectItem>
              {artists.map(artist => (
                <SelectItem key={artist.id} value={artist.id.toString()}>
                  {artist.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Сортировка" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">По названию</SelectItem>
              <SelectItem value="price">По цене</SelectItem>
              <SelectItem value="date">По году создания</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, index) => (
            <Card key={index}>
              <Skeleton className="aspect-[3/4] w-full" />
              <CardContent className="pt-5">
                <Skeleton className="h-6 w-40 mb-2" />
                <Skeleton className="h-4 w-32 mb-4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-lg text-red-500 mb-4">Ошибка при загрузке данных</p>
          <Button onClick={() => window.location.reload()}>Попробовать снова</Button>
        </div>
      ) : filteredArtworks.length === 0 ? (
        <p className="text-muted-foreground">По вашему запросу ничего не найдено</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredArtworks.map((artwork) => (
            <Card key={artwork.id}>
              <div className="relative aspect-[3/4]">
                <Link href={`/artworks/${artwork.id}`}>
                  <Image
                    src={artwork.image || "/placeholder.svg"}
                    alt={artwork.name}
                    fill
                    className="object-cover cursor-pointer transition-opacity hover:opacity-90"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  />
                  {!artwork.isActive && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#1E3557]/40">
                      <span className="px-3 py-1 text-sm font-medium text-white bg-art-primary/90 rounded-sm">Продано</span>
                    </div>
                  )}
                </Link>
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
                    {artwork.isActive ? (
                      <>
                        <p className="text-xs text-foreground/70">Начальная цена</p>
                        <p className="font-medium text-art-primary">{artwork.initialPrice.toLocaleString('ru-RU')} ₽</p>
                      </>
                    ) : (
                      <>
                        {!artwork.finalText && <p className="text-xs text-foreground/70">Продано за</p>}
                        <p className="font-medium text-art-primary">
                          {artwork.finalText || (artwork.finalPrice ? artwork.finalPrice.toLocaleString('ru-RU') : artwork.initialPrice.toLocaleString('ru-RU')) + ' ₽'}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 