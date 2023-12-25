import axios from 'axios'
import store from '../redux/store'
import { updateAccessToken } from '../redux/Slice/authSlice'
import { API_URL } from '@constants/url'

const BASE_URL = import.meta.env.VITE_BASE_URL_API

const api = axios.create({
  baseURL: BASE_URL,
})

api.interceptors.request.use(config => {
  const state = store.getState()
  const { accessToken } = state.auth // get access token from redux state

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config
    const state = store.getState()
    const { refreshToken } = state.auth // get refresh token from redux state

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      // try to refresh access token
      const response = await api.post(API_URL.REFRESH_TOKEN, { refreshToken })

      if (response.status === 200) {
        // update access token in redux state
        store.dispatch(updateAccessToken(response.data.accessToken))

        // retry the original request
        originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`

        return api(originalRequest)
      }
    }

    return Promise.reject(error)
  }
)

export default api
