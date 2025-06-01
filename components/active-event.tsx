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
              </div>
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-10 w-48" />
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
            </div>

            <p className="text-foreground/80 leading-relaxed">{auction.description}</p>

            <Button asChild className="w-fit">
              <Link href={`/auctions/${auction.id}`}>Выбрать картину</Link>
            </Button>
          </div>
        </div>
      </Card>
    </section>
  )
}
