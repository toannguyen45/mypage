import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEY } from '@constants/reactQuery'
import {
  getProjectsApi,
  createProjectApi,
  getProjectByIdApi,
  updateProjectApi,
  deleteProjectApi,
} from '@api/projectApi'
import { useNavigate } from 'react-router-dom'

export const useGetProjects = params => {
  return useQuery({
    queryKey: [QUERY_KEY.PROJECTS, params],
    queryFn: () => getProjectsApi(params),
  })
}

export const useCreateProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: data => createProjectApi(data),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.PROJECTS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.DASHBOARD] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.EMPLOYEE_PROJECTS] })
    },
    onError: (error, variables, context) => {},
    onSettled: (data, error, variables, context) => {},
  })
}

export const useGetProjectById = id => {
  const navigate = useNavigate()

  return useQuery({
    queryKey: [QUERY_KEY.PROJECTS, id],
    queryFn: () => getProjectByIdApi(id),
    onSuccess: (data, variables, context) => {},
    onError: (error, variables, context) => {
      navigate('/404')
    },
    onSettled: (data, error, variables, context) => {},
  })
}

export const useUpdateProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => updateProjectApi(id, data),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.PROJECTS] })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.PROJECTS, variables.id],
      })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.EMPLOYEE_PROJECTS] })
    },
    onError: (error, variables, context) => {},
    onSettled: (data, error, variables, context) => {},
  })
}

export const useDeleteProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: id => deleteProjectApi(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.PROJECTS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.DASHBOARD] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.EMPLOYEE_PROJECTS] })
    },
    onError: (error, variables, context) => {},
    onSettled: (data, error, variables, context) => {},
  })
}
