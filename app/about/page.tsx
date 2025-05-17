import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Mail, Phone, MapPin } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="max-w-xl">
          <h1 className="mb-4 text-3xl font-bold">О нас</h1>
          <p className="mb-4 text-muted-foreground">
            ASPY — это современная платформа для проведения аукционов произведений искусства, объединяющая
            коллекционеров, ценителей искусства и художников со всего мира.
          </p>
          <p className="mb-6 text-muted-foreground">
            Наша миссия — сделать искусство доступным для всех, создавая прозрачную и удобную площадку для покупки и
            продажи произведений искусства.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 mt-1 text-primary" />
              <div>
                <h3 className="font-medium">Подлинность</h3>
                <p className="text-sm text-muted-foreground">
                  Все произведения искусства проходят тщательную проверку подлинности нашими экспертами.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 mt-1 text-primary" />
              <div>
                <h3 className="font-medium">Прозрачность</h3>
                <p className="text-sm text-muted-foreground">
                  Мы обеспечиваем полную прозрачность всех аукционных процессов и истории произведений.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 mt-1 text-primary" />
              <div>
                <h3 className="font-medium">Доступность</h3>
                <p className="text-sm text-muted-foreground">
                  Наша платформа делает искусство доступным для широкой аудитории, от начинающих коллекционеров до
                  опытных ценителей.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative h-[400px] md:h-[500px] overflow-hidden rounded-lg">
          <Image
            src="/AspyLogoBig.webp"
            alt="Art Auction Gallery"
            fill
            priority
            quality={90}
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
          />
        </div>
      </div>

      <Separator className="my-12" />

      <div className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-center">Наша команда</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              name: "Анна Петрова",
              position: "Основатель и CEO",
              image: "/placeholder.svg?height=300&width=300",
            },
            {
              name: "Михаил Иванов",
              position: "Арт-директор",
              image: "/placeholder.svg?height=300&width=300",
            },
            {
              name: "Елена Сидорова",
              position: "Главный эксперт",
              image: "/placeholder.svg?height=300&width=300",
            },
            {
              name: "Дмитрий Козлов",
              position: "Технический директор",
              image: "/placeholder.svg?height=300&width=300",
            },
          ].map((member, index) => (
            <Card key={index}>
              <CardContent className="p-4 text-center">
                <div className="relative w-32 h-32 mx-auto mb-4 overflow-hidden rounded-full">
                  <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                </div>
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.position}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid gap-8 mb-12 md:grid-cols-2">
        <div>
          <h2 className="mb-6 text-2xl font-bold">Наша история</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">2020</h3>
              <p className="text-muted-foreground">
                Основание компании. Запуск первой версии платформы с фокусом на российских художников.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">2021</h3>
              <p className="text-muted-foreground">
                Расширение каталога. Проведение первого крупного онлайн-аукциона современного искусства.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">2022</h3>
              <p className="text-muted-foreground">
                Запуск мобильного приложения. Интеграция с ведущими галереями и музеями.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">2023</h3>
              <p className="text-muted-foreground">
                Выход на международный рынок. Открытие представительств в Европе и Азии.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">2024</h3>
              <p className="text-muted-foreground">
                Запуск образовательной программы для коллекционеров и художников. Проведение первого благотворительного
                аукциона.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">2025</h3>
              <p className="text-muted-foreground">
                Редизайн платформы. Внедрение новых технологий для улучшения пользовательского опыта.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="mb-6 text-2xl font-bold">Контакты</h2>
          <div className="p-6 space-y-4 border rounded-lg">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 mt-1 text-primary" />
              <div>
                <h3 className="font-medium">Адрес</h3>
                <p className="text-muted-foreground">г. Владивосток, ул. Станюковича 1, офис 212</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 mt-1 text-primary" />
              <div>
                <h3 className="font-medium">Телефон</h3>
                <p className="text-muted-foreground">+7 (914) 670-70-53</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 mt-1 text-primary" />
              <div>
                <h3 className="font-medium">Email</h3>
                <p className="text-muted-foreground">spot.hustle@gmail.com</p>
              </div>
            </div>

            <Button asChild className="w-full mt-4">
              <Link href="/contact">Связаться с нами</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="p-8 text-center border rounded-lg">
        <h2 className="mb-4 text-2xl font-bold">Присоединяйтесь к нам</h2>
        <p className="max-w-2xl mx-auto mb-6 text-muted-foreground">
          Станьте частью нашего сообщества ценителей искусства. Регистрируйтесь на платформе, чтобы получить доступ к
          эксклюзивным аукционам, предварительным просмотрам и специальным мероприятиям.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/register">Зарегистрироваться</Link>
          </Button>
          <Button variant="outline" asChild size="lg">
            <Link href="/login">Войти</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
