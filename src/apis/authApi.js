import axios from '@utils/axios'

import { API_URL } from '@constants/url'

export const getLoginApi = async ({ email, password }) => {
  const response = await axios.post(API_URL.LOGIN, {
    email,
    password,
  })

  return response.data
}

export const getMeApi = async () => {
  const response = await axios.get('users/me')
  return response.data
}
