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
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import type { SearchResults } from '@/lib/services/search'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  
  const [results, setResults] = useState<SearchResults | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchResults() {
      if (!query.trim()) {
        setResults({ artworks: [], artists: [] })
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        if (!response.ok) {
          throw new Error('Ошибка при выполнении поиска')
        }
        
        const data = await response.json()
        setResults(data)
      } catch (err) {
        console.error('Ошибка при поиске:', err)
        setError((err as Error).message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchResults()
  }, [query])

  const totalResults = (results?.artworks?.length || 0) + (results?.artists?.length || 0)

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="text-3xl font-serif font-medium text-art-primary mb-4">
        {query ? `Результаты поиска: "${query}"` : 'Поиск'}
      </h1>

      {isLoading ? (
        <div className="space-y-8">
          <Skeleton className="h-8 w-64 mb-4" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(4)].map((_, index) => (
              <Card key={index}>
                <Skeleton className="aspect-[3/4] w-full" />
                <CardContent className="pt-5">
                  <Skeleton className="h-6 w-40 mb-2" />
                  <Skeleton className="h-4 w-32 mb-4" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : error ? (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <>
          {query && totalResults === 0 ? (
            <p className="text-muted-foreground mb-6">По запросу "{query}" ничего не найдено</p>
          ) : (
            <>
              <p className="text-muted-foreground mb-6">
                {totalResults} {totalResults === 1 ? 'результат' : 
                totalResults >= 2 && totalResults <= 4 ? 'результата' : 
                'результатов'}
              </p>

              <Tabs defaultValue="all" className="mb-8">
                <TabsList>
                  <TabsTrigger value="all">Все результаты</TabsTrigger>
                  <TabsTrigger value="artworks">Произведения ({results?.artworks?.length || 0})</TabsTrigger>
                  <TabsTrigger value="artists">Художники ({results?.artists?.length || 0})</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="mt-6">
                  {/* Художники */}
                  {results?.artists && results.artists.length > 0 && (
                    <div className="mb-10">
                      <h2 className="text-xl font-medium mb-4">Художники</h2>
                      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {results.artists.map(artist => (
                          <Card key={artist.id}>
                            <div className="relative aspect-[1/1]">
                              <Link href={`/artists/${artist.id}`}>
                                <Image
                                  src={artist.image || "/placeholder.svg"}
                                  alt={artist.displayName || artist.name}
                                  fill
                                  className="object-cover cursor-pointer transition-opacity hover:opacity-90"
                                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                                />
                              </Link>
                            </div>
                            <CardContent className="pt-5">
                              <Link href={`/artists/${artist.id}`} className="elegant-link">
                                <h3 className="font-serif font-medium text-art-primary">{artist.displayName || artist.name}</h3>
                              </Link>
                              <p className="text-sm text-foreground/70">
                                {artist.artworksCount} {artist.artworksCount === 1 ? 'работа' : 
                                artist.artworksCount >= 2 && artist.artworksCount <= 4 ? 'работы' : 
                                'работ'}
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Произведения */}
                  {results?.artworks && results.artworks.length > 0 && (
                    <div>
                      <h2 className="text-xl font-medium mb-4">Произведения</h2>
                      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {results.artworks.map(artwork => (
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
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="artworks" className="mt-6">
                  {results?.artworks && results.artworks.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {results.artworks.map(artwork => (
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
                  ) : (
                    <p className="text-muted-foreground">Произведения не найдены</p>
                  )}
                </TabsContent>
                
                <TabsContent value="artists" className="mt-6">
                  {results?.artists && results.artists.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {results.artists.map(artist => (
                        <Card key={artist.id}>
                          <div className="relative aspect-[1/1]">
                            <Link href={`/artists/${artist.id}`}>
                              <Image
                                src={artist.image || "/placeholder.svg"}
                                alt={artist.displayName || artist.name}
                                fill
                                className="object-cover cursor-pointer transition-opacity hover:opacity-90"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                              />
                            </Link>
                          </div>
                          <CardContent className="pt-5">
                            <Link href={`/artists/${artist.id}`} className="elegant-link">
                              <h3 className="font-serif font-medium text-art-primary">{artist.displayName || artist.name}</h3>
                            </Link>
                            <p className="text-sm text-foreground/70">
                              {artist.artworksCount} {artist.artworksCount === 1 ? 'работа' : 
                              artist.artworksCount >= 2 && artist.artworksCount <= 4 ? 'работы' : 
                              'работ'}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Художники не найдены</p>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </>
      )}
    </div>
  )
}
