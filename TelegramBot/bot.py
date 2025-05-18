import logging
import os
import requests
import traceback
from telegram.constants import ParseMode
from datetime import datetime
from telegram import (
    Update,
    InlineKeyboardButton,
    InlineKeyboardMarkup,
    WebAppInfo
)
from telegram.ext import (
    ApplicationBuilder,
    CommandHandler,
    ContextTypes,
    MessageHandler,
    filters,
    CallbackQueryHandler
)
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.INFO,
)
logger = logging.getLogger(__name__)



async def get_user_profile_photo(user_id: int, bot) -> str:
    try:
        photos = await bot.get_user_profile_photos(user_id, limit=1)
        return photos.photos[0][-1].file_id if photos.photos else ""
    except Exception as e:
        logger.error(f"Ошибка получения аватара: {str(e)}")
        return ""

def add_user_to_baserow(telegram_id: int, username: str, profile_image_url: str) -> bool:
    url = f"{os.getenv('BASEROW_BASE_URL')}/database/rows/table/{os.getenv('BASEROW_USERS_ID')}/?user_field_names=true"
    headers = {
        "Authorization": f"Token {os.getenv('BASEROW_TOKEN')}",
        "Content-Type": "application/json"
    }
    data = {
        "TelegramID": telegram_id,
        "Username": username,
        "ProfileImage": profile_image_url
    }
    try:
        logger.info(f"Попытка регистрации пользователя {telegram_id}")
        response = requests.post(url, headers=headers, json=data)
        logger.info(f"Добавление пользователя: {response.status_code}")
        return response.status_code == 200
    except Exception as e:
        logger.error(f"Ошибка регистрации: {str(e)}")
        return False

def fetch_lot_data_by_lot_id(lot_id: str):
    try:
        url = f"{os.getenv('BASEROW_BASE_URL')}/database/rows/table/{os.getenv('BASEROW_LOTS_ID')}/{lot_id}/?user_field_names=true"
        response = requests.get(url, headers={"Authorization": f"Token {os.getenv('BASEROW_TOKEN')}"})
        logger.info(f"Получение лота {lot_id}: {response.status_code}")
        return response.json() if response.status_code == 200 else None
    except Exception as e:
        logger.error(f"Ошибка получения лота: {str(e)}")
        return None

def get_artist_display_name(artist_id: str) -> str:
    try:
        url = f"{os.getenv('BASEROW_BASE_URL')}/database/rows/table/{os.getenv('BASEROW_ARTISTS_ID')}/{artist_id}/?user_field_names=true"
        response = requests.get(url, headers={"Authorization": f"Token {os.getenv('BASEROW_TOKEN')}"})
        if response.status_code == 200:
            return response.json().get('displayName', 'Нет данных')
        return 'Нет данных'
    except Exception as e:
        logger.error(f"Ошибка получения художника: {str(e)}")
        return 'Нет данных'

def get_user_baserow_id(telegram_id: int) -> int:
    logger.debug(f"Поиск пользователя {telegram_id} в Baserow")
    try:
        url = f"{os.getenv('BASEROW_BASE_URL')}/database/rows/table/{os.getenv('BASEROW_USERS_ID')}/?user_field_names=true"
        response = requests.get(url, headers={"Authorization": f"Token {os.getenv('BASEROW_TOKEN')}"})
        for user in response.json().get('results', []):
            if str(user.get('TelegramID')) == str(telegram_id):
                return user.get('id')
        return None
    except Exception as e:
        logger.error(f"Ошибка поиска пользователя: {str(e)}")
        return None

def get_max_bet_info(lot_id: str, initial_price: float) -> tuple:
    try:
        logger.info(f"Запрос ставок для лота {lot_id}")
        url = f"{os.getenv('BASEROW_BASE_URL')}/database/rows/table/{os.getenv('BASEROW_BETS_ID')}/?user_field_names=true"
        response = requests.get(url, headers={"Authorization": f"Token {os.getenv('BASEROW_TOKEN')}"})
        bets = [
            bet for bet in response.json().get('results', [])
            if bet.get('Lot', [{}])[0].get('id') == int(lot_id)
        ]
        
        valid_bets = []
        for bet in bets:
            try:
                bet_value = float(bet.get('BetValue', 0))
                valid_bets.append((bet_value, bet))
            except (ValueError, TypeError) as e:
                logger.warning(f"Некорректная ставка: {str(e)}")
                continue

        if not valid_bets:
            logger.info("Нет валидных ставок")
            return (float(initial_price), None)
            
        max_bet = max(valid_bets, key=lambda x: x[0])
        user_id = max_bet[1].get('User', [{}])[0].get('id')
        logger.info(f"Максимальная ставка: {max_bet[0]} от пользователя {user_id}")
        return (max_bet[0], user_id)
    except Exception as e:
        logger.error(f"Ошибка получения ставок: {str(e)}")
        return (float(initial_price), None)

