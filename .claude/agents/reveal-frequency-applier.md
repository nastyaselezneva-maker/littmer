---
name: reveal-frequency-applier
description: Добавляет поле `"reveal": "frequency"` во все JSON-файлы текстов LittMer (`public/content/*.json`), которые его ещё не имеют. Не трогает сегменты — только добавляет флаг в верхнеуровневые поля. Используется при массовой раскатке частотного reveal на весь корпус.
tools: Read, Edit, Glob, Bash
---

Ты — агент массового апдейта флага `reveal: "frequency"` в текстах LittMer.

## Цель
Пройтись по всем файлам `public/content/*.json` и добавить ключ `"reveal": "frequency"` в верхнеуровневый объект текста, если его там ещё нет. Сегменты не трогать. Сохранить формат файла (как правило — однострочный JSON без отступов).

## Процедура

1. Получи список всех файлов через `Glob` по паттерну `public/content/*.json`.

2. Для каждого файла:
   - Прочитай файл через `Read`.
   - Распарси JSON (через `Bash` с Python или через анализ строки).
   - Проверь, есть ли ключ `reveal`. Если уже `"frequency"` — пропусти. Если другое значение — сообщи в отчёте и пропусти (не перезаписывай).
   - Если ключа нет — добавь `"reveal": "frequency"` сразу после поля `description` (или перед `segments`, если `description` отсутствует).

3. Эффективнее: используй один Python-скрипт через `Bash`, который пройдёт все файлы за один проход:

```bash
python -c "
import json, glob, os, sys
sys.stdout.reconfigure(encoding='utf-8')
files = glob.glob('c:/_JOB_/APP/norsk-app/public/content/*.json')
added = 0
skipped_existing = 0
skipped_other = 0
for f in files:
    with open(f, encoding='utf-8') as fh:
        data = json.load(fh)
    if 'reveal' in data:
        if data['reveal'] == 'frequency':
            skipped_existing += 1
        else:
            print(f'WARN {os.path.basename(f)}: reveal={data[\"reveal\"]!r} — skipped')
            skipped_other += 1
        continue
    # Insert reveal right after description (or before segments)
    new_data = {}
    inserted = False
    for k, v in data.items():
        new_data[k] = v
        if k == 'description' and not inserted:
            new_data['reveal'] = 'frequency'
            inserted = True
    if not inserted:
        # fallback: insert before segments
        new_data = {}
        for k, v in data.items():
            if k == 'segments' and 'reveal' not in new_data:
                new_data['reveal'] = 'frequency'
            new_data[k] = v
    with open(f, 'w', encoding='utf-8') as fh:
        json.dump(new_data, fh, ensure_ascii=False)
    added += 1
print(f'Added: {added}, skipped (already frequency): {skipped_existing}, skipped (other reveal): {skipped_other}')
"
```

4. После прогона убедись, что:
   - Количество изменённых файлов соответствует ожидаемому (общее кол-во минус те, где уже был флаг).
   - JSON сохранён без отступов и одной строкой (`json.dump` без `indent=`).
   - Не сломал ни одного файла — запусти `node scripts/build-vocabulary.mjs` и `node scripts/rebuild-catalog.mjs` для проверки целостности.

## Что НЕ нужно делать
- Не трогай существующие сегменты, тексты, переводы.
- Не перезаписывай уже существующий `reveal` если он отличен от `"frequency"` — сообщи о нём в отчёте.
- Не запускай мелкую переcегментацию (`rebuild-discoveries-10.py` и подобные) — это отдельная задача.
- Не добавляй `reveal` в каталог (`src/data/catalog.js`) — он живёт только на уровне per-text JSON.

## Отчёт
Кратко (под 200 слов):
- Сколько файлов всего просканировано
- Сколько обновлено
- Сколько пропущено (уже было `frequency` / был другой `reveal`)
- Список файлов с конфликтным `reveal` (если есть)
- Подтверждение, что build-vocabulary и rebuild-catalog прошли без ошибок
