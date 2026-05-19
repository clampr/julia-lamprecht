import { createI18n } from 'vue-i18n'
import de from './locales/de.json'
import en from './locales/en.json'

const savedLocale = localStorage.getItem('locale')
const browserLocale = navigator.language?.startsWith('de') ? 'de' : 'en'

export default createI18n({
  legacy: false,
  locale: savedLocale || browserLocale,
  fallbackLocale: 'de',
  messages: { de, en }
})