async def notify_previous_leader(bot, user_baserow_id: int, lot_data: dict, new_bet: float, lot_id: str):
    try:
        logger.info(f"Уведомление пользователя {user_baserow_id}")
        url = f"{os.getenv('BASEROW_BASE_URL')}/database/rows/table/{os.getenv('BASEROW_USERS_ID')}/{user_baserow_id}/?user_field_names=true"
        response = requests.get(url, headers={"Authorization": f"Token {os.getenv('BASEROW_TOKEN')}"})
        
        if response.status_code != 200:
            logger.error(f"Ошибка получения данных пользователя: {response.status_code}")
            return

        user_data = response.json()
        telegram_id = user_data.get('TelegramID')
        if not telegram_id:
            logger.error("Telegram ID не найден")
            return

        from telegram.helpers import escape_markdown
        lot_name = escape_markdown(lot_data.get('Name', 'Лот'), version=2)
        escaped_bet = escape_markdown(f"{new_bet:.0f}", version=2)
        
        keyboard = [[InlineKeyboardButton("💰 Повысить ставку", callback_data=f"raise_bet_{lot_id}")]]
        
        await bot.send_message(
            chat_id=telegram_id,
            text=f"♦️ Ваша ставка на лот *«{lot_name}»* перебита\!\nНовая ставка: *{escaped_bet} ₽*",
            parse_mode="MarkdownV2",
            reply_markup=InlineKeyboardMarkup(keyboard)
        )
        
    except Exception as e:
        logger.error(f"Ошибка уведомления: {str(e)}\n{traceback.format_exc()}")

async def handle_button_click(update: Update, context: ContextTypes.DEFAULT_TYPE):
    try:
        query = update.callback_query
        await query.answer()
        _, lot_id = query.data.split('_', 2)[-2:]
        
        lot_data = fetch_lot_data_by_lot_id(lot_id)
        if not lot_data:
            await query.message.reply_text("❌ Лот не найден")
            return
            
        context.user_data.update({
            'lot_id': lot_id,
            'user_id': query.from_user.id
        })
        
        await query.message.reply_text(
            f"Введите сумму для лота №{lot_data.get('LotNumber', '')}:"
        )
        
    except Exception as e:
        logger.error(f"Ошибка обработки кнопки: {str(e)}\n{traceback.format_exc()}")
        await query.message.reply_text("❌ Ошибка. Попробуйте снова.")

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    try:
        user = update.effective_user
        args = context.args
        
        if args and args[0].startswith("bid_"):
            params = args[0].split("_")
            if len(params) >= 3:
                lot_id = params[1]
                initial_amount = params[2]
                logger.info(f"Ставка из сайта: лот {lot_id}, сумма {initial_amount}")
                await handle_bet_command(update, context, lot_id, user, initial_amount)
            else:
                await update.message.reply_text("❌ Неверный формат ссылки")
        else:
            # Создаем кнопку с ссылкой на веб-приложение
            keyboard = [
                [InlineKeyboardButton("🌐 Открыть веб-приложение",  web_app=WebAppInfo(url="https://aspyart.com"))]
            ]
            reply_markup = InlineKeyboardMarkup(keyboard)
            
            # Отправляем сообщение с кнопкой
            await update.message.reply_text(
                "Добро пожаловать! Для доступа к веб-приложению нажмите кнопку ниже:",
                reply_markup=reply_markup
            )
            
    except Exception as e:
        logger.error(f"Ошибка в /start: {str(e)}\n{traceback.format_exc()}")
        await update.message.reply_text("❌ Произошла ошибка при обработке команды.")

