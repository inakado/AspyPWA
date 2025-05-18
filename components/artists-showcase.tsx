'use client'

import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useArtists } from "@/hooks/api"
import { Skeleton } from "@/components/ui/skeleton"
import { pluralizeWorks } from "@/lib/utils"

export default function ArtistsShowcase() {
  const { artists, isLoading, error } = useArtists()

  // Показываем состояние загрузки
  if (isLoading) {
    return (
      <section className="py-10">
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(4)].map((_, index) => (
            <Card key={index}>
              <Skeleton className="aspect-video w-full" />
              <CardContent className="pt-5">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-6 w-16" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    )
  }

  // Показываем сообщение об ошибке
  if (error) {
    return (
      <section className="py-10">
        <div className="text-center p-8 bg-destructive/10 rounded-lg">
          <h2 className="text-2xl font-medium text-destructive mb-2">Ошибка загрузки</h2>
          <p className="text-foreground/70">{error}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-10">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-serif font-medium text-art-primary">Художники</h2>
        <Link
          href="/artists"
          className="flex items-center text-sm text-art-primary hover:text-art-accent transition-colors"
        >
          Все художники <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {artists.map((artist) => (
          <Card key={artist.id}>
            <div className="relative aspect-video">
              <Image
                src={artist.image || "/placeholder.svg"}
                alt={`${artist.name} artwork`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              />
            </div>
            <CardContent className="pt-5">
              <div className="flex items-center gap-3">

                <div>
                  <Link href={`/artists/${artist.id}`} className="elegant-link">
                    <h3 className="font-serif font-medium text-art-primary">{artist.displayName}</h3>
                  </Link>
                  <p className="text-sm text-foreground/70">{pluralizeWorks(artist.artworksCount)}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {artist.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="px-2 py-1 text-xs bg-primary/5 rounded-sm text-foreground/80">
                    {tag}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
