'use client'

import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useArtist } from "@/hooks/api"
import { useArtistLots } from "@/hooks/api/lots"
import { useMemo } from "react"

export default function ArtistPage() {
  const params = useParams()
  const artistId = typeof params.id === 'string' ? parseInt(params.id, 10) : Array.isArray(params.id) ? parseInt(params.id[0], 10) : NaN
  const { artist, isLoading: artistLoading, error: artistError } = useArtist(artistId)
  const { lots, isLoading: lotsLoading, error: lotsError } = useArtistLots(artistId)

  // Сортируем лоты - активные впереди, проданные в конце
  const sortedLots = useMemo(() => {
    if (!lots) return [];
    return [...lots].sort((a, b) => {
      // isActive = true идет перед isActive = false
      if (a.isActive && !b.isActive) return -1;
      if (!a.isActive && b.isActive) return 1;
      return 0;
    });
  }, [lots]);

  // Показываем состояние загрузки
  if (artistLoading || lotsLoading) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="mb-12">
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
            <Skeleton className="w-48 h-48 rounded-full" />
            <div className="w-full space-y-4">
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-20 w-full" />
              <div className="flex flex-wrap gap-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-8 w-24 rounded-full" />
                ))}
              </div>
            </div>
          </div>
        </div>

        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="w-full aspect-[3/4]" />
              <CardContent className="p-4">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-20 mb-4" />
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Показываем сообщение об ошибке
  if (artistError || lotsError) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="text-center p-8 bg-destructive/10 rounded-lg">
          <h2 className="text-2xl font-medium text-destructive mb-2">Ошибка загрузки</h2>
          <p className="text-foreground/70">{artistError || lotsError}</p>
        </div>
      </div>
    )
  }

  // Если художник не найден
  if (!artist) {
    notFound()
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="mb-12">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
          <div className="relative w-48 h-48 overflow-hidden rounded-full">
            <Image
              src={artist.profileImage || "/placeholder.svg"}
              alt={artist.name}
              fill
              priority
              quality={95}
              className="object-cover"
              sizes="(max-width: 768px) 192px, 192px"
            />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold">{artist.displayName || artist.name}</h1>
            <p className="mt-2 text-muted-foreground">{artist.bio}</p>
            <div className="flex flex-wrap justify-center gap-4 mt-4 md:justify-start">
              {artist.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 text-sm bg-muted rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <h2 className="mb-6 text-2xl font-bold">Работы художника</h2>

      {sortedLots && sortedLots.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sortedLots.map((lot) => (
            <Card key={lot.id} className="overflow-hidden">
              <div className="relative aspect-[1/1]">
                <Image
                  src={lot.image || "/placeholder.svg"}
                  alt={lot.name}
                  fill
                  quality={85}
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {!lot.isActive && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <span className="px-3 py-1 text-sm font-medium text-white bg-art-primary/90 rounded-sm">Продано</span>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold">{lot.name}</h3>
                <p className="text-sm text-muted-foreground">{lot.year}</p>
                <div className="flex items-center justify-between mt-4">
                  {lot.isActive ? (
                    <span className="font-medium">
                      {lot.initialPrice ? `${lot.initialPrice.toLocaleString('ru-RU')} ₽` : "Нет ставок"}
                    </span>
                  ) : (
                    <div>
                      {!lot.finalText && <p className="text-xs text-foreground/70">Продано за</p>}
                      <p className="font-medium text-art-primary">
                        {lot.finalText || (lot.finalPrice ? `${lot.finalPrice.toLocaleString('ru-RU')} ₽` : `${lot.initialPrice.toLocaleString('ru-RU')} ₽`)}
                      </p>
                    </div>
                  )}
                  <Link href={`/artworks/${lot.id}`}>
                    <Button variant="outline" size="sm">
                      Подробнее
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 bg-muted rounded-lg">
          <p>У этого художника пока нет работ на аукционе</p>
        </div>
      )}
    </div>
  )
}
