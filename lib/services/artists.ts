import { baserowClient } from '../baserow'
import type { Artist, BaserowReference } from '../baserow'

/**
 * Адаптированная модель художника для использования на клиенте
 */
export interface ArtistModel {
	id: number
	name: string
	displayName: string
	bio: string
	image: string | null  // Картинка из mainArt для карточек лотов
	profileImage: string | null  // Фото художника из photos для страницы профиля
	photos: string[]
	artworksCount: number
	lots: { id: number; name: string }[]
	tags: string[]
}

/**
 * Получение списка всех художников
 */
export async function getArtists(): Promise<ArtistModel[]> {
	try {
		const response = await baserowClient.getArtists()
		return response.results.map(transformArtistToModel)
	} catch (error) {
		console.error('Ошибка при получении списка художников:', error)
		return []
	}
}

/**
 * Получение художника по ID
 */
export async function getArtistById(id: number): Promise<ArtistModel | null> {
	try {
		const artist = await baserowClient.getArtistById(id)
		return transformArtistToModel(artist)
	} catch (error) {
		console.error(`Ошибка при получении художника с ID ${id}:`, error)
		return null
	}
}

/**
 * Преобразование данных из Baserow в модель художника
 */
function transformArtistToModel(artist: Artist): ArtistModel {
	// Получаем основное фото художника из поля mainArt или первое из photos
	const mainPhoto = artist.mainArt?.length > 0 
		? artist.mainArt[0].url 
		: artist.photos?.length > 0 
			? artist.photos[0].url 
			: null

	// Получаем фото для профиля из photos
	const profilePhoto = artist.photos?.length > 0 
		? artist.photos[0].url 
		: null

	// Получаем все фото художника
	const photos = artist.photos?.map(photo => photo.url) || []

	// Получаем список лотов художника
	const lots = artist.Lots?.map(transformReference) || []

	// Получаем теги художника из Baserow
	const tags = artist.tags?.map(tag => tag.value) || []
	
	// Если теги отсутствуют, используем запасной вариант с генерацией из био
	if (tags.length === 0) {
		tags.push(...generateTagsFromBio(artist.bio))
	}

	return {
		id: artist.id,
		name: artist.Name,
		displayName: artist.displayName || artist.Name,
		bio: artist.bio || '',
		image: mainPhoto,
		profileImage: profilePhoto,
		photos,
		artworksCount: lots.length,
		lots,
		tags,
	}
}

/**
 * Преобразование ссылки Baserow в объект { id, name }
 */
function transformReference(ref: BaserowReference) {
	return {
		id: ref.id,
		name: ref.value,
	}
}

/**
 * Генерация тегов на основе описания художника (временное решение)
 * Используется только если в Baserow не заданы теги
 */
function generateTagsFromBio(bio: string = ''): string[] {
	const defaultTags = ['Современное искусство']
	
	// Ключевые слова для тегов
	const keywordMap = {
		'монументалист': 'Монументальное искусство',
		'мозаик': 'Мозаика',
		'живопис': 'Живопись',
		'муралист': 'Стрит-арт',
		'владивосток': 'Владивосток',
		'графи': 'Графика',
	}

	const tags = [...defaultTags]
	
	// Добавляем теги на основе ключевых слов в описании
	Object.entries(keywordMap).forEach(([keyword, tag]) => {
		if (bio.toLowerCase().includes(keyword.toLowerCase())) {
			tags.push(tag)
		}
	})
	
	// Удаляем дубликаты и возвращаем не более 5 тегов
	return [...new Set(tags)].slice(0, 5)
} 