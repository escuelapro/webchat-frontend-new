import React, { useEffect, useState } from 'react'

import observe, { emitData } from '@/utils/observers'
import Messenger from '@/components/Chat/Messenger'

import styled from './styled'

const Popup = styled()

// Event listener for focus change
window.addEventListener('focus', function () {
  window.__arsfChatInBackground = false
})

window.addEventListener('blur', function () {
  window.__arsfChatInBackground = true
})

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
              <div className='msger-button' onClick={toggle} title='Support service'>
                <span className='notify-indicator' />
              </div>
              )}
        </div>
      </Popup>
    </div>
  )
}
export default Chat
