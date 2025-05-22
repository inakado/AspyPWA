'use client'

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useSoldLots } from "@/hooks/api"

export default function SoldArtworks() {
  const { lots: soldArtworks, isLoading, error, retry } = useSoldLots()
  const [limitCount] = useState(8) // Количество отображаемых лотов

  // Отображение состояния загрузки
  if (isLoading) {
    return (
      <section className="py-10">
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-10 w-56" />
          <Skeleton className="h-6 w-40" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(limitCount)].map((_, index) => (
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
                  <Skeleton className="h-4 w-24" />
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
        <h2 className="text-3xl font-serif font-medium text-art-primary mb-4">Проданные работы</h2>
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

  // Если нет проданных работ
  if (soldArtworks.length === 0) {
    return (
      <section className="py-10">
        <h2 className="text-3xl font-serif font-medium text-art-primary mb-4">Проданные работы</h2>
        <p className="text-muted-foreground">Нет проданных работ</p>
      </section>
    )
  }

  return (
    <section className="py-10">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-serif font-medium text-art-primary">Архив работ</h2>
        <Link
          href="/sold"
          className="flex items-center text-sm text-art-primary hover:text-art-accent transition-colors"
        >
          Все работы <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {soldArtworks.slice(0, limitCount).map((artwork) => (
          <Card key={artwork.id}>
            <div className="relative aspect-[3/4]">
              {artwork.artists.length > 0 ? (
                <Link href={`/artworks/${artwork.id}`}>
                  <Image
                    src={artwork.image || "/placeholder.svg"}
                    alt={artwork.name}
                    fill
                    className="object-cover cursor-pointer transition-opacity hover:opacity-90"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-[#1E3557]/40">
                    <span className="px-3 py-1 text-sm font-medium text-white bg-art-primary/90 rounded-sm">Продано</span>
                  </div>
                </Link>
              ) : (
                <>
                  <Link href={`/artworks/${artwork.id}`}>
              <Image
                src={artwork.image || "/placeholder.svg"}
                alt={artwork.name}
                fill
                      className="object-cover cursor-pointer transition-opacity hover:opacity-90"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-[#1E3557]/40">
                <span className="px-3 py-1 text-sm font-medium text-white bg-art-primary/90 rounded-sm">Продано</span>
              </div>
                  </Link>
                </>
              )}
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
                  {!artwork.finalText && <p className="text-xs text-foreground/70">Продано за</p>}
                  <p className="font-medium text-art-primary">
                    {artwork.finalText || (artwork.finalPrice ? artwork.finalPrice.toLocaleString('ru-RU') : artwork.initialPrice.toLocaleString('ru-RU')) + ' ₽'}
                  </p>
                </div>
                {/* Пока нет даты продажи, можно показать заглушку */}
                {/* <p className="text-sm text-foreground/70">{new Date().toLocaleDateString("ru-RU")}</p> */}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
