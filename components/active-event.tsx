import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { getActiveEvent } from "@/lib/data"

export default function ActiveEvent() {
  const event = getActiveEvent()

  if (!event) {
    return null
  }

  return (
    <section className="py-10">
      <Card>
        <div className="grid md:grid-cols-2">
          <div className="relative aspect-square md:aspect-auto">
            <Image
              src={event.image || "/placeholder.svg"}
              alt={event.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>

          <div className="flex flex-col justify-center px-4 py-8 md:p-8 space-y-5">
            <div>
              <h3 className="text-2xl font-serif font-medium text-art-primary">{event.title}</h3>
              <p className="mt-1 text-foreground/70">{new Date(event.date).toLocaleDateString("ru-RU")}</p>
            </div>

            <p className="text-foreground/80 leading-relaxed">{event.description}</p>

            <div className="grid grid-cols-2 gap-6 mt-4">
              <div>
                <p className="text-sm text-foreground/70">Начало</p>
                <p className="font-medium text-art-primary">{event.startTime}</p>
              </div>
              <div>
                <p className="text-sm text-foreground/70">Окончание</p>
                <p className="font-medium text-art-primary">{event.endTime}</p>
              </div>
              <div>
                <p className="text-sm text-foreground/70">Локация</p>
                <p className="font-medium text-art-primary">{event.location}</p>
              </div>
              <div>
                <p className="text-sm text-foreground/70">Лотов</p>
                <p className="font-medium text-art-primary">{event.totalLots}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-4 sm:flex-row">
              <Button asChild className="flex-1">
                <Link href={`/events/${event.id}`}>Участвовать</Link>
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link href={`/events/${event.id}/lots`}>Смотреть лоты</Link>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </section>
  )
}
