/**
 * Двухуровневая структура: категория → подтемы.
 * category — ключ категории
 * topic — ключ подтемы (используется в текстах)
 */

export const categories = {
  driving: {
    label: "Вождение в Норвегии",
    icon: "\u{1F697}",
    topics: {
      traffic_signs: { label: "Знаки дорожного движения", icon: "\u{1F6A6}" },
      car: { label: "Устройство автомобиля", icon: "\u{1F699}" },
      motorcycle: { label: "Устройство мотоцикла", icon: "\u{1F3CD}\u{FE0F}" },
    },
  },
  economy: {
    label: "Экономика",
    icon: "\u{1F4B0}",
    topics: {
      banks: { label: "Банки Норвегии", icon: "\u{1F3E6}" },
      mortgage: { label: "Ипотека в Норвегии", icon: "\u{1F3E0}" },
      budget: { label: "Домашняя бухгалтерия", icon: "\u{1F4CA}" },
    },
  },
  science: {
    label: "Наука",
    icon: "\u{1F52C}",
    topics: {
      discoveries: { label: "Открытия", icon: "\u{1F52D}" },
      technology: { label: "Современные технологии", icon: "\u{1F4BB}" },
    },
  },
  work: {
    label: "Работа",
    icon: "\u{1F4BC}",
    topics: {
      job_search: { label: "Поиск работы", icon: "\u{1F50D}" },
      interview: { label: "Собеседование", icon: "\u{1F91D}" },
      rights: { label: "Права работника", icon: "\u{2696}\u{FE0F}" },
    },
  },
  education: {
    label: "Образование",
    icon: "\u{1F4DA}",
    topics: {
      school: { label: "Школа", icon: "\u{1F3EB}" },
      university: { label: "Университет", icon: "\u{1F393}" },
      norwegian_course: { label: "Норвежский для иностранцев", icon: "\u{1F1F3}\u{1F1F4}" },
    },
  },
}

export const levels = ["A2", "B1", "B2"]

export const lengths = {
  short: "Короткий",
  medium: "Средний",
  long: "Длинный",
}

// Вспомогательная функция: получить название подтемы по ключу
export function getTopicLabel(topicKey) {
  for (const cat of Object.values(categories)) {
    if (cat.topics[topicKey]) return cat.topics[topicKey].label
  }
  return topicKey
}

export function getTopicIcon(topicKey) {
  for (const cat of Object.values(categories)) {
    if (cat.topics[topicKey]) return cat.topics[topicKey].icon
  }
  return ""
}

// Вспомогательная функция: получить ключ категории по ключу подтемы
export function getCategoryKey(topicKey) {
  for (const [catKey, cat] of Object.entries(categories)) {
    if (cat.topics[topicKey]) return catKey
  }
  return null
}
