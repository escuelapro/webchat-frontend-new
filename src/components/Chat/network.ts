// @ts-nocheck
import {
  getMessages,
  getGroups,
  sendMessage,
  addGroups,
} from './network/rest'

function logger (e) {
  // @ts-ignore
  if (import.meta.env.VITE_APP_ENVIRONMENT === 'development') {
    console.log(e)
  }
}

export {
  getGroups,
  getMessages,
  sendMessage,
  addGroups,
  logger,
}
