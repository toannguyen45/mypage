import { QUERY_KEY } from '@constants/reactQuery'
import { useQuery } from '@tanstack/react-query'
import { getDashboardApi } from '../apis/dashboardAPI'

export const useGetDashboard = params => {
  return useQuery({
    queryKey: [QUERY_KEY.DASHBOARD, params],
    queryFn: () => getDashboardApi(params),
  })
}
