'use client'

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { Clock, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getHotBids } from "@/lib/data"
import { useIsMobile } from "@/components/ui/use-mobile"
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel"

// Тип для горячих ставок
interface HotBid {
  id: string
  title: string
  image: string
  artist: string
  artistId: string
  currentBid: number
  timeLeft: string
}

export default function HotBids() {
  const hotBids = getHotBids()
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

  // Рендерим карточку с горячей ставкой
  const renderBidCard = (bid: HotBid) => (
    <Card key={bid.id}>
      <div className="relative aspect-[3/4]">
        <Image
          src={bid.image || "/placeholder.svg"}
          alt={bid.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
        />
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 text-xs font-medium text-white bg-art-primary/90 rounded-sm">
          <Clock className="w-3 h-3" />
          <span>{bid.timeLeft}</span>
        </div>
      </div>
      <CardContent className="pt-5">
        <Link href={`/artworks/${bid.id}`} className="elegant-link">
          <h3 className="font-serif text-lg font-medium text-art-primary">{bid.title}</h3>
        </Link>
        <Link
          href={`/artists/${bid.artistId}`}
          className="text-sm text-foreground/70 hover:text-art-accent transition-colors"
        >
          {bid.artist}
        </Link>
        <div className="flex items-center justify-between mt-4">
          <div>
            <p className="text-xs text-foreground/70">Текущая ставка</p>
            <p className="font-medium text-art-primary">{bid.currentBid} ₽</p>
          </div>
          <Button size="sm" asChild>
            <Link href={`/artworks/${bid.id}`}>Сделать ставку</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <section className="py-10">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-serif font-medium text-art-primary">Актуальные ставки</h2>
        <Link
          href="/hot-bids"
          className="flex items-center text-sm text-art-primary hover:text-art-accent transition-colors"
        >
          Смотреть все <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
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
              {hotBids.map((bid) => (
                <CarouselItem key={bid.id} className="pl-4 md:pl-6 basis-4/5 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  {renderBidCard(bid)}
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
          {hotBids.map(renderBidCard)}
        </div>
      )}
    </section>
  )
}
