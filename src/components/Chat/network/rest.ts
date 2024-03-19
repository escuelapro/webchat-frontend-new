// @ts-nocheck
import Storage from '../../../utils/storage'
import request from '../../../utils/request'

const API_URL = ''
// @ts-ignore
const API_URL2 = import.meta.env.REST_API
// eslint-disable-next-line require-yield
function * getHeader () {
  // @ts-ignore
  const token = Storage.get('ctoken')
  return {
    Authorization: `Bearer ${token}`,
  }
}

function reqApi (url, postData = false) {
  // @ts-ignore
  return req(url, 'POST', postData)
}

export const docApiUrl = (a) => {
  const db = ''
  return `${a}${a.match(/\?/) ? '&' : '?'}${db ? `db_name=${db}` : ''}`
}

function * req (url: string, method = 'POST', postData = false) {
  let apiUrl = API_URL
  if (url.match('getMessages')) {
    apiUrl = API_URL2
  }
  url = `${apiUrl}${url}`
  url = docApiUrl(url)
  const headers = yield getHeader()
  if (postData) {
    headers['Content-Type'] = 'application/json'
    headers.Accept = 'application/json'
    headers.Referer = 'http://localhost.dev'
  }
  const options = { headers }
  if (postData) {
    // @ts-ignore
    options.method = method
    // @ts-ignore
    options.body = JSON.stringify(postData)
  }
  let data
  try {
    data = yield request(url, options)
  } catch (e) {
    console.log(e)
  }
  return data
}

export function * getGroups (userId, params = []) {
  params.push(`user_id=${userId}`)
  params.push('model=groups')
  params.push('service=avitochat')
  const url = `v1/objects?${params.join('&')}`
  return yield reqApi(url)
}

export function * getMessages (userId, params) {
  const url = `/getMessages?user_id=${userId}&${params.join('&')}`
  return yield req(url)
}

export function * sendMessage (userId, chatId, data) {
  const url = `?user_id=${userId}`
  return yield req(url, 'POST', data)
}

export function * addGroups (data) {
  const params = ['model=groups', 'service=avitochat']
  const url = `v1/objects?${params.join('&')}`
  return yield reqApi(url, data)
}
