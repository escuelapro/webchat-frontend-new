// @ts-nocheck
import { getMessages } from './network/rest'

function logger (e) {
  // @ts-ignore
  if (import.meta.env.VITE_APP_ENVIRONMENT === 'development') {
    console.log(e)
  }
}

export {
  getMessages,
  logger,
}
