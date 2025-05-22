"use client"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import SearchDialog from "@/components/search-dialog"

export default function Header() {
  const pathname = usePathname()

  const navItems = [
    { name: "Главная", href: "/" },
    { name: "Аукционы", href: "/auctions" },
    { name: "Художники", href: "/artists" },
    { name: "О проекте", href: "/about" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-art-bg/95 backdrop-blur supports-[backdrop-filter]:bg-art-bg/60">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <div className="flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="w-5 h-5 text-foreground" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px] bg-art-base">
              <nav className="flex flex-col gap-4 mt-6">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-lg font-medium transition-colors ${
                      pathname === item.href ? "text-art-accent" : "text-foreground/80 hover:text-art-primary"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-2 mr-6">
            <Image 
              src="/aspy-logo.svg" 
              alt="ASPY" 
              width={100} 
              height={46} 
              className="h-[32px] w-auto"
              priority
            />
          </Link>

          <nav className="hidden md:flex md:gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === item.href ? "text-art-accent" : "text-foreground/80 hover:text-art-primary"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center">
          <SearchDialog />
        </div>
      </div>
    </header>
  )
}
