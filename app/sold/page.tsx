import { Metadata } from 'next'
import SoldArtworksPage from '@/components/pages/sold-artworks-page'

export const metadata: Metadata = {
	title: 'Проданные работы | Art Auction',
	description: 'Просмотр всех проданных работ на нашем аукционе',
}

export default function SoldPage() {
	return <SoldArtworksPage />
} 