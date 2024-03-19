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
    switch (action.type) {
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
        break
      case 'message_success':
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
