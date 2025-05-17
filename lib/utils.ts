import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Склоняет слово в зависимости от числа
 * @param count Число
 * @param words Массив слов для разных форм [одна, две-четыре, пять-двадцать]
 * @returns Правильная форма слова
 */
export function pluralize(count: number, words: [string, string, string]): string {
  const cases = [2, 0, 1, 1, 1, 2]
  const index = 
    count % 100 > 4 && count % 100 < 20 
      ? 2 
      : cases[Math.min(count % 10, 5)]
  return words[index]
}

/**
 * Склоняет слово "работа" в зависимости от числа
 * @param count Количество работ
 * @returns Строка с правильной формой слова "работа"
 */
export function pluralizeWorks(count: number): string {
  return `${count} ${pluralize(count, ['работа', 'работы', 'работ'])}`
}
