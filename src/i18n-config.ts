// i18n-config.js
const DEF_LANG = 'en-US'
// @ts-ignore
const lang = navigator.language || navigator.userLanguage
export const defaultLocale = ['ru', DEF_LANG].includes(lang) ? lang : DEF_LANG
export const locales = {
  [DEF_LANG]: {
    greet: 'Hello!{br}This is a chat for quick communication to quickly resolve your issue',
    ask: 'Ask your question',
    screen: 'Are you sure you want to send a screenshot?',
    yes: 'Yes',
    no: 'No',
    sent: 'Screenshot sent',
  },
  ru: {
    greet: 'Привет!{br}Это чат для быстрой связи, чтобы оперативно решить твой вопрос{br}:)',
    ask: 'Задайте свой вопрос',
    screen: 'Вы действительно хотите отправить скриншот?',
    yes: 'Да',
    no: 'Нет',
    sent: 'Скриншот отправлен',
  },
}
