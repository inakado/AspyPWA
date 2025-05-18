import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQ() {
  const faqItems = [
    {
      question: "Как узнать что я выиграл?",
      answer:
        "После завершения аукциона победитель получает уведомление по электронной почте и в личном кабинете. Также с вами свяжется наш менеджер для подтверждения покупки и организации оплаты.",
    },
    {
      question: "Как происходит оплата?",
      answer:
        "Оплата производится в течение 3 рабочих дней после завершения аукциона. Мы принимаем банковские карты, банковские переводы и электронные платежи. После подтверждения оплаты вы получите чек и сертификат подлинности.",
    },
    {
      question: "Есть ли доставка?",
      answer:
        "Да, мы организуем доставку по всей России и международную доставку. Стоимость доставки зависит от размера работы и адреса доставки. Все работы тщательно упаковываются для безопасной транспортировки.",
    },
    {
      question: "Как работает аукцион?",
      answer:
        "Наш аукцион работает по принципу повышения ставок. Вы можете сделать ставку, превышающую текущую на минимальный шаг или больше. Если ваша ставка остается наивысшей до окончания аукциона, вы становитесь победителем. Также доступна функция автоматических ставок, где вы указываете максимальную сумму, а система автоматически повышает вашу ставку при необходимости.",
    },
    {
      question: "А картины подлинные?",
      answer:
        "Да, все представленные на нашем аукционе работы являются подлинными. Каждое произведение проходит тщательную проверку подлинности нашими экспертами. При покупке вы получаете сертификат подлинности, подтверждающий авторство и происхождение работы.",
    },
  ]

  return (
    <section className="py-10">
      <h2 className="mb-8 text-3xl font-serif font-medium text-center text-art-primary">Часто задаваемые вопросы</h2>

      <Accordion type="single" collapsible className="max-w-4xl mx-auto">
        {faqItems.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`} className="border-border/40">
            <AccordionTrigger className="text-left font-medium text-art-primary hover:text-art-accent">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-foreground/80 leading-relaxed">{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