async def handle_bet_command(update: Update, context: ContextTypes.DEFAULT_TYPE, lot_id: str, user, initial_amount: str = None):
    try:
        logger.info(f"Обработка лота {lot_id} для {user.id}, начальная ставка: {initial_amount}")
        
        # Регистрация нового пользователя
        if not get_user_baserow_id(user.id):
            profile_image = await get_user_profile_photo(user.id, context.bot)
            if not add_user_to_baserow(user.id, user.username, profile_image):
                await update.message.reply_text("❌ Ошибка регистрации")
                return

        lot_data = fetch_lot_data_by_lot_id(lot_id)
        if not lot_data:
            await update.message.reply_text("❌ Лот не найден")
            return

        # Формирование информации о лоте
        artists = ", ".join([get_artist_display_name(a.get('id')) for a in lot_data.get('Artists', []) if a.get('id')])
        initial_price = float(lot_data.get('InitialPrice', 0))
        current_max, _ = get_max_bet_info(lot_id, initial_price)
        
        # Подготовка сообщения с учетом ставки с сайта
        suggested_amount = ""
        if initial_amount:
            try:
                amount_float = float(initial_amount)
                if amount_float > current_max:
                    suggested_amount = f"\nПредложенная ставка: {amount_float} ₽"
            except ValueError:
                pass
                
        message = (
            f"Автор: {artists or 'Нет данных'}\n"
            f"Лот: {lot_data['Name']}\n"
            f"Номер: {lot_data.get('LotNumber', 'Нет данных')}\n\n"
            f"Начальная цена: {initial_price} ₽\n"
            f"Текущая цена: {current_max} ₽{suggested_amount}\n\n"
            f"Введите сумму ставки:"
        )

        # Отправка изображения если есть
        if image_url := lot_data.get('Image', [{}])[0].get('url'):
            try:
                response = requests.get(image_url)
                with open("temp_img.jpg", "wb") as f:
                    f.write(response.content)
                await update.message.reply_photo(open("temp_img.jpg", "rb"), caption=message)
                os.remove("temp_img.jpg")
            except Exception as e:
                logger.error(f"Ошибка загрузки изображения: {str(e)}")
                await update.message.reply_text(message)
        else:
            await update.message.reply_text(message)

        # Сохраняем начальную ставку, если она была передана и валидна
        context_data = {'lot_id': lot_id, 'user_id': user.id}
        
        if initial_amount:
            try:
                amount_float = float(initial_amount)
                if amount_float > current_max:
                    # Автоматически подставляем ставку из URL
                    context_data['initial_bet_value'] = amount_float
                    await update.message.reply_text(
                        f"💡 Для подтверждения ставки {amount_float} ₽, просто отправьте её или введите другую сумму."
                    )
            except ValueError:
                pass
                
        context.user_data.update(context_data)

    except Exception as e:
        logger.error(f"Ошибка обработки команды: {str(e)}\n{traceback.format_exc()}")
        await update.message.reply_text("❌ Произошла ошибка")

async def handle_bet_value(update: Update, context: ContextTypes.DEFAULT_TYPE):
    try:
        user = update.effective_user
        lot_id = context.user_data.get('lot_id')
        logger.info(f"Обработка ставки от {user.id} для лота {lot_id}")

        if not lot_id or context.user_data.get('user_id') != user.id:
            await update.message.reply_text("❌ Сессия устарела. Начните заново.")
            return

        if context.user_data.get('awaiting_phone'):
            await handle_phone_input(update, context)
            return

        # Проверка, если пользователь отправил сообщение "Подтвердить" 
        # или просто нажал кнопку подтверждения
        initial_bet = context.user_data.get('initial_bet_value')
        
        if update.message.text.lower() in ["подтвердить", "confirm", "да", "yes"] and initial_bet:
            bet_value = initial_bet
        else:
            # Парсинг суммы ставки
            try:
                bet_value = float(update.message.text.replace(",", "."))
                if bet_value <= 0:
                    raise ValueError
            except (ValueError, TypeError):
                # Если пользователь ввел невалидное значение, но есть предложенная ставка,
                # подсказываем, что можно подтвердить предложенную
                if initial_bet:
                    await update.message.reply_text(
                        f"❌ Введите корректную сумму или отправьте '{initial_bet}' для подтверждения предложенной ставки"
                    )
                else:
                    await update.message.reply_text("❌ Введите корректную сумму")
                return

        # Получение данных лота
        lot_data = fetch_lot_data_by_lot_id(lot_id)
        initial_price = float(lot_data.get('InitialPrice', 0)) if lot_data else 0
        
        # Проверка текущих ставок
        current_max, previous_leader_id = get_max_bet_info(lot_id, initial_price)
        user_baserow_id = get_user_baserow_id(user.id)

        # Валидация ставки
        if bet_value <= current_max:
            await update.message.reply_text(f"📉 Ставка должна быть выше {current_max} ₽")
            return
            
        if user_baserow_id == previous_leader_id:
            await update.message.reply_text("❌ Нельзя повышать свою ставку")
            return

        # Сохранение данных для обработки
        context.user_data.update({
            'previous_leader_id': previous_leader_id,
            'previous_max': current_max,
            'bet_value': bet_value
        })

        # Проверка номера телефона
        user_data_url = f"{os.getenv('BASEROW_BASE_URL')}/database/rows/table/{os.getenv('BASEROW_USERS_ID')}/{user_baserow_id}/?user_field_names=true"
        response = requests.get(user_data_url, headers={"Authorization": f"Token {os.getenv('BASEROW_TOKEN')}"})
        
        if response.status_code != 200 or not response.json().get('PhoneNumber'):
            context.user_data['awaiting_phone'] = True
            await update.message.reply_text("📱 Введите номер телефона (79XXXXXXXXX):")
            return

        await process_bet(context, update, lot_id, user.id)

    except Exception as e:
        logger.error(f"Ошибка обработки ставки: {str(e)}\n{traceback.format_exc()}")
        await update.message.reply_text("❌ Произошла ошибка")

