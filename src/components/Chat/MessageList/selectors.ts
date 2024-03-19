// @ts-nocheck
/**
 * The global state selectors
 */

import { createSelector } from 'reselect'
import { initialState } from './reducer'

const selectGlobal = state => state.messages || initialState

// const selectRouter = state => state.router;

const makeSelectLoading = () =>
  createSelector(
    selectGlobal,
    (globalState: any) => globalState.loading,
  )

const makeSelectError = () =>
  createSelector(
    selectGlobal,
    (globalState: any) => globalState.error,
  )

const makeSelectMess = () =>
  createSelector(
    selectGlobal,
    (globalState: any) => globalState.messages,
  )
const makeSelectAction = () =>
  createSelector(
    selectGlobal,
    (globalState: any) => globalState.action,
  )
export {
  selectGlobal,
  makeSelectLoading,
  makeSelectError,
  makeSelectMess,
  makeSelectAction,
}
