import { produce } from 'immer'
import { LOAD_REPOS_SUCCESS, LOAD_REPOS, LOAD_REPOS_ERROR } from './constants'

// The initial state of the App
export const _initialState = {
  loading: false,
  error: false,
  currentUser: false,
  userData: {
    repositories: false,
  },
}

/* eslint-disable default-case, no-param-reassign */
const appReducer = (state = _initialState, action) =>
  produce(state, (draft: any) => {
    switch (action.type) {
      case LOAD_REPOS:
        draft.loading = true
        draft.error = false
        draft.userData.repositories = false
        break

      case LOAD_REPOS_SUCCESS:
        draft.userData.repositories = action.repos
        draft.loading = false
        draft.currentUser = action.username
        break

      case LOAD_REPOS_ERROR:
        draft.error = action.error
        draft.loading = false
        break
    }
  })

export default appReducer