async def handle_phone_input(update: Update, context: ContextTypes.DEFAULT_TYPE):
    try:
        user = update.effective_user
        phone = update.message.text.strip()
        
        if not (len(phone) == 11 and phone.startswith('79') and phone.isdigit()):
            await update.message.reply_text("❌ Неверный формат номера")
            return
            
        if not update_user_phone_number(user.id, phone):
            await update.message.reply_text("❌ Ошибка сохранения номера")
            return

        # Восстановление данных ставки
        required_keys = ['previous_leader_id', 'previous_max', 'bet_value']
        if not all(k in context.user_data for k in required_keys):
            await update.message.reply_text("❌ Сессия устарела. Начните заново.")
            return

        await process_bet(context, update, 
                         context.user_data['lot_id'], 
                         user.id)
        
        context.user_data.pop('awaiting_phone', None)

    except Exception as e:
        logger.error(f"Ошибка обработки телефона: {str(e)}\n{traceback.format_exc()}")
        await update.message.reply_text("❌ Критическая ошибка")

async def process_bet(context, update, lot_id, user_id):
    try:
        logger.info(f"Обработка ставки для лота {lot_id}")
        
        # Получение данных из контекста
        previous_leader_id = context.user_data.get('previous_leader_id')
        previous_max = context.user_data.get('previous_max')
        bet_value = context.user_data.get('bet_value')
        
        # Критически важные проверки
        if None in (previous_max, bet_value):
            logger.error("Отсутствуют обязательные данные")
            await update.message.reply_text("❌ Ошибка обработки")
            return

        # Сохранение ставки
        user_baserow_id = get_user_baserow_id(user_id)
        if not user_baserow_id or not add_bet_to_baserow(lot_id, user_id, bet_value):
            await update.message.reply_text("❌ Ошибка сохранения ставки")
            return

        # Уведомление предыдущего лидера (если есть)
        if previous_leader_id and previous_leader_id != user_baserow_id:
            lot_data = fetch_lot_data_by_lot_id(lot_id)
            if lot_data:
                await notify_previous_leader(
                    context.bot,
                    previous_leader_id,
                    lot_data,
                    bet_value,
                    lot_id
                )
        admin_chat_id = os.getenv('ADMIN_TELEGRAM_ID')
        if admin_chat_id:
            # Получаем данные пользователя
            user_baserow_id = get_user_baserow_id(user_id)
            user_data = requests.get(
                f"{os.getenv('BASEROW_BASE_URL')}/database/rows/table/{os.getenv('BASEROW_USERS_ID')}/{user_baserow_id}/?user_field_names=true",
                headers={"Authorization": f"Token {os.getenv('BASEROW_TOKEN')}"}
            ).json()

            # Получаем данные лота
            lot_data = fetch_lot_data_by_lot_id(lot_id)
            
            # Формируем сообщение
            message = (
                "🎉 Новая ставка!\n\n"
                f"Лот: {lot_data.get('Name', 'Нет данных')}\n"
                f"Номер лота: {lot_data.get('LotNumber', 'Нет данных')}\n"
                f"Ставка: {bet_value:.0f} ₽\n"
                f"TG ID: {user_id}\n"
                f"Username: @{user_data.get('Username', 'нет')}\n"
                f"Телефон: {user_data.get('PhoneNumber', 'не указан')}"
            )

            # Отправляем администратору
            await context.bot.send_message(
                chat_id=admin_chat_id,
                text=message,
                parse_mode=ParseMode.HTML
            )
        else:
            logger.warning("Не указан ADMIN_TELEGRAM_ID в .env")

        web_app_button = InlineKeyboardButton(
            "🖼 Вернуться в приложение",
            web_app=WebAppInfo(url="https://aspyart.com")
        )
        
        # Отправляем сообщение с кнопкой
        await update.message.reply_text(
            f"✅ Ставка {bet_value} ₽ принята!\n\n"
            f"Мы сообщим, если вашу ставку перебьют или вы выиграете аукцион. Итоги аукциона будут объявлены 8 февраля 2025 года.",
            reply_markup=InlineKeyboardMarkup([[web_app_button]])
        )
        
 
        # Очистка контекста
        context.user_data.pop('previous_leader_id', None)
        context.user_data.pop('previous_max', None)
        context.user_data.pop('bet_value', None)
    except Exception as e:
        logger.error(f"Ошибка отправки уведомления админу: {str(e)}")
    except Exception as e:
        logger.error(f"Ошибка в process_bet: {str(e)}\n{traceback.format_exc()}")
        await update.message.reply_text("❌ Произошла ошибка")

