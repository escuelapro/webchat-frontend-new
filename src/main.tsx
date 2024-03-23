import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Chat from '@/pages/Chat/Loadable'
import { Provider } from 'react-redux'
import configureStore from '@/utils/configureStore'

let rootElement = document.getElementById('apppopupmax')
if (!rootElement) {
  rootElement = document.getElementById('apppopupmax122')
}

const initialState = {}
const store = configureStore(initialState)

if (!rootElement) {
  throw new Error('Failed to find the root element')
}

const root = createRoot(rootElement)
root.render(
  <StrictMode>
    <Provider store={store}>
      <Chat />
    </Provider>
  </StrictMode>,
)
