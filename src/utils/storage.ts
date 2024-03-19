function toInt (v) {
  let inVal = parseInt(v, 10)
  if (isNaN(inVal)) {
    inVal = 0
  }
  return inVal
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

  clear () {
    return localStorage.clear()
  }

  getInt (key) {
    return toInt(this._(key, 0))
  }

  inc (key, val) {
    let v = this.getInt(key)
    v += toInt(val)
    return this.set(key, v)
  }
}

export default new Storage()
