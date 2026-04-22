/**
 * Двухуровневая структура: категория → подтемы.
 * category — ключ категории
 * topic — ключ подтемы (используется в текстах)
 *
 * Ключ категории/подтемы также используется как имя файла картинки:
 * public/icons/{ключ}.png
 */

export const categories = {
  driving: {
    label: "Вождение в Норвегии",
    topics: {
      traffic_signs: { label: "Знаки дорожного движения" },
      car: { label: "Устройство автомобиля" },
      motorcycle: { label: "Устройство мотоцикла" },
    },
  },
  economy: {
    label: "Экономика",
    topics: {
      banks: { label: "Банки Норвегии" },
      mortgage: { label: "Ипотека в Норвегии" },
      budget: { label: "Домашняя бухгалтерия" },
      insurance: { label: "Страхование" },
      oil_fund: { label: "Нефтяной фонд" },
    },
  },
  society: {
    label: "Общество",
    topics: {
      bureaucracy: { label: "Бюрократия" },
      digital_services: { label: "Цифровые сервисы" },
      allemannsretten: { label: "Allemannsretten" },
      janteloven: { label: "Janteloven" },
      judicial: { label: "Судебная система" },
    },
  },
  science: {
    label: "Наука",
    topics: {
      discoveries: { label: "Открытия" },
      technology: { label: "Современные технологии" },
    },
  },
  work: {
    label: "Работа",
    topics: {
      job_search: { label: "Поиск работы" },
      interview: { label: "Собеседование" },
      rights: { label: "Права работника" },
    },
  },
  education: {
    label: "Образование",
    topics: {
      school: { label: "Школа" },
      university: { label: "Университет" },
      norwegian_course: { label: "Норвежский для иностранцев" },
    },
  },
}

export const levels = ["A2", "B1", "B2"]

export const levelDescriptions = {
  A2: {
    title: "Элементарный уровень",
    summary: "Простые короткие предложения и базовая повседневная лексика.",
    features: [
      "Простые предложения, рассказы от первого лица",
      "Бытовая лексика: семья, дом, работа, покупки",
      "Настоящее и простое прошедшее время",
      "Базовые числа, даты, описания людей и мест",
    ],
  },
  B1: {
    title: "Средний уровень",
    summary: "Сложные предложения с придаточными и специализированная тематическая лексика.",
    features: [
      "Сложные предложения с придаточными (потому что, если, когда)",
      "Тематическая лексика: специализированные термины",
      "Описания процессов, сравнения, выражение мнения",
      "Условные конструкции и модальные глаголы",
    ],
  },
  B2: {
    title: "Продвинутый уровень",
    summary: "Аналитический стиль, профессиональная терминология, сложные многосоставные предложения.",
    features: [
      "Профессиональная и абстрактная терминология",
      "Причинно-следственные связи, аналитические тексты",
      "Пассивные конструкции, сложные формулировки",
      "Выражение нюансов, противопоставлений, оценок",
    ],
  },
}

export const lengths = {
  short: "Короткий",
  medium: "Средний",
  long: "Длинный",
}

// Путь к картинке категории или подтемы по её ключу
export function iconPath(key) {
  return `/icons/${key}.png`
}

export function getTopicLabel(topicKey) {
  for (const cat of Object.values(categories)) {
    if (cat.topics[topicKey]) return cat.topics[topicKey].label
  }
  return topicKey
}

export function getCategoryKey(topicKey) {
  for (const [catKey, cat] of Object.entries(categories)) {
    if (cat.topics[topicKey]) return catKey
  }
  return null
}
