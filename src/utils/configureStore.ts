import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'

import createReducer from './reducers'

export default function configureStore () {
  const reduxSagaMonitorOptions = {}

  const sagaMiddleware = createSagaMiddleware(reduxSagaMonitorOptions)

  const middlewares = [sagaMiddleware]

  const enhancers = [applyMiddleware(...middlewares)]

  const store = createStore(
    createReducer(),
    // @ts-ignore
    {},
    // @ts-ignore
    compose(...enhancers),
  )

  // @ts-ignore
  store.runSaga = sagaMiddleware.run
  // @ts-ignore
  store.injectedReducers = {}
  // @ts-ignore
  store.injectedSagas = {}

  return store
}
