/**
 * Двухуровневая структура: категория → подтемы.
 * category — ключ категории
 * topic — ключ подтемы (используется в текстах)
 */

export const categories = {
  driving: {
    label: "Вождение в Норвегии",
    topics: {
      traffic_signs: "Знаки дорожного движения",
      car: "Устройство автомобиля",
      motorcycle: "Устройство мотоцикла",
    },
  },
  economy: {
    label: "Экономика",
    topics: {
      banks: "Банки Норвегии",
      mortgage: "Ипотека в Норвегии",
      budget: "Домашняя бухгалтерия",
    },
  },
  science: {
    label: "Наука",
    topics: {
      discoveries: "Открытия",
      technology: "Современные технологии",
    },
  },
  work: {
    label: "Работа",
    topics: {
      job_search: "Поиск работы",
      interview: "Собеседование",
      rights: "Права работника",
    },
  },
  education: {
    label: "Образование",
    topics: {
      school: "Школа",
      university: "Университет",
      norwegian_course: "Норвежский для иностранцев",
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
    if (cat.topics[topicKey]) return cat.topics[topicKey]
  }
  return topicKey
}

// Вспомогательная функция: получить ключ категории по ключу подтемы
export function getCategoryKey(topicKey) {
  for (const [catKey, cat] of Object.entries(categories)) {
    if (cat.topics[topicKey]) return catKey
  }
  return null
}
