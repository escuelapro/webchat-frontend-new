// @ts-nocheck
import { produce } from 'immer'

export const initialState = {
  loading: false,
  error: false,
  total: 0,
  action: false,
  messages: { messages: [] },
}

const appReducer = (state = initialState, action) =>
  produce(state, (draft: any) => {
    let m, m2, msg
    let messages = []

    switch (action.type) {
      case 'messages_clear':
        draft.loading = false
        draft.error = false
        draft.action = false
        draft.messages = { messages: [] }
        break
      case 'messages_load':
      case 'messages_test':
        draft.loading = true
        draft.error = false
        draft.action = false
        break
      case 'message_load':
        draft.loading = true
        draft.error = false
        break
      case 'messages_success':
        m = action.data || []
        m.reverse()
        if (!action.isNewMessage) {
          if (!action.isNew) {
            m = state.messages.messages.concat(m)
          }
        } else {
          setTimeout(() => {
            const element = document.querySelector(
              '.arsf-messenger-scrollable.content')
            element.scrollTop = element.scrollHeight
          }, 100)
        }
        m2 = { messages: m, total: action.total }
        draft.messages = m2
        draft.loading = false
        break
      case 'message_success':
        msg = action.data
        if (!Array.isArray(msg)) msg = [msg]
        messages = state.messages.messages.concat(msg)
        draft.messages = { messages }
        draft.loading = false
        break
      case 'messages_error':
        draft.error = action.error
        draft.loading = false
        break
      case 'action_success':
        draft.action = action.data
        draft.loading = false
        break
    }
  })

export default appReducer
