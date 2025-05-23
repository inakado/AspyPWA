import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { CalendarDays, Clock, MapPin, Users, PaintBucket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getAuction, getAuctionLots } from "@/lib/data"

interface AuctionPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function AuctionPage({ params }: AuctionPageProps) {
  const { id } = await params
  const auction = getAuction(id)

  if (!auction) {
    notFound()
  }

  const lots = getAuctionLots(id)

  // Форматирование даты
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU")
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative aspect-video overflow-hidden rounded-lg">
          <Image
            src={auction.image || "/placeholder.svg"}
            alt={auction.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
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

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{auction.title}</h1>
            <p className="mt-2 text-muted-foreground">{auction.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Дата</p>
                <p>{formatDate(auction.date)}</p>
              </div>
            </div>
            {auction.startTime && auction.endTime && (
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Время</p>
                  <p>
                    {auction.startTime} - {auction.endTime}
                  </p>
                </div>
              </div>
            )}
            {auction.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Локация</p>
                  <p>{auction.location}</p>
                </div>
              </div>
            )}
            {auction.totalLots && (
              <div className="flex items-center gap-2">
                <PaintBucket className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Лотов</p>
                  <p>{auction.totalLots}</p>
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
                <Link href={`/auctions/${auction.id}/lots`}>Перейти к лотам</Link>
              </Button>
            </div>
          )}

          {auction.status === "past" && (
            <div className="p-4 border rounded-lg">
              <p className="mb-4 text-sm text-muted-foreground">
                Аукцион завершен. Вы можете просмотреть результаты торгов и проданные лоты.
              </p>
              <Button variant="outline" asChild className="w-full">
                <Link href={`/auctions/${auction.id}/results`}>Результаты аукциона</Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      <Separator className="my-8" />

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Избранные лоты</h2>
          <Button variant="outline" asChild>
            <Link href={`/auctions/${auction.id}/lots`}>Все лоты</Link>
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {lots.slice(0, 4).map((lot) => (
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
    </div>
  )
}
