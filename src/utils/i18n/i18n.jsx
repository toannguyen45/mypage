import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import English from '../lang/en.json'
import Vietnamese from '../lang/vi.json'

const resources = {
  en: {
    translation: English,
  },
  vi: {
    translation: Vietnamese,
  },
}

//Lấy ngôn ngữ đã lưu từ localStorage hoặc sử dụng  mặc định ('en')
const savedLanguage = localStorage.getItem('selectedLanguage') || 'en'

i18n.use(initReactI18next).init({
  resources,
  lng: savedLanguage, // Set language từ localStorage
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
