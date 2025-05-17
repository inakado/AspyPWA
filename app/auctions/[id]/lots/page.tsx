import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getAuction, getAuctionLots } from "@/lib/data"

interface AuctionLotsPageProps {
  params: {
    id: string
  }
}

export default function AuctionLotsPage({ params }: AuctionLotsPageProps) {
  const auction = getAuction(params.id)

  if (!auction) {
    notFound()
  }

  const lots = getAuctionLots(params.id)

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex flex-col gap-2 mb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Лоты аукциона</h1>
          <p className="text-muted-foreground">{auction.title}</p>
        </div>
        <Link href={`/auctions/${auction.id}`} className="text-primary hover:underline">
          Вернуться к аукциону
        </Link>
      </div>

      <div className="flex flex-col gap-4 mb-6 md:flex-row">
        <div className="flex-1">
          <Input type="search" placeholder="Поиск по названию или художнику..." />
        </div>
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Категория" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все категории</SelectItem>
              <SelectItem value="painting">Живопись</SelectItem>
              <SelectItem value="sculpture">Скульптура</SelectItem>
              <SelectItem value="photography">Фотография</SelectItem>
              <SelectItem value="graphics">Графика</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="current">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Сортировка" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">По текущей ставке</SelectItem>
              <SelectItem value="ending">По времени завершения</SelectItem>
              <SelectItem value="bids">По количеству ставок</SelectItem>
              <SelectItem value="name">По названию</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {lots.map((lot) => (
          <Card key={lot.id} className="overflow-hidden">
            <div className="relative aspect-[3/4]">
              <Image
                src={lot.image || "/placeholder.svg"}
                alt={lot.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              />
              {auction.status === "active" && (
                <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 text-xs font-medium text-white bg-black/70 rounded-full">
                  <Clock className="w-3 h-3" />
                  <span>{lot.timeLeft || "Скоро завершится"}</span>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 px-2 py-1 text-xs font-medium text-white bg-black/70">
                Лот #{lot.lotNumber}
              </div>
            </div>
            <CardContent className="p-4">
              <Link href={`/artworks/${lot.id}`}>
                <h3 className="font-semibold hover:text-primary">{lot.title}</h3>
              </Link>
              <Link href={`/artists/${lot.artistId}`} className="text-sm text-muted-foreground hover:text-primary">
                {lot.artist}
              </Link>
              <div className="flex items-center justify-between mt-4">
                <div>
                  <p className="text-xs text-muted-foreground">
                    {auction.status === "past" ? "Продано за" : "Текущая ставка"}
                  </p>
                  <p className="font-medium">{lot.currentBid || lot.startingPrice} ₽</p>
                </div>
                <Button size="sm" asChild>
                  <Link href={`/artworks/${lot.id}`}>
                    {auction.status === "active" ? "Сделать ставку" : "Подробнее"}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
