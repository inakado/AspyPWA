'use client'

import { notFound, useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { CalendarDays, Clock, MapPin, Users, PaintBucket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuction, useAuctionLots } from "@/hooks/api/auctions"

export default function AuctionPage() {
  const params = useParams()
  const auctionId = typeof params.id === 'string' ? parseInt(params.id, 10) : Array.isArray(params.id) ? parseInt(params.id[0], 10) : NaN
  
  const { auction, isLoading: auctionLoading, error: auctionError } = useAuction(auctionId)
  const { lots, isLoading: lotsLoading, error: lotsError } = useAuctionLots(auctionId)

  // Показываем состояние загрузки
  if (auctionLoading || lotsLoading) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="grid gap-8 md:grid-cols-2">
          <Skeleton className="aspect-video rounded-lg" />
          <div className="space-y-6">
            <div>
              <Skeleton className="h-10 w-64 mb-2" />
              <Skeleton className="h-16 w-full" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="w-5 h-5" />
                  <div>
                    <Skeleton className="h-3 w-16 mb-1" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              ))}
            </div>
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
        </div>

        <Separator className="my-8" />

        <div>
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-24" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-[3/4]" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-24 mb-4" />
                  <div className="flex items-center justify-between">
                    <div>
                      <Skeleton className="h-3 w-20 mb-1" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                    <Skeleton className="h-8 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Показываем сообщение об ошибке
  if (auctionError || lotsError) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="text-center p-8 bg-destructive/10 rounded-lg">
          <h2 className="text-2xl font-medium text-destructive mb-2">Ошибка загрузки</h2>
          <p className="text-foreground/70">{auctionError || lotsError}</p>
        </div>
      </div>
    )
  }

  // Если аукцион не найден
  if (!auction) {
    notFound()
  }

  // Форматирование даты
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500 hover:bg-green-600">Активный</Badge>
      case "upcoming":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Предстоящий</Badge>
      default:
        return <Badge className="bg-gray-500 hover:bg-gray-600">Завершен</Badge>
    }
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative aspect-video overflow-hidden rounded-lg">
          <Image
            src={auction.image || "/placeholder.svg"}
            alt={auction.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          <div className="absolute top-2 right-2">
            {getStatusBadge(auction.status)}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{auction.name}</h1>
            <p className="mt-2 text-muted-foreground">{auction.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Дата начала</p>
                <p>{formatDate(auction.startDate)}</p>
              </div>
            </div>
            {auction.startDate !== auction.endDate && (
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Дата окончания</p>
                  <p>{formatDate(auction.endDate)}</p>
                </div>
              </div>
            )}
            {(auction.venue || auction.city) && (
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Локация</p>
                  <p>
                    {auction.venue && auction.city 
                      ? `${auction.venue}, ${auction.city}` 
                      : auction.venue || auction.city
                    }
                  </p>
                </div>
              </div>
            )}
            {auction.lotCount > 0 && (
              <div className="flex items-center gap-2">
                <PaintBucket className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Лотов</p>
                  <p>{auction.lotCount}</p>
                </div>
              </div>
            )}
          </div>

          {auction.status === "upcoming" && (
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-muted-foreground" />
                <p className="font-medium">Регистрация участников</p>
              </div>
              <p className="mb-4 text-sm text-muted-foreground">
                Для участия в аукционе необходима предварительная регистрация. Регистрация закрывается за 24 часа до
                начала аукциона.
              </p>
              <Button className="w-full">Зарегистрироваться</Button>
            </div>
          )}

          {auction.status === "active" && (
            <div className="p-4 border rounded-lg">
              <p className="mb-4 text-sm text-muted-foreground">
                Аукцион в процессе. Вы можете делать ставки на лоты до окончания торгов.
              </p>
              <Button asChild className="w-full">
                <Link href={`#lots`}>Перейти к лотам</Link>
              </Button>
            </div>
          )}

          {auction.status === "past" && (
            <div className="p-4 border rounded-lg">
              <p className="mb-4 text-sm text-muted-foreground">
                Аукцион завершен. Вы можете просмотреть результаты торгов и проданные лоты.
              </p>
              <Button variant="outline" asChild className="w-full">
                <Link href={`#lots`}>Просмотреть лоты</Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      <Separator className="my-8" />

      <div id="lots">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Лоты аукциона</h2>
        </div>

        {lots && lots.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {lots.map((lot) => (
              <Card key={lot.id} className="overflow-hidden group cursor-pointer">
                <Link href={`/artworks/${lot.id}`}>
                  <div className="relative aspect-[3/4]">
                    <Image
                      src={lot.image || "/placeholder.svg"}
                      alt={lot.name}
                      fill
                      className="object-cover transition-opacity hover:opacity-90"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    />
                    {!lot.isActive && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <span className="px-3 py-1 text-sm font-medium text-white bg-art-primary/90 rounded-sm">Продано</span>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-serif font-medium text-art-primary elegant-link">{lot.name}</h3>
                    {lot.artists.length > 0 && (
                      <p className="text-sm text-muted-foreground">{lot.artists[0].displayName || lot.artists[0].name}</p>
                    )}
                    <div className="mt-4">
                      {lot.isActive ? (
                        <div>
                          <p className="text-xs text-foreground/70">Начальная цена</p>
                          <p className="font-medium text-art-primary">{lot.initialPrice.toLocaleString('ru-RU')} ₽</p>
                        </div>
                      ) : (
                        <div>
                          {!lot.finalText && <p className="text-xs text-foreground/70">Продано за</p>}
                          <p className="font-medium text-art-primary">
                            {lot.finalText || (lot.finalPrice ? lot.finalPrice.toLocaleString('ru-RU') : lot.initialPrice.toLocaleString('ru-RU')) + ' ₽'}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 bg-muted rounded-lg">
            <p>В этом аукционе пока нет лотов</p>
          </div>
        )}
      </div>
    </div>
  )
}
