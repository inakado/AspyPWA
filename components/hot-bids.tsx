import Link from "next/link"
import Image from "next/image"
import { Clock, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getHotBids } from "@/lib/data"

export default function HotBids() {
  const hotBids = getHotBids()

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

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {hotBids.map((bid) => (
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
            <CardContent className="p-5">
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
        ))}
      </div>
    </section>
  )
}
