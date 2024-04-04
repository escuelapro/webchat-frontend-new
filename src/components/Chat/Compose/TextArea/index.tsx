import React from 'react'
import { useIntl } from 'react-intl'

interface Props {
  rel: any;
  send: any;
}
const TextArea: React.FC<Props> = ({ rel, send }) => {
  const intl = useIntl()

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (!e.ctrlKey && !e.shiftKey)) {
      send(e)
    }
  }

  return (
    <textarea
      ref={rel}
      className='compose-input form-control'
      placeholder={intl.formatMessage({ id: 'ask' })}
      onKeyDown={handleKeyDown}
    />
  )
}

export default TextArea
