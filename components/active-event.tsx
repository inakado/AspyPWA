'use client'

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useActiveAuction } from "@/hooks/api/auctions"

export default function ActiveEvent() {
  const { auction, isLoading, error } = useActiveAuction()

  // Показываем состояние загрузки
  if (isLoading) {
    return (
      <section className="py-10">
        <Card>
          <div className="grid md:grid-cols-2">
            <div className="relative w-full aspect-[4/3] md:aspect-[3/2] lg:min-h-[400px]">
              <Skeleton className="absolute inset-0" />
            </div>
            <div className="flex flex-col justify-center px-4 py-8 md:p-8 space-y-5">
              <div>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-16 w-full" />
              <div className="grid grid-cols-2 gap-6 mt-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-3 w-16 mb-1" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                ))}
              </div>
              {/* ВРЕМЕННО ОТКЛЮЧЕНО: Кнопки действий */}
              {/* <div className="flex flex-col gap-3 mt-4 sm:flex-row">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 flex-1" />
              </div> */}
            </div>
          </div>
        </Card>
      </section>
    )
  }

  // Скрываем компонент если ошибка или нет активного аукциона
  if (error || !auction) {
    return null
  }

  // Форматирование даты
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU")
  }

  // ВРЕМЕННО ОТКЛЮЧЕНО: Получение времени из дат
  // const getTimeFromDate = (dateString: string) => {
  //   return new Date(dateString).toLocaleTimeString("ru-RU", { 
  //     hour: '2-digit', 
  //     minute: '2-digit' 
  //   })
  // }

  return (
    <section className="py-10">
      <Card className="overflow-hidden max-w-full">
        <div className="grid md:grid-cols-2">
          <div className="relative w-full aspect-[4/3] md:aspect-[3/2] lg:min-h-[400px]">
            <Image
              src={auction.image || "/placeholder.svg"}
              alt={auction.name}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 33vw"
              priority
            />
          </div>
          <div className="flex flex-col justify-center px-4 py-8 md:p-8 space-y-5">
            <div>
              <h3 className="text-2xl font-serif font-medium text-art-primary">{auction.name}</h3>
              {/* <p className="mt-1 text-foreground/70">{formatDate(auction.startDate)}</p> */}
            </div>

            <p className="text-foreground/80 leading-relaxed">{auction.description}</p>

            <div className="grid grid-cols-2 gap-6 mt-4">
              <div>
                <p className="text-sm text-foreground/70">Дата начала</p>
                <p className="font-medium text-art-primary">
                  {formatDate(auction.startDate)}
                </p>
              </div>
              <div>
                <p className="text-sm text-foreground/70">Дата окончания</p>
                <p className="font-medium text-art-primary">
                  {auction.startDate !== auction.endDate
                    ? formatDate(auction.endDate)
                    : "Один день"
                  }
                </p>
              </div>
              {(auction.venue || auction.city) && (
                <div>
                  <p className="text-sm text-foreground/70">Локация</p>
                  <p className="font-medium text-art-primary">
                    {auction.venue && auction.city 
                      ? `${auction.venue}, ${auction.city}` 
                      : auction.venue || auction.city
                    }
                  </p>
                </div>
              )}
              {auction.lotCount > 0 && (
                <div>
                  <p className="text-sm text-foreground/70">Лотов</p>
                  <p className="font-medium text-art-primary">{auction.lotCount}</p>
                </div>
              )}
            </div>

            {/* ВРЕМЕННО ОТКЛЮЧЕНО: Кнопки действий */}
            {/* <div className="flex flex-col gap-3 mt-4 sm:flex-row">
              <Button asChild className="flex-1">
                <Link href={`/auctions/${auction.id}`}>Участвовать</Link>
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link href={`/auctions/${auction.id}/lots`}>Смотреть лоты</Link>
              </Button>
            </div> */}
          </div>
        </div>
      </Card>
    </section>
  )
}
