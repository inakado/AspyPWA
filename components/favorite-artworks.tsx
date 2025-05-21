'use client'

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useFavoriteArtworks } from "@/hooks/api"
import { useIsMobile } from "@/components/ui/use-mobile"
import { LotModel } from "@/lib/services"
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi
} from "@/components/ui/carousel"

export default function FavoriteArtworks() {
  const { lots: favoriteArtworks, isLoading, error, retry } = useFavoriteArtworks()
  const isMobile = useIsMobile()
  const [api, setApi] = useState<CarouselApi | null>(null)
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  const onSelect = useCallback(() => {
    if (!api) return
    setCurrent(api.selectedScrollSnap())
  }, [api])

  useEffect(() => {
    if (!api) return
    
    setCount(api.scrollSnapList().length)
    onSelect()
    api.on("select", onSelect)
    
    return () => {
      api.off("select", onSelect)
    }
  }, [api, onSelect])

  // Отображение состояния загрузки
  if (isLoading) {
    return (
      <section className="py-10">
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-10 w-56" />
          <Skeleton className="h-6 w-40" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(4)].map((_, index) => (
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    )
  }

  // Обработка ошибки с возможностью повторной попытки
  if (error) {
    return (
      <section className="py-10">
        <h2 className="text-3xl font-serif font-medium text-art-primary mb-4">Избранные работы</h2>
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <button 
          onClick={retry} 
          className="px-4 py-2 bg-art-primary text-white rounded-md hover:bg-art-accent transition-colors"
        >
          Попробовать снова
        </button>
      </section>
    )
  }

  // Если нет избранных работ
  if (favoriteArtworks.length === 0) {
    return (
      <section className="py-10">
        <h2 className="text-3xl font-serif font-medium text-art-primary mb-4">Избранные работы</h2>
        <p className="text-muted-foreground">В данный момент нет избранных работ</p>
      </section>
    )
  }

  // Рендерим карточку с работой
  const renderArtworkCard = (artwork: LotModel) => (
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
  )

  return (
    <section className="py-10">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-serif font-medium text-art-primary">Избранные работы</h2>
      </div>

      {isMobile ? (
        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: false,
              dragFree: true,
              containScroll: "trimSnaps"
            }}
            setApi={setApi}
            className="w-full"
          >
            <CarouselContent className="-ml-4 md:-ml-6">
              {favoriteArtworks.map((artwork) => (
                <CarouselItem key={artwork.id} className="pl-4 md:pl-6 basis-4/5 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  {renderArtworkCard(artwork)}
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          
          {/* Индикаторы */}
          {count > 0 && (
            <div className="flex justify-center gap-1 mt-4">
              {[...Array(count)].map((_, i) => (
                <button
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === current ? "w-6 bg-art-primary" : "w-1.5 bg-art-primary/30"
                  }`}
                  onClick={() => api?.scrollTo(i)}
                  aria-label={`Перейти к слайду ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {favoriteArtworks.map(renderArtworkCard)}
        </div>
      )}
    </section>
  )
} 