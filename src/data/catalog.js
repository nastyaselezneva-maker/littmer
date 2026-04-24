const catalog = [
  {
    "id": "trafikkregler-1",
    "title": "Основные правила дорожного движения",
    "titleNo": "Grunnleggende trafikkregler",
    "level": "A2",
    "category": "driving",
    "topic": "traffic_signs",
    "length": "short",
    "description": "Базовые правила на дороге в Норвегии"
  },
  {
    "id": "trafikkregler-2",
    "title": "Знаки и перекрёстки",
    "titleNo": "Skilt og veikryss",
    "level": "B1",
    "category": "driving",
    "topic": "traffic_signs",
    "length": "medium",
    "description": "Дорожные знаки и правила проезда перекрёстков"
  },
  {
    "id": "trafikkregler-3",
    "title": "Вождение зимой в Норвегии",
    "titleNo": "Å kjøre om vinteren i Norge",
    "level": "B2",
    "category": "driving",
    "topic": "traffic_signs",
    "length": "long",
    "description": "Особенности вождения в зимних условиях"
  },
  {
    "id": "bil-1",
    "title": "Части автомобиля",
    "titleNo": "Bildeler",
    "level": "A2",
    "category": "driving",
    "topic": "car",
    "length": "short",
    "description": "Основные части автомобиля и их названия"
  },
  {
    "id": "bil-2",
    "title": "Обслуживание автомобиля",
    "titleNo": "Service og vedlikehold av bil",
    "level": "B1",
    "category": "driving",
    "topic": "car",
    "length": "medium",
    "description": "Техобслуживание и уход за машиной"
  },
  {
    "id": "bil-3",
    "title": "Электромобили в Норвегии",
    "titleNo": "Elbiler i Norge",
    "level": "B2",
    "category": "driving",
    "topic": "car",
    "length": "long",
    "description": "Почему Норвегия — мировой лидер по электромобилям"
  },
  {
    "id": "mc-1",
    "title": "Части мотоцикла",
    "titleNo": "Deler på en motorsykkel",
    "level": "A2",
    "category": "driving",
    "topic": "motorcycle",
    "length": "short",
    "description": "Основные части мотоцикла и их функции"
  },
  {
    "id": "mc-2",
    "title": "Вождение мотоцикла в Норвегии",
    "titleNo": "Å kjøre motorsykkel i Norge",
    "level": "B2",
    "category": "driving",
    "topic": "motorcycle",
    "length": "medium",
    "description": "Правила и особенности вождения мотоцикла"
  },
  {
    "id": "mc-3",
    "title": "Мотоциклетный сезон",
    "titleNo": "Motorsykkelsesongen",
    "level": "B1",
    "category": "driving",
    "topic": "motorcycle",
    "length": "long",
    "description": "Подготовка мотоцикла к сезону и лучшие маршруты"
  },
  {
    "id": "utdanning-1",
    "title": "Школьная система",
    "titleNo": "Skolesystemet",
    "level": "A2",
    "category": "education",
    "topic": "school",
    "length": "short",
    "description": "Как устроена школа в Норвегии"
  },
  {
    "id": "utdanning-2",
    "title": "Высшее образование",
    "titleNo": "Høyere utdanning",
    "level": "B2",
    "category": "education",
    "topic": "university",
    "length": "medium",
    "description": "Университеты и студенческая жизнь в Норвегии"
  },
  {
    "id": "utdanning-3",
    "title": "Норвежский для иностранцев",
    "titleNo": "Norsk for utlendinger",
    "level": "B1",
    "category": "education",
    "topic": "norwegian_course",
    "length": "long",
    "description": "Как иностранцы изучают норвежский язык"
  },
  {
    "id": "boliglan-1",
    "title": "Мы хотим купить квартиру",
    "titleNo": "Vi vil kjøpe leilighet",
    "level": "A2",
    "category": "economy",
    "topic": "mortgage",
    "length": "short",
    "description": "Семья решает купить своё первое жильё"
  },
  {
    "id": "boliglan-2",
    "title": "Встреча в банке",
    "titleNo": "Møte i banken",
    "level": "A2",
    "category": "economy",
    "topic": "mortgage",
    "length": "medium",
    "description": "Первый визит в банк по поводу ипотеки"
  },
  {
    "id": "boliglan-3",
    "title": "Наша первая квартира",
    "titleNo": "Vår første leilighet",
    "level": "A2",
    "category": "economy",
    "topic": "mortgage",
    "length": "long",
    "description": "Полная история покупки квартиры — от мечты до ключей"
  },
  {
    "id": "boliglan-4",
    "title": "Как выбрать ипотечный кредит",
    "titleNo": "Å velge boliglån",
    "level": "B1",
    "category": "economy",
    "topic": "mortgage",
    "length": "short",
    "description": "Сравнение условий и типов ипотечных кредитов"
  },
  {
    "id": "boliglan-5",
    "title": "Процесс покупки жилья",
    "titleNo": "Boligkjøpsprosessen",
    "level": "B1",
    "category": "economy",
    "topic": "mortgage",
    "length": "medium",
    "description": "Подробные шаги покупки недвижимости в Норвегии"
  },
  {
    "id": "boliglan-6",
    "title": "Рынок жилья и риски ипотеки",
    "titleNo": "Boligmarkedet og risiko ved boliglån",
    "level": "B1",
    "category": "economy",
    "topic": "mortgage",
    "length": "long",
    "description": "Экономические факторы, влияющие на ипотеку и стоимость жилья"
  },
  {
    "id": "boliglan-7",
    "title": "Аннуитетный и серийный кредит",
    "titleNo": "Annuitetslån og serielån",
    "level": "B2",
    "category": "economy",
    "topic": "mortgage",
    "length": "short",
    "description": "Сравнение двух способов погашения ипотеки"
  },
  {
    "id": "boliglan-8",
    "title": "Рефинансирование ипотеки",
    "titleNo": "Refinansiering av boliglån",
    "level": "B2",
    "category": "economy",
    "topic": "mortgage",
    "length": "medium",
    "description": "Когда и как стоит менять банк для снижения платежей"
  },
  {
    "id": "boliglan-9",
    "title": "Монетарная политика и рынок жилья",
    "titleNo": "Pengepolitikk og boligmarkedet",
    "level": "B2",
    "category": "economy",
    "topic": "mortgage",
    "length": "long",
    "description": "Анализ влияния политики Центробанка на ипотечный рынок"
  },
  {
    "id": "allemannsretten-1",
    "title": "Право каждого гулять на природе",
    "titleNo": "Retten til å ferdes i naturen",
    "level": "A2",
    "category": "society",
    "topic": "allemannsretten",
    "length": "short",
    "description": "Что такое Allemannsretten и почему это важно"
  },
  {
    "id": "allemannsretten-2",
    "title": "Поход с семьёй",
    "titleNo": "På tur med familien",
    "level": "A2",
    "category": "society",
    "topic": "allemannsretten",
    "length": "medium",
    "description": "Наш семейный поход в лес"
  },
  {
    "id": "allemannsretten-4",
    "title": "Innmark и utmark: где можно ходить",
    "titleNo": "Innmark og utmark: hvor kan man gå",
    "level": "B1",
    "category": "society",
    "topic": "allemannsretten",
    "length": "short",
    "description": "Разница между культивированной и природной землёй"
  },
  {
    "id": "allemannsretten-5",
    "title": "Кемпинг в палатке: правила",
    "titleNo": "Teltregler i naturen",
    "level": "B1",
    "category": "society",
    "topic": "allemannsretten",
    "length": "medium",
    "description": "Правила установки палатки и ночёвки в норвежской природе"
  },
  {
    "id": "allemannsretten-6",
    "title": "Allemannsretten: свобода и ответственность",
    "titleNo": "Allemannsretten: frihet og ansvar",
    "level": "B1",
    "category": "society",
    "topic": "allemannsretten",
    "length": "long",
    "description": "Как работает закон о свободе природы в современной Норвегии"
  },
  {
    "id": "allemannsretten-7",
    "title": "Юридические тонкости friluftsloven",
    "titleNo": "Juridiske nyanser i friluftsloven",
    "level": "B2",
    "category": "society",
    "topic": "allemannsretten",
    "length": "short",
    "description": "Тонкие различия между правами передвижения, пребывания и пользования"
  },
  {
    "id": "allemannsretten-8",
    "title": "Современные вызовы allemannsretten",
    "titleNo": "Allemannsretten under press",
    "level": "B2",
    "category": "society",
    "topic": "allemannsretten",
    "length": "medium",
    "description": "Конфликты между туризмом, землевладельцами и природой"
  },
  {
    "id": "allemannsretten-9",
    "title": "Allemannsretten в мировом контексте",
    "titleNo": "Allemannsretten i internasjonal sammenheng",
    "level": "B2",
    "category": "society",
    "topic": "allemannsretten",
    "length": "long",
    "description": "Сравнительный анализ норвежского права с другими странами"
  },
  {
    "id": "allemannsretten-3",
    "title": "Выходные в палатке",
    "titleNo": "Helg i telt",
    "level": "A2",
    "category": "society",
    "topic": "allemannsretten",
    "length": "long",
    "description": "Целые выходные на природе по правилу Allemannsretten"
  },
  {
    "id": "banks-1",
    "title": "Первый визит в банк",
    "titleNo": "Første besøk i banken",
    "level": "A2",
    "category": "economy",
    "topic": "banks",
    "length": "short",
    "description": "Как открыть банковский счёт в Норвегии"
  },
  {
    "id": "banks-2",
    "title": "Карта и мобильное приложение",
    "titleNo": "Kort og mobilapp",
    "level": "A2",
    "category": "economy",
    "topic": "banks",
    "length": "medium",
    "description": "Как пользоваться банковской картой и приложениями"
  },
  {
    "id": "banks-3",
    "title": "Зарплата и счета",
    "titleNo": "Lønn og regninger",
    "level": "A2",
    "category": "economy",
    "topic": "banks",
    "length": "long",
    "description": "Как получать зарплату и оплачивать счета"
  },
  {
    "id": "banks-4",
    "title": "Банковские продукты для студентов",
    "titleNo": "Bankprodukter for studenter",
    "level": "B1",
    "category": "economy",
    "topic": "banks",
    "length": "short",
    "description": "Специальные предложения для студентов в норвежских банках"
  },
  {
    "id": "banks-5",
    "title": "Потребительские кредиты и ставки",
    "titleNo": "Forbrukslån og renter",
    "level": "B1",
    "category": "economy",
    "topic": "banks",
    "length": "medium",
    "description": "Как устроены потребительские кредиты в норвежских банках"
  },
  {
    "id": "banks-6",
    "title": "Интернет-банк и цифровые услуги",
    "titleNo": "Nettbank og digitale tjenester",
    "level": "B1",
    "category": "economy",
    "topic": "banks",
    "length": "long",
    "description": "Как норвежские банки стали полностью цифровыми"
  },
  {
    "id": "banks-7",
    "title": "Регулирование банковского сектора",
    "titleNo": "Regulering av banksektoren",
    "level": "B2",
    "category": "economy",
    "topic": "banks",
    "length": "short",
    "description": "Как регулируется банковская деятельность в Норвегии"
  },
  {
    "id": "banks-8",
    "title": "Цифровая трансформация и финтех",
    "titleNo": "Digital transformasjon og fintech",
    "level": "B2",
    "category": "economy",
    "topic": "banks",
    "length": "medium",
    "description": "Как финансовые технологии меняют норвежский банковский сектор"
  },
  {
    "id": "banks-9",
    "title": "Банковский сектор и экономика страны",
    "titleNo": "Banksektoren og norsk økonomi",
    "level": "B2",
    "category": "economy",
    "topic": "banks",
    "length": "long",
    "description": "Роль банков в норвежской экономике и уроки кризисов"
  },
  {
    "id": "bureaucracy-1",
    "title": "Первые документы в Норвегии",
    "titleNo": "De første papirene i Norge",
    "level": "A2",
    "category": "society",
    "topic": "bureaucracy",
    "length": "short",
    "description": "Как получить персональный номер и начать жизнь в Норвегии"
  },
  {
    "id": "bureaucracy-2",
    "title": "Налоговая карта",
    "titleNo": "Skattekort",
    "level": "A2",
    "category": "society",
    "topic": "bureaucracy",
    "length": "medium",
    "description": "Что такое skattekort и как её получить"
  },
  {
    "id": "bureaucracy-3",
    "title": "Первый год в Норвегии",
    "titleNo": "Det første året i Norge",
    "level": "A2",
    "category": "society",
    "topic": "bureaucracy",
    "length": "long",
    "description": "Все важные учреждения, с которыми познакомился иммигрант"
  },
  {
    "id": "bureaucracy-4",
    "title": "Как устроен NAV",
    "titleNo": "Hvordan NAV fungerer",
    "level": "B1",
    "category": "society",
    "topic": "bureaucracy",
    "length": "short",
    "description": "Что такое NAV и какие услуги он предоставляет"
  },
  {
    "id": "bureaucracy-5",
    "title": "Altinn и налоговая декларация",
    "titleNo": "Altinn og skattemeldingen",
    "level": "B1",
    "category": "society",
    "topic": "bureaucracy",
    "length": "medium",
    "description": "Как подать ежегодную налоговую декларацию онлайн"
  },
  {
    "id": "bureaucracy-6",
    "title": "Цифровая бюрократия в Норвегии",
    "titleNo": "Digitalt byråkrati i Norge",
    "level": "B1",
    "category": "society",
    "topic": "bureaucracy",
    "length": "long",
    "description": "Как устроена цифровая система государственных услуг"
  },
  {
    "id": "bureaucracy-7",
    "title": "Принципы цифрового государства",
    "titleNo": "Prinsipper for digital forvaltning",
    "level": "B2",
    "category": "society",
    "topic": "bureaucracy",
    "length": "short",
    "description": "Фундаментальные принципы организации норвежской госслужбы"
  },
  {
    "id": "bureaucracy-8",
    "title": "NAV: государство благосостояния на практике",
    "titleNo": "NAV: velferdsstaten i praksis",
    "level": "B2",
    "category": "society",
    "topic": "bureaucracy",
    "length": "medium",
    "description": "Как работает и критикуется норвежская система социальной защиты"
  },
  {
    "id": "bureaucracy-9",
    "title": "Норвежская бюрократия: сильные стороны и критика",
    "titleNo": "Norsk byråkrati: styrker og kritikk",
    "level": "B2",
    "category": "society",
    "topic": "bureaucracy",
    "length": "long",
    "description": "Анализ эффективности и проблем государственной системы"
  },
  {
    "id": "digital-1",
    "title": "Мой первый BankID",
    "titleNo": "Min første BankID",
    "level": "A2",
    "category": "society",
    "topic": "digital_services",
    "length": "short",
    "description": "Как я получила электронную идентификацию в Норвегии"
  },
  {
    "id": "digital-2",
    "title": "Оплата через Vipps",
    "titleNo": "Å betale med Vipps",
    "level": "A2",
    "category": "society",
    "topic": "digital_services",
    "length": "medium",
    "description": "Как норвежцы платят друг другу через мобильное приложение"
  },
  {
    "id": "digital-3",
    "title": "Приложения, которыми я пользуюсь",
    "titleNo": "Apper jeg bruker hver dag",
    "level": "A2",
    "category": "society",
    "topic": "digital_services",
    "length": "long",
    "description": "Полезные норвежские приложения на каждый день"
  },
  {
    "id": "digital-4",
    "title": "Электронная идентификация",
    "titleNo": "Elektronisk ID",
    "level": "B1",
    "category": "society",
    "topic": "digital_services",
    "length": "short",
    "description": "Разные способы идентификации себя в цифровом пространстве Норвегии"
  },
  {
    "id": "digital-5",
    "title": "Государственные услуги онлайн",
    "titleNo": "Offentlige tjenester på nett",
    "level": "B1",
    "category": "society",
    "topic": "digital_services",
    "length": "medium",
    "description": "Как Altinn, Skatteetaten и Helsenorge упрощают жизнь"
  },
  {
    "id": "digital-6",
    "title": "Как защититься от мошенников",
    "titleNo": "Å beskytte seg mot svindel",
    "level": "B1",
    "category": "society",
    "topic": "digital_services",
    "length": "long",
    "description": "Онлайн-безопасность и распространённые виды мошенничества"
  },
  {
    "id": "digital-7",
    "title": "ID-porten: архитектура цифровой идентичности",
    "titleNo": "ID-porten: arkitekturen bak digital identitet",
    "level": "B2",
    "category": "society",
    "topic": "digital_services",
    "length": "short",
    "description": "Как устроена единая система входа в государственные сервисы"
  },
  {
    "id": "digital-8",
    "title": "Защита персональных данных в Норвегии",
    "titleNo": "Personvern i Norge",
    "level": "B2",
    "category": "society",
    "topic": "digital_services",
    "length": "medium",
    "description": "GDPR, Datatilsynet и право на приватность в цифровую эпоху"
  },
  {
    "id": "digital-9",
    "title": "Цифровая трансформация государственного сектора",
    "titleNo": "Digitalisering av offentlig sektor",
    "level": "B2",
    "category": "society",
    "topic": "digital_services",
    "length": "long",
    "description": "Как Норвегия строит цифровое государство и какие вызовы её ждут"
  },
  {
    "id": "discoveries-1",
    "title": "Фритьоф Нансен — полярный исследователь",
    "titleNo": "Fridtjof Nansen — polarforsker",
    "level": "A2",
    "category": "science",
    "topic": "discoveries",
    "length": "short",
    "description": "История знаменитого норвежского учёного и путешественника"
  },
  {
    "id": "discoveries-2",
    "title": "Норвежская скрепка",
    "titleNo": "Den norske binders",
    "level": "A2",
    "category": "science",
    "topic": "discoveries",
    "length": "medium",
    "description": "Маленькое изобретение с большой историей"
  },
  {
    "id": "discoveries-3",
    "title": "Роальд Амундсен и Южный полюс",
    "titleNo": "Roald Amundsen og Sydpolen",
    "level": "A2",
    "category": "science",
    "topic": "discoveries",
    "length": "long",
    "description": "История первого человека, достигшего Южного полюса"
  },
  {
    "id": "discoveries-4",
    "title": "Открытие нефти в Северном море",
    "titleNo": "Oljefunnet i Nordsjøen",
    "level": "B1",
    "category": "science",
    "topic": "discoveries",
    "length": "short",
    "description": "Как Норвегия нашла свою главную природную ценность"
  },
  {
    "id": "discoveries-5",
    "title": "Нильс Хенрик Абель — гений математики",
    "titleNo": "Niels Henrik Abel — et matematisk geni",
    "level": "B1",
    "category": "science",
    "topic": "discoveries",
    "length": "medium",
    "description": "Короткая, но блестящая жизнь норвежского математика"
  },
  {
    "id": "discoveries-6",
    "title": "Тур Хейердал и экспедиция Кон-Тики",
    "titleNo": "Thor Heyerdahl og Kon-Tiki-ekspedisjonen",
    "level": "B1",
    "category": "science",
    "topic": "discoveries",
    "length": "long",
    "description": "Невероятное путешествие через Тихий океан на плоту"
  },
  {
    "id": "discoveries-7",
    "title": "Нобелевская премия мира в Осло",
    "titleNo": "Nobels fredspris i Oslo",
    "level": "B2",
    "category": "science",
    "topic": "discoveries",
    "length": "short",
    "description": "Почему норвежский парламент присуждает эту престижную премию"
  },
  {
    "id": "discoveries-8",
    "title": "Норвежские вклады в климатологию",
    "titleNo": "Norske bidrag til klimaforskningen",
    "level": "B2",
    "category": "science",
    "topic": "discoveries",
    "length": "medium",
    "description": "Как норвежские учёные формируют глобальное понимание климата"
  },
  {
    "id": "discoveries-9",
    "title": "Норвежская нобелевская традиция: критика и признание",
    "titleNo": "Den norske Nobel-tradisjonen: kritikk og anerkjennelse",
    "level": "B2",
    "category": "science",
    "topic": "discoveries",
    "length": "long",
    "description": "Роль Норвегии в мировом научном и политическом диалоге"
  },
  {
    "id": "tech-1",
    "title": "Мой первый смартфон",
    "titleNo": "Min første smarttelefon",
    "level": "A2",
    "category": "science",
    "topic": "technology",
    "length": "short",
    "description": "Как мобильные технологии меняют повседневную жизнь"
  },
  {
    "id": "tech-2",
    "title": "Технологии в школе",
    "titleNo": "Teknologi på skolen",
    "level": "A2",
    "category": "science",
    "topic": "technology",
    "length": "medium",
    "description": "Как цифровые технологии используются в норвежских школах"
  },
  {
    "id": "tech-3",
    "title": "День в цифровом мире",
    "titleNo": "En dag i den digitale hverdagen",
    "level": "A2",
    "category": "science",
    "topic": "technology",
    "length": "long",
    "description": "Как технологии окружают норвежца целый день"
  },
  {
    "id": "tech-4",
    "title": "Норвежские технологические компании",
    "titleNo": "Norske teknologiselskaper",
    "level": "B1",
    "category": "science",
    "topic": "technology",
    "length": "short",
    "description": "Знаменитые норвежские фирмы с мировой известностью"
  },
  {
    "id": "tech-5",
    "title": "Зелёная энергия в Норвегии",
    "titleNo": "Grønn energi i Norge",
    "level": "B1",
    "category": "science",
    "topic": "technology",
    "length": "medium",
    "description": "Как Норвегия производит чистую энергию"
  },
  {
    "id": "tech-6",
    "title": "Цифровая инфраструктура и 5G",
    "titleNo": "Digital infrastruktur og 5G",
    "level": "B1",
    "category": "science",
    "topic": "technology",
    "length": "long",
    "description": "Как Норвегия строит сети нового поколения"
  },
  {
    "id": "tech-7",
    "title": "ИИ в норвежской медицине",
    "titleNo": "KI i norsk helsevesen",
    "level": "B2",
    "category": "science",
    "topic": "technology",
    "length": "short",
    "description": "Как искусственный интеллект меняет диагностику и лечение"
  },
  {
    "id": "tech-8",
    "title": "Водородная экономика",
    "titleNo": "Hydrogenøkonomien",
    "level": "B2",
    "category": "science",
    "topic": "technology",
    "length": "medium",
    "description": "Как Норвегия готовится к будущему без углеводородов"
  },
  {
    "id": "tech-9",
    "title": "Норвегия как технологическая держава",
    "titleNo": "Norge som teknologinasjon",
    "level": "B2",
    "category": "science",
    "topic": "technology",
    "length": "long",
    "description": "Анализ технологического сектора страны и его будущего"
  },
  {
    "id": "jobsearch-1",
    "title": "Я ищу работу",
    "titleNo": "Jeg søker jobb",
    "level": "A2",
    "category": "work",
    "topic": "job_search",
    "length": "short",
    "description": "Первые шаги в поиске работы в Норвегии"
  },
  {
    "id": "jobsearch-2",
    "title": "Составление резюме",
    "titleNo": "Å skrive CV",
    "level": "B1",
    "category": "work",
    "topic": "job_search",
    "length": "medium",
    "description": "Как правильно написать норвежское резюме"
  },
  {
    "id": "jobsearch-3",
    "title": "Рынок труда в Норвегии",
    "titleNo": "Arbeidsmarkedet i Norge",
    "level": "B2",
    "category": "work",
    "topic": "job_search",
    "length": "long",
    "description": "Структура и особенности норвежского рынка труда"
  },
  {
    "id": "interview-1",
    "title": "Первое собеседование",
    "titleNo": "Mitt første jobbintervju",
    "level": "A2",
    "category": "work",
    "topic": "interview",
    "length": "short",
    "description": "Личный опыт первого собеседования"
  },
  {
    "id": "interview-2",
    "title": "Подготовка к собеседованию",
    "titleNo": "Å forberede seg til jobbintervju",
    "level": "B1",
    "category": "work",
    "topic": "interview",
    "length": "medium",
    "description": "Как подготовиться к собеседованию в норвежской компании"
  },
  {
    "id": "interview-3",
    "title": "Психология норвежского собеседования",
    "titleNo": "Psykologien bak norske jobbintervjuer",
    "level": "B2",
    "category": "work",
    "topic": "interview",
    "length": "long",
    "description": "Культурные нюансы и неочевидные ожидания работодателей"
  },
  {
    "id": "rights-1",
    "title": "Мой отпуск",
    "titleNo": "Ferien min",
    "level": "A2",
    "category": "work",
    "topic": "rights",
    "length": "short",
    "description": "Отпуск и отгулы по норвежскому закону"
  },
  {
    "id": "rights-2",
    "title": "Трудовой договор",
    "titleNo": "Arbeidskontrakten",
    "level": "B1",
    "category": "work",
    "topic": "rights",
    "length": "medium",
    "description": "Что должно быть в норвежском трудовом договоре"
  },
  {
    "id": "budget-1",
    "title": "Мой бюджет",
    "titleNo": "Budsjettet mitt",
    "level": "A2",
    "category": "economy",
    "topic": "budget",
    "length": "short",
    "description": "Как я распределяю зарплату каждый месяц"
  },
  {
    "id": "budget-2",
    "title": "Экономия в Норвегии",
    "titleNo": "Å spare penger i Norge",
    "level": "B1",
    "category": "economy",
    "topic": "budget",
    "length": "medium",
    "description": "Практичные способы сэкономить в дорогой стране"
  },
  {
    "id": "budget-3",
    "title": "Финансовая грамотность и долгосрочное планирование",
    "titleNo": "Økonomisk kunnskap og langsiktig planlegging",
    "level": "B2",
    "category": "economy",
    "topic": "budget",
    "length": "long",
    "description": "Как норвежцы планируют свои финансы на десятилетия"
  },
  {
    "id": "insurance-1",
    "title": "Моя страховка",
    "titleNo": "Forsikringen min",
    "level": "A2",
    "category": "economy",
    "topic": "insurance",
    "length": "short",
    "description": "Базовые виды страхования для жизни в Норвегии"
  },
  {
    "id": "insurance-2",
    "title": "Виды страхования",
    "titleNo": "Typer forsikring",
    "level": "B1",
    "category": "economy",
    "topic": "insurance",
    "length": "medium",
    "description": "Обзор основных страховых продуктов"
  },
  {
    "id": "insurance-3",
    "title": "Страховой рынок Норвегии",
    "titleNo": "Forsikringsmarkedet i Norge",
    "level": "B2",
    "category": "economy",
    "topic": "insurance",
    "length": "long",
    "description": "Структура и регулирование страховой отрасли"
  },
  {
    "id": "oilfund-1",
    "title": "Что такое Нефтяной фонд",
    "titleNo": "Hva er Oljefondet",
    "level": "A2",
    "category": "economy",
    "topic": "oil_fund",
    "length": "short",
    "description": "Базовое объяснение для всех"
  },
  {
    "id": "oilfund-2",
    "title": "История Нефтяного фонда",
    "titleNo": "Oljefondets historie",
    "level": "B1",
    "category": "economy",
    "topic": "oil_fund",
    "length": "medium",
    "description": "Как Норвегия построила самый большой фонд мира"
  },
  {
    "id": "oilfund-3",
    "title": "Экономика Норвегии и нефтяная зависимость",
    "titleNo": "Norsk økonomi og oljeavhengighet",
    "level": "B2",
    "category": "economy",
    "topic": "oil_fund",
    "length": "long",
    "description": "Как нефтяные доходы влияют на экономику и политику страны"
  },
  {
    "id": "rights-3",
    "title": "Профсоюзы и коллективные договоры",
    "titleNo": "Fagforeninger og tariffavtaler",
    "level": "B2",
    "category": "work",
    "topic": "rights",
    "length": "long",
    "description": "Роль профсоюзов в формировании условий труда"
  },
  {
    "id": "janteloven-1",
    "title": "Что такое Janteloven",
    "titleNo": "Hva er Janteloven",
    "level": "A2",
    "category": "society",
    "topic": "janteloven",
    "length": "short",
    "description": "Знакомство с неписаным законом скромности"
  },
  {
    "id": "janteloven-2",
    "title": "Десять правил Янте",
    "titleNo": "De ti Jantelovene",
    "level": "B1",
    "category": "society",
    "topic": "janteloven",
    "length": "medium",
    "description": "Содержание и смысл закона"
  },
  {
    "id": "janteloven-3",
    "title": "Janteloven в современной Норвегии",
    "titleNo": "Janteloven i dagens Norge",
    "level": "B2",
    "category": "society",
    "topic": "janteloven",
    "length": "long",
    "description": "Как неписаный закон влияет на общество сегодня"
  },
  {
    "id": "judicial-1",
    "title": "Суды в Норвегии",
    "titleNo": "Domstolene i Norge",
    "level": "A2",
    "category": "society",
    "topic": "judicial",
    "length": "short",
    "description": "Простое введение в судебную систему"
  },
  {
    "id": "judicial-2",
    "title": "Уголовный процесс",
    "titleNo": "Straffesak fra A til Å",
    "level": "B1",
    "category": "society",
    "topic": "judicial",
    "length": "medium",
    "description": "Как расследуются преступления в Норвегии"
  },
  {
    "id": "judicial-3",
    "title": "Философия норвежского правосудия",
    "titleNo": "Filosofien bak norsk rettsvesen",
    "level": "B2",
    "category": "society",
    "topic": "judicial",
    "length": "long",
    "description": "Почему норвежская система уникальна и часто критикуется"
  },
  {
    "id": "literature-1",
    "title": "Норвежские писатели",
    "titleNo": "Norske forfattere",
    "level": "A2",
    "category": "culture",
    "topic": "literature",
    "length": "short",
    "description": "Знакомство со знаменитыми норвежскими авторами"
  },
  {
    "id": "literature-2",
    "title": "От саг викингов до современной литературы",
    "titleNo": "Fra vikingsagaer til moderne litteratur",
    "level": "B1",
    "category": "culture",
    "topic": "literature",
    "length": "medium",
    "description": "Тысячелетняя история норвежской литературной традиции"
  },
  {
    "id": "literature-3",
    "title": "Литература, язык и норвежская идентичность",
    "titleNo": "Litteratur, språk og norsk identitet",
    "level": "B2",
    "category": "culture",
    "topic": "literature",
    "length": "long",
    "description": "Языковой вопрос, переводы и место литературы в национальной культуре"
  },
  {
    "id": "art-1",
    "title": "Эдвард Мунк и «Крик»",
    "titleNo": "Edvard Munch og «Skrik»",
    "level": "A2",
    "category": "culture",
    "topic": "art",
    "length": "short",
    "description": "Знакомство со знаменитым норвежским художником"
  },
  {
    "id": "art-2",
    "title": "Национальная романтика в живописи",
    "titleNo": "Nasjonalromantikken i malerkunsten",
    "level": "B1",
    "category": "culture",
    "topic": "art",
    "length": "medium",
    "description": "Норвежский пейзаж XIX века и поиск национальной идентичности"
  },
  {
    "id": "art-3",
    "title": "Современное искусство и государственная поддержка",
    "titleNo": "Samtidskunst og offentlig støtte",
    "level": "B2",
    "category": "culture",
    "topic": "art",
    "length": "long",
    "description": "Музеи, финансирование и место искусства в норвежском обществе"
  },
  {
    "id": "music-1",
    "title": "Современные норвежские артисты",
    "titleNo": "Norske artister i dag",
    "level": "A2",
    "category": "culture",
    "topic": "music",
    "length": "short",
    "description": "Популярная музыка из Норвегии"
  },
  {
    "id": "music-2",
    "title": "Норвежская музыкальная сцена",
    "titleNo": "Den norske musikkscenen",
    "level": "B1",
    "category": "culture",
    "topic": "music",
    "length": "medium",
    "description": "От фолка до блэк-метала — разнообразие норвежской музыки"
  },
  {
    "id": "music-3",
    "title": "Григ и экспорт норвежской музыки",
    "titleNo": "Grieg og norsk musikkeksport",
    "level": "B2",
    "category": "culture",
    "topic": "music",
    "length": "long",
    "description": "Классическое наследие и современная музыкальная индустрия"
  },
  {
    "id": "cinema-1",
    "title": "Норвежские фильмы и актёры",
    "titleNo": "Norske filmer og skuespillere",
    "level": "A2",
    "category": "culture",
    "topic": "cinema",
    "length": "short",
    "description": "Популярные фильмы и знакомые лица из Норвегии"
  },
  {
    "id": "cinema-2",
    "title": "История норвежского кино",
    "titleNo": "Norsk filmhistorie",
    "level": "B1",
    "category": "culture",
    "topic": "cinema",
    "length": "medium",
    "description": "От немого кино до современных международных успехов"
  },
  {
    "id": "cinema-3",
    "title": "Культурная политика и финансирование кино",
    "titleNo": "Kulturpolitikk og filmfinansiering",
    "level": "B2",
    "category": "culture",
    "topic": "cinema",
    "length": "long",
    "description": "Как Norsk filminstitutt формирует киноиндустрию"
  },
  {
    "id": "fastlege-1",
    "title": "Как записаться к fastlege",
    "titleNo": "Å bestille time hos fastlegen",
    "level": "A2",
    "category": "health",
    "topic": "fastlege",
    "length": "short",
    "description": "Первые шаги к семейному врачу в Норвегии"
  },
  {
    "id": "fastlege-2",
    "title": "Система fastlege и helsenorge.no",
    "titleNo": "Fastlegeordningen og helsenorge.no",
    "level": "B1",
    "category": "health",
    "topic": "fastlege",
    "length": "medium",
    "description": "Как устроена первичная медицинская помощь в Норвегии"
  },
  {
    "id": "fastlege-3",
    "title": "Реформа fastlege и дефицит врачей",
    "titleNo": "Fastlegereformen og legemangelen",
    "level": "B2",
    "category": "health",
    "topic": "fastlege",
    "length": "long",
    "description": "Кризис первичного звена и поиск путей реформы"
  },
  {
    "id": "hospital-1",
    "title": "Скорая помощь и легевакт",
    "titleNo": "Ambulanse og legevakt",
    "level": "A2",
    "category": "health",
    "topic": "hospital",
    "length": "short",
    "description": "Что делать при срочной медицинской помощи"
  },
  {
    "id": "hospital-2",
    "title": "Госпитализация и операция",
    "titleNo": "Innleggelse og operasjon",
    "level": "B1",
    "category": "health",
    "topic": "hospital",
    "length": "medium",
    "description": "Что ожидать при лечении в больнице"
  },
  {
    "id": "hospital-3",
    "title": "Система sykehus и региональные различия",
    "titleNo": "Sykehussystemet og regionale forskjeller",
    "level": "B2",
    "category": "health",
    "topic": "hospital",
    "length": "long",
    "description": "Как устроена и финансируется больничная сеть Норвегии"
  },
  {
    "id": "pharmacy-1",
    "title": "В аптеке",
    "titleNo": "På apoteket",
    "level": "A2",
    "category": "health",
    "topic": "pharmacy",
    "length": "short",
    "description": "Как купить лекарство по рецепту"
  },
  {
    "id": "pharmacy-2",
    "title": "Типы лекарств и рецептов",
    "titleNo": "Typer medisiner og resepter",
    "level": "B1",
    "category": "health",
    "topic": "pharmacy",
    "length": "medium",
    "description": "Что можно купить в аптеке и где"
  },
  {
    "id": "pharmacy-3",
    "title": "Legemiddelverket и фармацевтический рынок",
    "titleNo": "Legemiddelverket og legemiddelmarkedet",
    "level": "B2",
    "category": "health",
    "topic": "pharmacy",
    "length": "long",
    "description": "Регулирование лекарственного сектора в Норвегии"
  },
  {
    "id": "mental-1",
    "title": "Стресс и усталость",
    "titleNo": "Stress og utmattelse",
    "level": "A2",
    "category": "health",
    "topic": "mental_health",
    "length": "short",
    "description": "Как получить помощь при душевных проблемах"
  },
  {
    "id": "mental-2",
    "title": "Психолог, психиатр и DPS",
    "titleNo": "Psykolog, psykiater og DPS",
    "level": "B1",
    "category": "health",
    "topic": "mental_health",
    "length": "medium",
    "description": "Как устроена помощь при психических проблемах в Норвегии"
  },
  {
    "id": "mental-3",
    "title": "Психическое здоровье: политика, статистика и стигма",
    "titleNo": "Psykisk helse: politikk, statistikk og stigma",
    "level": "B2",
    "category": "health",
    "topic": "mental_health",
    "length": "long",
    "description": "Вызовы системы психического здоровья в Норвегии"
  }
]

export default catalog
