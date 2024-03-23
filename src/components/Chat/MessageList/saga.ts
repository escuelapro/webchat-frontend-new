// @ts-nocheck
import { put, takeLatest } from 'redux-saga/effects'
import Storage from '../../../utils/storage'
import { logger } from '../network'
import html2canvas from 'html2canvas'

import notifySound from '../../../assets/sound.mp3'

let lastLocation = ''
let connected = 0
let _rec = false
let reconnect = true

const sound = new Audio(notifySound)

// Play the sound
function playSound () {
  sound.play()
}
const testDomain = 'escuela-chat-test.web.app'
const isTestDomain = window.location.host === testDomain
if (window.location.host === 'localhost:3000' || isTestDomain) {
  window.__arsfChatIdg = '4156467812'
  if (isTestDomain) {
    window.__arsfChatUrl = 'api.cafechat.app'
  }
}
// // Example usage: Call the playSound() function when a button is clicked
// const playButton = document.getElementById('playButton');
// playButton.addEventListener('click', playSound);
export function wsSend (text, img) {
  if (img && !text) {
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
  if (!text) return

  message.host = window.location.host
  message.pathname = window.location.pathname
  if (img) {
    message.img = img
  }
  message.g = window.__arsfChatIdg || ''
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

  lastLocation = ''
  connected = 0
  _rec = true
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
            message.g = window.__arsfChatIdg || ''
            message.uid = getUid()
            window.__arsfChat.send(JSON.stringify(message))
          }
        }
      }
    }
    const userId = getUid()
    const isNew = userId !== lastLocation
    if (lastLocation && isNew) {
      yield put({ type: 'messages_clear' })
    }
    lastLocation = userId
  } catch (e) {
    yield put({ type: 'messages_error', e })
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
  cc.onopen = () => {
    _rec = false
    window.__arsfChat = cc
    if (window.__arsfChat) {
      window.__arsfChat.addEventListener('message',
        (event) => {
          if (event?.data === '#getscreen') {
            html2canvas(document.body).then(canvas => {
              const dataURL = canvas.toDataURL('image/png')
              wsSend('', dataURL)
            })
            return
          } else if (event?.data === '#getlogs') {
            let conArr = console.everything || []
            if (conArr.length) {
              try {
                conArr = conArr.map(it => {
                  const v = it.value?.map(it2 => {
                    return JSON.stringify(it2)
                  })
                  return `${it.type} - ${v}`
                })
                wsSend('logs', conArr)
              } catch (e) {
                console.log(e)
              }
            }
            return
          } else if (window.__arsfChatInBackground) {
            playSound()
          }
          if (window.__arsfChatEmmitter) {
            window.__arsfChatEmmitter(
              '__arsfChatEmmittermess', event)
          }
        })
    }
    if (params.mount) {
      const message = { service: 'lastmes', g: '', uid: '' }
      message.g = window.__arsfChatIdg || ''
      message.uid = getUid()
      window.__arsfChat.send(JSON.stringify(message))
    }
    if (!rec) {
      const message = { message: 'hi', login: 1, host: '', pathname: '', g: '', uid: '', u: '' }
      message.host = window.location.host
      message.pathname = window.location.pathname
      message.g = window.__arsfChatIdg || ''
      message.uid = getUid()
      if (window.__arsfChatIdu) {
        message.u = window.__arsfChatIdu
      }
      window.__arsfChat.send(JSON.stringify(message))
    }
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
    if (message.message[0] === '{') {
      try {
        const mess = JSON.parse(message.message)
        if (typeof mess === 'object') {
          message = mess
        }
      } catch (e) {
        logger(e)
      }
    }
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
