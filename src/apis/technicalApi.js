import axios from '@utils/axios'
import { API_URL } from '@constants/url'

export const getTechnicalsApi = async () => {
  const response = await axios.get(API_URL.TECHNICALS)

  if (response.status !== 200) {
    throw new Error(`HTTP error! Status: ${response.status}`)
  }

  return response.data
}
