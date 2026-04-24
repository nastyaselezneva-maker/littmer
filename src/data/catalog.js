const catalog = [
  {
    "id": "trafikkregler-1",
    "title": "Основные правила дорожного движения",
    "level": "A2",
    "category": "driving",
    "topic": "traffic_signs",
    "length": "short",
    "description": "Базовые правила на дороге в Норвегии"
  },
  {
    "id": "trafikkregler-2",
    "title": "Знаки и перекрёстки",
    "level": "B1",
    "category": "driving",
    "topic": "traffic_signs",
    "length": "medium",
    "description": "Дорожные знаки и правила проезда перекрёстков"
  },
  {
    "id": "trafikkregler-3",
    "title": "Вождение зимой в Норвегии",
    "level": "B2",
    "category": "driving",
    "topic": "traffic_signs",
    "length": "long",
    "description": "Особенности вождения в зимних условиях"
  },
  {
    "id": "bil-1",
    "title": "Части автомобиля",
    "level": "A2",
    "category": "driving",
    "topic": "car",
    "length": "short",
    "description": "Основные части автомобиля и их названия"
  },
  {
    "id": "bil-2",
    "title": "Обслуживание автомобиля",
    "level": "B1",
    "category": "driving",
    "topic": "car",
    "length": "medium",
    "description": "Техобслуживание и уход за машиной"
  },
  {
    "id": "bil-3",
    "title": "Электромобили в Норвегии",
    "level": "B2",
    "category": "driving",
    "topic": "car",
    "length": "long",
    "description": "Почему Норвегия — мировой лидер по электромобилям"
  },
  {
    "id": "mc-1",
    "title": "Части мотоцикла",
    "level": "A2",
    "category": "driving",
    "topic": "motorcycle",
    "length": "short",
    "description": "Основные части мотоцикла и их функции"
  },
  {
    "id": "mc-2",
    "title": "Вождение мотоцикла в Норвегии",
    "level": "B2",
    "category": "driving",
    "topic": "motorcycle",
    "length": "medium",
    "description": "Правила и особенности вождения мотоцикла"
  },
  {
    "id": "mc-3",
    "title": "Мотоциклетный сезон",
    "level": "B1",
    "category": "driving",
    "topic": "motorcycle",
    "length": "long",
    "description": "Подготовка мотоцикла к сезону и лучшие маршруты"
  },
  {
    "id": "utdanning-1",
    "title": "Школьная система",
    "level": "A2",
    "category": "education",
    "topic": "school",
    "length": "short",
    "description": "Как устроена школа в Норвегии"
  },
  {
    "id": "utdanning-2",
    "title": "Высшее образование",
    "level": "B2",
    "category": "education",
    "topic": "university",
    "length": "medium",
    "description": "Университеты и студенческая жизнь в Норвегии"
  },
  {
    "id": "utdanning-3",
    "title": "Норвежский для иностранцев",
    "level": "B1",
    "category": "education",
    "topic": "norwegian_course",
    "length": "long",
    "description": "Как иностранцы изучают норвежский язык"
  },
  {
    "id": "boliglan-1",
    "title": "Мы хотим купить квартиру",
    "level": "A2",
    "category": "economy",
    "topic": "mortgage",
    "length": "short",
    "description": "Семья решает купить своё первое жильё"
  },
  {
    "id": "boliglan-2",
    "title": "Встреча в банке",
    "level": "A2",
    "category": "economy",
    "topic": "mortgage",
    "length": "medium",
    "description": "Первый визит в банк по поводу ипотеки"
  },
  {
    "id": "boliglan-3",
    "title": "Наша первая квартира",
    "level": "A2",
    "category": "economy",
    "topic": "mortgage",
    "length": "long",
    "description": "Полная история покупки квартиры — от мечты до ключей"
  },
  {
    "id": "boliglan-4",
    "title": "Как выбрать ипотечный кредит",
    "level": "B1",
    "category": "economy",
    "topic": "mortgage",
    "length": "short",
    "description": "Сравнение условий и типов ипотечных кредитов"
  },
  {
    "id": "boliglan-5",
    "title": "Процесс покупки жилья",
    "level": "B1",
    "category": "economy",
    "topic": "mortgage",
    "length": "medium",
    "description": "Подробные шаги покупки недвижимости в Норвегии"
  },
  {
    "id": "boliglan-6",
    "title": "Рынок жилья и риски ипотеки",
    "level": "B1",
    "category": "economy",
    "topic": "mortgage",
    "length": "long",
    "description": "Экономические факторы, влияющие на ипотеку и стоимость жилья"
  },
  {
    "id": "boliglan-7",
    "title": "Аннуитетный и серийный кредит",
    "level": "B2",
    "category": "economy",
    "topic": "mortgage",
    "length": "short",
    "description": "Сравнение двух способов погашения ипотеки"
  },
  {
    "id": "boliglan-8",
    "title": "Рефинансирование ипотеки",
    "level": "B2",
    "category": "economy",
    "topic": "mortgage",
    "length": "medium",
    "description": "Когда и как стоит менять банк для снижения платежей"
  },
  {
    "id": "boliglan-9",
    "title": "Монетарная политика и рынок жилья",
    "level": "B2",
    "category": "economy",
    "topic": "mortgage",
    "length": "long",
    "description": "Анализ влияния политики Центробанка на ипотечный рынок"
  },
  {
    "id": "allemannsretten-1",
    "title": "Право каждого гулять на природе",
    "level": "A2",
    "category": "society",
    "topic": "allemannsretten",
    "length": "short",
    "description": "Что такое Allemannsretten и почему это важно"
  },
  {
    "id": "allemannsretten-2",
    "title": "Поход с семьёй",
    "level": "A2",
    "category": "society",
    "topic": "allemannsretten",
    "length": "medium",
    "description": "Наш семейный поход в лес"
  },
  {
    "id": "allemannsretten-4",
    "title": "Innmark и utmark: где можно ходить",
    "level": "B1",
    "category": "society",
    "topic": "allemannsretten",
    "length": "short",
    "description": "Разница между культивированной и природной землёй"
  },
  {
    "id": "allemannsretten-5",
    "title": "Кемпинг в палатке: правила",
    "level": "B1",
    "category": "society",
    "topic": "allemannsretten",
    "length": "medium",
    "description": "Правила установки палатки и ночёвки в норвежской природе"
  },
  {
    "id": "allemannsretten-6",
    "title": "Allemannsretten: свобода и ответственность",
    "level": "B1",
    "category": "society",
    "topic": "allemannsretten",
    "length": "long",
    "description": "Как работает закон о свободе природы в современной Норвегии"
  },
  {
    "id": "allemannsretten-7",
    "title": "Юридические тонкости friluftsloven",
    "level": "B2",
    "category": "society",
    "topic": "allemannsretten",
    "length": "short",
    "description": "Тонкие различия между правами передвижения, пребывания и пользования"
  },
  {
    "id": "allemannsretten-8",
    "title": "Современные вызовы allemannsretten",
    "level": "B2",
    "category": "society",
    "topic": "allemannsretten",
    "length": "medium",
    "description": "Конфликты между туризмом, землевладельцами и природой"
  },
  {
    "id": "allemannsretten-9",
    "title": "Allemannsretten в мировом контексте",
    "level": "B2",
    "category": "society",
    "topic": "allemannsretten",
    "length": "long",
    "description": "Сравнительный анализ норвежского права с другими странами"
  },
  {
    "id": "allemannsretten-3",
    "title": "Выходные в палатке",
    "level": "A2",
    "category": "society",
    "topic": "allemannsretten",
    "length": "long",
    "description": "Целые выходные на природе по правилу Allemannsretten"
  },
  {
    "id": "banks-1",
    "title": "Первый визит в банк",
    "level": "A2",
    "category": "economy",
    "topic": "banks",
    "length": "short",
    "description": "Как открыть банковский счёт в Норвегии"
  },
  {
    "id": "banks-2",
    "title": "Карта и мобильное приложение",
    "level": "A2",
    "category": "economy",
    "topic": "banks",
    "length": "medium",
    "description": "Как пользоваться банковской картой и приложениями"
  },
  {
    "id": "banks-3",
    "title": "Зарплата и счета",
    "level": "A2",
    "category": "economy",
    "topic": "banks",
    "length": "long",
    "description": "Как получать зарплату и оплачивать счета"
  },
  {
    "id": "banks-4",
    "title": "Банковские продукты для студентов",
    "level": "B1",
    "category": "economy",
    "topic": "banks",
    "length": "short",
    "description": "Специальные предложения для студентов в норвежских банках"
  },
  {
    "id": "banks-5",
    "title": "Потребительские кредиты и ставки",
    "level": "B1",
    "category": "economy",
    "topic": "banks",
    "length": "medium",
    "description": "Как устроены потребительские кредиты в норвежских банках"
  },
  {
    "id": "banks-6",
    "title": "Интернет-банк и цифровые услуги",
    "level": "B1",
    "category": "economy",
    "topic": "banks",
    "length": "long",
    "description": "Как норвежские банки стали полностью цифровыми"
  },
  {
    "id": "banks-7",
    "title": "Регулирование банковского сектора",
    "level": "B2",
    "category": "economy",
    "topic": "banks",
    "length": "short",
    "description": "Как регулируется банковская деятельность в Норвегии"
  },
  {
    "id": "banks-8",
    "title": "Цифровая трансформация и финтех",
    "level": "B2",
    "category": "economy",
    "topic": "banks",
    "length": "medium",
    "description": "Как финансовые технологии меняют норвежский банковский сектор"
  },
  {
    "id": "banks-9",
    "title": "Банковский сектор и экономика страны",
    "level": "B2",
    "category": "economy",
    "topic": "banks",
    "length": "long",
    "description": "Роль банков в норвежской экономике и уроки кризисов"
  },
  {
    "id": "bureaucracy-1",
    "title": "Первые документы в Норвегии",
    "level": "A2",
    "category": "society",
    "topic": "bureaucracy",
    "length": "short",
    "description": "Как получить персональный номер и начать жизнь в Норвегии"
  },
  {
    "id": "bureaucracy-2",
    "title": "Налоговая карта",
    "level": "A2",
    "category": "society",
    "topic": "bureaucracy",
    "length": "medium",
    "description": "Что такое skattekort и как её получить"
  },
  {
    "id": "bureaucracy-3",
    "title": "Первый год в Норвегии",
    "level": "A2",
    "category": "society",
    "topic": "bureaucracy",
    "length": "long",
    "description": "Все важные учреждения, с которыми познакомился иммигрант"
  },
  {
    "id": "bureaucracy-4",
    "title": "Как устроен NAV",
    "level": "B1",
    "category": "society",
    "topic": "bureaucracy",
    "length": "short",
    "description": "Что такое NAV и какие услуги он предоставляет"
  },
  {
    "id": "bureaucracy-5",
    "title": "Altinn и налоговая декларация",
    "level": "B1",
    "category": "society",
    "topic": "bureaucracy",
    "length": "medium",
    "description": "Как подать ежегодную налоговую декларацию онлайн"
  },
  {
    "id": "bureaucracy-6",
    "title": "Цифровая бюрократия в Норвегии",
    "level": "B1",
    "category": "society",
    "topic": "bureaucracy",
    "length": "long",
    "description": "Как устроена цифровая система государственных услуг"
  },
  {
    "id": "bureaucracy-7",
    "title": "Принципы цифрового государства",
    "level": "B2",
    "category": "society",
    "topic": "bureaucracy",
    "length": "short",
    "description": "Фундаментальные принципы организации норвежской госслужбы"
  },
  {
    "id": "bureaucracy-8",
    "title": "NAV: государство благосостояния на практике",
    "level": "B2",
    "category": "society",
    "topic": "bureaucracy",
    "length": "medium",
    "description": "Как работает и критикуется норвежская система социальной защиты"
  },
  {
    "id": "bureaucracy-9",
    "title": "Норвежская бюрократия: сильные стороны и критика",
    "level": "B2",
    "category": "society",
    "topic": "bureaucracy",
    "length": "long",
    "description": "Анализ эффективности и проблем государственной системы"
  },
  {
    "id": "digital-1",
    "title": "Мой первый BankID",
    "level": "A2",
    "category": "society",
    "topic": "digital_services",
    "length": "short",
    "description": "Как я получила электронную идентификацию в Норвегии"
  },
  {
    "id": "digital-2",
    "title": "Оплата через Vipps",
    "level": "A2",
    "category": "society",
    "topic": "digital_services",
    "length": "medium",
    "description": "Как норвежцы платят друг другу через мобильное приложение"
  },
  {
    "id": "digital-3",
    "title": "Приложения, которыми я пользуюсь",
    "level": "A2",
    "category": "society",
    "topic": "digital_services",
    "length": "long",
    "description": "Полезные норвежские приложения на каждый день"
  },
  {
    "id": "digital-4",
    "title": "Электронная идентификация",
    "level": "B1",
    "category": "society",
    "topic": "digital_services",
    "length": "short",
    "description": "Разные способы идентификации себя в цифровом пространстве Норвегии"
  },
  {
    "id": "digital-5",
    "title": "Государственные услуги онлайн",
    "level": "B1",
    "category": "society",
    "topic": "digital_services",
    "length": "medium",
    "description": "Как Altinn, Skatteetaten и Helsenorge упрощают жизнь"
  },
  {
    "id": "digital-6",
    "title": "Как защититься от мошенников",
    "level": "B1",
    "category": "society",
    "topic": "digital_services",
    "length": "long",
    "description": "Онлайн-безопасность и распространённые виды мошенничества"
  },
  {
    "id": "digital-7",
    "title": "ID-porten: архитектура цифровой идентичности",
    "level": "B2",
    "category": "society",
    "topic": "digital_services",
    "length": "short",
    "description": "Как устроена единая система входа в государственные сервисы"
  },
  {
    "id": "digital-8",
    "title": "Защита персональных данных в Норвегии",
    "level": "B2",
    "category": "society",
    "topic": "digital_services",
    "length": "medium",
    "description": "GDPR, Datatilsynet и право на приватность в цифровую эпоху"
  },
  {
    "id": "digital-9",
    "title": "Цифровая трансформация государственного сектора",
    "level": "B2",
    "category": "society",
    "topic": "digital_services",
    "length": "long",
    "description": "Как Норвегия строит цифровое государство и какие вызовы её ждут"
  },
  {
    "id": "discoveries-1",
    "title": "Фритьоф Нансен — полярный исследователь",
    "level": "A2",
    "category": "science",
    "topic": "discoveries",
    "length": "short",
    "description": "История знаменитого норвежского учёного и путешественника"
  },
  {
    "id": "discoveries-2",
    "title": "Норвежская скрепка",
    "level": "A2",
    "category": "science",
    "topic": "discoveries",
    "length": "medium",
    "description": "Маленькое изобретение с большой историей"
  },
  {
    "id": "discoveries-3",
    "title": "Роальд Амундсен и Южный полюс",
    "level": "A2",
    "category": "science",
    "topic": "discoveries",
    "length": "long",
    "description": "История первого человека, достигшего Южного полюса"
  },
  {
    "id": "discoveries-4",
    "title": "Открытие нефти в Северном море",
    "level": "B1",
    "category": "science",
    "topic": "discoveries",
    "length": "short",
    "description": "Как Норвегия нашла свою главную природную ценность"
  },
  {
    "id": "discoveries-5",
    "title": "Нильс Хенрик Абель — гений математики",
    "level": "B1",
    "category": "science",
    "topic": "discoveries",
    "length": "medium",
    "description": "Короткая, но блестящая жизнь норвежского математика"
  },
  {
    "id": "discoveries-6",
    "title": "Тур Хейердал и экспедиция Кон-Тики",
    "level": "B1",
    "category": "science",
    "topic": "discoveries",
    "length": "long",
    "description": "Невероятное путешествие через Тихий океан на плоту"
  },
  {
    "id": "discoveries-7",
    "title": "Нобелевская премия мира в Осло",
    "level": "B2",
    "category": "science",
    "topic": "discoveries",
    "length": "short",
    "description": "Почему норвежский парламент присуждает эту престижную премию"
  },
  {
    "id": "discoveries-8",
    "title": "Норвежские вклады в климатологию",
    "level": "B2",
    "category": "science",
    "topic": "discoveries",
    "length": "medium",
    "description": "Как норвежские учёные формируют глобальное понимание климата"
  },
  {
    "id": "discoveries-9",
    "title": "Норвежская нобелевская традиция: критика и признание",
    "level": "B2",
    "category": "science",
    "topic": "discoveries",
    "length": "long",
    "description": "Роль Норвегии в мировом научном и политическом диалоге"
  },
  {
    "id": "tech-1",
    "title": "Мой первый смартфон",
    "level": "A2",
    "category": "science",
    "topic": "technology",
    "length": "short",
    "description": "Как мобильные технологии меняют повседневную жизнь"
  },
  {
    "id": "tech-2",
    "title": "Технологии в школе",
    "level": "A2",
    "category": "science",
    "topic": "technology",
    "length": "medium",
    "description": "Как цифровые технологии используются в норвежских школах"
  },
  {
    "id": "tech-3",
    "title": "День в цифровом мире",
    "level": "A2",
    "category": "science",
    "topic": "technology",
    "length": "long",
    "description": "Как технологии окружают норвежца целый день"
  },
  {
    "id": "tech-4",
    "title": "Норвежские технологические компании",
    "level": "B1",
    "category": "science",
    "topic": "technology",
    "length": "short",
    "description": "Знаменитые норвежские фирмы с мировой известностью"
  },
  {
    "id": "tech-5",
    "title": "Зелёная энергия в Норвегии",
    "level": "B1",
    "category": "science",
    "topic": "technology",
    "length": "medium",
    "description": "Как Норвегия производит чистую энергию"
  },
  {
    "id": "tech-6",
    "title": "Цифровая инфраструктура и 5G",
    "level": "B1",
    "category": "science",
    "topic": "technology",
    "length": "long",
    "description": "Как Норвегия строит сети нового поколения"
  },
  {
    "id": "tech-7",
    "title": "ИИ в норвежской медицине",
    "level": "B2",
    "category": "science",
    "topic": "technology",
    "length": "short",
    "description": "Как искусственный интеллект меняет диагностику и лечение"
  },
  {
    "id": "tech-8",
    "title": "Водородная экономика",
    "level": "B2",
    "category": "science",
    "topic": "technology",
    "length": "medium",
    "description": "Как Норвегия готовится к будущему без углеводородов"
  },
  {
    "id": "tech-9",
    "title": "Норвегия как технологическая держава",
    "level": "B2",
    "category": "science",
    "topic": "technology",
    "length": "long",
    "description": "Анализ технологического сектора страны и его будущего"
  },
  {
    "id": "jobsearch-1",
    "title": "Я ищу работу",
    "level": "A2",
    "category": "work",
    "topic": "job_search",
    "length": "short",
    "description": "Первые шаги в поиске работы в Норвегии"
  },
  {
    "id": "jobsearch-2",
    "title": "Составление резюме",
    "level": "B1",
    "category": "work",
    "topic": "job_search",
    "length": "medium",
    "description": "Как правильно написать норвежское резюме"
  },
  {
    "id": "jobsearch-3",
    "title": "Рынок труда в Норвегии",
    "level": "B2",
    "category": "work",
    "topic": "job_search",
    "length": "long",
    "description": "Структура и особенности норвежского рынка труда"
  },
  {
    "id": "interview-1",
    "title": "Первое собеседование",
    "level": "A2",
    "category": "work",
    "topic": "interview",
    "length": "short",
    "description": "Личный опыт первого собеседования"
  },
  {
    "id": "interview-2",
    "title": "Подготовка к собеседованию",
    "level": "B1",
    "category": "work",
    "topic": "interview",
    "length": "medium",
    "description": "Как подготовиться к собеседованию в норвежской компании"
  },
  {
    "id": "interview-3",
    "title": "Психология норвежского собеседования",
    "level": "B2",
    "category": "work",
    "topic": "interview",
    "length": "long",
    "description": "Культурные нюансы и неочевидные ожидания работодателей"
  },
  {
    "id": "rights-1",
    "title": "Мой отпуск",
    "level": "A2",
    "category": "work",
    "topic": "rights",
    "length": "short",
    "description": "Отпуск и отгулы по норвежскому закону"
  },
  {
    "id": "rights-2",
    "title": "Трудовой договор",
    "level": "B1",
    "category": "work",
    "topic": "rights",
    "length": "medium",
    "description": "Что должно быть в норвежском трудовом договоре"
  },
  {
    "id": "budget-1",
    "title": "Мой бюджет",
    "level": "A2",
    "category": "economy",
    "topic": "budget",
    "length": "short",
    "description": "Как я распределяю зарплату каждый месяц"
  },
  {
    "id": "budget-2",
    "title": "Экономия в Норвегии",
    "level": "B1",
    "category": "economy",
    "topic": "budget",
    "length": "medium",
    "description": "Практичные способы сэкономить в дорогой стране"
  },
  {
    "id": "budget-3",
    "title": "Финансовая грамотность и долгосрочное планирование",
    "level": "B2",
    "category": "economy",
    "topic": "budget",
    "length": "long",
    "description": "Как норвежцы планируют свои финансы на десятилетия"
  },
  {
    "id": "insurance-1",
    "title": "Моя страховка",
    "level": "A2",
    "category": "economy",
    "topic": "insurance",
    "length": "short",
    "description": "Базовые виды страхования для жизни в Норвегии"
  },
  {
    "id": "insurance-2",
    "title": "Виды страхования",
    "level": "B1",
    "category": "economy",
    "topic": "insurance",
    "length": "medium",
    "description": "Обзор основных страховых продуктов"
  },
  {
    "id": "insurance-3",
    "title": "Страховой рынок Норвегии",
    "level": "B2",
    "category": "economy",
    "topic": "insurance",
    "length": "long",
    "description": "Структура и регулирование страховой отрасли"
  },
  {
    "id": "oilfund-1",
    "title": "Что такое Нефтяной фонд",
    "level": "A2",
    "category": "economy",
    "topic": "oil_fund",
    "length": "short",
    "description": "Базовое объяснение для всех"
  },
  {
    "id": "oilfund-2",
    "title": "История Нефтяного фонда",
    "level": "B1",
    "category": "economy",
    "topic": "oil_fund",
    "length": "medium",
    "description": "Как Норвегия построила самый большой фонд мира"
  },
  {
    "id": "oilfund-3",
    "title": "Экономика Норвегии и нефтяная зависимость",
    "level": "B2",
    "category": "economy",
    "topic": "oil_fund",
    "length": "long",
    "description": "Как нефтяные доходы влияют на экономику и политику страны"
  },
  {
    "id": "rights-3",
    "title": "Профсоюзы и коллективные договоры",
    "level": "B2",
    "category": "work",
    "topic": "rights",
    "length": "long",
    "description": "Роль профсоюзов в формировании условий труда"
  },
  {
    "id": "janteloven-1",
    "title": "Что такое Janteloven",
    "level": "A2",
    "category": "society",
    "topic": "janteloven",
    "length": "short",
    "description": "Знакомство с неписаным законом скромности"
  },
  {
    "id": "janteloven-2",
    "title": "Десять правил Янте",
    "level": "B1",
    "category": "society",
    "topic": "janteloven",
    "length": "medium",
    "description": "Содержание и смысл закона"
  },
  {
    "id": "janteloven-3",
    "title": "Janteloven в современной Норвегии",
    "level": "B2",
    "category": "society",
    "topic": "janteloven",
    "length": "long",
    "description": "Как неписаный закон влияет на общество сегодня"
  },
  {
    "id": "judicial-1",
    "title": "Суды в Норвегии",
    "level": "A2",
    "category": "society",
    "topic": "judicial",
    "length": "short",
    "description": "Простое введение в судебную систему"
  },
  {
    "id": "judicial-2",
    "title": "Уголовный процесс",
    "level": "B1",
    "category": "society",
    "topic": "judicial",
    "length": "medium",
    "description": "Как расследуются преступления в Норвегии"
  },
  {
    "id": "judicial-3",
    "title": "Философия норвежского правосудия",
    "level": "B2",
    "category": "society",
    "topic": "judicial",
    "length": "long",
    "description": "Почему норвежская система уникальна и часто критикуется"
  }
]

export default catalog
