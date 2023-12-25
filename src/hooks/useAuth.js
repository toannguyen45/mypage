import { useMutation } from '@tanstack/react-query'
import { getLoginApi } from '@api/authApi'
import { useNavigate } from 'react-router-dom'
import { showToast } from '@components/toast/ToastCustom'
import { useTranslation } from 'react-i18next'
import { login } from '@redux/Slice/authSlice'
import store from '@redux/store'
import { useDispatch } from 'react-redux'
import { setSelectedKey } from '@redux/Slice/menuSlice'
import { useEffect } from 'react'

export const useLogin = () => {
  const navigate = useNavigate()
  const { t } = useTranslation('translation')
  const dispatch = useDispatch()
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken')

    if (accessToken) {
      dispatch(setSelectedKey('/admin/dashboard'))
      navigate('/admin/dashboard')
    }
  }, [])

  return useMutation({
    mutationFn: ({ email, password }) => getLoginApi({ email, password }),
    onSuccess: (data, variables, context) => {
      store.dispatch(
        login({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        })
      )
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      dispatch(setSelectedKey('/admin/dashboard'))
      navigate('/admin/dashboard')
      showToast(t('message.success_login'), 'success')
    },
    onError: (error, variables, context) => {
      showToast(t('message.error_login'), 'error')
    },
    onSettled: (data, error, variables, context) => {},
  })
}
