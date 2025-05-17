import { NextResponse } from 'next/server'
import {
	getUsers,
	getUserById,
	getUserByTelegramId,
	createUser,
	updateUser,
} from '@/lib/services'

/**
 * GET /api/users - получение всех пользователей
 * GET /api/users?id=123 - получение пользователя по ID
 * GET /api/users?telegramId=123456789 - получение пользователя по Telegram ID
 */
export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url)
		const id = searchParams.get('id')
		const telegramId = searchParams.get('telegramId')

		// Получение пользователя по ID
		if (id) {
			const userId = parseInt(id, 10)
			const user = await getUserById(userId)

			if (!user) {
				return NextResponse.json(
					{ error: `Пользователь с ID ${id} не найден` },
					{ status: 404 }
				)
			}

			return NextResponse.json(user)
		}

		// Получение пользователя по Telegram ID
		if (telegramId) {
			const user = await getUserByTelegramId(telegramId)

			if (!user) {
				return NextResponse.json(
					{ error: `Пользователь с Telegram ID ${telegramId} не найден` },
					{ status: 404 }
				)
			}

			return NextResponse.json(user)
		}

		// Получение всех пользователей
		const users = await getUsers()
		return NextResponse.json(users)
	} catch (error) {
		console.error('Ошибка при обработке запроса пользователей:', error)
		return NextResponse.json(
			{ error: 'Ошибка при получении данных' },
			{ status: 500 }
		)
	}
}

/**
 * POST /api/users - создание нового пользователя
 */
export async function POST(request: Request) {
	try {
		const body = await request.json()
		const { telegramId, username, phoneNumber, profileImage } = body

		// Проверка наличия необходимых данных
		if (!telegramId || !username) {
			return NextResponse.json(
				{ error: 'Необходимо указать telegramId и username' },
				{ status: 400 }
			)
		}

		// Проверка, что пользователь с таким Telegram ID еще не существует
		const existingUser = await getUserByTelegramId(telegramId)
		if (existingUser) {
			return NextResponse.json(
				{ error: 'Пользователь с таким Telegram ID уже существует', user: existingUser },
				{ status: 409 }
			)
		}

		// Создание нового пользователя
		const newUser = await createUser(telegramId, username, phoneNumber, profileImage)

		if (!newUser) {
			return NextResponse.json(
				{ error: 'Не удалось создать пользователя' },
				{ status: 500 }
			)
		}

		return NextResponse.json(newUser, { status: 201 })
	} catch (error) {
		console.error('Ошибка при создании пользователя:', error)
		return NextResponse.json(
			{ error: 'Ошибка при создании пользователя' },
			{ status: 500 }
		)
	}
}

/**
 * PATCH /api/users - обновление пользователя
 */
export async function PATCH(request: Request) {
	try {
		const body = await request.json()
		const { id, ...userData } = body

		// Проверка наличия необходимых данных
		if (!id) {
			return NextResponse.json(
				{ error: 'Необходимо указать id пользователя' },
				{ status: 400 }
			)
		}

		// Проверка существования пользователя
		const existingUser = await getUserById(parseInt(id, 10))
		if (!existingUser) {
			return NextResponse.json(
				{ error: `Пользователь с ID ${id} не найден` },
				{ status: 404 }
			)
		}

		// Обновление пользователя
		const updatedUser = await updateUser(parseInt(id, 10), userData)

		if (!updatedUser) {
			return NextResponse.json(
				{ error: 'Не удалось обновить пользователя' },
				{ status: 500 }
			)
		}

		return NextResponse.json(updatedUser)
	} catch (error) {
		console.error('Ошибка при обновлении пользователя:', error)
		return NextResponse.json(
			{ error: 'Ошибка при обновлении пользователя' },
			{ status: 500 }
		)
	}
} 