// @ts-ignore
import React from 'react'
import moment from 'dayjs'
import { useIntl } from 'react-intl'

import styled from './styled'

const Div = styled()

interface Prop {
  data: any;
  startsSequence: any;
  endsSequence: any;
  showTimestamp: any;
}

const Message = ({ data, startsSequence, endsSequence, showTimestamp }: Prop) => {
  const intl = useIntl()

  let text = data.message

  const friendlyTimestamp = moment(data.createdAt).format('HH:mm')

  if (!text) {
    if (!data.img) {
      return null
    } else {
      text = intl.formatMessage({ id: 'sent' })
    }
  }
  const isMine = data.sender !== 'admin'

  return (
    <Div>
      <div
        className={[
          'arsf-message',
          `${isMine ? 'mine' : ''}`,
          `${startsSequence ? 'start' : ''}`,
          `${endsSequence ? 'end' : ''}`,
        ].join(' ')}
      >
        {showTimestamp && <div className='timestamp'>{friendlyTimestamp}</div>}

        <div className='bubble-container'>
          <div className='bubble' title={friendlyTimestamp}>
            {`${text}`.trim()}
            <div className='time'>
              <span className={isMine ? 'right' : 'left'}>
                {friendlyTimestamp}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Div>
  )
}
export default Message
