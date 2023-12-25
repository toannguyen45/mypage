import axios from '@utils/axios'
import { API_URL } from '@constants/url'

export const getDashboardApi = async () => {
  const response = await axios.get(API_URL.DASHBOARD)

  if (response.status !== 200) {
    throw new Error(`HTTP error! Status: ${response.status}`)
  }

  return response.data
}
