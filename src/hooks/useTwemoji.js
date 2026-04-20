import { useEffect } from 'react'
import twemoji from '@twemoji/api'

/**
 * Заменяет нативные эмодзи на Twemoji (Twitter-style) в указанном элементе.
 * Вызывается после каждого рендера, чтобы новые эмодзи тоже обновились.
 */
export default function useTwemoji() {
  useEffect(() => {
    twemoji.parse(document.body, {
      folder: 'svg',
      ext: '.svg',
      base: 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/',
    })
  })
}
