/* tslint:disable */
// @ts-ignore file
/* @ts-ignore */
// @ts-nocheck
import Storage from '../../utils/storage'

let connected = 0
let _rec = false

function getUid () {
  const u = Storage.get('instantChatBotUidNameStored')
  if (u) {
    return u
  }
  return window.instantChatBotUidName
}

const connect = (rec = false) => {
  let wss = 'wss'
  if (import.meta.env.NODE_ENV === 'development') wss = 'ws'
  const WS_URL = window.__arsfChatUrl || import.meta.env.WS_URI
  const cc = new WebSocket(`${wss}://${WS_URL}/`)

  window.__arsfChat = cc
  if (!window.__arsfChatIdg) window.__arsfChatIdg = 2

  cc.onopen = () => {
    _rec = false
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
        if (window.__arsfChatEmmitter) {
          window.__arsfChatEmmitter(
            '__arsfChatEmmittermess', event)
        }
      })
  }
  cc.onclose = function () {
    setTimeout(function () {
      connect(true)
      connected += 1
    }, 1000)
  }
}

export default function * saga () {}
