'use client'

import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLot } from "@/hooks/api/lots"
import { useArtist } from "@/hooks/api"
import { useLotBets } from "@/hooks/api/bets"
import { useArtistLots } from "@/hooks/api/lots"
import { Skeleton } from "@/components/ui/skeleton"
import BidForm from "@/components/bid-form"
import { Card, CardContent } from "@/components/ui/card"
import { useCallback, useEffect, useState } from "react"
import { useIsMobile } from "@/components/ui/use-mobile"
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi
} from "@/components/ui/carousel"

export default function ArtworkPage() {
  const params = useParams();
  const lotId = typeof params.id === 'string' ? parseInt(params.id, 10) : Array.isArray(params.id) ? parseInt(params.id[0], 10) : NaN;
  const { lot, isLoading: lotLoading, error: lotError } = useLot(lotId);
  const { bets, isLoading: betsLoading } = useLotBets(lotId);
  
  // Получаем данные о художнике только если у нас есть ID художника
  const artistId = lot?.artists?.[0]?.id || null;
  const { artist, isLoading: artistLoading } = useArtist(artistId);
  const { lots: artistLots, isLoading: artistLotsLoading } = useArtistLots(artistId);
  
  // Для слайдера с работами художника
  const [api, setApi] = useState<CarouselApi | null>(null)
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)
  const isMobile = useIsMobile()

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

  // Показываем состояние загрузки
  if (lotLoading || artistLoading) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <Skeleton className="w-full h-full" />
          </div>

          <div className="space-y-6">
            <div>
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-5 w-1/2 mb-1" />
              <Skeleton className="h-4 w-1/3" />
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-6 w-40" />
                </div>
                <div>
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-5 w-24" />
                </div>
              </div>

              <Skeleton className="h-4 w-64 mt-4" />
              <Skeleton className="h-10 w-full mt-4" />
            </div>

            <div>
              <Skeleton className="h-10 w-full mb-4" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Показываем сообщение об ошибке
  if (lotError) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="text-center p-8 bg-destructive/10 rounded-lg">
          <h2 className="text-2xl font-medium text-destructive mb-2">Ошибка загрузки</h2>
          <p className="text-foreground/70">{lotError}</p>
        </div>
      </div>
    );
  }

  // Если лот не найден
  if (!lot) {
    notFound();
  }

  // Отфильтрованные работы художника (без текущей работы)
  const filteredArtistLots = artistLots
    ? artistLots.filter(artwork => artwork.id !== lotId)
    : [];

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-lg">
          <Image
            src={lot.image || "/placeholder.svg"}
            alt={lot.name}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{lot.name}</h1>
            {artist && (
              <Link href={`/artists/${artist.id}`} className="text-primary hover:underline">
                {artist.displayName || artist.name}
              </Link>
            )}
            <p className="mt-1 text-muted-foreground">
              {lot.year}, {lot.technique}
            </p>
          </div>

          <div className="p-4 border border-primary/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-primary/40">Текущая ставка</p>
                <p className="text-2xl font-bold">{lot.currentBid ? `${lot.currentBid.toLocaleString('ru-RU')} ₽` : "Нет ставок"}</p>
              </div>
              <div>
                <p className="text-sm text-primary/40">Начальная цена</p>
                <p className="text-lg">{lot.initialPrice.toLocaleString('ru-RU')} ₽</p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                {lot.isActive ? "Принимаются ставки" : "Аукцион завершен"}
              </p>
            </div>

            {lot.isActive && <BidForm artworkId={String(lot.id)} currentBid={lot.currentBid || 0} />}

            {!lot.isActive && (
              <div className="p-3 mt-4 text-center text-white bg-red-500 rounded-md">
                {lot.finalText || (lot.finalPrice ? `Продано за ${lot.finalPrice.toLocaleString('ru-RU')} ₽` : `Продано за ${lot.initialPrice.toLocaleString('ru-RU')} ₽`)}
              </div>
            )}
          </div>

          <Tabs defaultValue="description">
            <TabsList className="w-full bg-primary/5">
              <TabsTrigger value="description" className="flex-1">
                Описание
              </TabsTrigger>
              <TabsTrigger value="details" className="flex-1">
                Детали
              </TabsTrigger>
              <TabsTrigger value="history" className="flex-1">
                История ставок
              </TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="p-4 mt-4 border border-primary/20 rounded-lg">
              <p>{lot.description}</p>
            </TabsContent>
            <TabsContent value="details" className="p-4 mt-4 border rounded-lg">
              <ul className="space-y-2">
                <li>
                  <span className="font-medium">Техника:</span> {lot.technique}
                </li>
                <li>
                  <span className="font-medium">Год создания:</span> {lot.year}
                </li>
                <li>
                  <span className="font-medium">Спецификации:</span> {lot.specs}
                </li>
              </ul>
            </TabsContent>
            <TabsContent value="history" className="p-4 mt-4 border rounded-lg">
              {bets && bets.length > 0 ? (
                <ul className="space-y-2">
                  {bets.map((bet) => (
                    <li key={bet.id} className="flex items-center justify-between">
                      <span>Пользователь #{bet.user ? bet.user.id.toString().slice(-4) : 'Аноним'}</span>
                      <span className="font-medium">{bet.value.toLocaleString('ru-RU')} ₽</span>
                      <span className="text-sm text-muted-foreground">
                        {bet.date.toLocaleString("ru-RU")}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-muted-foreground">Ставок пока нет</p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Секция с другими работами художника */}
      {artistId && filteredArtistLots.length > 0 && (
        <div className="mt-16">
          <div className="w-full h-px bg-primary/10 my-8"></div>
          
          {artistLotsLoading ? (
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
          ) : (
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
                  {filteredArtistLots.slice(0, 8).map((artwork) => (
                    <CarouselItem key={artwork.id} className="pl-4 md:pl-6 basis-4/5 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                      <Card>
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
                            <h3 className="font-serif font-medium text-primary">{artwork.name}</h3>
                          </Link>
                          <p className="text-sm text-foreground/70">{artwork.year}, {artwork.technique}</p>
                          <div className="flex items-center justify-between mt-4">
                            <div>
                              {artwork.isActive ? (
                                <>
                                  <p className="text-xs text-foreground/70">Начальная цена</p>
                                  <p className="font-medium text-primary">{artwork.initialPrice.toLocaleString('ru-RU')} ₽</p>
                                </>
                              ) : (
                                <>
                                  {!artwork.finalText && <p className="text-xs text-foreground/70">Продано за</p>}
                                  <p className="font-medium text-primary">
                                    {artwork.finalText || (artwork.finalPrice ? artwork.finalPrice.toLocaleString('ru-RU') : artwork.initialPrice.toLocaleString('ru-RU')) + ' ₽'}
                                  </p>
                                </>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
              
              {/* Индикаторы слайдера */}
              {count > 0 && (
                <div className="flex justify-center gap-1 mt-4">
                  {[...Array(count)].map((_, i) => (
                    <button
                      key={i}
                      className={`h-1.5 rounded-full transition-all ${
                        i === current ? "w-6 bg-primary" : "w-1.5 bg-primary/30"
                      }`}
                      onClick={() => api?.scrollTo(i)}
                      aria-label={`Перейти к слайду ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

