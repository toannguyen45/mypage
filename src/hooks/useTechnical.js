import { useQuery } from '@tanstack/react-query'
import { QUERY_KEY } from '@constants/reactQuery'
import { getTechnicalsApi } from '@api/technicalApi'

export const useGetTechnicals = params => {
  return useQuery({
    queryKey: [QUERY_KEY.TECHNICALS, params],
    queryFn: () => getTechnicalsApi(params),
  })
}
