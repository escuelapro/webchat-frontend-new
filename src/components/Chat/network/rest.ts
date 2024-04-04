// @ts-nocheck
import Storage from '@/utils/storage'
import request from '@/utils/request'

const apiUrl = import.meta.env.REST_API

// eslint-disable-next-line require-yield
function * getHeader () {
  // @ts-ignore
  const token = Storage.get('ctoken')
  return {
    Authorization: `Bearer ${token}`,
  }
}

export const docApiUrl = (a) => {
  const db = ''
  return `${a}${a.match(/\?/) ? '&' : '?'}${db ? `db_name=${db}` : ''}`
}

function * req (url: string) {
  url = `${apiUrl}${url}`
  url = docApiUrl(url)
  const headers = yield getHeader()
  const options = { headers }
  let data
  try {
    data = yield request(url, options)
  } catch (e) {
    console.log(e)
  }
  return data
}

export function * getMessages (userId, params) {
  const url = `/getMessages?user_id=${userId}&${params.join('&')}`
  return yield req(url)
}
