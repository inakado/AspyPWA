import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Mail, Phone, MapPin, Palette, Heart, Eye } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="max-w-4xl mx-auto">
        <h1 className="mb-8 text-4xl font-bold text-center text-primary">О нас</h1>
        
        <div className="space-y-6">
          <div className="p-6 bg-gradient-to-br from-primary/5 to-transparent rounded-lg border">
            <h2 className="text-xl font-semibold mb-3 text-primary">ASPY — арт-бюро из Владивостока</h2>
            <p className="text-muted-foreground leading-relaxed">
              Мы вдохновлены экспериментальным подходом к искусству, свободой эстетического самовыражения 
              и преодолением временных рамок и стереотипов. В основе нашего проекта лежит уверенность в том, 
              что искусство остается актуальным, живым и востребованным до тех пор, пока зритель способен 
              чувствовать, понимать и осознавать его.
            </p>
          </div>

          <div className="p-6 bg-gradient-to-br from-secondary/10 to-transparent rounded-lg border">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              АСПИ — Уникальная платформа
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Аукцион Своевременных Произведений Искусств представляет собой уникальную платформу, 
              где искусство становится мостом между прошлым и настоящим. Здесь вы можете обнаружить 
              удивительные параллели и созвучия между произведениями, созданными столетия назад, 
              и современными арт-объектами, отражающими идеи сегодняшнего дня.
            </p>
          </div>

          <div className="p-6 bg-gradient-to-br from-accent/10 to-transparent rounded-lg border">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              Пространство вдохновения
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Наш аукцион – это не только место продажи картин, но и пространство, призванное вдохновлять, 
              пробуждать воображение и стимулировать зрителей на увлекательное путешествие по океану ассоциаций 
              и образного мышления. Взаимодействуя с произведениями своевременного искусства, вы погружаетесь 
              в атмосферу живых образов и ярких эмоций, способных изменить восприятие окружающего мира.
            </p>
          </div>

          <div className="p-6 bg-gradient-to-br from-primary/10 to-transparent rounded-lg border-2 border-primary/20">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-primary">
              <Eye className="w-5 h-5" />
              Присоединяйтесь к ASPY
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Откройте для себя своевременное искусство, способное говорить на языке, понятном каждому поколению.
            </p>
          </div>
        </div>
      </div>

      <Separator className="my-12" />

      {/* Скрытый блок команды - можно раскомментировать при необходимости
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
      */}

      {/* Дополнительный декоративный блок */}
      <div className="grid gap-8 mb-12 md:grid-cols-3">
        <Card className="p-6 text-center bg-gradient-to-br from-primary/5 to-transparent">
          <Palette className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h3 className="mb-2 font-semibold">Экспериментальный подход</h3>
          <p className="text-sm text-muted-foreground">
            Свобода эстетического самовыражения и преодоление временных рамок
          </p>
        </Card>
        
        <Card className="p-6 text-center bg-gradient-to-br from-secondary/10 to-transparent">
          <Heart className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h3 className="mb-2 font-semibold">Живое искусство</h3>
          <p className="text-sm text-muted-foreground">
            Произведения остаются актуальными, пока зритель способен их чувствовать
          </p>
        </Card>
        
        <Card className="p-6 text-center bg-gradient-to-br from-accent/10 to-transparent">
          <Eye className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h3 className="mb-2 font-semibold">Мост времени</h3>
          <p className="text-sm text-muted-foreground">
            Связываем прошлое и настоящее через своевременное искусство
          </p>
        </Card>
      </div>

      <div>
        <h2 className="mb-6 text-2xl font-bold text-center">Контакты</h2>
        <div className="max-w-lg mx-auto">
          <div className="p-6 space-y-4 border rounded-lg bg-gradient-to-br from-primary/5 to-transparent">
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
    </div>
  )
}
