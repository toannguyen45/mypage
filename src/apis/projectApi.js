import axios from '@utils/axios'
import { API_URL } from '@constants/url'

export const getProjectsApi = async ({
  page,
  pageSize,
  sortColumn,
  sortOrder,
  searchText,
}) => {
  const response = await axios.get(API_URL.PROJECTS, {
    params: {
      _page: page,
      _limit: pageSize,
      _sort: sortColumn || 'id',
      _order: sortOrder || 'asc',
      q: searchText,
    },
  })

  if (response.status !== 200) {
    throw new Error(`HTTP error! Status: ${response.status}`)
  }

  return response.data
}

export const createProjectApi = async data => {
  const response = await axios.post(API_URL.PROJECTS, data)

  if (response.status !== 201) {
    throw new Error(`HTTP error! Status: ${response.status}`)
  }

  return response.data
}

export const getProjectByIdApi = async id => {
  const response = await axios.get(`${API_URL.PROJECTS}/${id}`)

  if (response.status !== 200) {
    throw new Error(`HTTP error! Status: ${response.status}`)
  }

  return response.data
}

export const updateProjectApi = async (id, data) => {
  const response = await axios.put(`${API_URL.PROJECTS}/${id}`, data)

  if (response.status !== 200) {
    throw new Error(`HTTP error! Status: ${response.status}`)
  }

  return response.data
}

export const deleteProjectApi = async id => {
  const response = await axios.delete(`${API_URL.PROJECTS}/${id}`)

  if (response.status !== 200) {
    throw new Error(`HTTP error! Status: ${response.status}`)
  }

  return response.data
}
