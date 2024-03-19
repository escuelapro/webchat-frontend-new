// @ts-ignore
import React, { lazy, Suspense } from 'react'

interface IProps {

}

type Func = () => Promise<any>;

const loadable = (importFunc: Func, { fallback = null } = { fallback: null }) => {
  const LazyComponent = lazy(importFunc)

  return (props: IProps) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  )
}

export default loadable