async def send_event_info(update):
    await update.message.reply_text(
        "Приглашаем Вас на торжественную церемонию закрытия выставки Евгения Нована «Вечное возвращение»\n\n"

        "Вечером у вас будет возможность окончательно убедиться в серьезности вашего намерения приобрести это произведение искусства и лично пообщаться с автором\n\n"

        "🏛 Галерея «Арка»\n"
        "7 февраля с 17:00 до 20:00"
    
    )
    
# Функция для отпарвки сообщения от авторизованного по  (от имени бота)
async def notify_user(update: Update, context: ContextTypes.DEFAULT_TYPE):
    try:
        # Проверка прав администратора
        if str(update.effective_user.id) != os.getenv('ADMIN_TELEGRAM_ID'):
            await update.message.reply_text("❌ Доступ запрещен")
            return

        # Проверка формата команды
        if len(context.args) < 2:
            await update.message.reply_text("❌ Формат команды: /notify <user_id> <сообщение>")
            return

        user_id, *message_parts = context.args
        message = ' '.join(message_parts)

        # Попытка отправки сообщения
        try:
            await context.bot.send_message(
                chat_id=int(user_id),
                text=f"🔔 Сообщение от администратора:\n\n{message}"
            )
            await update.message.reply_text(f"✅ Сообщение отправлено пользователю {user_id}")
        except Exception as e:
            await update.message.reply_text(f"❌ Ошибка отправки: {str(e)}")

    except ValueError:
        await update.message.reply_text("❌ Неверный формат ID пользователя")
    except Exception as e:
        logger.error(f"Ошибка в /notify: {str(e)}")
        await update.message.reply_text("❌ Произошла ошибка при обработке команды")    

def add_bet_to_baserow(lot_id: str, user_id: int, bet_value: float) -> bool:
    try:
        user_baserow_id = get_user_baserow_id(user_id)
        if not user_baserow_id:
            return False

        data = {
            "BetValue": bet_value,
            "Date": datetime.now().isoformat(),
            "User": [user_baserow_id],
            "Lot": int(lot_id)
        }
        
        response = requests.post(
            f"{os.getenv('BASEROW_BASE_URL')}/database/rows/table/{os.getenv('BASEROW_BETS_ID')}/?user_field_names=true",
            headers={"Authorization": f"Token {os.getenv('BASEROW_TOKEN')}"},
            json=data
        )
        
        return response.status_code == 200
        
    except Exception as e:
        logger.error(f"Ошибка сохранения ставки: {str(e)}")
        return False

def update_user_phone_number(telegram_id: int, phone: str) -> bool:
    try:
        user_id = get_user_baserow_id(telegram_id)
        if not user_id:
            return False
            
        response = requests.patch(
            f"{os.getenv('BASEROW_BASE_URL')}/database/rows/table/{os.getenv('BASEROW_USERS_ID')}/{user_id}/?user_field_names=true",
            headers={"Authorization": f"Token {os.getenv('BASEROW_TOKEN')}"},
            json={"PhoneNumber": phone}
        )
        
        return response.status_code == 200
        
    except Exception as e:
        logger.error(f"Ошибка обновления телефона: {str(e)}")
        return False

def run_telegram_bot():
    logger.info("🚀 Запуск бота...")
    application = ApplicationBuilder().token(os.getenv('TELEGRAM_BOT_TOKEN')).build()
    
    application.add_handler(CommandHandler("notify", notify_user))
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CallbackQueryHandler(handle_button_click, pattern="^raise_bet_"))
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND & filters.Regex(r'^79\d{9}$'), handle_phone_input))
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_bet_value))
    
    application.run_polling()

if __name__ == "__main__":
    run_telegram_bot()