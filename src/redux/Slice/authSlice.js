import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated:
    !!localStorage.getItem('accessToken') &&
    !!localStorage.getItem('refreshToken'),
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      state.isAuthenticated = true
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
    },
    updateAccessToken(state, action) {
      state.accessToken = action.payload
      localStorage.setItem('accessToken', action.payload)
    },
    logout(state) {
      state.isAuthenticated = false
      state.accessToken = null
      state.refreshToken = null
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    },
  },
})

export const { login, updateAccessToken, logout } = authSlice.actions

export default authSlice.reducer
