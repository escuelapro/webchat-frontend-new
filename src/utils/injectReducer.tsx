// @ts-nocheck
import hoistNonReactStatics from 'hoist-non-react-statics'
import { ReactReduxContext } from 'react-redux'

import getInjectors from './reducerInjectors'
import React, { Component, useContext, useEffect } from 'react'

/**
 * Dynamically injects a reducer
 *
 * @param {string} key A key of the reducer
 * @param {function} reducer A reducer that will be injected
 *
 */
// eslint-disable-next-line import/no-anonymous-default-export
export default ({ key, reducer }) => WrappedComponent => {
  class ReducerInjector extends Component<any, any> {
    static WrappedComponent = WrappedComponent

    static contextType = ReactReduxContext

    static displayName = `withReducer(${WrappedComponent.displayName ||
      WrappedComponent.name ||
      'Component'})`

    constructor (props, context) {
      super(props, context)

      getInjectors(context.store).injectReducer(key, reducer)
    }

    render () {
      return <WrappedComponent {...this.props} />
    }
  }

  return hoistNonReactStatics(ReducerInjector, WrappedComponent)
}

const useInjectReducer = ({ key, reducer }) => {
  const context = useContext(ReactReduxContext)
  useEffect(() => {
    getInjectors(context.store).injectReducer(key, reducer)
  }, [context.store, key, reducer])
}

export { useInjectReducer }
