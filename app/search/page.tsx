"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { searchArtworks, searchArtists } from "@/lib/search"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  const [query, setQuery] = useState(initialQuery)
  const [searchResults, setSearchResults] = useState({ artworks: [], artists: [] })
  const [activeTab, setActiveTab] = useState("artworks")
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery)
    }
  }, [initialQuery])

  const handleSearch = async (searchQuery: string) => {
    setIsSearching(true)
    try {
      const artworksResults = await searchArtworks(searchQuery)
      const artistsResults = await searchArtists(searchQuery)
      setSearchResults({
        artworks: artworksResults,
        artists: artistsResults,
      })
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      handleSearch(query)
      // Update URL with search query
      const url = new URL(window.location.href)
      url.searchParams.set("q", query)
      window.history.pushState({}, "", url)
    }
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Поиск</h1>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <Input
          type="search"
          placeholder="Поиск по названию, художнику, стилю..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={isSearching}>
          {isSearching ? "Поиск..." : "Найти"}
        </Button>
      </form>

      {(searchResults.artworks.length > 0 || searchResults.artists.length > 0) && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="artworks">Произведения ({searchResults.artworks.length})</TabsTrigger>
            <TabsTrigger value="artists">Художники ({searchResults.artists.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="artworks">
            <div className="flex flex-col gap-4 mb-6 md:flex-row">
              <div className="flex-1">
                <p className="text-muted-foreground">
                  Найдено {searchResults.artworks.length} произведений по запросу "{initialQuery}"
                </p>
              </div>
              <div className="flex gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Категория" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все категории</SelectItem>
                    <SelectItem value="painting">Живопись</SelectItem>
                    <SelectItem value="sculpture">Скульптура</SelectItem>
                    <SelectItem value="photography">Фотография</SelectItem>
                    <SelectItem value="graphics">Графика</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="relevance">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Сортировка" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">По релевантности</SelectItem>
                    <SelectItem value="price-asc">По цене (возр.)</SelectItem>
                    <SelectItem value="price-desc">По цене (убыв.)</SelectItem>
                    <SelectItem value="name">По названию</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {searchResults.artworks.map((artwork: any) => (
                <Card key={artwork.id} className="overflow-hidden">
                  <div className="relative aspect-[3/4]">
                    <Image
                      src={artwork.image || "/placeholder.svg"}
                      alt={artwork.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    />
                  </div>
                  <CardContent className="p-4">
                    <Link href={`/artworks/${artwork.id}`}>
                      <h3 className="font-semibold hover:text-primary">{artwork.title}</h3>
                    </Link>
                    <Link
                      href={`/artists/${artwork.artistId}`}
                      className="text-sm text-muted-foreground hover:text-primary"
                    >
                      {artwork.artist}
                    </Link>
                    <div className="flex items-center justify-between mt-4">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {artwork.status === "sold" ? "Продано за" : "Текущая ставка"}
                        </p>
                        <p className="font-medium">
                          {artwork.status === "sold" ? artwork.soldPrice : artwork.currentBid || artwork.startingPrice}{" "}
                          ₽
                        </p>
                      </div>
                      <Button size="sm" asChild>
                        <Link href={`/artworks/${artwork.id}`}>
                          {artwork.status === "active" ? "Сделать ставку" : "Подробнее"}
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="artists">
            <div className="flex flex-col gap-4 mb-6 md:flex-row">
              <div className="flex-1">
                <p className="text-muted-foreground">
                  Найдено {searchResults.artists.length} художников по запросу "{initialQuery}"
                </p>
              </div>
              <div className="flex gap-2">
                <Select defaultValue="relevance">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Сортировка" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">По релевантности</SelectItem>
                    <SelectItem value="name">По имени</SelectItem>
                    <SelectItem value="popularity">По популярности</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {searchResults.artists.map((artist: any) => (
                <Card key={artist.id} className="overflow-hidden">
                  <div className="relative aspect-video">
                    <Image
                      src={artist.coverImage || "/placeholder.svg"}
                      alt={`${artist.name} artwork`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 overflow-hidden rounded-full">
                        <Image
                          src={artist.image || "/placeholder.svg"}
                          alt={artist.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <Link href={`/artists/${artist.id}`}>
                          <h3 className="font-semibold hover:text-primary">{artist.name}</h3>
                        </Link>
                        <p className="text-sm text-muted-foreground">{artist.artworksCount} работ</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {artist.tags.slice(0, 3).map((tag: string) => (
                        <span key={tag} className="px-2 py-1 text-xs bg-muted rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}

      {initialQuery && searchResults.artworks.length === 0 && searchResults.artists.length === 0 && !isSearching && (
        <div className="p-8 text-center border rounded-lg">
          <h2 className="mb-2 text-xl font-semibold">Ничего не найдено</h2>
          <p className="mb-4 text-muted-foreground">
            По запросу "{initialQuery}" ничего не найдено. Попробуйте изменить запрос или просмотреть наши категории.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Button variant="outline" asChild>
              <Link href="/artworks">Все произведения</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/artists">Все художники</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/auctions">Аукционы</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
