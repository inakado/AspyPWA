'use client'

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useArtists } from "@/hooks/api"
import { pluralizeWorks } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

export default function ArtistsPage() {
  const { artists, isLoading, error } = useArtists()
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [styleFilter, setStyleFilter] = useState('all')

  // Фильтрация и сортировка художников
  const filteredArtists = useMemo(() => {
    if (!artists.length) return []

    let result = [...artists]

    // Фильтрация по поисковому запросу
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        artist => artist.name.toLowerCase().includes(query) || 
                 artist.displayName.toLowerCase().includes(query)
      )
    }

    // Фильтрация по стилю (здесь заглушка)
    if (styleFilter !== 'all') {
      // В реальном приложении здесь будет фильтрация по тегам/стилям
      // Оставляем как заглушку
    }

    // Сортировка результатов
    result.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name)
      } else if (sortBy === 'artworks') {
        return b.artworksCount - a.artworksCount
      }
      return 0
    })

    return result
  }, [artists, searchQuery, sortBy, styleFilter])

  // Отображение состояния загрузки
  if (isLoading) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <Skeleton className="h-10 w-48 mb-6" />
        <div className="flex flex-col gap-4 mb-6 md:flex-row">
          <Skeleton className="h-10 flex-1" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-[180px]" />
            <Skeleton className="h-10 w-[180px]" />
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <Skeleton className="aspect-video w-full" />
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-5 w-32 mb-1" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Отображение ошибки
  if (error) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <h1 className="mb-6 text-3xl font-bold">Художники</h1>
        <div className="p-6 text-center bg-destructive/10 rounded-lg">
          <h2 className="text-xl font-semibold text-destructive mb-2">Ошибка загрузки</h2>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Художники</h1>

      <div className="flex flex-col gap-4 mb-6 md:flex-row">
        <div className="flex-1">
          <Input 
            type="search" 
            placeholder="Поиск по имени художника..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={styleFilter} onValueChange={setStyleFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Стиль" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все стили</SelectItem>
              <SelectItem value="impressionism">Импрессионизм</SelectItem>
              <SelectItem value="abstract">Абстракционизм</SelectItem>
              <SelectItem value="realism">Реализм</SelectItem>
              <SelectItem value="modern">Современное искусство</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Сортировка" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">По имени</SelectItem>
              <SelectItem value="artworks">По количеству работ</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredArtists.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg text-muted-foreground">Художники не найдены</p>
          {searchQuery && (
            <button 
              className="mt-2 text-primary hover:underline"
              onClick={() => setSearchQuery('')}
            >
              Сбросить поисковый запрос
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredArtists.map((artist) => (
            <Card key={artist.id} className="overflow-hidden">
              <div className="relative aspect-video">
                <Image
                  src={artist.image || "/placeholder.svg"}
                  alt={`${artist.name} artwork`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={artist.image || "/placeholder.svg"} alt={artist.name} />
                    <AvatarFallback className="bg-art-primary text-white">
                      {artist.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Link href={`/artists/${artist.id}`}>
                      <h3 className="font-semibold hover:text-primary">{artist.displayName || artist.name}</h3>
                    </Link>
                    <p className="text-sm text-muted-foreground">{pluralizeWorks(artist.artworksCount)}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {artist.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2 py-1 text-xs bg-muted rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
