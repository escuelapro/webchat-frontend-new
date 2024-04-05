if (console.everything === undefined) {
  console.everything = []

  console.defaultLog = console.log.bind(console)
  console.log = function () {
    console.everything.push({ type: 'log', datetime: Date().toLocaleString(), value: Array.from(arguments) })
    console.defaultLog.apply(console, arguments)
  }
  console.defaultError = console.error.bind(console)
  console.error = function () {
    console.everything.push({ type: 'error', datetime: Date().toLocaleString(), value: Array.from(arguments) })
    console.defaultError.apply(console, arguments)
  }
  console.defaultWarn = console.warn.bind(console)
  console.warn = function () {
    console.everything.push({ type: 'warn', datetime: Date().toLocaleString(), value: Array.from(arguments) })
    console.defaultWarn.apply(console, arguments)
  }
}
class Storage {
  _ (k, def) {
    // @ts-ignore
    let v = localStorage.getItem(k)
    if (v && v.match(/^{/)) {
      v = JSON.parse(v)
    }
    return v || def
  }

  __ (k, v) {
    // @ts-ignore
    return localStorage.setItem(k, v)
  }

  rm (k) {
    // @ts-ignore
    return localStorage.removeItem(k)
  }

  get (k, def = '') {
    return this._(k, def)
  }

  set (k, v) {
    return this.__(k, v)
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new Storage()
