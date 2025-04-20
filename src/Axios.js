// src/Axios.js
import axiosLib from 'axios'
import { authApiEndpoints, host } from "./API"
import { getItem, setItem, removeItem } from "./Helpers"

// 1) Create an axios instance with your API base
const api = axiosLib.create({
  baseURL: host,                     // e.g. "http://localhost:8000/api/v1"
  headers: { 'Content-Type': 'application/json' }
})

// 2) Request interceptor: attach the token (unless we're hitting login/register)
api.interceptors.request.use(config => {
  // pull off the last URL segment
  const segments = config.url.split('/')
  const last = segments[segments.length - 1]

  // only send Authorization on everything _but_ login/register
  if (last !== 'login' && last !== 'register') {
    const token = getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }

  return config
}, error => Promise.reject(error))


// 3) Response interceptor: on 401, try a refresh once, then replay queued requests
let isRefreshing = false
let subscribers = []

// helper to subscribe pending requests
function subscribeTokenRefresh(cb) {
  subscribers.push(cb)
}
function onRefreshed(token) {
  subscribers.forEach(cb => cb(token))
  subscribers = []
}

api.interceptors.response.use(
  res => res,
  err => {
    const { config, response } = err
    if (response && response.status === 401) {
      // the original request that got a 401
      const originalRequest = config

      if (!isRefreshing) {
        isRefreshing = true

        // spin up a *fresh* axios instance to hit the /refresh endpoint
        axiosLib.create({ baseURL: host })
          .patch(authApiEndpoints.refresh, null, {
            headers: { Authorization: `Bearer ${getItem('access_token')}` }
          })
          .then(({ data }) => {
            isRefreshing = false

            // store the brand‐new tokens
            setItem('access_token', data.access_token)
            setItem('expires_in',   data.expires_in)
            setItem('token_created', data.token_created)

            // let all the queued requests retry
            onRefreshed(data.access_token)
          })
          .catch(e => {
            // if refresh fails, logout entirely
            logout()
          })
      }

      // queue this request until the token is refreshed
      return new Promise(resolve => {
        subscribeTokenRefresh(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          resolve(api(originalRequest))
        })
      })
    }

    return Promise.reject(err)
  }
)


// 4) a simple logout helper that clears storage & reloads
export function logout() {
  removeItem('access_token')
  removeItem('expires_in')
  removeItem('token_created')
  removeItem('user')
  window.location.reload()
}


export default api
