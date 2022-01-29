import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'

import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui lang
//import elementTrLocale from 'element-ui/lib/locale/lang/tr' // element-ui lang

import enLocale from './en'

Vue.use(VueI18n)

/*
const keys = Object.keys(enLocale)
console.log(keys);
for (const key of keys) {
  const obj = enLocale[key]
  const objKeys = Object.keys(obj)
  for (const subKey of objKeys) {
    if (typeof obj[subKey] == 'string') {
      console.log(key + '.' + subKey + '&' + obj[subKey])
    }else{
      const subObj = obj[subKey]
      const subObjKeys = Object.keys(subObj)
      for (const subSubKey of subObjKeys) {
        if (typeof subObj[subSubKey] == 'string') {
          console.log(key + '.' + subKey + '.' + subSubKey + '&' + subObj[subSubKey])
        }
      }
    }
  } 
}
*/


const messages = {
  en: {
    ...enLocale,
    ...elementEnLocale
  }
}

export function getLanguage() {
  const chooseLanguage = Cookies.get('language')
  if (chooseLanguage) return chooseLanguage

  // if has not choose language
  const language = (navigator.language || navigator.browserLanguage).toLowerCase()
  const locales = Object.keys(messages)
  for (const locale of locales) {
    if (language.indexOf(locale) > -1) {
      return locale
    }
  }

  return 'en'
}

const i18n = new VueI18n({
  // set locale
  // options: en | 
  locale: getLanguage(),
  // set locale messages
  messages
})

export default i18n