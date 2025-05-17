import Link from "next/link"
import Image from "next/image"
import { CalendarDays, Clock, MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAllAuctions } from "@/lib/data"

export default function AuctionsPage() {
  const auctions = getAllAuctions()
  const upcomingAuctions = auctions.filter((auction) => auction.status === "upcoming")
  const activeAuctions = auctions.filter((auction) => auction.status === "active")
  const pastAuctions = auctions.filter((auction) => auction.status === "past")

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

function AuctionCard({ auction }: { auction: any }) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48">
        <Image
          src={auction.image || "/placeholder.svg"}
          alt={auction.title}
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
      <CardContent className="p-6">
        <h2 className="mb-2 text-xl font-bold">{auction.title}</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">{new Date(auction.date).toLocaleDateString("ru-RU")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">
              {auction.startTime} - {auction.endTime}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">{auction.location}</span>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">Лотов: </span>
            <span>{auction.totalLots}</span>
          </div>
        </div>
        <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{auction.description}</p>
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
