'use client'

import Link from "next/link"
import Image from "next/image"
import { CalendarDays, Clock, MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuctions } from "@/hooks/api/auctions"
import type { AuctionModel } from "@/lib/services/auctions"

export default function AuctionsPage() {
  const { auctions, isLoading, error } = useAuctions()
  
  // Фильтрация аукционов по статусу
  const upcomingAuctions = auctions.filter((auction) => auction.status === "upcoming")
  const activeAuctions = auctions.filter((auction) => auction.status === "active")
  const pastAuctions = auctions.filter((auction) => auction.status === "past")

  // Отображение состояния загрузки
  if (isLoading) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <Skeleton className="h-10 w-48 mb-6" />
        
        <div className="mb-6">
          <Skeleton className="h-10 w-full max-w-md" />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(4)].map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="pt-5">
                <Skeleton className="h-6 w-32 mb-2" />
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-12 w-full mb-4" />
                <div className="flex gap-2">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 flex-1" />
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
        <h1 className="mb-6 text-3xl font-bold">Аукционы</h1>
        <div className="p-6 text-center bg-destructive/10 rounded-lg">
          <h2 className="text-xl font-semibold text-destructive mb-2">Ошибка загрузки</h2>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Аукционы</h1>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="active">Активные</TabsTrigger>
          <TabsTrigger value="upcoming">Предстоящие</TabsTrigger>
          <TabsTrigger value="past">Прошедшие</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {activeAuctions.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {activeAuctions.map((auction) => (
                <AuctionCard key={auction.id} auction={auction} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">В данный момент нет активных аукционов</p>
          )}
        </TabsContent>

        <TabsContent value="upcoming">
          {upcomingAuctions.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {upcomingAuctions.map((auction) => (
                <AuctionCard key={auction.id} auction={auction} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">Нет предстоящих аукционов</p>
          )}
        </TabsContent>

        <TabsContent value="past">
          {pastAuctions.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {pastAuctions.map((auction) => (
                <AuctionCard key={auction.id} auction={auction} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">Нет прошедших аукционов</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function AuctionCard({ auction }: { auction: AuctionModel }) {
  // Форматирование дат
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU")
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative h-48">
        <Image
          src={auction.image || "/placeholder.svg"}
          alt={auction.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute top-2 right-2">
          <Badge
            className={
              auction.status === "active"
                ? "bg-green-500 hover:bg-green-600"
                : auction.status === "upcoming"
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-gray-500 hover:bg-gray-600"
            }
          >
            {auction.status === "active" ? "Активный" : auction.status === "upcoming" ? "Предстоящий" : "Завершен"}
          </Badge>
        </div>
      </div>
      <CardContent className="pt-5">
        <h2 className="mb-2 text-xl font-bold">{auction.name}</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Дата начала - всегда показываем */}
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">{formatDate(auction.startDate)}</span>
          </div>
          
          {/* Показываем дату окончания только если она отличается от начала */}
          {auction.endDate !== auction.startDate && (
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">до {formatDate(auction.endDate)}</span>
            </div>
          )}

          {/* Место проведения - показываем только если есть данные */}
          {(auction.venue || auction.city) && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                {auction.venue && auction.city ? `${auction.venue}, ${auction.city}` : auction.venue || auction.city}
              </span>
            </div>
          )}
          
          {/* Количество лотов - показываем только если больше 0 */}
          {auction.lotCount > 0 && (
            <div className="text-sm">
              <span className="text-muted-foreground">Лотов: </span>
              <span>{auction.lotCount}</span>
            </div>
          )}

          {/* Продано лотов - показываем только если есть продажи */}
          {auction.lotsSold > 0 && (
            <div className="text-sm">
              <span className="text-muted-foreground">Продано: </span>
              <span>{auction.lotsSold}</span>
            </div>
          )}

          {/* Общая сумма продаж - показываем только если больше 0 */}
          {auction.totalSalesRub > 0 && (
            <div className="text-sm">
              <span className="text-muted-foreground">Продаж на: </span>
              <span>{auction.totalSalesRub.toLocaleString('ru-RU')} ₽</span>
            </div>
          )}
        </div>
        
        {/* Описание - показываем только если есть */}
        {auction.description && (
          <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{auction.description}</p>
        )}
        
        <div className="flex gap-2">
          <Button asChild className="flex-1">
            <Link href={`/auctions/${auction.id}`}>Подробнее</Link>
          </Button>
          {auction.status !== "past" && (
            <Button variant="outline" asChild className="flex-1">
              <Link href={`/auctions/${auction.id}/lots`}>Лоты</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
