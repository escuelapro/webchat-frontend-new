import hoistNonReactStatics from 'hoist-non-react-statics'
import { ReactReduxContext } from 'react-redux'

import getInjectors from './sagaInjectors'
import React, { useContext, useEffect, Component } from 'react'

/**
 * Dynamically injects a saga, passes component's props as saga arguments
 *
 * @param {string} key A key of the saga
 * @param {function} saga A root saga that will be injected
 * @param {string} [mode] By default (constants.DAEMON) the saga will be started
 * on component mount and never canceled or started again. Another two options:
 *   - constants.RESTART_ON_REMOUNT — the saga will be started on component mount and
 *   cancelled with `task.cancel()` on component unmount for improved performance,
 *   - constants.ONCE_TILL_UNMOUNT — behaves like 'RESTART_ON_REMOUNT' but never runs it again.
 *
 */
// eslint-disable-next-line import/no-anonymous-default-export
export default ({ key, saga, mode = '' }) => WrappedComponent => {
  // @ts-ignore
  class InjectSaga extends Component {
    static WrappedComponent = WrappedComponent

    // @ts-ignore
    static contextType = ReactReduxContext

    static displayName = `withSaga(${WrappedComponent.displayName ||
      WrappedComponent.name ||
      'Component'})`

    constructor (props, context) {
      super(props, context)

      // @ts-ignore
      this.injectors = getInjectors(context.store)

      // @ts-ignore
      this.injectors.injectSaga(key, { saga, mode }, this.props)
    }

    // @ts-ignore
    componentWillUnmount () {
      // @ts-ignore
      this.injectors.ejectSaga(key)
    }

    // @ts-ignore
    render () {
      return <WrappedComponent {...this.props} />
    }
  }

  return hoistNonReactStatics(InjectSaga, WrappedComponent)
}

const useInjectSaga = ({ key, saga, mode }) => {
  const context = useContext(ReactReduxContext)
  useEffect(() => {
    // @ts-ignore
    const injectors = getInjectors(context.store)
    // @ts-ignore
    injectors.injectSaga(key, { saga, mode })

    return () => {
      injectors.ejectSaga(key)
    }
  }, [context, key, mode, saga])
}

export { useInjectSaga }
