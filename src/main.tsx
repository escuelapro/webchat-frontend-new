import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { IntlProvider } from 'react-intl'

import Chat from '@/pages/Chat'
import configureStore from '@/utils/configureStore'

import { defaultLocale, locales } from './i18n-config'

const rootElement = document.getElementById('apppopupmax')

const store = configureStore()

if (!rootElement) {
  throw new Error('Failed to find the root element')
}

function I18n (props): JSX.Element {
  return (
    <IntlProvider
      locale={defaultLocale}
      defaultLocale={defaultLocale}
      messages={locales[defaultLocale]}
    >
      {/* eslint-disable-next-line react/prop-types */}
      {props.children}
    </IntlProvider>
  )
}

const root = createRoot(rootElement)
root.render(
  <StrictMode>
    <I18n>
      <Provider store={store}>
        <Chat />
      </Provider>
    </I18n>
  </StrictMode>,
)
