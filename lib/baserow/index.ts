export * from './types'
export * from './config'
export * from './client'

import { BaserowClient } from './client'

// Экспорт готового экземпляра клиента для использования в приложении
export const baserowClient = new BaserowClient() 