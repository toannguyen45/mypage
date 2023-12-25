import { useQuery } from '@tanstack/react-query'
import { QUERY_KEY } from '@constants/reactQuery'
import { getManagersApi } from '@api/managerApi'

export const useGetManagers = params => {
  return useQuery({
    queryKey: [QUERY_KEY.MANAGERS, params],
    queryFn: () => getManagersApi(params),
  })
}
