/**
 * Русская плюрализация.
 * plural(1, ['текст', 'текста', 'текстов']) → 'текст'
 * plural(2, ['текст', 'текста', 'текстов']) → 'текста'
 * plural(5, ['текст', 'текста', 'текстов']) → 'текстов'
 */
export function plural(n, [one, few, many]) {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod100 >= 11 && mod100 <= 14) return many
  if (mod10 === 1) return one
  if (mod10 >= 2 && mod10 <= 4) return few
  return many
}

export const texts = ['текст', 'текста', 'текстов']
export const words = ['слово', 'слова', 'слов']
