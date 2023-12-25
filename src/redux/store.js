import { configureStore } from '@reduxjs/toolkit'
import authReducer from './Slice/authSlice'
import userReducer from './Slice/userSlice'
import menuReducer from './Slice/menuSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    menu: menuReducer,
  },
})

export default store
