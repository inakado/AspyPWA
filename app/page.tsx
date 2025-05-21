import ActiveEvent from "@/components/active-event"
import HotBids from "@/components/hot-bids"
import Announcements from "@/components/announcements"
import ArtistsShowcase from "@/components/artists-showcase"
import SoldArtworks from "@/components/sold-artworks"
import FAQ from "@/components/faq"
import FavoriteArtworks from "@/components/favorite-artworks"

export default function HomePage() {
  return (
    <div className="container px-4 py-8 mx-auto space-y-16">
      <ActiveEvent />
      {/* Компонент HotBids временно скрыт, но сохранен для возможного использования в будущем */}
      {/* <HotBids /> */}
      <FavoriteArtworks />
      <Announcements />
      <ArtistsShowcase />
      <SoldArtworks />
      <FAQ />
    </div>
  )
}
