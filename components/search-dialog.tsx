"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export default function SearchDialog() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="w-9 px-0">
          <Search className="w-5 h-5 text-foreground" />
          <span className="sr-only">Поиск</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-art-base border-border/40">
        <DialogHeader>
          <DialogTitle className="font-serif text-art-primary">Поиск</DialogTitle>
          <DialogDescription className="text-foreground/70">
            Найдите произведения искусства, художников или аукционы
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="search"
            placeholder="Поиск..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 border-border/40 focus-visible:ring-art-accent"
            autoFocus
          />
          <Button type="submit">Найти</Button>
        </form>
        <div className="mt-4">
          <p className="mb-2 text-sm text-foreground/70">Популярные запросы:</p>
          <div className="flex flex-wrap gap-2">
            {["Пейзаж", "Абстракция", "Портрет", "Современное искусство", "Импрессионизм"].map((term) => (
              <Button
                key={term}
                variant="outline"
                size="sm"
                onClick={() => {
                  setQuery(term)
                }}
              >
                {term}
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
