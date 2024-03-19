// @ts-ignore
import React, { memo, useEffect, useState } from 'react'
import { compose } from 'redux'
import styled from './styled'
import observe, { emitData } from '../../utils/observers'
import Messenger from '../../components/Chat/Messenger/index'

const Popup = styled()

// @ts-ignore
window.instantChatBot = {
  show: false,
  open: () => {
    // @ts-ignore
    window.instantChatBot.show = !window.instantChatBot.show
    // @ts-ignore
    emitData('instantChatBotEvents', { open: window.instantChatBot.show })
  },
  // @ts-ignore
  close: (exit) => {
    // @ts-ignore
    if (exit && window.instantChatBotUidName) delete window.instantChatBotUidName
    // @ts-ignore
    window.instantChatBot.show = false
    // @ts-ignore
    emitData('instantChatBotEvents', { open: false })
  },
}

// @ts-ignore
function HomePage () {
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
export default compose(memo)(HomePage)
