import axios from '@utils/axios'
import { API_URL } from '@constants/url'

export const getManagersApi = async () => {
  const response = await axios.get(API_URL.MANAGERS)

  if (response.status !== 200) {
    throw new Error(`HTTP error! Status: ${response.status}`)
  }

  return response.data
}
