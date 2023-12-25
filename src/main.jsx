import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import AppRoutes from './Routes'
import store from './redux/store'
import '@utils/i18n/i18n.jsx'
import { BrowserRouter as Router } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toast } from '@components/toast/ToastCustom'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppRoutes />
      </Router>
      <Toast />
    </QueryClientProvider>
  </Provider>
)
