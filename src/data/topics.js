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
    labelNo: "Kjøring i Norge",
    topics: {
      traffic_signs: { label: "Знаки дорожного движения", labelNo: "Trafikkskilt" },
      car: { label: "Устройство автомобиля", labelNo: "Bilens oppbygning" },
      motorcycle: { label: "Устройство мотоцикла", labelNo: "Motorsykkelens oppbygning" },
    },
  },
  economy: {
    label: "Экономика",
    labelNo: "Økonomi",
    topics: {
      banks: { label: "Банки Норвегии", labelNo: "Norske banker" },
      mortgage: { label: "Ипотека в Норвегии", labelNo: "Boliglån i Norge" },
      budget: { label: "Домашняя бухгалтерия", labelNo: "Husholdningsøkonomi" },
      insurance: { label: "Страхование", labelNo: "Forsikring" },
      oil_fund: { label: "Нефтяной фонд", labelNo: "Oljefondet" },
    },
  },
  society: {
    label: "Общество",
    labelNo: "Samfunn",
    topics: {
      bureaucracy: { label: "Бюрократия", labelNo: "Byråkrati" },
      digital_services: { label: "Цифровые сервисы", labelNo: "Digitale tjenester" },
      allemannsretten: { label: "Allemannsretten", labelNo: "Allemannsretten" },
      janteloven: { label: "Janteloven", labelNo: "Janteloven" },
      judicial: { label: "Судебная система", labelNo: "Rettssystem" },
    },
  },
  science: {
    label: "Наука",
    labelNo: "Vitenskap",
    topics: {
      discoveries: { label: "Открытия", labelNo: "Oppdagelser" },
      technology: { label: "Современные технологии", labelNo: "Moderne teknologi" },
    },
  },
  work: {
    label: "Работа",
    labelNo: "Arbeid",
    topics: {
      job_search: { label: "Поиск работы", labelNo: "Jobbsøk" },
      interview: { label: "Собеседование", labelNo: "Jobbintervju" },
      rights: { label: "Права работника", labelNo: "Arbeidstakerrettigheter" },
    },
  },
  education: {
    label: "Образование",
    labelNo: "Utdanning",
    topics: {
      school: { label: "Школа", labelNo: "Skole" },
      university: { label: "Университет", labelNo: "Universitet" },
      norwegian_course: { label: "Норвежский для иностранцев", labelNo: "Norsk for utlendinger" },
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

export function getTopicLabelNo(topicKey) {
  for (const cat of Object.values(categories)) {
    if (cat.topics[topicKey]) return cat.topics[topicKey].labelNo
  }
  return null
}

export function getCategoryKey(topicKey) {
  for (const [catKey, cat] of Object.entries(categories)) {
    if (cat.topics[topicKey]) return catKey
  }
  return null
}
