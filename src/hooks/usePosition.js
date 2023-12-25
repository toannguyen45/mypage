import { useQuery } from '@tanstack/react-query'
import { QUERY_KEY } from '@constants/reactQuery'
import { getPositionsApi } from '@api/positionApi'

export const useGetPositions = params => {
  return useQuery({
    queryKey: [QUERY_KEY.POSITIONS, params],
    queryFn: () => getPositionsApi(params),
  })
}
