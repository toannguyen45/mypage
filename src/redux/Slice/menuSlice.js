import { createSlice } from '@reduxjs/toolkit'

const menuSlice = createSlice({
  name: 'selectedKey',
  initialState: localStorage.getItem('selectedKey') || '1',
  reducers: {
    setSelectedKey: (state, action) => {
      localStorage.setItem('selectedKey', action.payload)
      return action.payload
    },
  },
})

export const { setSelectedKey } = menuSlice.actions

export default menuSlice.reducer
