// @ts-nocheck
import { put, takeLatest } from 'redux-saga/effects'
import Storage from '../../../utils/storage'
import { logger } from '../network'
import html2canvas from 'html2canvas'

let lastMessageId = ''
let lastLocation = ''
let scrollEnd = false
let lastOffset = 0
let connected = 0
let _rec = false
let reconnect = true
let getlastMessagesNewUid = false

export function wsSend (text, img) {
  if (img) {
    text = 'Скриншот отправлен'
  }
  const message = {
    message: text,
    host: '',
    pathname: '',
    g: '',
    u: '',
    uid: '',
    isRec: false,
    img: '',
  }
  if (!text) {
    logger('empty mess')
    return
  }
  message.host = window.location.host
  message.pathname = window.location.pathname
  if (img) {
    message.img = img
  }
  if (window.__arsfChatIdg) {
    message.g = window.__arsfChatIdg
  }
  if (window.__arsfChatIdu) {
    message.u = window.__arsfChatIdu
  }
  message.uid = getUid()
  message.isRec = connected > 0
  window.__arsfChat.send(JSON.stringify(message))
  window.__arsfShowGreetings = false
  return message
}
// eslint-disable-next-line require-yield
export function * clear () {
  const userId = getUid()
  const isNew = userId !== lastLocation
  if (!lastLocation || !isNew) return

  lastMessageId = ''
  scrollEnd = false
  lastLocation = ''
  lastOffset = 0
  connected = 0
  _rec = true
  getlastMessagesNewUid = true
}

export function * getData (params) {
  try {
    if (!connected) {
      connect(_rec, params)
      connected += 1
    } else {
      if (window.__arsfChat) {
        if (!isOpen(window.__arsfChat)) {
          reconnect = true
          connect(_rec, params)
        } else {
          if (params.mount) {
            const message = { service: 'lastmes', g: '', uid: '' }
            if (window.__arsfChatIdg) {
              message.g = window.__arsfChatIdg
            }
            message.uid = getUid()
            window.__arsfChat.send(JSON.stringify(message))
          }
        }
      }
    }
    const { isNewMessage } = params
    const userId = getUid()
    const isNew = userId !== lastLocation
    if (lastLocation && isNew) {
      yield put({ type: 'messages_clear' })
      lastOffset = 0
    }
    lastLocation = userId
    if (isNew) {
      scrollEnd = false
    }
    if (isNewMessage) {
      lastOffset = 0
    }
  } catch (error) {
    logger(error)
    yield put({ type: 'messages_error', error })
  }
}

function isOpen (ws) { return ws.readyState === ws.OPEN }

const connect = (rec = false, params = { mount: false }) => {
  let wsUri = 'wss://undefined/'
  if (import.meta.env.VITE_APP_WS_URI) {
    wsUri = import.meta.env.VITE_APP_WS_URI
  }
  if (window.__arsfChatUrl) {
    wsUri = `wss://${window.__arsfChatUrl}/`
  }
  const cc = new WebSocket(wsUri)
  window.__arsfChat = cc
  if (!window.__arsfChatIdg) window.__arsfChatIdg = 1
  cc.onopen = () => {
    _rec = false
    if (params.mount) {
      const message = { service: 'lastmes', g: '', uid: '' }
      if (window.__arsfChatIdg) {
        message.g = window.__arsfChatIdg
      }
      message.uid = getUid()
      window.__arsfChat.send(JSON.stringify(message))
    }
    if (!rec) {
      // console.log(`room ${window.__arsfChatIdg}`)
      const message = { message: 'hi', login: 1, host: '', pathname: '', g: '', uid: '', u: '' }
      message.host = window.location.host
      message.pathname = window.location.pathname
      if (window.__arsfChatIdg) {
        message.g = window.__arsfChatIdg
      }
      message.uid = getUid()
      if (window.__arsfChatIdu) {
        message.u = window.__arsfChatIdu
      }
      window.__arsfChat.send(JSON.stringify(message))
    }
  }
  if (window.__arsfChat) {
    window.__arsfChat.addEventListener('message',
      (event) => {
        if (event?.data?.match('#getscreen')) {
          html2canvas(document.body).then(canvas => {
            const dataURL = canvas.toDataURL('image/png')
            wsSend('', dataURL)
          })
          return
        }
        if (window.__arsfChatEmmitter) {
          window.__arsfChatEmmitter(
            '__arsfChatEmmittermess', event)
        }
      })
  }
  cc.onerror = function (e) {
    reconnect = false
    logger(e)
  }
  cc.onclose = function () {
    if (!reconnect) return
    setTimeout(function () {
      connect(true)
      connected += 1
    }, 1000)
  }
}

function getUid () {
  const u = Storage.get('instantChatBotUidNameStored')
  if (u) {
    return u
  }
  return window.instantChatBotUidName
}

export function * newMessage ({ text, img }) {
  try {
    const message = wsSend(text, img)
    yield put({ type: 'messages_success', data: [message] })
  } catch (e) {
    logger(e)
  }
}

export function * sendGroupAction (params) {
  try {
    let { message } = params
    message = { message }
    try {
      const mess = JSON.parse(message.message)
      if (typeof mess === 'object') {
        message = mess
      }
    } catch (e) {
      logger(e)
    }
    logger(message)
    if (message.service) {
      if (message.service === 'setUid') {
        if (!window.instantChatBotUidName) {
          window.instantChatBotUidName = message.message
          Storage.set('instantChatBotUidNameStored', message.message)
        }
        const { lastMess = [] } = message
        yield put({ type: 'messages_success', data: lastMess })
      }
      if (message.service === 'lastmes') {
        const { lastMess = [] } = message
        yield put({ type: 'messages_success', data: lastMess })
      }
    } else {
      if (connected > 1 && message.greeting) {
        //
      } else {
        message.sender = 'admin'
        yield put({ type: 'messages_success', data: [message] })
      }
    }
  } catch (e) {
    logger(e)
  }
}

export default function * saga () {
  yield takeLatest('messages_clear', clear)
  yield takeLatest('messages_load', getData)
  yield takeLatest('send_action', sendGroupAction)
  yield takeLatest('scroll_mess', getData)
  // @ts-ignore
  yield takeLatest('messages_test', newMessage)
}
