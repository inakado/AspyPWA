import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getAnnouncements } from "@/lib/data"

export default function Announcements() {
  const announcements = getAnnouncements()

  return (
    <section className="py-10">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-serif font-medium text-art-primary">Анонсы</h2>
        <Link
          href="/announcements"
          className="flex items-center text-sm text-art-primary hover:text-art-accent transition-colors"
        >
          Все анонсы <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {announcements.map((announcement) => (
          <Card key={announcement.id}>
            <CardContent className="border border-primary/20 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant={announcement.type === "event" ? "default" : "accent"}>
                    {announcement.type === "event" ? "Мероприятие" : "Новость"}
                  </Badge>
                  <h3 className="mt-3 text-xl font-serif font-medium text-art-primary">{announcement.title}</h3>
                </div>
                <p className="text-sm text-foreground/70">{new Date(announcement.date).toLocaleDateString("ru-RU")}</p>
              </div>

              <p className="mt-4 text-foreground/80 leading-relaxed">{announcement.description}</p>

              {announcement.type === "event" && (
                <div className="grid grid-cols-2 gap-4 mt-5">
                  <div>
                    <p className="text-sm text-foreground/70">Начало</p>
                    <p className="font-medium text-art-primary">{announcement.startTime}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/70">Локация</p>
                    <p className="font-medium text-art-primary">{announcement.location}</p>
                  </div>
                </div>
              )}

              <Link
                href={announcement.type === "event" ? `/events/${announcement.id}` : `/news/${announcement.id}`}
                className="inline-block mt-4 text-sm text-art-primary hover:text-art-accent transition-colors"
              >
                Подробнее
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
