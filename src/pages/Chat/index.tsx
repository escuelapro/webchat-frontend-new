// @ts-ignore
import React, { useEffect, useState } from 'react'

import observe, { emitData } from '@/utils/observers'
import Messenger from '@/components/Chat/Messenger'

import styled from './styled'

const Popup = styled()
let isTabActive = true

// Event listener for visibility change
document.addEventListener('visibilitychange', function () {
  isTabActive = document.visibilityState === 'visible'
})

// Event listener for focus change
window.addEventListener('focus', function () {
  isTabActive = true
  // console.log('Tab is active')
  window.__arsfChatInBackground = false
})

window.addEventListener('blur', function () {
  isTabActive = false
  // console.log('Tab is in background')
  window.__arsfChatInBackground = true
})
// function handleBrowserFocus () {
// console.log('User returned to the browser focus')
// window.__arsfChatInBackground = true
// Add any additional logic or functionality you need here
// }

// window.addEventListener('focus', handleBrowserFocus)

// @ts-ignore
window.instantChatBot = {
  show: false,
  open: () => {
    // @ts-ignore
    window.instantChatBot.show = !window.instantChatBot.show
    // @ts-ignore
    emitData('instantChatBotEvents', { open: window.instantChatBot.show })
  },
}

// @ts-ignore
function Chat () {
  const [show, setShow] = useState(false)
  // @ts-ignore
  const setShowFunc = (data) => {
    setShow(data.open)
  }
  useEffect(() => {
    const name = 'instantChatBotEvents'
    observe(name, {
      [name]: setShowFunc,
    })
  }, [])
  const toggle = () => {
    // @ts-ignore
    window.instantChatBot.open()
  }
  return (
    <div>
      <Popup>
        <div className='__mx-phone-line bottom'>
          {show
            ? (
              <div className='chat-wrapper1'>
                <div style={{ height: '100%' }}>
                  <Messenger />
                </div>
                <button className='__mx-phone-line-btn close-btn' onClick={toggle}>
                  <span />
                </button>
              </div>
              )
            : (
              <div className='msger-button' onClick={toggle} title='Support service' />
              )}
        </div>
      </Popup>
    </div>
  )
}
export default Chat
