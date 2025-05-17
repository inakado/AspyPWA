"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { placeBid } from "@/lib/actions"
import { ExternalLink } from "lucide-react"

interface BidFormProps {
  artworkId: string
  currentBid: number | null
}

export default function BidForm({ artworkId, currentBid }: BidFormProps) {
  const [bidAmount, setBidAmount] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const minBid = currentBid ? currentBid + 1000 : 5000 // Минимальный шаг ставки 1000₽

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    const amount = Number.parseInt(bidAmount)

    if (isNaN(amount) || amount < minBid) {
      setError(`Минимальная ставка должна быть ${minBid}₽`)
      return
    }

    setIsSubmitting(true)

    try {
      // Редирект в Telegram бот
      const telegramBotUrl = `https://t.me/AspyArtBot?start=bid_${artworkId}_${amount}`
      window.open(telegramBotUrl, '_blank')
      setSuccess("Перенаправляем вас в Telegram для завершения ставки")
      
      /* 
      // Логика для будущего использования
      // await placeBid(artworkId, amount)
      // setSuccess("Ваша ставка принята!")
      */
      
      setBidAmount("")
    } catch (err) {
      setError("Произошла ошибка. Пожалуйста, попробуйте снова.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="space-y-2">
        <label htmlFor="bid-amount" className="text-sm text-muted-foreground">
          Ваша ставка (мин. {minBid}₽)
        </label>
        <div className="flex gap-2">
          <Input
            id="bid-amount"
            type="number"
            min={minBid}
            step="1000"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            placeholder={`${minBid}`}
            className="flex-1"
            required
          />
          <Button type="submit" disabled={isSubmitting} className="flex items-center gap-1">
            {isSubmitting ? "Отправка..." : (
              <>
                Сделать ставку
                <ExternalLink className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        {success && <p className="text-sm text-green-500">{success}</p>}
        <p className="text-xs text-muted-foreground mt-2">
          Вы будете перенаправлены в Telegram для завершения процесса
        </p>
      </div>
    </form>
  )
}
